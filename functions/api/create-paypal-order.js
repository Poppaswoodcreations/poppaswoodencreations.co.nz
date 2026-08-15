// Cloudflare Pages Function: POST /api/create-paypal-order
//
// FIX (16 Aug 2026): PayPal checkout previously computed the charge amount
// entirely in the browser (PayPalButton.tsx's `grandTotal` prop, set by
// Cart.tsx) and sent that number straight to PayPal via the client-side
// SDK's actions.order.create(). Anyone with browser dev tools open could
// edit that value before paying — the same price-tampering hole already
// closed for Stripe in create-payment-intent.js. This endpoint recomputes
// the real charge server-side from actual Supabase product prices,
// mirroring create-payment-intent.js's logic as closely as possible, and
// order creation now happens here rather than in the browser.
//
// NZ_RURAL_POSTCODES / shipping logic duplicated from create-payment-intent.js
// and Cart.tsx, per the existing project convention (see create-payment-intent.js's
// own comments for why — no shared module setup yet in this codebase). Keep
// all three copies byte-for-byte identical if shipping rates ever change.

const PAYPAL_CLIENT_ID = 'AaTKWO_kVwBAySr7UBFWRQCKSZXzrwZCjeMcxKG5cggnG_6M2L-KGiqUI8ZYTxCudlo_qayN15nTIzdt';
const PAYPAL_API_BASE = 'https://api-m.paypal.com';

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
function isRuralAddressText(address) {
  return /\bR\.?\s?D\.?\s?\d+\b/i.test(String(address || ''));
}
function volumetricWeightKg(lengthMm, widthMm, heightMm) {
  if (!lengthMm || !widthMm || !heightMm) return 0;
  const lCm = lengthMm / 10, wCm = widthMm / 10, hCm = heightMm / 10;
  return (lCm * wCm * hCm) / 5000;
}
function nzWeightTier(weight) {
  return weight <= 1 ? 10.00 : weight <= 2 ? 10.40 : weight <= 3 ? 12.40 : weight <= 4 ? 13.40 : 18.70;
}
function calculateShipping({ items, dbProducts, subtotal, billableWeight, country, deliveryMethod, postalCode, address }) {
  if (deliveryMethod === 'pickup') return 0;

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
    case 'NZ': base = nzWeightTier(billableWeight); break;
    case 'AU': base = billableWeight <= 1 ? 25 : 35; break;
    case 'US':
    case 'CA': base = billableWeight <= 1 ? 35 : 50; break;
    case 'GB': base = billableWeight <= 1 ? 40 : 55; break;
    default: base = billableWeight <= 1 ? 50 : 70;
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

async function getPayPalAccessToken(env) {
  const secret = env.PAYPAL_CLIENT_SECRET;
  if (!secret) throw new Error('PAYPAL_CLIENT_SECRET not configured');
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${secret}`);
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`PayPal auth failed: ${errText}`);
  }
  const data = await res.json();
  return data.access_token;
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return json({ error: 'Method Not Allowed' }, 405);
  }

  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('create-paypal-order: missing Supabase env vars');
    return json({ error: 'Supabase env vars not configured' }, 500);
  }

  try {
    const body = await request.json();
    const { items, deliveryMethod, country, postalCode, address } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return json({ error: 'Cart items are required' }, 400);
    }

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

    const billableWeight = Math.max(totalActualWeight, totalVolumetricWeight);

    const shipping = calculateShipping({
      items: cleanItems,
      dbProducts,
      subtotal,
      billableWeight,
      country: country || 'NZ',
      deliveryMethod: deliveryMethod || 'shipping',
      postalCode: postalCode || '',
      address: address || '',
    });

    const grandTotal = subtotal + shipping;

    if (!(grandTotal > 0)) {
      return json({ error: 'Computed total must be greater than zero' }, 400);
    }

    const accessToken = await getPayPalAccessToken(env);

    const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'NZD', value: grandTotal.toFixed(2) },
          description: "Poppa's Wooden Creations Order",
        }],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error('PayPal order create error:', orderData);
      return json({ error: orderData.message || 'PayPal order creation failed' }, orderRes.status);
    }

    return json({
      orderId: orderData.id,
      subtotal,
      shipping,
      grandTotal,
    });
  } catch (error) {
    console.error('create-paypal-order error:', error);
    return json({ error: error.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
