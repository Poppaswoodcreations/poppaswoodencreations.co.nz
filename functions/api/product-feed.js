// Cloudflare Pages Function: GET /api/product-feed
//
// Generates the MAIN Google Merchant Center product feed (title, price,
// images, description, etc.) directly from live Supabase product data —
// so it can never go stale or get accidentally overwritten by an old
// manually-uploaded file again.
//
// Set this URL as a NEW primary data source in Merchant Center:
//   Data sources -> Add product source -> "Enter a link to your file"
//   https://poppaswoodencreations.co.nz/api/product-feed
// Google will then re-fetch it automatically instead of relying on a
// manual re-upload. Once confirmed working, delete the old file-based
// "poppas_wooden_creations_feed_fixed.tsv" primary source.
//
// identifier_exists is always "FALSE" — these are handmade goods with no
// GTIN/MPN, which Google requires to be explicitly declared. mpn is set
// to the product's own id as a substitute identifier (brand + mpn),
// which helps Google's data confidence even without a barcode.
//
// shipping_weight is read from Supabase products.weight (kg) — the same
// field already used by create-payment-intent.js for volumetric shipping
// calculations at checkout.
const BASE_URL = 'https://poppaswoodencreations.co.nz';
const BRAND = "Poppa's Wooden Creations";

// Mirrors functions/_middleware.ts MATERIAL_OVERRIDES so the GMC feed,
// the bot-rendered schema, and the real product page all agree on material.
// Duplicated here (not imported) because each Cloudflare Pages Function
// file is bundled separately.
const MATERIAL_OVERRIDES = {
  '2-by-4-car-steering-wheel': 'Pine wood',
  '2-by-4-pine-car': 'Pine wood',
  '2-by-4-pine-car-with-roof': 'Pine wood',
  '2-by-4-pine-tow-truck': 'Pine wood',
  '2-by-4-pine-ute': 'Pine wood',
  '2-by-4-set-5': 'Pine wood',
  'baby-rattle': 'Rimu wood',
  'bi-plane': 'Pine wood',
  'big-spatula-flat': 'Rimu wood',
  'big-spatula-flat-2': 'Rimu wood',
  'block-train': 'Kauri wood',
  'car-carrier': 'Kauri wood',
  'car-carrier-and-4-cars': 'Kauri & Macrocarpa wood',
  'dragster': 'Kauri wood',
  'dump-truck': 'Kauri & Macrocarpa wood',
  'egg-cup': 'Rimu wood',
  'fishing-boat': 'Rewa Rewa & Kauri wood',
  'floor-noise-maker': 'Pine wood',
  'french-rolling-pin': 'Rimu wood',
  'gt-coupe': 'Kauri wood',
  'hammer-set': 'Pine wood',
  'happy-go-luck-train': 'Pine wood',
  'helicopter-rimu': 'Rimu wood',
  'hot-pot-stand': 'Rimu wood',
  'kauri-truck-trailer-loader': 'Kauri & Macrocarpa wood',
  'key-holder': 'Rimu wood',
  'logging-truck': 'Kauri & Macrocarpa wood',
  'noise-maker': 'Pine wood',
  'pine-bat-car': 'Pine wood',
  'pine-boat': 'Pine wood',
  'pine-helicopter': 'Pine wood',
  'pine-kiwi': 'Pine wood',
  'pine-plane': 'Pine wood',
  'police-boat': 'Rewa Rewa & Kauri wood',
  'product-pen-kauri-chrome-black': 'Kauri wood',
  'product-pen-kauri-gold-stylus': 'Kauri wood',
  'product-pen-rewa-rewa-antique-bronze': 'Rewa Rewa wood',
  'product-pen-rewa-rewa-chrome-black': 'Rewa Rewa wood',
  'product-pen-rewa-rewa-gold-stylus': 'Rewa Rewa wood',
  'product-pen-rimu-antique-bronze': 'Rimu wood',
  'product-pen-rimu-chrome-black': 'Rimu wood',
  'product-pen-rimu-gold-stylus': 'Rimu wood',
  'product-pen-totara-antique-bronze': 'Totara wood',
  'product-pen-totara-chrome-black': 'Totara wood',
  'product-pen-totara-gold-stylus': 'Totara wood',
  'rimu-wooden-cross': 'Rimu wood',
  'roadster': 'Kauri wood',
  'rolling-pin-2': 'Rimu wood',
  'rubbish-truck': 'Kauri & Macrocarpa wood',
  'salad-forks': 'Rimu wood',
  'small-pine-bus': 'Pine wood',
  'small-pine-car': 'Pine wood',
  'small-pine-helicopter': 'Pine wood',
  'small-pine-truck': 'Pine wood',
  'small-pine-ute': 'Pine wood',
  'small-spatula-curve': 'Rimu wood',
  'small-spatula-flat-1': 'Rimu wood',
  'speedster': 'Kauri wood',
  'sportster': 'Kauri wood',
  't-rex': 'Pine wood',
  'teething-ring': 'Rimu wood',
  'toaster-tongs': 'Kauri wood',
  'tour-bus': 'Pine wood',
  'tour-bus-wooden-car': 'Kauri wood',
  'tractor-exquisite': 'Kauri wood',
  'trolley-and-blocks': 'Pine & Macrocarpa wood',
  'truckster': 'Kauri wood',
  'two-window-coupe': 'Kauri wood',
  'wooden-tea-spoon': 'Kauri wood',
};

function extractMaterial(id, name, desc) {
  const override = MATERIAL_OVERRIDES[id];
  if (override) return override;

  const text = `${name} ${desc || ''}`.toLowerCase();
  const materials = ['rewa rewa', 'kauri', 'rimu', 'macrocarpa', 'pine', 'totara', 'matai'];
  for (const material of materials) {
    if (text.includes(material)) {
      return material.replace(/\b\w/g, c => c.toUpperCase()) + ' wood';
    }
  }
  return '';
}

async function fetchAllProducts(supabaseUrl, supabaseKey) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/products?select=id,name,description,price,category,images,in_stock,stock_quantity,seo_title,seo_description,google_product_category,weight`,
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
  return String(value ?? '').replace(/[\t\r\n]/g, ' ').trim();
}

function firstImage(images) {
  const img = Array.isArray(images) && images.length > 0 ? images[0] : null;
  if (!img) return `${BASE_URL}/og-image.jpg`;
  return img.startsWith('http') ? img : `${BASE_URL}${img}`;
}

function toAbsolute(img) {
  return img.startsWith('http') ? img : `${BASE_URL}${img}`;
}

// Google accepts up to 10 additional_image_link values, comma-separated
// within a single TSV field. Skips the first image (already sent as
// image_link) and any empty/falsy entries.
function additionalImages(images) {
  if (!Array.isArray(images) || images.length <= 1) return '';
  return images
    .slice(1, 11)
    .filter(Boolean)
    .map(toAbsolute)
    .join(',');
}

export async function onRequest(context) {
  const { env } = context;
  const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('product-feed: missing Supabase env vars');
    return new Response('Supabase env vars not configured', { status: 500 });
  }

  try {
    const products = await fetchAllProducts(SUPABASE_URL, SUPABASE_ANON_KEY);

    const header = [
      'id',
      'title',
      'description',
      'link',
      'image_link',
      'additional_image_link',
      'availability',
      'price',
      'brand',
      'condition',
      'identifier_exists',
      'mpn',
      'material',
      'google_product_category',
      'shipping_weight',
    ].join('\t');

    const lines = [header];

    for (const p of products) {
      const id = tsvEscape(p.id);
      const title = tsvEscape(p.seo_title || p.name);
      const description = tsvEscape(p.description || p.seo_description || p.name);
      const link = `${BASE_URL}/products/${p.id}`;
      const imageLink = firstImage(p.images);
      const additionalImageLink = additionalImages(p.images);

      const qtyRaw = Number(p.stock_quantity);
      const qty = Number.isFinite(qtyRaw) ? Math.max(0, Math.trunc(qtyRaw)) : 0;
      const availability = p.in_stock === true && qty > 0 ? 'in stock' : 'out of stock';

      const priceRaw = Number(p.price);
      const price = Number.isFinite(priceRaw) ? `${priceRaw.toFixed(2)} NZD` : '0.00 NZD';

      const material = tsvEscape(extractMaterial(p.id, p.name, p.description));
      const googleCategory = tsvEscape(p.google_product_category || '');

      // Google expects shipping_weight as "<number> kg" (or lb/oz/g).
      // Fall back to a conservative default if weight is missing/invalid
      // in Supabase, rather than omitting the field entirely.
      const weightRaw = Number(p.weight);
      const shippingWeight = Number.isFinite(weightRaw) && weightRaw > 0
        ? `${weightRaw} kg`
        : '0.5 kg';

      lines.push(
        [
          id,
          title,
          description,
          link,
          imageLink,
          additionalImageLink,
          availability,
          price,
          BRAND,
          'new',
          'FALSE',
          id,
          material,
          googleCategory,
          shippingWeight,
        ].join('\t')
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
    console.error('product-feed error:', error);
    return new Response(`Error generating feed: ${error.message}`, { status: 500 });
  }
}
