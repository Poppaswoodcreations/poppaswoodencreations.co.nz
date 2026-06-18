// Cloudflare Pages Function: POST /api/create-payment-intent
// Creates a Stripe PaymentIntent via the Stripe REST API (no SDK needed).
export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { amount, currency = 'nzd', metadata } = await request.json();

    if (!amount || amount <= 0) {
      return json({ error: 'Invalid amount' }, 400);
    }

    const form = new URLSearchParams();
    form.set('amount', String(Math.round(amount * 100)));
    form.set('currency', currency);
    form.set('automatic_payment_methods[enabled]', 'true');
    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        // Stripe metadata values are capped at 500 chars
        form.set(`metadata[${key}]`, String(value).slice(0, 490));
      }
    }

    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    const pi = await res.json();
    if (!res.ok) {
      console.error('Stripe error:', pi);
      return json({ error: (pi.error && pi.error.message) || 'Stripe error' }, res.status);
    }

    return new Response(JSON.stringify({ clientSecret: pi.client_secret }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('create-payment-intent error:', error);
    return json({ error: error.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
