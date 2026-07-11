// Cloudflare Pages Function (adapter).
// The original Netlify handler body is preserved unchanged below;
// this wrapper feeds it a Netlify-style `event` and maps the result to a Response.

const RATE_LIMIT = 15;          // max requests
const RATE_WINDOW_SECONDS = 300; // per 5 minutes

async function checkRateLimit(env, ip) {
  const kv = env.RATE_LIMIT_KV;
  if (!kv) return { allowed: true }; // KV not bound yet — fail open

  const key = `chat:${ip}`;
  const now = Date.now();
  const raw = await kv.get(key);
  let data = raw ? JSON.parse(raw) : { count: 0, start: now };

  if (now - data.start > RATE_WINDOW_SECONDS * 1000) {
    data = { count: 0, start: now };
  }

  data.count += 1;
  await kv.put(key, JSON.stringify(data), { expirationTtl: RATE_WINDOW_SECONDS });

  return { allowed: data.count <= RATE_LIMIT, count: data.count };
}

export async function onRequest(context) {
  // Expose Cloudflare env to the handler's process.env.* reads
  globalThis.process = globalThis.process || {};
  globalThis.process.env = { ...(globalThis.process.env || {}), ...context.env };

  const { request, env } = context;

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { allowed } = await checkRateLimit(env, ip);

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a few minutes and try again.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(RATE_WINDOW_SECONDS),
        },
      }
    );
  }

  const reqHeaders = {};
  request.headers.forEach((v, k) => { reqHeaders[k] = v; });

  const event = {
    httpMethod: request.method,
    headers: reqHeaders,
    body: (request.method === 'GET' || request.method === 'HEAD') ? null : await request.text(),
    queryStringParameters: Object.fromEntries(new URL(request.url).searchParams),
  };

  const result = await handler(event, context);
  return new Response(result && result.body != null ? result.body : '', {
    status: (result && result.statusCode) || 200,
    headers: (result && result.headers) || {},
  });
}

// netlify/functions/chat.js
// This serverless function handles OpenAI API calls securely


const KNOWLEDGE_BASE = `
# Poppa's Wooden Creations Knowledge Base

## Business Overview
- Business: Poppa's Wooden Creations, Whangarei, New Zealand
- Established: 2015
- Website: poppaswoodencreations.co.nz
- Specialty: Handcrafted wooden toys and kitchenware from native NZ timbers
- Mission: Create heirloom-quality wooden products built to last generations
- Values: Sustainability, premium craftsmanship, safety, Montessori principles

## Products & Materials

### Kauri
- Premium native NZ timber with unique grain patterns
- Beautiful honey tones, each piece unique
- Best for heirloom pieces and special occasions
- Reclaimed or sustainably sourced
- Durable, lightweight, distinctive

### Rimu
- Native NZ timber with rich reddish-brown tones
- Beautiful grain, ages beautifully
- Best for everyday items, toys, kitchenware
- Sustainably harvested
- Strong and durable

### Macrocarpa
- NZ-grown cypress timber
- Warm tones, aromatic, naturally resistant
- Best for outdoor toys and robust items
- Locally grown, renewable
- Weather-resistant, naturally durable

### Product Categories
- Wooden Toys: Montessori-inspired developmental toys for ages 1-6
- First Birthday Gifts: Special heirloom pieces
- Kitchenware: Cutting boards, serving boards, utensils
- All products: Non-toxic finishes, food-safe, no small parts (age-appropriate)

## Common Questions

### Safety & Care
Q: Are toys safe for babies?
A: Absolutely! Non-toxic, food-safe finishes, smooth edges, no choking hazards, meets NZ safety standards.

Q: How to care for wooden items?
A: Wipe with damp cloth. Use mild soap if needed, dry immediately. Avoid soaking or dishwasher. Occasionally treat with food-safe oil.

Q: Will wood change color?
A: Yes, natural wood develops beautiful patina over time. This adds to heirloom quality.

### Sustainability
Q: Where is timber sourced?
A: Native NZ timbers (Kauri, Rimu) sustainably sourced or reclaimed. Macrocarpa locally grown in NZ.

Q: Are Kauri trees endangered?
A: We only use reclaimed Kauri or sustainably certified sources. Never illegally harvested.

Q: Are finishes eco-friendly?
A: Yes, non-toxic, food-safe finishes. Many use natural oils like coconut or linseed oil.

### Products
Q: Why more expensive than mass-produced?
A: Handcrafted from premium native timbers, hours of skilled work, heirloom quality that lasts generations.

Q: Are products Montessori-suitable?
A: Yes, many designed with Montessori principles: natural materials, open-ended play, sensory development.

Q: Why different grain patterns?
A: Each piece of native timber is unique. This makes each item truly one-of-a-kind.

## Key Messages
1. Heirloom Quality - Built to last generations
2. Unique & Handcrafted - No two pieces identical
3. Safety First - Non-toxic, age-appropriate
4. Sustainability - Eco-friendly plastic alternative
5. Montessori Principles - Supporting child development
6. NZ Pride - Native timbers, local craftsmanship

## Tone
Friendly, proud of NZ heritage, passionate about quality and sustainability, helpful without being pushy, warm when discussing children and family.
`;

const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a friendly customer service chatbot for Poppa's Wooden Creations, a handcrafted wooden toy and kitchenware business in Whangarei, New Zealand. Use the following knowledge base to answer questions accurately and helpfully. Be warm, enthusiastic about the craftsmanship and sustainability, and use a conversational Kiwi tone. Keep responses concise but informative (2-3 sentences usually).

${KNOWLEDGE_BASE}

Important guidelines:
- Be friendly and conversational
- Emphasize heirloom quality and sustainability when relevant
- If asked about specific pricing, shipping details, or custom orders, politely say you can help them via the contact form or email
- Celebrate the uniqueness of each handcrafted piece
- Use "Kia ora" occasionally for NZ flavor
- If you don't know something, be honest and offer to connect them with Adrian
- Keep responses concise - aim for 2-4 sentences unless more detail is specifically needed
- Use emojis sparingly (wood/tree emoji 🌳 or sparkle ✨ occasionally)`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: data.choices[0].message.content
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
