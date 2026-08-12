// Cloudflare Pages Function: POST /api/create-payment-intent
// Creates a Stripe PaymentIntent via the Stripe REST API (no SDK needed).
//
// SECURITY: the amount charged is now computed entirely server-side from
// real product prices in Supabase — the client only sends item IDs and
// quantities, never a dollar amount. This closes a price-tampering hole
// where a modified request could previously charge any amount the caller
// wanted, regardless of what was actually in the cart.
//
// SHIPPING: NZ Post charges by billable weight, which is the GREATER of
// actual weight and volumetric weight — not actual weight alone. Volumetric
// weight = (length_cm x width_cm x height_cm) / 5000, per NZ Post's own
// formula. A weight-only calculation undercharges any order with several
// small, differently-shaped items (e.g. a T-Rex + rattle + helicopter is
// light in total but needs a bigger box than its weight alone suggests).
// This is computed from real product dimensions stored in Supabase
// (length_mm/width_mm/height_mm), falling back to actual weight only for
// any product missing dimension data.
//
// FIX (12 Aug 2026): this file's NZ_RURAL_POSTCODES set had been silently
// truncated at some point — it was missing the entire ~2680–7476 postcode
// range (most of the central North Island and a chunk of the South Island,
// including 3073/Kaingaroa Forest), while the client-side copy in Cart.tsx
// was complete. Because this server file is what actually computes the
// Stripe charge, every rural order in that missing range was silently
// undercharged by the full $6.00 rural surcharge, even though the customer
// saw the correct rural banner/line-item on the checkout page. Replaced
// with the full, complete set below — now byte-for-byte identical to
// Cart.tsx so client display and server charge can never drift apart again.
//
// STOCK TRACKING (13 Aug 2026): item IDs + quantities are now also written
// into Stripe metadata as `stock_items` ("id1:qty1,id2:qty2"). The webhook
// reads this back and passes it to save-order.js, which decrements
// stock_quantity for each product and fires a low-stock alert once a
// product's stock hits 1. This file never touches stock itself — it only
// carries the IDs through so the webhook (which fires after payment
// actually succeeds) can act on them.

// NZ Post small-parcel pricing effective 1 July 2026 (Courier service tier —
// delivery to door, next working day). Source: NZ Post small parcel rate card.
const RURAL_SURCHARGE = 6.00;

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
  '3481','3482','3483','4694','4696','3295','3296','3297','4189','3081','3083','4780','3077','3072','3073',
  '3074','3076','3096','3097','4081','4082','4083','0591','0592','0272','0994','0992','0993','4391','4392',
  '4393','4394','4395','4396','4397','4791','4792','4793','4794','4795','4796','4286','4287','4288','0381',
  '3991','3992','3993','3994','3996','3791','3792','3377','3378','3379','3384','3385','3171','3172','3173',
  '3174','3175','3176','3179','3180','3391','3392','3393','3879','3872','3873','3874','3875','3876','3877',
  '3878','4091','4092','4093','4094','3781','3782','0391','3981','3982','3983','3985','3986','3987','3988',
  '3894','3895','3182','3183','3186','3187','3188','3189','3578','3577','3574','3575','3576','4087','4086',
  '5894','3484','3485','4079','3491','4077','2696','2697','2693','2694','2695','3381','3382','5371','5372',
  '4377','4375','4379','4378','3474','1971','3681','3682','5391','3196','0881','0882','0883','3998','5373',
  '0193','4271','4272','4273','4274','4275','0582','4281','4282','4283','4284','4285','4191','4197','4193',
  '4195','4196','4382','4383','3380','2681','2682','2683','2684','3475','4571','4572','4573','4574','4575',
  '4576','4577','4578','4581','4582','4584','4585','4586','4587','4588','0981','0982','0983','0984','0985',
  '0986','4591','4592','0972','0973','0974','0975','0977','3191','3192','3193','3194','3691','0171','0172',
  '0173','0174','0175','0176','0178','0179','0170','3591','3592','4997','4998','4999',
  // South Island
  '7581','7582','7583','9391','9392','9393','7481','7482','7483','7771','7772','7773','7774','7775','7776',
  '7777','7778','9271','9272','9273','9274','9779','7670','7871','7271','7272','7273','7274','7275','7276',
  '9091','7091','7984','7381','7382','7383','7384','7671','7672','7674','7675','7676','7677','7678','9583',
  '9584','7673','7073','9384','9383','7391','7392','7571','7572','9791','7872','9076','9077','7987','7193',
  '7991','7992','9372','9771','9772','9773','9774','9775','9776','9777','7387','7884','7178','7385','7881',
  '7882','7883','9871','9872','9874','9875','9876','9879','9877','7691','7692','7371','7374','7373','9281',
  '9282','7893','7875','9498','9591','9593','7682','7683','7591','9792','9793','9794','8971','5781','5782',
  '5783','5784','7791','9596','9597','9598','9291','9292','9092','7196','7197','7198','7077','7071','7072',
  '9491','9492','9494','9495','9493','9376','9377','9689','9682','9683','9386','9387','9073','9074','9585',
  '9586','7495','9481','9482','9483','7990','7281','7282','7284','7982','7983','9081','9082','9371','7194',
  '7192','7195','7781','7782','7783','7784','9395','9396','9397','9398','7471','7472','7473','7475','7476',
  '7477','7895','7081','9881','9883','7885','7379','9571','9572','7873','7285','7580','7681','7988','7183',
  '7182','9587','9679','9672','7985','7986','7971','7972','7973','7974','7975','9884','9691','7173','7175',
  '7395','9778','7491','9471','9472','7977','7978','7979','7980','9085','7095','7096','9382','7891','7892',
  '7886','9781','9782','9783','9891','9892','9893',
]);

function isRuralPostcode(postcode) {
  return NZ_RURAL_POSTCODES.has(String(postcode || '').trim());
}

// NZ Post's own addressing convention marks rural delivery addresses with an
// explicit "RD" (Rural Delivery) number in the address line itself, e.g.
// "RD 3", "RD10", "R D 5". This catches genuinely rural addresses whose
// postcode isn't in our (necessarily incomplete) NZ_RURAL_POSTCODES list —
// postcodes can cover a mix of urban and rural delivery points, so the list
// alone will always miss some. RD-in-address is a much stronger per-address
// signal and costs nothing to check.
function isRuralAddressText(address) {
  return /\bR\.?\s?D\.?\s?\d+\b/i.test(String(address || ''));
}

// NZ Post's own formula: volumetric weight (kg) = (L cm x W cm x H cm) / 5000
function volumetricWeightKg(lengthMm, widthMm, heightMm) {
  if (!lengthMm || !widthMm || !heightMm) return 0; // missing dims -> no volumetric contribution
  const lCm = lengthMm / 10, wCm = widthMm / 10, hCm = heightMm / 10;
  return (lCm * wCm * hCm) / 5000;
}

// Approximates NZ Post's size-based Courier tiers (XS/S/M/L/XL) using
// billable weight as a proxy, since we don't store box-size categories.
// Prices are the Courier column from NZ Post's small-parcel rate card,
// effective 1 July 2026: XS $9.10, S $10.40, M $12.40, L $13.40, XL $18.70.
// Floored at $10 on the smallest tier — the last few orders showed Courier
// coming in cheaper than our old $10 minimum, so we keep $10 as the floor.
function nzWeightTier(weight) {
  return weight <= 1 ? 10.00 : weight <= 2 ? 10.40 : weight <= 3 ? 12.40 : weight <= 4 ? 13.40 : 18.70;
}

function calculateShipping({ items, dbProducts, subtotal, billableWeight, country, deliveryMethod, postalCode, address }) {
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
      base = nzWeightTier(billableWeight);
      break;
    case 'AU':
      base = billableWeight <= 1 ? 25 : 35;
      break;
    case 'US':
    case 'CA':
      base = billableWeight <= 1 ? 35 : 50;
      break;
    case 'GB':
      base = billableWeight <= 1 ? 40 : 55;
      break;
    default:
      base = billableWeight <= 1 ? 50 : 70;
  }

  const isRural = country === 'NZ' && deliveryMethod === 'shipping' &&
    (isRuralPostcode(postalCode) || isRuralAddressText(address));
  return base + (isRural ? RURAL_SURCHARGE : 0);
}

async function fetchProducts(supabaseUrl, supabaseKey, ids) {
  if (!ids.length) return {};
  const uniqueIds = [...new Set(ids)];
  const idList = uniqueIds.map(id => `"${id}"`).join(',');
  const res = await fetch(
    `${supabaseUrl}/rest/v1/products?id=in.(${idList})&select=id,name,price,weight,length_mm,width_mm,height_mm,in_stock`,
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
    const { items, deliveryMethod, country, postalCode, address, metadata } = body || {};
    const shippingAddress = address || (metadata && metadata.address) || '';

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
    let totalActualWeight = 0;
    let totalVolumetricWeight = 0;
    for (const item of cleanItems) {
      const product = dbProducts[item.id];
      if (!product) {
        return json({ error: `Product not found: ${item.id}` }, 400);
      }
      subtotal += Number(product.price || 0) * item.quantity;
      totalActualWeight += Number(product.weight || 0.5) * item.quantity;
      totalVolumetricWeight += volumetricWeightKg(product.length_mm, product.width_mm, product.height_mm) * item.quantity;
    }

    // NZ Post bills whichever is greater: actual weight or volumetric weight.
    const billableWeight = Math.max(totalActualWeight, totalVolumetricWeight);

    const shipping = calculateShipping({
      items: cleanItems,
      dbProducts,
      subtotal,
      billableWeight,
      country: country || 'NZ',
      deliveryMethod: deliveryMethod || 'shipping',
      postalCode: postalCode || '',
      address: shippingAddress,
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

    // Stock tracking: carry exact product IDs + quantities through to the
    // webhook (which fires only after payment actually succeeds), so it can
    // tell save-order.js precisely what to decrement. Format: "id:qty,id:qty".
    // Stripe metadata values cap at 500 chars — for a handmade shop's cart
    // sizes this is comfortably enough room; if a cart is ever large enough
    // to exceed it, we just truncate rather than fail the whole payment.
    const stockItemsStr = cleanItems.map(i => `${i.id}:${i.quantity}`).join(',').slice(0, 490);
    form.set('metadata[stock_items]', stockItemsStr);

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
