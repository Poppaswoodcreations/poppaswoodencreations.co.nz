// Cloudflare Pages Function: POST /api/admin-upload-video
//
// Mirrors admin-upload-image.js: takes a base64 data URL from the browser,
// decodes it server-side, and PUTs the binary to the "product-videos"
// Supabase Storage bucket using the service role key (key never leaves the
// server). Returns the public storage URL so the browser can store THAT in
// the product's video_url column.

const REQUEST_LIMIT = 30;              // max requests
const REQUEST_WINDOW_SECONDS = 300;    // per 5 minutes

const AUTH_FAIL_LIMIT = 5;             // max wrong-password attempts
const AUTH_FAIL_WINDOW_SECONDS = 900;  // per 15 minutes

const BUCKET = 'product-videos';
const MAX_BYTES = 15 * 1024 * 1024; // 15MB safety ceiling per video
const ALLOWED_TYPES = ['video/mp4', 'video/webm'];

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

// Decodes a "data:video/xxx;base64,...." URL into raw bytes + content type.
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
  const fallback = `video-${Date.now()}.mp4`;
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

  const requestCheck = await checkLimit(kv, `admin-upload-video:req:${ip}`, REQUEST_LIMIT, REQUEST_WINDOW_SECONDS);
  if (!requestCheck.allowed) {
    return json({ error: 'Too many requests. Please wait a few minutes and try again.' }, 429);
  }

  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY =
    env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_KEY;
  const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'Adrianbar1?';

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('admin-upload-video: missing Supabase env vars');
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
    const authCheck = await checkLimit(kv, `admin-upload-video:auth:${ip}`, AUTH_FAIL_LIMIT, AUTH_FAIL_WINDOW_SECONDS);
    if (!authCheck.allowed) {
      return json({ error: 'Too many failed attempts. Please wait 15 minutes and try again.' }, 429);
    }
    return json({ error: 'Unauthorized' }, 401);
  }

  const decoded = decodeDataUrl(dataUrl);
  if (!decoded) {
    return json({ error: 'dataUrl must be a base64 data: URL' }, 400);
  }
  if (!ALLOWED_TYPES.includes(decoded.contentType)) {
    return json({ error: 'Only mp4 or webm files are allowed' }, 400);
  }
  if (decoded.bytes.length > MAX_BYTES) {
    return json({ error: `Video too large (max ${MAX_BYTES / 1024 / 1024}MB)` }, 400);
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
      console.error('admin-upload-video: storage upload failed', uploadRes.status, errText);
      return json({ error: `Storage upload failed: ${errText}` }, 500);
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(path)}`;
    return json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('admin-upload-video error:', error);
    return json({ error: error.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
