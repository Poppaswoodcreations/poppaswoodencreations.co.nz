// Cloudflare Pages Function: POST /api/stripe-webhook
// Verifies the Stripe signature with Web Crypto (no SDK), then saves the order
// and triggers order emails. Order-handling logic is unchanged from the original.

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const rawBody = await request.text();
  const sig = request.headers.get('stripe-signature');

  const valid = await verifyStripeSignature(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    console.error('Webhook signature verification failed');
    return new Response('Webhook Error: signature verification failed', { status: 400 });
  }

  let stripeEvent;
  try {
    stripeEvent = JSON.parse(rawBody);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Accept BOTH the Checkout flow and the direct PaymentIntent flow.
  let metadata = {};
  let amountTotal = 0;
  let stripeRef = '';

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    metadata = session.metadata || {};
    amountTotal = (session.amount_total != null ? session.amount_total : 0) / 100;
    stripeRef = session.payment_intent || session.id;

    // If order metadata wasn't set on the session, it may be on the
    // PaymentIntent — retrieve it and merge (session values win).
    if (!metadata.items && session.payment_intent) {
      try {
        const piRes = await fetch(`https://api.stripe.com/v1/payment_intents/${session.payment_intent}`, {
          headers: { 'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}` },
        });
        if (piRes.ok) {
          const pi = await piRes.json();
          metadata = { ...(pi.metadata || {}), ...metadata };
          if (!amountTotal) amountTotal = (pi.amount || 0) / 100;
        }
      } catch (e) {
        console.error('Could not retrieve PaymentIntent for session:', e.message);
      }
    }
  } else if (stripeEvent.type === 'payment_intent.succeeded') {
    const pi = stripeEvent.data.object;
    metadata = pi.metadata || {};
    amountTotal = (pi.amount || 0) / 100;
    stripeRef = pi.id;
  } else {
    console.log(`Event ${stripeEvent.type} ignored`);
    return new Response('Event ignored', { status: 200 });
  }

  const m = metadata;
  const customerName   = m.customer_name   || 'Not provided';
  const customerEmail  = m.customer_email  || 'Not provided';
  const deliveryMethod = m.delivery_method || 'shipping';
  const address        = m.address         || '';
  const city           = m.city            || '';
  const postalCode     = m.postal_code     || '';
  const country        = m.country         || 'NZ';
  const subtotal       = parseFloat(m.subtotal || '0');
  const shippingCost   = parseFloat(m.shipping || '0');
  const grandTotal     = amountTotal;
  const paymentMethod  = m.payment_method  || 'Card';

  const refTail = (stripeRef || '').slice(-8).toUpperCase();
  const orderId = `STR-${refTail}`;

  const itemsStr = m.items || '';
  const items = itemsStr
    ? itemsStr.split(', ').map(itemStr => {
        const match = itemStr.match(/^(.+) x(\d+) \(\$([0-9.]+)\)$/);
        if (match) {
          const totalPrice = parseFloat(match[3]);
          const quantity = parseInt(match[2], 10);
          return { name: match[1], quantity, price: totalPrice / quantity };
        }
        return { name: itemStr, quantity: 1, price: 0 };
      })
    : [];

  const payload = {
    orderNumber: orderId,
    orderTotal: grandTotal,
    subtotal,
    shipping: shippingCost,
    items,
    customer: {
      name: customerName,
      email: customerEmail,
      address,
      city,
      postalCode,
      country,
      deliveryMethod,
    },
    paymentMethod,
  };

  const baseUrl = env.SITE_URL || 'https://poppaswoodencreations.co.nz';

  // Save order to Supabase
  try {
    const saveRes = await fetch(`${baseUrl}/api/save-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!saveRes.ok) {
      const errText = await saveRes.text();
      console.error(`save-order failed (${saveRes.status}):`, errText);
    } else {
      console.log(`Order ${orderId} saved to Supabase`);
    }
  } catch (saveErr) {
    console.error('save-order fetch error:', saveErr);
  }

  // Send order emails
  try {
    const emailRes = await fetch(`${baseUrl}/api/send-order-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error(`send-order-email failed (${emailRes.status}):`, errText);
    } else {
      console.log(`Order emails sent for ${orderId}`);
    }
  } catch (emailErr) {
    console.error('send-order-email fetch error:', emailErr);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}


// ── Stripe signature verification (Web Crypto — no SDK) ──────────────
async function verifyStripeSignature(rawBody, sigHeader, secret, toleranceSec = 300) {
  if (!sigHeader || !secret) return false;
  let t;
  const v1s = [];
  for (const part of sigHeader.split(',')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k === 't') t = v;
    else if (k === 'v1') v1s.push(v);
  }
  if (!t || v1s.length === 0) return false;

  const expected = await computeHmac(secret, `${t}.${rawBody}`);
  if (!v1s.some((v) => timingSafeEqual(v, expected))) return false;

  // Replay protection: reject timestamps outside the tolerance window
  const now = Math.floor(Date.now() / 1000);
  if (toleranceSec && Math.abs(now - Number(t)) > toleranceSec) return false;
  return true;
}

async function computeHmac(secret, payload) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
