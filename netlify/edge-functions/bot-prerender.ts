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

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function extractProductId(pathname: string): string | null {
  const match = pathname.match(/^\/products\/([^/]+)$/);
  return match ? match[1] : null;
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

function buildProductHTML(product: any, productId: string): string {
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
      "seller": { "@type": "Organization", "name": "Poppa's Wooden Creations" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5"
    }
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://poppaswoodencreations.co.nz" },
      { "@type": "ListItem", "position": 2, "name": category.replace(/\b\w/g, l => l.toUpperCase()), "item": `https://poppaswoodencreations.co.nz/${product.category || 'products'}` },
      { "@type": "ListItem", "position": 3, "name": name, "item": canonicalUrl }
    ]
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
    <div>
      <strong>Price:</strong> $${price} NZD
    </div>
    <div>
      <strong>Availability:</strong> ${inStock ? 'In Stock' : 'Out of Stock'}
    </div>
    <div>
      <strong>Material:</strong> Premium New Zealand native timber
    </div>
    <div>
      <strong>Made in:</strong> Whangarei, New Zealand
    </div>
    <div>
      <strong>Category:</strong> ${category.replace(/\b\w/g, (l: string) => l.toUpperCase())}
    </div>
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
</body>
</html>`;
}

export default async function handler(request: Request, context: Context) {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only intercept product pages for bots
  const productId = extractProductId(pathname);
  if (!productId || !isBot(userAgent)) {
    return context.next();
  }

  // Fetch product from Supabase
  const product = await fetchProduct(productId);
  
  // If product not found, let React handle it (404 page)
  if (!product) {
    return context.next();
  }

  // Return fully populated HTML for the bot
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

export const config = {
  path: '/products/*',
};
