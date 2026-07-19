// Cloudflare Pages Function: POST /api/create-payment-intent
// Creates a Stripe PaymentIntent via the Stripe REST API (no SDK needed).
//
// SECURITY: the amount charged is now computed entirely server-side from
// real product prices in Supabase — the client only sends item IDs and
// quantities, never a dollar amount. This closes a price-tampering hole
// where a modified request could previously charge any amount the caller
// wanted, regardless of what was actually in the cart.

const RURAL_SURCHARGE = 5.70;

const NZ_RURAL_POSTCODES = new Set([
  // North Island
  '0448','0792','0793','0794','4771','3979','4884','3078','0486','2675','0496','4894','3493','3494','3495','3496',
  '5791','5792','3581','3582','3583','3584','4971','4972','4973','4975','4976','4977','4978','4970','4979',
  '0371','0372','0373','0374','0376','0377','0370','0379','2577','2578','2579','4994','4996','4993','4995',
  '4398','4399','5771','5772','5773','4775','4777','4779','4891','4893','4071','4072','4073','0991','5794',
  '3281','3282','3283','3284','3285','3286','3287','3288','3289','3290','3293','4171','4172','4174','4175',
  '4179','4180','4178','4294','4295','4671','4672','4673','4674','4675','4678','4679','0874','0875','0781',
  '0782','3579','0181','0182','0184','2571','4781','4782','4783','4784','4785','4786','3771','3772','4386',
  '4387','4388','4389','4390','0478','0479','0474','0472','0473','0481','0482','0483','0484','0573','0185',
  '6972','3177','3178','3170','3181','0871','0873','0281','0282','0283','3889','0294','0295','0293','4774',
  '0491','0492','4188','0891','0892','5571','5574','5575','5572','5570','5573','3978','3492','4797','0494',
  '2576','4078','4787','4788','4789','5881','5882','5883','5884','5885','5886','5887','5888','5889','5890',
  '5871','5872','0593','0594','3471','3472','3473','4075','3995','0583','0587','0588','0589','2474','4376',
  '3371','3372','3373','3374','3375','3079','4181','4182','4183','4184','4186','0772','4371','4372','4373',
  '4374','4381','3793','3794','3597','4974','4198','4691','3881','3882','3883','3784','3980','0475','0476',
  '0192','4278','4279','3997','3885','3886','3197','3198','3199','4681','4682','4684','4685','5581','5582',
  '5583','4276','4277','3972','3973','3974','3975','3976','3977','3989','3990','3671','3672','3673','3674',
  '4981','4982','4983','4984','4985','4986','4987','4988','4989','4471','4472','4473','4474','4475','4476',
  '4477','4478','4479','4470','4481','2580','2582','2583','2584','2585','0571','4597','4598','3971','3970',
  '2471','2472','2473','4990','4991','4992','4291','4292','4293','5381','3880','2676','2677','2678','2679',
  // South Island (etc.)
  '7477','7895','7081','9881','9883','7885','7379','9571','9572','7873','7285','7580','7681','7988','7183',
  '7182','9587','9679','9672','7985','7986','7971','7972','7973','7974','7975','9884','9691','7173','7175',
  '7395','9778','7491','9471','9472','7977','7978','7979','7980','9085','7095','7096','9382','7891','7892',
  '7886','9781','9782','9783','9891','9892','9893',
]);

function isRuralPostcode(postcode) {
  return NZ_RURAL_POSTCODES.has(String(postcode || '').trim());
}

function calculateShipping({ items, dbProducts, subtotal, totalWeight, country, deliveryMethod, postalCode }) {
  if (deliveryMethod === 'pickup') return 0;

  // Same "small pine vehicle" free-shipping rule as the client, but checked
  // against real DB prices/names rather than anything the client claims.
  const hasPineCars = items.some(item => {
    const p = dbProducts[item.id];
    if (!p) return false;
    const name = (p.name || '').toLowerCase();
    return p.price === 5.0 && (
      name.includes('pine') || name.includes('car') || name.includes('ute') || name.includes('small')
    );
  });
  if (hasPineCars) return 0;

  if (subtotal >= 1000) return 0;

  let base;
  switch (country) {
    case 'NZ':
      base = totalWeight <= 1 ? 10 : totalWeight <= 2 ? 13 : totalWeight <= 3 ? 19 : totalWeight <= 4 ? 26 : 32;
      break;
    case 'AU':
      base = totalWeight <= 1 ? 25 : 35;
      break;
    case 'US':
    case 'CA':
      base = totalWeight <= 1 ? 35 : 50;
      break;
    case 'GB':
      base = totalWeight <= 1 ? 40 : 55;
      break;
    default:
      base = totalWeight <= 1 ? 50 : 70;
  }

  const isRural = country === 'NZ' && deliveryMethod === 'shipping' && isRuralPostcode(postalCode);
  return base + (isRural ? RURAL_SURCHARGE : 0);
}

async function fetchProducts(supabaseUrl, supabaseKey, ids) {
  if (!ids.length) return {};
  const uniqueIds = [...new Set(ids)];
  const idList = uniqueIds.map(id => `"${id}"`).join(',');
  const res = await fetch(
    `${supabaseUrl}/rest/v1/products?id=in.(${idList})&select=id,name,price,weight,in_stock`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );
  if (!res.ok) return {};
  const rows = await res.json();
  const map = {};
  for (const row of rows) map[row.id] = row;
  return map;
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('create-payment-intent: missing Supabase env vars');
    return json({ error: 'Supabase env vars not configured' }, 500);
  }

  try {
    const body = await request.json();
    const { items, deliveryMethod, country, postalCode, metadata } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return json({ error: 'Cart items are required' }, 400);
    }

    // Normalise + validate the item list shape before touching the DB.
    const cleanItems = items
      .map(i => ({ id: String(i.id || ''), quantity: Math.max(1, Math.min(50, parseInt(i.quantity, 10) || 1)) }))
      .filter(i => i.id);

    if (cleanItems.length === 0) {
      return json({ error: 'Invalid cart items' }, 400);
    }

    const dbProducts = await fetchProducts(SUPABASE_URL, SUPABASE_ANON_KEY, cleanItems.map(i => i.id));

    let subtotal = 0;
    let totalWeight = 0;
    for (const item of cleanItems) {
      const product = dbProducts[item.id];
      if (!product) {
        return json({ error: `Product not found: ${item.id}` }, 400);
      }
      subtotal += Number(product.price || 0) * item.quantity;
      totalWeight += Number(product.weight || 0.5) * item.quantity;
    }

    const shipping = calculateShipping({
      items: cleanItems,
      dbProducts,
      subtotal,
      totalWeight,
      country: country || 'NZ',
      deliveryMethod: deliveryMethod || 'shipping',
      postalCode: postalCode || '',
    });

    const grandTotal = subtotal + shipping;

    if (!(grandTotal > 0)) {
      return json({ error: 'Computed total must be greater than zero' }, 400);
    }

    const form = new URLSearchParams();
    form.set('amount', String(Math.round(grandTotal * 100)));
    form.set('currency', 'nzd');
    form.set('automatic_payment_methods[enabled]', 'true');
    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        // Stripe metadata values are capped at 500 chars
        form.set(`metadata[${key}]`, String(value).slice(0, 490));
      }
    }
    form.set('metadata[server_computed_subtotal]', subtotal.toFixed(2));
    form.set('metadata[server_computed_shipping]', shipping.toFixed(2));
    form.set('metadata[server_computed_total]', grandTotal.toFixed(2));

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

    return new Response(JSON.stringify({
      clientSecret: pi.client_secret,
      subtotal,
      shipping,
      grandTotal,
    }), {
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
