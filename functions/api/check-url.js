// functions/api/check-url.js
//
// GET /api/check-url?url=<encoded target URL>  ->  { "status": 200 }
//
// Runs the fetch server-side on Cloudflare's own edge, right next to your
// site — so it's fast and never CORS-blocked. Replaces the old approach of
// routing every check through a free third-party proxy (api.allorigins.win),
// which was slow and flaky under load. redirect: 'manual' so a 301/302
// shows up as a redirect instead of silently resolving to 200.

export async function onRequestGet(context) {
  const { request } = context;
  const target = new URL(request.url).searchParams.get('url');

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (!target) {
    return new Response(JSON.stringify({ error: 'missing url param' }), { status: 400, headers });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const resp = await fetch(target, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    return new Response(JSON.stringify({ status: resp.status }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ status: 0, error: e.message || String(e) }), { headers });
  }
}
