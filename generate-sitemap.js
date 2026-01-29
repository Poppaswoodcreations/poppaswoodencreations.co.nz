// generateSitemap.js
// Run this script to generate your sitemap.xml with only active, indexable pages

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log('Generating sitemap...');

  // Fetch active products with proper slugs (not old product- or SQ IDs)
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

  // Static pages (high priority pages you want indexed)
  const staticPages = [
    { 
      url: '', 
      priority: '1.0', 
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    },
    { 
      url: '/products', 
      priority: '0.9', 
      changefreq: 'daily',
      lastmod: new Date().toISOString()
    },
    { 
      url: '/wooden-planes-helicopters', 
      priority: '0.8', 
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    },
    { 
      url: '/blog', 
      priority: '0.8', 
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    },
    { 
      url: '/reviews', 
      priority: '0.7', 
      changefreq: 'monthly',
      lastmod: new Date().toISOString()
    },
    { 
      url: '/contact', 
      priority: '0.6', 
      changefreq: 'monthly',
      lastmod: new Date().toISOString()
    },
    { 
      url: '/shipping', 
      priority: '0.6', 
      changefreq: 'monthly',
      lastmod: new Date().toISOString()
    },
  ];

  // Fetch blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  console.log(`Found ${blogPosts?.length || 0} published blog posts`);

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticPages.map(page => `  <url>
    <loc>https://poppaswoodencreations.co.nz${page.url}</loc>
    <lastmod>${page.lastmod.split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${products?.map(product => `  <url>
    <loc>https://poppaswoodencreations.co.nz/products/${product.slug}</loc>
    <lastmod>${product.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n') || ''}
${blogPosts?.map(post => `  <url>
    <loc>https://poppaswoodencreations.co.nz/blog/${post.slug}</loc>
    <lastmod>${post.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n') || ''}
</urlset>`;

  // Write to public folder
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
  console.log(`Total URLs: ${staticPages.length + (products?.length || 0) + (blogPosts?.length || 0)}`);
}

generateSitemap().catch(console.error);
