// functions/sitemap.xml.ts  (Cloudflare Pages)
//
// Generates sitemap.xml at request time from the live Supabase products
// and blog_posts tables, plus a small hardcoded list of static pages
// (home, categories, policy/info pages) that rarely change.
//
// Why this exists: the static public/sitemap.xml was hand-maintained and
// drifted from the real product catalog — 5 dead product slugs stayed in
// it long after being removed from Supabase, and a live product plus two
// blog posts were missing because nobody remembered to add them by hand.
// Generating it from Supabase at request time means it can't drift again.
//
// IMPORTANT DEPLOYMENT NOTE: Cloudflare Pages serves a matching static
// file before it runs a function for the same path. If public/sitemap.xml
// still exists in the repo, IT will keep being served at /sitemap.xml and
// this function will never run. Either delete public/sitemap.xml, or add
// a functions/_routes.json that excludes it from static serving — see the
// note at the bottom of this file.

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

const BASE_URL = 'https://poppaswoodencreations.co.nz';

// Static pages that aren't in Supabase — home, category listing pages,
// and policy/info pages. These change rarely, so keeping this one small
// list hardcoded is fine; it's the products and blog posts (the parts
// that actually change week to week) that were the real drift problem.
const STATIC_PAGES: { path: string; changefreq: string; priority: string }[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/wooden-toys-nz', changefreq: 'weekly', priority: '0.9' },
  { path: '/wooden-baby-toys', changefreq: 'weekly', priority: '0.9' },
  { path: '/wooden-cars', changefreq: 'weekly', priority: '0.9' },
  { path: '/wooden-trucks', changefreq: 'weekly', priority: '0.9' },
  { path: '/wooden-trains', changefreq: 'weekly', priority: '0.9' },
  { path: '/wooden-tractors-boats', changefreq: 'weekly', priority: '0.9' },
  { path: '/wooden-planes-helicopters', changefreq: 'weekly', priority: '0.9' },
  { path: '/wooden-kitchenware', changefreq: 'weekly', priority: '0.9' },
  { path: '/wooden-pens', changefreq: 'weekly', priority: '0.8' },
  { path: '/wooden-crosses', changefreq: 'weekly', priority: '0.8' },
  { path: '/custom-order', changefreq: 'monthly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/reviews', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/shipping', changefreq: 'monthly', priority: '0.5' },
  { path: '/returns', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
];

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toLastmod(value: unknown): string {
  if (!value) return new Date().toISOString().slice(0, 10);
  const d = new Date(value as string);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function fetchAllProducts(supabaseUrl: string, supabaseKey: string): Promise<any[]> {
  if (!supabaseUrl || !supabaseKey) return [];
  try {
    const resp = await fetch(
      `${supabaseUrl}/rest/v1/products?select=id,updated_at,created_at&order=id.asc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!resp.ok) return [];
    return await resp.json();
  } catch {
    return [];
  }
}

async function fetchAllBlogPosts(supabaseUrl: string, supabaseKey: string): Promise<any[]> {
  if (!supabaseUrl || !supabaseKey) return [];
  try {
    const resp = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=slug,updated_at,published_at,created_at&order=slug.asc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!resp.ok) return [];
    return await resp.json();
  } catch {
    return [];
  }
}

export const onRequestGet: PagesFunction = async (context: any) => {
  const env: Env = context.env || {};
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || '';
  const supabaseKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || '';

  const [products, posts] = await Promise.all([
    fetchAllProducts(supabaseUrl, supabaseKey),
    fetchAllBlogPosts(supabaseUrl, supabaseKey),
  ]);

  const staticEntries = STATIC_PAGES.map(p =>
    urlEntry(`${BASE_URL}${p.path}`, new Date().toISOString().slice(0, 10), p.changefreq, p.priority)
  );

  const productEntries = products.map(p =>
    urlEntry(
      `${BASE_URL}/products/${p.id}`,
      toLastmod(p.updated_at || p.created_at),
      'weekly',
      '0.9'
    )
  );

  const blogEntries = posts.map(p =>
    urlEntry(
      `${BASE_URL}/blog/${p.slug}`,
      toLastmod(p.updated_at || p.published_at || p.created_at),
      'monthly',
      '0.7'
    )
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- PAGES -->
${staticEntries.join('\n')}

  <!-- PRODUCTS (${productEntries.length}) -->
${productEntries.join('\n')}

  <!-- BLOG POSTS (${blogEntries.length}) -->
${blogEntries.join('\n')}

</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

// ─────────────────────────────────────────────────────────────
// DEPLOYMENT: only ONE of these two steps is needed, not both.
//
// Option A (simplest) — delete public/sitemap.xml from the repo entirely.
// With no static file at that path, Cloudflare Pages will fall through to
// this function automatically.
//
// Option B — keep the static file as a manual fallback, but add or edit
// functions/_routes.json so /sitemap.xml is explicitly routed to functions
// instead of static assets:
//
// {
//   "version": 1,
//   "include": ["/sitemap.xml", "/api/*"],
//   "exclude": []
// }
//
// If a _routes.json already exists in functions/, just add "/sitemap.xml"
// to its "include" array rather than replacing the whole file — paste me
// its current contents and I'll merge it in.
// ─────────────────────────────────────────────────────────────
