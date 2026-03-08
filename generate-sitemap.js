// generate-sitemap.js
// Run: node generate-sitemap.js
// Generates public/sitemap.xml from Supabase products + blog posts + all static routes

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log('Generating sitemap...');

  // ── FETCH ACTIVE PRODUCTS ──────────────────────────────────────────────────
  const { data: products, error } = await supabase
    .from('products')
    .select('slug, name, updated_at, id')
    .eq('status', 'active')
    .not('slug', 'like', 'product-%')
    .not('slug', 'like', 'SQ%')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log(`Found ${products?.length || 0} active products`);

  // ── FETCH PUBLISHED BLOG POSTS ─────────────────────────────────────────────
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  console.log(`Found ${blogPosts?.length || 0} published blog posts`);

  const today = new Date().toISOString().split('T')[0];

  // ── STATIC PAGES ───────────────────────────────────────────────────────────
  // Priority guide:
  //   1.0 = homepage
  //   0.9 = all products listing
  //   0.8 = category pages, SEO landing pages, blog index
  //   0.7 = reviews, about, custom order
  //   0.6 = contact, shipping, returns
  const staticPages = [
    // Core
    { url: '',                          priority: '1.0', changefreq: 'weekly'  },
    { url: '/products',                 priority: '0.9', changefreq: 'daily'   },

    // Category pages
    { url: '/wooden-cars',              priority: '0.8', changefreq: 'weekly'  },
    { url: '/wooden-trucks',            priority: '0.8', changefreq: 'weekly'  },
    { url: '/wooden-trains',            priority: '0.8', changefreq: 'weekly'  },
    { url: '/wooden-planes-helicopters',priority: '0.8', changefreq: 'weekly'  },
    { url: '/wooden-baby-toys',         priority: '0.8', changefreq: 'weekly'  },
    { url: '/wooden-tractors-boats',    priority: '0.8', changefreq: 'weekly'  },
    { url: '/wooden-kitchenware',       priority: '0.8', changefreq: 'weekly'  },
    { url: '/wooden-crosses',           priority: '0.8', changefreq: 'weekly'  },
    { url: '/wooden-pens',              priority: '0.8', changefreq: 'weekly'  },

    // SEO landing page
    { url: '/wooden-toys-nz',           priority: '0.8', changefreq: 'monthly' },

    // Blog
    { url: '/blog',                     priority: '0.8', changefreq: 'weekly'  },

    // Business pages
    { url: '/reviews',                  priority: '0.7', changefreq: 'weekly'  },
    { url: '/about',                    priority: '0.7', changefreq: 'monthly' },
    { url: '/custom-order',             priority: '0.7', changefreq: 'monthly' },

    // Info / policy pages
    { url: '/contact',                  priority: '0.6', changefreq: 'monthly' },
    { url: '/shipping',                 priority: '0.6', changefreq: 'monthly' },
    { url: '/returns',                  priority: '0.6', changefreq: 'monthly' },

    // NOTE: the following are intentionally excluded (noindex in app):
    //   /order-confirmation, /privacy, /terms, /admin/reviews,
    //   /search, /write-review, /cart
  ];

  // ── BUILD XML ──────────────────────────────────────────────────────────────
  const urlEntry = ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

  const staticEntries = staticPages.map(p =>
    urlEntry({
      loc: `https://poppaswoodencreations.co.nz${p.url}`,
      lastmod: today,
      changefreq: p.changefreq,
      priority: p.priority,
    })
  );

  const productEntries = (products || []).map(product =>
    urlEntry({
      loc: `https://poppaswoodencreations.co.nz/products/${product.slug}`,
      lastmod: product.updated_at?.split('T')[0] || today,
      changefreq: 'weekly',
      priority: '0.8',
    })
  );

  const blogEntries = (blogPosts || []).map(post =>
    urlEntry({
      loc: `https://poppaswoodencreations.co.nz/blog/${post.slug}`,
      lastmod: post.updated_at?.split('T')[0] || today,
      changefreq: 'monthly',
      priority: '0.7',
    })
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- ═══ STATIC PAGES (${staticPages.length}) ═══ -->
${staticEntries.join('\n')}

  <!-- ═══ PRODUCT PAGES (${(products || []).length}) ═══ -->
${productEntries.join('\n')}

  <!-- ═══ BLOG POSTS (${(blogPosts || []).length}) ═══ -->
${blogEntries.join('\n')}

</urlset>`;

  // ── WRITE FILE ─────────────────────────────────────────────────────────────
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);

  const total = staticPages.length + (products?.length || 0) + (blogPosts?.length || 0);
  console.log(`✅ Sitemap written to ${sitemapPath}`);
  console.log(`   Static pages : ${staticPages.length}`);
  console.log(`   Products     : ${products?.length || 0}`);
  console.log(`   Blog posts   : ${blogPosts?.length || 0}`);
  console.log(`   Total URLs   : ${total}`);
}

generateSitemap().catch(console.error);
