// Cloudflare Pages Function: POST /api/save-order
// Inserts an order into Supabase via the REST API (no SDK needed).
//
// IDEMPOTENT: checks for an existing row with the same order_number before
// inserting. This protects against Stripe re-delivering the same webhook
// event (which it does whenever a response takes too long, or if there are
// duplicate webhook endpoints configured) — without this check, every
// re-delivery created a second order row and triggered a second round of
// emails.
//
// STOCK TRACKING (13 Aug 2026): when the incoming order carries a
// `stockItems` array (id + quantity per line item — see stripe-webhook.js),
// this decrements stock_quantity for each product straight after a
// genuinely new insert. Because this only runs on the non-duplicate branch,
// Stripe re-delivering the same webhook event can never double-decrement.
// If a product's stock lands on exactly 1, a low-stock alert email fires.
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

    // ── Stock decrement — only on a genuinely new order ─────────────────
    if (Array.isArray(o.stockItems) && o.stockItems.length > 0) {
      try {
        const lowStockProducts = await decrementStock(SUPABASE_URL, headers, o.stockItems);
        if (lowStockProducts.length > 0) {
          const baseUrl = env.SITE_URL || 'https://poppaswoodencreations.co.nz';
          // IMPORTANT: wrapped in context.waitUntil() — Cloudflare Pages
          // Functions can kill an un-awaited fetch the instant the response
          // is returned below, before it ever reaches Resend. waitUntil()
          // keeps this request alive until it actually settles.
          const alertPromise = fetch(`${baseUrl}/api/send-low-stock-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: lowStockProducts }),
          })
            .then(res => {
              if (!res.ok) console.error('send-low-stock-email responded', res.status);
            })
            .catch(e => console.error('send-low-stock-email fetch error:', e.message));

          if (context.waitUntil) {
            context.waitUntil(alertPromise);
          }
        }
      } catch (stockErr) {
        // Never let a stock hiccup fail the order save — the order and
        // customer email matter more than the stock count being exact.
        console.error('Stock decrement error:', stockErr.message);
      }
    }

    return json({ success: true, alreadyExisted: false, order: Array.isArray(data) ? data[0] : data });
  } catch (error) {
    console.error('save-order error:', error);
    return json({ error: error.message }, 500);
  }
}

// Decrements stock_quantity for each { id, quantity } item, floored at 0,
// and flips in_stock to false once a product hits 0. Returns the list of
// products that landed on exactly 1 — the threshold for a low-stock alert.
async function decrementStock(SUPABASE_URL, headers, items) {
  const lowStock = [];

  for (const item of items) {
    if (!item.id || !item.quantity) continue;
    try {
      const getRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(item.id)}&select=id,name,stock_quantity`,
        { headers }
      );
      if (!getRes.ok) {
        console.error(`Stock lookup failed for ${item.id}:`, await getRes.text());
        continue;
      }
      const rows = await getRes.json();
      if (!rows.length) {
        console.error(`Stock decrement: product not found for id ${item.id}`);
        continue;
      }
      const product = rows[0];
      const currentStock = typeof product.stock_quantity === 'number' ? product.stock_quantity : 0;
      const newStock = Math.max(0, currentStock - item.quantity);

      const patchBody = { stock_quantity: newStock };
      if (newStock === 0) patchBody.in_stock = false;

      const patchRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(item.id)}`,
        {
          method: 'PATCH',
          headers: { ...headers, Prefer: 'return=representation' },
          body: JSON.stringify(patchBody),
        }
      );
      if (!patchRes.ok) {
        console.error(`Stock decrement failed for ${item.id}:`, await patchRes.text());
        continue;
      }

      console.log(`Stock for ${product.name} (${item.id}): ${currentStock} -> ${newStock}`);

      if (newStock === 1) {
        lowStock.push({ id: product.id, name: product.name, stock_quantity: newStock });
      }
    } catch (err) {
      console.error(`Stock decrement error for ${item.id}:`, err.message);
    }
  }

  return lowStock;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
