// Cloudflare Pages Function: POST /api/admin-orders
// Handles all admin order reads/writes (list/update-status/delete) server-side.
// The service role key never leaves this function — the browser only ever
// sends the admin password + the data, and gets JSON back.
// Same pattern as admin-products.js.

const REQUEST_LIMIT = 30;             // max requests
const REQUEST_WINDOW_SECONDS = 300;    // per 5 minutes

const AUTH_FAIL_LIMIT = 5;             // max wrong-password attempts
const AUTH_FAIL_WINDOW_SECONDS = 900;  // per 15 minutes

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'completed'];

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

  const requestCheck = await checkLimit(kv, `admin-orders:req:${ip}`, REQUEST_LIMIT, REQUEST_WINDOW_SECONDS);
  if (!requestCheck.allowed) {
    return json({ error: 'Too many requests. Please wait a few minutes and try again.' }, 429);
  }

  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY =
    env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_KEY;
  const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'Adrianbar1?';

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('admin-orders: missing Supabase env vars', {
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

  const { password, action, id, status } = body || {};

  if (password !== ADMIN_PASSWORD) {
    const authCheck = await checkLimit(kv, `admin-orders:auth:${ip}`, AUTH_FAIL_LIMIT, AUTH_FAIL_WINDOW_SECONDS);
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
    if (action === 'list') {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`,
        { headers }
      );
      if (!res.ok) return json({ error: await res.text() }, 500);
      return json({ success: true, orders: await res.json() });
    }

    if (action === 'update-status') {
      if (!id || !VALID_STATUSES.includes(status)) {
        return json({ error: 'Invalid id or status' }, 400);
      }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { ...headers, Prefer: 'return=representation' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return json({ error: await res.text() }, 500);
      return json({ success: true, order: await res.json() });
    }

    if (action === 'delete') {
      if (!id) return json({ error: 'Missing id' }, 400);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) return json({ error: await res.text() }, 500);
      return json({ success: true });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (error) {
    console.error('admin-orders error:', error);
    return json({ error: error.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
