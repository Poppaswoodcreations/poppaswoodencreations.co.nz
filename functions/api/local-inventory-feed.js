// Cloudflare Pages Function: GET /api/local-inventory-feed
//
// Generates the Local product inventory feed for Google Merchant Center
// directly from live Supabase stock data (in_stock, stock_quantity), so
// it never goes stale like a manually re-uploaded file would.
//
// Set this URL as the data source in Merchant Center:
//   Data sources -> local_inventory_feed -> Edit -> "Enter a link to your file"
//   https://poppaswoodencreations.co.nz/api/local-inventory-feed
// Google will then re-fetch it automatically (every 24 hours by default)
// instead of relying on a manual re-upload.
//
// Required Merchant Center attributes for local inventory: id, store_code,
// availability, quantity. A product counts as available only if BOTH
// in_stock is true AND stock_quantity is greater than zero.
//
// Availability is sent as "on_display_to_order" rather than "in stock":
// every product is handmade and customers view it in the workshop, then
// it's made/ordered for them rather than taken off a shelf immediately.
// This matches the verified on-display-to-order shipping policy on file
// with Google Merchant Center (NZ).
const STORE_CODE = '10089051641764592169';
async function fetchAllProducts(supabaseUrl, supabaseKey) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/products?select=id,in_stock,stock_quantity`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Supabase fetch failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
function tsvEscape(value) {
  return String(value ?? '').replace(/[\t\r\n]/g, ' ');
}
export async function onRequest(context) {
  const { env } = context;
  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('local-inventory-feed: missing Supabase env vars');
    return new Response('Supabase env vars not configured', { status: 500 });
  }
  try {
    const products = await fetchAllProducts(SUPABASE_URL, SUPABASE_ANON_KEY);
    const lines = ['id\tstore_code\tavailability\tquantity'];
    for (const p of products) {
      // Parse stock_quantity ONCE and reuse the parsed number — the previous
      // version called Number() to validate but parseInt(p.stock_quantity, 10)
      // to build the value. When stock_quantity was null in Supabase,
      // Number(null) === 0 (passes the finite check) but parseInt(null, 10)
      // === NaN, silently writing "NaN" into the feed's quantity column.
      const qtyRaw = Number(p.stock_quantity);
      const qty = Number.isFinite(qtyRaw) ? Math.max(0, Math.trunc(qtyRaw)) : 0;
      const availability = p.in_stock === true && qty > 0 ? 'on_display_to_order' : 'out of stock';
      lines.push(
        [tsvEscape(p.id), STORE_CODE, availability, qty].join('\t')
      );
    }
    const body = lines.join('\r\n') + '\r\n';
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/tab-separated-values; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('local-inventory-feed error:', error);
    return new Response(`Error generating feed: ${error.message}`, { status: 500 });
  }
}
