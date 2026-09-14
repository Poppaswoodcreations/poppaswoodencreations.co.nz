// functions/api/audit-fetch.ts
// Fetches a page server-side using a Googlebot User-Agent, so the
// site-audit tool sees exactly what crawlers see — the fully prerendered
// HTML from functions/_middleware.ts — instead of the empty SPA shell a
// plain browser fetch or same-origin iframe gets. Domain-locked to this
// site only, same security pattern as check-url.ts.

const ALLOWED_HOST = 'poppaswoodencreations.co.nz';

export const onRequestGet = async (context: any): Promise<Response> => {
  const { request } = context;
  const reqUrl = new URL(request.url);
  const target = reqUrl.searchParams.get('url');

  if (!target) {
    return new Response(JSON.stringify({ error: 'missing url param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response(JSON.stringify({ error: 'invalid url' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (targetUrl.hostname !== ALLOWED_HOST) {
    return new Response(JSON.stringify({ error: 'host not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const resp = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
      },
      redirect: 'follow',
    });
    const html = await resp.text();
    return new Response(JSON.stringify({ status: resp.status, html }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `https://${ALLOWED_HOST}`,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String((err && err.message) || err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
