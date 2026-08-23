// functions/api/check-url.ts
//
// Server-side status check. The URL checker tool (a standalone local HTML
// file) can't read real HTTP status codes cross-origin from the browser —
// CORS blocks it, and no-cors mode hides the status entirely. This endpoint
// runs on Cloudflare's edge instead: it fetches the target URL server-to-
// server (no CORS restriction applies there) and hands back the real status
// with an open CORS header so the checker tool can read it from anywhere.
//
// Locked to this site's own domain only, so it can't be used as an open
// proxy to probe arbitrary URLs.

const ALLOWED_HOST = 'poppaswoodencreations.co.nz';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'no-store',
    },
  });
}

export const onRequestOptions: PagesFunction = async () => {
  return json({}, 204);
};

export const onRequestGet: PagesFunction = async (context) => {
  const requestUrl = new URL(context.request.url);
  const target = requestUrl.searchParams.get('url');

  if (!target) {
    return json({ error: 'missing url param' }, 400);
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return json({ error: 'invalid url' }, 400);
  }

  if (targetUrl.hostname !== ALLOWED_HOST) {
    return json({ error: 'only ' + ALLOWED_HOST + ' URLs are allowed' }, 400);
  }

  try {
    // redirect: 'manual' so a 301/302 is reported as-is instead of being
    // silently followed to whatever it points at.
    const resp = await fetch(targetUrl.toString(), {
      method: 'GET',
      redirect: 'manual',
      headers: { 'User-Agent': 'PoppasURLChecker/1.0 (+https://poppaswoodencreations.co.nz)' },
    });

    return json({
      url: target,
      status: resp.status,
      location: resp.headers.get('location') || null,
    });
  } catch (err) {
    return json({ url: target, status: 0, error: String(err) });
  }
};
