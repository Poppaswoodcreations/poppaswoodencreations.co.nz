// Cloudflare Pages Function: POST /api/save-order
// Inserts an order into Supabase via the REST API (no SDK needed).
//
// IDEMPOTENT: checks for an existing row with the same order_number before
// inserting. This protects against Stripe re-delivering the same webhook
// event (which it does whenever a response takes too long, or if there are
// duplicate webhook endpoints configured) — without this check, every
// re-delivery created a second order row and triggered a second round of
// emails.
export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const SUPABASE_URL =
    env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY =
    env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('save-order: missing Supabase env vars', {
      hasUrl: !!SUPABASE_URL, hasKey: !!SUPABASE_SERVICE_KEY,
    });
    return json({ error: 'Supabase env vars not configured' }, 500);
  }

  const headers = {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const o = await request.json();

    if (!o.orderNumber) {
      return json({ error: 'orderNumber is required' }, 400);
    }

    // ── Idempotency check — has this order already been saved? ─────────
    const existingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?order_number=eq.${encodeURIComponent(o.orderNumber)}&select=*`,
      { headers }
    );
    if (existingRes.ok) {
      const existingRows = await existingRes.json();
      if (Array.isArray(existingRows) && existingRows.length > 0) {
        console.log(`Order ${o.orderNumber} already saved — skipping duplicate insert`);
        return json({ success: true, alreadyExisted: true, order: existingRows[0] });
      }
    }

    const row = {
      order_number: o.orderNumber,
      order_total: o.orderTotal,
      subtotal: o.subtotal,
      shipping: o.shipping,
      items: o.items,
      customer: o.customer,
      payment_method: o.paymentMethod,
      status: 'pending',
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify([row]),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Supabase insert error:', res.status, errText);
      return json({ error: errText }, 500);
    }
    const data = await res.json();
    return json({ success: true, alreadyExisted: false, order: Array.isArray(data) ? data[0] : data });
  } catch (error) {
    console.error('save-order error:', error);
    return json({ error: error.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
