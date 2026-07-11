// Cloudflare Pages Function: POST /api/admin-products
// Handles all admin product writes (save/update/delete/bulk-sync) server-side.
// The service role key never leaves this function — the browser only ever
// sends the admin password + the data, and gets JSON back.

const REQUEST_LIMIT = 30;             // max requests
const REQUEST_WINDOW_SECONDS = 300;    // per 5 minutes

const AUTH_FAIL_LIMIT = 5;             // max wrong-password attempts
const AUTH_FAIL_WINDOW_SECONDS = 900;  // per 15 minutes

async function checkLimit(kv, key, limit, windowSeconds) {
  if (!kv) return { allowed: true }; // KV not bound yet — fail open
  const now = Date.now();
  const raw = await kv.get(key);
  let data = raw ? JSON.parse(raw) : { count: 0, start: now };

  if (now - data.start > windowSeconds * 1000) {
    data = { count: 0, start: now };
  }

  data.count += 1;
  await kv.put(key, JSON.stringify(data), { expirationTtl: windowSeconds });

  return { allowed: data.count <= limit };
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return json({ error: 'Method Not Allowed' }, 405);
  }

  const kv = env.RATE_LIMIT_KV;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  const requestCheck = await checkLimit(kv, `admin-products:req:${ip}`, REQUEST_LIMIT, REQUEST_WINDOW_SECONDS);
  if (!requestCheck.allowed) {
    return json({ error: 'Too many requests. Please wait a few minutes and try again.' }, 429);
  }

  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY =
    env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_KEY;
  const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'Adrianbar1?';

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('admin-products: missing Supabase env vars', {
      hasUrl: !!SUPABASE_URL, hasKey: !!SUPABASE_SERVICE_KEY,
    });
    return json({ error: 'Supabase env vars not configured' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { password, action, product, id, updates, products } = body || {};

  if (password !== ADMIN_PASSWORD) {
    const authCheck = await checkLimit(kv, `admin-products:auth:${ip}`, AUTH_FAIL_LIMIT, AUTH_FAIL_WINDOW_SECONDS);
    if (!authCheck.allowed) {
      return json({ error: 'Too many failed attempts. Please wait 15 minutes and try again.' }, 429);
    }
    return json({ error: 'Unauthorized' }, 401);
  }

  const headers = {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    if (action === 'save') {
      const genId = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const row = {
        id: product.id || genId,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images,
        in_stock: product.inStock,
        featured: product.featured,
        seo_title: product.seoTitle || '',
        seo_description: product.seoDescription || '',
        stock_quantity: product.stockQuantity || 0,
        weight: product.weight || 0,
        length_mm: product.lengthMm ?? null,
        width_mm: product.widthMm ?? null,
        height_mm: product.heightMm ?? null,
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=representation' },
        body: JSON.stringify(row),
      });
      if (!res.ok) return json({ error: await res.text() }, 500);
      return json({ success: true, product: await res.json() });
    }

    if (action === 'update') {
      const dbUpdates = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      if (updates.seoTitle !== undefined) dbUpdates.seo_title = updates.seoTitle;
      if (updates.seoDescription !== undefined) dbUpdates.seo_description = updates.seoDescription;
      if (updates.stockQuantity !== undefined) dbUpdates.stock_quantity = updates.stockQuantity;
      if (updates.weight !== undefined) dbUpdates.weight = updates.weight;
      if (updates.lengthMm !== undefined) dbUpdates.length_mm = updates.lengthMm;
      if (updates.widthMm !== undefined) dbUpdates.width_mm = updates.widthMm;
      if (updates.heightMm !== undefined) dbUpdates.height_mm = updates.heightMm;

      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { ...headers, Prefer: 'return=representation' },
        body: JSON.stringify(dbUpdates),
      });
      if (!res.ok) return json({ error: await res.text() }, 500);
      return json({ success: true, product: await res.json() });
    }

    if (action === 'delete') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) return json({ error: await res.text() }, 500);
      return json({ success: true });
    }

    if (action === 'bulk-sync') {
      const rows = (products || []).map(p => ({
        id: p.id || `SQ${Math.floor(Math.random() * 10000000)}`,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
        in_stock: p.inStock,
        featured: p.featured,
        weight: p.weight || 0.5,
        stock_quantity: p.stockQuantity || 5,
      }));

      const batchSize = 10;
      let totalInserted = 0;
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?on_conflict=id`, {
          method: 'POST',
          headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify(batch),
        });
        if (!res.ok) return json({ error: `Batch failed: ${await res.text()}` }, 500);
        const batchData = await res.json();
        totalInserted += batchData.length;
      }
      return json({ success: true, totalInserted });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (error) {
    console.error('admin-products error:', error);
    return json({ error: error.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
