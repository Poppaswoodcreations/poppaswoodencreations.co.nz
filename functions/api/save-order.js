// Cloudflare Pages Function: POST /api/save-order
// Inserts an order into Supabase via the REST API (no SDK needed).
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

  try {
    const o = await request.json();
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
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify([row]),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Supabase insert error:', res.status, errText);
      return json({ error: errText }, 500);
    }
    const data = await res.json();
    return json({ success: true, order: Array.isArray(data) ? data[0] : data });
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
