/**
 * AUTOMATIC SITEMAP GENERATOR
 * 
 * This script connects to your Supabase database and generates
 * a complete sitemap.xml file with all your products automatically.
 * 
 * SETUP:
 * 1. npm install @supabase/supabase-js
 * 2. Update SUPABASE_URL and SUPABASE_ANON_KEY below
 * 3. Run: node generate-sitemap.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const SUPABASE_URL = 'https://hfirnolwhesjkxshidxo.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'; // Get this from your Supabase dashboard
const SITE_URL = 'https://poppaswoodencreations.co.nz';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// STATIC PAGES CONFIGURATION
// ============================================
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/products', priority: '0.9', changefreq: 'daily' },
  
  // Category Pages
  { url: '/wooden-cars', priority: '0.8', changefreq: 'weekly' },
  { url: '/wooden-trucks', priority: '0.8', changefreq: 'weekly' },
  { url: '/wooden-trains', priority: '0.8', changefreq: 'weekly' },
  { url: '/wooden-planes-helicopters', priority: '0.8', changefreq: 'weekly' },
  { url: '/wooden-baby-toys', priority: '0.8', changefreq: 'weekly' },
  { url: '/wooden-tractors-boats', priority: '0.8', changefreq: 'weekly' },
  { url: '/wooden-kitchenware', priority: '0.8', changefreq: 'weekly' },
  
  // Information Pages
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.6', changefreq: 'monthly' },
  { url: '/reviews', priority: '0.7', changefreq: 'weekly' },
  { url: '/shipping', priority: '0.5', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'weekly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
];

// ============================================
// BLOG POSTS (Add more as you publish)
// ============================================
const BLOG_POSTS = [
  { slug: 'wooden-toys-by-age', date: '2025-12-25' },
  { slug: 'why-natural-wood-toys-beat-plastic', date: '2025-12-22' },
  { slug: 'happy-go-luck-train', date: '2025-12-16' },
  { slug: 'wooden-pine-trolley-and-blocks', date: '2025-12-14' },
  { slug: 'rimu-teething-ring', date: '2025-12-12' },
  { slug: 'wooden-rubbish-truck-kauri-macrocarpa', date: '2025-12-11' },
  { slug: 'choosing-best-wooden-toy-cars', date: '2025-12-10' },
  { slug: 'tractor-exquisite', date: '2025-12-04' },
  { slug: 'how-to-clean-wooden-toys-naturally', date: '2024-11-27' },
  { slug: 'benefits-wooden-toys-child-development', date: '2024-11-01' },
  { slug: 'best-sensory-wooden-toys-babies', date: '2024-11-07' },
  { slug: 'baby-toy-cars-discovering-magic', date: '2024-06-13' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function generateUrlEntry(url, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// ============================================
// MAIN SITEMAP GENERATION
// ============================================
async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- ======================================== -->
  <!-- STATIC PAGES -->
  <!-- ======================================== -->
`;

  // Add static pages
  STATIC_PAGES.forEach(page => {
    sitemap += generateUrlEntry(page.url, getCurrentDate(), page.changefreq, page.priority) + '\n';
  });

  // ============================================
  // FETCH PRODUCTS FROM SUPABASE
  // ============================================
  console.log('📦 Fetching products from Supabase...');
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, updated_at, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }

    console.log(`✅ Found ${products.length} products`);

    sitemap += `
  <!-- ======================================== -->
  <!-- PRODUCT PAGES (${products.length} total) -->
  <!-- ======================================== -->
`;

    // Add product pages
    products.forEach(product => {
      const lastmod = product.updated_at 
        ? product.updated_at.split('T')[0] 
        : product.created_at.split('T')[0];
      
      sitemap += generateUrlEntry(
        `/products/${product.id}`,
        lastmod,
        'weekly',
        '0.7'
      ) + '\n';
    });

  } catch (error) {
    console.error('❌ Failed to fetch products. Using placeholder instead.');
    sitemap += `  <!-- ERROR: Could not fetch products from database -->\n`;
    sitemap += `  <!-- Please check your Supabase credentials -->\n`;
  }

  // ============================================
  // ADD BLOG POSTS
  // ============================================
  sitemap += `
  <!-- ======================================== -->
  <!-- BLOG POSTS (${BLOG_POSTS.length} total) -->
  <!-- ======================================== -->
`;

  BLOG_POSTS.forEach(post => {
    sitemap += generateUrlEntry(
      `/blog/${post.slug}`,
      post.date,
      'monthly',
      '0.6'
    ) + '\n';
  });

  // Close sitemap
  sitemap += '\n</urlset>';

  // ============================================
  // SAVE SITEMAP
  // ============================================
  const filename = 'sitemap.xml';
  fs.writeFileSync(filename, sitemap);
  
  console.log('✅ Sitemap generated successfully!');
  console.log(`📄 File saved as: ${filename}`);
  console.log(`📊 Total URLs: ${STATIC_PAGES.length + BLOG_POSTS.length} + products`);
  console.log('\n🚀 NEXT STEPS:');
  console.log('1. Upload sitemap.xml to your website root directory');
  console.log('2. Submit to Google Search Console: https://search.google.com/search-console');
  console.log('3. Submit sitemap URL: https://poppaswoodencreations.co.nz/sitemap.xml');
}

// ============================================
// RUN THE GENERATOR
// ============================================
generateSitemap().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

// ============================================
// EXPORT FOR USE IN BUILD SCRIPTS
// ============================================
module.exports = { generateSitemap };
