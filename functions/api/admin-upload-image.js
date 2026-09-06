// Cloudflare Pages Function: POST /api/admin-upload-image
//
// FIX (2 Sep 2026): src/components/ImageUpload.tsx used to convert every
// uploaded image to a base64 data: URL and save THAT directly into the
// product's `images` array in Supabase — it imported `uploadImageToSupabase`
// from ../lib/supabase but that function never existed anywhere in the
// codebase, so the "upload" step silently never happened. Any product that
// had a second/third image added through the admin panel ended up with a
// 400KB-1MB+ base64 string sitting in its images array instead of a proper
// storage URL. That bloat then flowed straight into the Google Merchant
// Center feed via product-feed.js's additionalImages(), which is what
// triggered Merchant Center's "Item too big" error for hammer-set,
// logging-truck, trolley-and-blocks, and big-spatula-flat-2.
//
// This endpoint does the upload that was always supposed to happen: takes
// a base64 data URL from the browser, decodes it server-side, and PUTs the
// binary to the "product-images" Supabase Storage bucket using the service
// role key (same key-never-leaves-the-server pattern as admin-products.js).
// Returns the public storage URL so the browser can store THAT in the
// product's images array instead of the raw base64.
//
// Existing products with base64 already saved in their images array are
// NOT touched by this endpoint — that's a one-off data cleanup, not an
// upload-time problem, and needs a separate pass over the products table.

const REQUEST_LIMIT = 30;              // max requests
const REQUEST_WINDOW_SECONDS = 300;    // per 5 minutes

const AUTH_FAIL_LIMIT = 5;             // max wrong-password attempts
const AUTH_FAIL_WINDOW_SECONDS = 900;  // per 15 minutes

const BUCKET = 'product-images';
const MAX_BYTES = 8 * 1024 * 1024; // 8MB safety ceiling per image

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

// Decodes a "data:image/xxx;base64,...." URL into raw bytes + content type.
function decodeDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl || '');
  if (!match) return null;
  const contentType = match[1];
  const binaryString = atob(match[2]);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return { contentType, bytes };
}

function sanitizeFilename(name) {
  const fallback = `image-${Date.now()}.jpg`;
  if (!name || typeof name !== 'string') return fallback;
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, '-');
  return cleaned || fallback;
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return json({ error: 'Method Not Allowed' }, 405);
  }

  const kv = env.RATE_LIMIT_KV;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  const requestCheck = await checkLimit(kv, `admin-upload-image:req:${ip}`, REQUEST_LIMIT, REQUEST_WINDOW_SECONDS);
  if (!requestCheck.allowed) {
    return json({ error: 'Too many requests. Please wait a few minutes and try again.' }, 429);
  }

  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY =
    env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_KEY;
  const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'Adrianbar1?';

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('admin-upload-image: missing Supabase env vars');
    return json({ error: 'Supabase env vars not configured' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { password, filename, dataUrl } = body || {};

  if (password !== ADMIN_PASSWORD) {
    const authCheck = await checkLimit(kv, `admin-upload-image:auth:${ip}`, AUTH_FAIL_LIMIT, AUTH_FAIL_WINDOW_SECONDS);
    if (!authCheck.allowed) {
      return json({ error: 'Too many failed attempts. Please wait 15 minutes and try again.' }, 429);
    }
    return json({ error: 'Unauthorized' }, 401);
  }

  const decoded = decodeDataUrl(dataUrl);
  if (!decoded) {
    return json({ error: 'dataUrl must be a base64 data: URL' }, 400);
  }
  if (decoded.bytes.length > MAX_BYTES) {
    return json({ error: `Image too large (max ${MAX_BYTES / 1024 / 1024}MB)` }, 400);
  }

  const path = sanitizeFilename(filename);

  try {
    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(path)}`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': decoded.contentType,
          'x-upsert': 'true',
        },
        body: decoded.bytes,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('admin-upload-image: storage upload failed', uploadRes.status, errText);
      return json({ error: `Storage upload failed: ${errText}` }, 500);
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(path)}`;
    return json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('admin-upload-image error:', error);
    return json({ error: error.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
