// netlify/edge-functions/bot-prerender.ts
// Detects Google/bot crawlers and serves fully populated HTML
// Real users get the normal React SPA as usual

import type { Context } from "https://edge.netlify.com";

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebot',
  'ia_archiver',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'applebot',
  'Google-InspectionTool',
  'Google-PageRenderer',
];

const SUPABASE_URL = Deno.env.get('VITE_SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('VITE_SUPABASE_ANON_KEY') || '';

// ─── Category page metadata ───────────────────────────────────────────────────
const CATEGORY_META: Record<string, {
  title: string;
  description: string;
  h1: string;
  intro: string;
  features: string[];
}> = {
  'wooden-kitchenware': {
    title: 'Wooden Kitchenware NZ | Handcrafted Serving Boards & Utensils',
    description: 'Handcrafted wooden kitchenware made from New Zealand native timber. Beautiful Rimu and Kauri serving boards, rolling pins and utensils built to last generations.',
    h1: 'Handcrafted Wooden Kitchenware',
    intro: 'Discover our collection of handcrafted wooden kitchenware, made from premium New Zealand native timber including Rimu, Kauri and Macrocarpa. Each piece is finished with food-safe oils and crafted by hand in Whangarei.',
    features: [
      'Made from native NZ timbers — Rimu, Kauri, Macrocarpa',
      'Food-safe, non-toxic oil finish',
      'Handcrafted in Whangarei since 2015',
      'Unique grain patterns — no two pieces identical',
      'Heirloom quality built to last generations',
    ],
  },
  'wooden-baby-toys': {
    title: 'Wooden Baby Toys NZ | Safe Handcrafted Toys for Infants & Toddlers',
    description: 'Safe, handcrafted wooden baby toys from New Zealand native timber. Non-toxic finish, Montessori-inspired designs trusted by NZ families and schools since 2015.',
    h1: 'Handcrafted Wooden Baby Toys',
    intro: 'Our wooden baby toys are lovingly handcrafted in Whangarei from New Zealand native timber. Finished with non-toxic, baby-safe oils and designed for sensory development and open-ended Montessori play.',
    features: [
      'Non-toxic, food-safe finish — safe for teething babies',
      'Montessori-inspired, open-ended play',
      'Trusted by NZ Montessori schools since 2015',
      'Made from Kauri, Rimu and Macrocarpa',
      'Smooth, splinter-free edges for little hands',
    ],
  },
  'wooden-trucks': {
    title: 'Wooden Trucks NZ | Handcrafted Toy Trucks from Native Timber',
    description: 'Handcrafted wooden toy trucks made from New Zealand native timber. Durable, smooth-rolling and built to last. Perfect for imaginative play.',
    h1: 'Handcrafted Wooden Trucks',
    intro: 'Our wooden trucks are handcrafted in Whangarei from premium New Zealand native timber. Smooth rolling wheels, chunky proportions perfect for small hands, and a non-toxic finish make these a favourite with kids and parents alike.',
    features: [
      'Smooth-rolling solid timber wheels',
      'Chunky design perfect for toddlers',
      'Made from native NZ timber — Kauri, Rimu, Macrocarpa',
      'Non-toxic finish, safe for children',
      'Built heirloom-quality to outlast plastic toys',
    ],
  },
  'wooden-tractors-boats': {
    title: 'Wooden Tractors & Boats NZ | Handcrafted Farm & Water Toys',
    description: 'Handcrafted wooden toy tractors and boats from New Zealand native timber. Beautifully detailed, non-toxic and built to last for Montessori and imaginative play.',
    h1: 'Handcrafted Wooden Tractors & Boats',
    intro: 'Spark imagination with our handcrafted wooden tractors and boats, made in Whangarei from New Zealand native timber. Whether your child loves the farm or the sea, these heirloom-quality toys are built to inspire years of play.',
    features: [
      'Beautifully detailed farm and water toys',
      'Made from native NZ timber',
      'Non-toxic, child-safe finish',
      'Montessori-friendly open-ended play',
      'Heirloom quality — built to be passed down',
    ],
  },
  'wooden-cars': {
    title: 'Wooden Toy Cars NZ | Handcrafted Cars from Native NZ Timber',
    description: 'Handcrafted wooden toy cars made in New Zealand from native Kauri, Rimu and Macrocarpa. Smooth, safe and built for imaginative play.',
    h1: 'Handcrafted Wooden Toy Cars',
    intro: 'Our wooden toy cars are handcrafted in Whangarei from premium New Zealand native timber. With smooth rolling wheels and satisfying weight, they are a timeless alternative to plastic toys.',
    features: [
      'Smooth-rolling solid timber wheels',
      'Made from Kauri, Rimu and Macrocarpa',
      'Non-toxic finish safe for children',
      'Montessori open-ended play',
      'Heirloom quality built to last',
    ],
  },
  'wooden-trains': {
    title: 'Wooden Train Sets NZ | Handcrafted Trains from Native Timber',
    description: 'Handcrafted wooden train sets made from New Zealand native timber. Classic designs with a non-toxic finish, perfect for Montessori and imaginative railway play.',
    h1: 'Handcrafted Wooden Trains',
    intro: 'Build railways and spark imagination with our handcrafted wooden trains, made in Whangarei from New Zealand native timber. Classic in design and built to the highest quality standards.',
    features: [
      'Classic train designs loved by generations',
      'Made from native NZ timber',
      'Non-toxic, child-safe finish',
      'Perfect for Montessori railway play',
      'Heirloom quality built to last',
    ],
  },
  'wooden-planes-helicopters': {
    title: 'Wooden Planes & Helicopters NZ | Handcrafted Aviation Toys',
    description: 'Handcrafted wooden toy planes and helicopters from New Zealand native timber. Beautifully crafted aviation toys with non-toxic finish, perfect for imaginative play.',
    h1: 'Handcrafted Wooden Planes & Helicopters',
    intro: 'Take imagination to new heights with our handcrafted wooden planes and helicopters, made in Whangarei from premium New Zealand native timber.',
    features: [
      'Beautifully detailed aviation toys',
      'Made from native NZ timber',
      'Non-toxic, child-safe finish',
      'Open-ended imaginative play',
      'Heirloom quality built to last',
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function extractProductId(pathname: string): string | null {
  const match = pathname.match(/^\/products\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function extractCategorySlug(pathname: string): string | null {
  // Strip trailing slash then match known categories
  const clean = pathname.replace(/\/$/, '');
  const slug = clean.replace(/^\//, '');
  return CATEGORY_META[slug] ? slug : null;
}

async function fetchProduct(productId: string): Promise<any | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(productId)}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchCategoryProducts(slug: string): Promise<any[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?category=eq.${encodeURIComponent(slug)}&select=id,name,price,description,images&limit=12`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

// ─── HTML builders ────────────────────────────────────────────────────────────

function buildCategoryHTML(slug: string, products: any[]): string {
  const meta = CATEGORY_META[slug];
  // Always no trailing slash on canonical
  const canonicalUrl = `https://poppaswoodencreations.co.nz/${slug}`;
  const baseUrl = 'https://poppaswoodencreations.co.nz';

  const productListItems = products.map(p => {
    const img = (p.images?.[0] || `${baseUrl}/og-image.jpg`);
    const fullImg = img.startsWith('http') ? img : `${baseUrl}${img}`;
    const price = parseFloat(p.price || 0).toFixed(2);
    return `
    <article>
      <a href="${baseUrl}/products/${p.id}">
        <img src="${fullImg}" alt="${p.name} - handcrafted wooden toy NZ" width="400" height="400" loading="lazy" />
        <h3>${p.name}</h3>
        <p>$${price} NZD</p>
        <p>${(p.description || '').substring(0, 120)}...</p>
      </a>
    </article>`;
  }).join('\n');

  const itemListSchema = products.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": meta.h1,
    "url": canonicalUrl,
    "numberOfItems": products.length,
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.name,
      "url": `${baseUrl}/products/${p.id}`,
    })),
  }) : null;

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": meta.h1, "item": canonicalUrl },
    ],
  });

  const collectionSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": meta.h1,
    "description": meta.description,
    "url": canonicalUrl,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Poppa's Wooden Creations",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "102 Kiripaka Road, Tikipunga",
        "addressLocality": "Whangarei",
        "addressRegion": "Northland",
        "postalCode": "0112",
        "addressCountry": "NZ",
      },
    },
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Poppa's Wooden Creations" />
  <meta property="og:locale" content="en_NZ" />
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <script type="application/ld+json">${collectionSchema}</script>
  ${itemListSchema ? `<script type="application/ld+json">${itemListSchema}</script>` : ''}
</head>
<body>
  <nav>
    <a href="${baseUrl}">Poppa's Wooden Creations</a> &rsaquo;
    <span>${meta.h1}</span>
  </nav>
  <main>
    <h1>${meta.h1}</h1>
    <p>${meta.intro}</p>

    <section>
      <h2>Why Choose Poppa's ${meta.h1}?</h2>
      <ul>
        ${meta.features.map(f => `<li>${f}</li>`).join('\n        ')}
      </ul>
    </section>

    ${products.length > 0 ? `
    <section>
      <h2>Our ${meta.h1} Collection</h2>
      <div>
        ${productListItems}
      </div>
    </section>` : ''}

    <section>
      <h2>Handcrafted in Whangarei, New Zealand</h2>
      <p>Every piece in our ${meta.h1.toLowerCase()} range is handcrafted by Adrian at Poppa's Wooden Creations in Tikipunga, Whangarei. Using only native New Zealand timbers — Kauri, Rimu, and Macrocarpa — and finished with non-toxic, food-safe oils, each piece is unique and built to last generations.</p>
      <p>We have been trusted by Montessori schools and eco-conscious families across New Zealand since 2015. Free shipping on orders over $1000 NZD within New Zealand.</p>
    </section>
  </main>
  <footer>
    <p>&copy; Poppa's Wooden Creations | 102 Kiripaka Road, Tikipunga, Whangarei 0112 | <a href="tel:+6421022881​66">+64 21 022 88166</a></p>
  </footer>
</body>
</html>`;
}

function buildProductHTML(product: any, productId: string): string {
  // Always no trailing slash on canonical
  const canonicalUrl = `https://poppaswoodencreations.co.nz/products/${productId}`;
  const name = product.name || 'Handcrafted Wooden Toy';
  const description = product.description || `Handcrafted wooden toy made from premium New Zealand native timber in Whangarei. Non-toxic finish, safe for children. Perfect for Montessori play.`;
  const price = parseFloat(product.price || 0).toFixed(2);
  const image = (product.images?.[0] || 'https://poppaswoodencreations.co.nz/og-image.jpg');
  const fullImage = image.startsWith('http') ? image : `https://poppaswoodencreations.co.nz${image}`;
  const inStock = product.in_stock !== false;
  const category = (product.category || 'wooden-toys').replace(/-/g, ' ');

  const productSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": fullImage,
    "sku": productId,
    "brand": { "@type": "Brand", "name": "Poppa's Wooden Creations" },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "NZD",
      "price": price,
      "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": { "@type": "Organization", "name": "Poppa's Wooden Creations" },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
    },
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://poppaswoodencreations.co.nz" },
      { "@type": "ListItem", "position": 2, "name": category.replace(/\b\w/g, l => l.toUpperCase()), "item": `https://poppaswoodencreations.co.nz/${product.category || 'products'}` },
      { "@type": "ListItem", "position": 3, "name": name, "item": canonicalUrl },
    ],
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} | Handcrafted Wooden Toy | Made in NZ | Poppa's Wooden Creations</title>
  <meta name="description" content="${description.substring(0, 160)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${name} | Poppa's Wooden Creations" />
  <meta property="og:description" content="${description.substring(0, 160)}" />
  <meta property="og:image" content="${fullImage}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="product" />
  <script type="application/ld+json">${productSchema}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
</head>
<body>
  <nav>
    <a href="/">Poppa's Wooden Creations</a> &rsaquo;
    <a href="/${product.category || 'products'}">${category.replace(/\b\w/g, (l: string) => l.toUpperCase())}</a> &rsaquo;
    <span>${name}</span>
  </nav>
  <main>
    <h1>${name}</h1>
    <p>${description}</p>
    <div><strong>Price:</strong> $${price} NZD</div>
    <div><strong>Availability:</strong> ${inStock ? 'In Stock' : 'Out of Stock'}</div>
    <div><strong>Material:</strong> Premium New Zealand native timber</div>
    <div><strong>Made in:</strong> Whangarei, New Zealand</div>
    <div><strong>Category:</strong> ${category.replace(/\b\w/g, (l: string) => l.toUpperCase())}</div>
    <img src="${fullImage}" alt="${name} - Handcrafted wooden toy from New Zealand" width="600" height="600" />
    <section>
      <h2>About This Product</h2>
      <p>Handcrafted in Whangarei, New Zealand from premium native timber.
      Finished with non-toxic, food-safe oils. Safe for children of all ages.
      Trusted by Montessori schools across New Zealand since 2015.</p>
    </section>
    <section>
      <h2>Why Choose Poppa's Wooden Creations?</h2>
      <ul>
        <li>Handcrafted from native New Zealand timber (Kauri, Rimu, Macrocarpa)</li>
        <li>Non-toxic, food-safe finish — safe for babies and toddlers</li>
        <li>Built to last generations as heirloom pieces</li>
        <li>Trusted by Montessori schools nationwide since 2015</li>
        <li>Free shipping on orders over $1000 NZD within New Zealand</li>
      </ul>
    </section>
  </main>
  <footer>
    <p>&copy; Poppa's Wooden Creations | 102 Kiripaka Road, Tikipunga, Whangarei 0112</p>
  </footer>
</body>
</html>`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(request: Request, context: Context) {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only intercept bots
  if (!isBot(userAgent)) {
    return context.next();
  }

  // ── Product pages ──────────────────────────────────────────────────────────
  const productId = extractProductId(pathname);
  if (productId) {
    const product = await fetchProduct(productId);
    if (!product) return context.next();
    const html = buildProductHTML(product, productId);
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'index, follow',
      },
    });
  }

  // ── Category pages ─────────────────────────────────────────────────────────
  const categorySlug = extractCategorySlug(pathname);
  if (categorySlug) {
    const products = await fetchCategoryProducts(categorySlug);
    const html = buildCategoryHTML(categorySlug, products);
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'index, follow',
      },
    });
  }

  // Everything else — let React handle it
  return context.next();
}

export const config = {
  // Now covers both product pages and category pages
  path: ['/products/*', '/wooden-*'],
};
