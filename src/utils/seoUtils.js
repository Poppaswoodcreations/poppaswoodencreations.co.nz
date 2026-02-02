// src/utils/seoUtils.js
// Utility functions for SEO canonical URLs and meta tags

export const getCanonicalUrl = (pathname) => {
  const baseUrl = 'https://poppaswoodencreations.co.nz';
  
  // Remove trailing slashes
  let cleanPath = pathname.replace(/\/$/, '');
  
  // Handle empty path
  if (!cleanPath || cleanPath === '') {
    return baseUrl;
  }
  
  return `${baseUrl}${cleanPath}`;
};

// List of valid product slugs (your real products)
const VALID_PRODUCT_SLUGS = [
  '2-by-4-car-steering-wheel',
  '2-by-4-pine-car',
  '2-by-4-pine-car-with-roof',
  '2-by-4-pine-tow-truck',
  'baby-blocks-native-rimu-8-pack',
  'backhoe',
  'bongo-drum',
  'bowl',
  'butter-knife',
  'car-carrier',
  'cargo-truck',
  'chopping-board',
  'dump-truck',
  'fire-truck',
  'front-end-loader',
  'garbage-truck',
  'gliders',
  'happy-go-lucky-train',
  'helicopter-macrocarpa',
  'humming-top',
  'ice-cream-truck',
  'kauri-bowl',
  'kauri-helicopter',
  'kauri-planes',
  'log-truck',
  'mini-buss-rimu',
  'paddle-boat',
  'pine-plane',
  'police-car',
  'pull-along-duck',
  'race-car',
  'rattle',
  'rimu-car',
  'rimu-salad-bowl',
  'rimu-teething-ring',
  'rubbish-truck',
  'salad-servers',
  'school-bus-small',
  'sedan',
  'skateboard',
  'small-pine-cars',
  'small-pine-train',
  'small-road-trains',
  'small-sports-car',
  'sports-car',
  'stacking-toy',
  'submarine',
  'tanker-truck',
  'the-block-train-made-from-kauri',
  'tipper-truck',
  'toaster-tongs',
  'tour-bus',
  'tractor-exquisite',
  'trolley-and-blocks',
  'wooden-kauri-car-6'
];

export const shouldNoIndex = (pathname, productId) => {
  // Extract the product slug from the pathname
  const productSlug = pathname.split('/products/')[1]?.replace(/\/$/, '');
  
  if (!productSlug) {
    return false; // Not a product page
  }
  
  // If it's in our valid products list, do NOT noindex
  if (VALID_PRODUCT_SLUGS.includes(productSlug)) {
    return false;
  }
  
  // Block old product patterns that are NOT in valid list
  if (productSlug.startsWith('product-')) return true;
  if (productSlug.startsWith('SQ')) return true;
  
  // Block search templates
  if (pathname.includes('search_term_string')) return true;
  
  return false;
};

export const getRobotsMetaTag = (pathname, productId) => {
  if (shouldNoIndex(pathname, productId)) {
    return 'noindex, follow';
  }
  return 'index, follow';
};

// Add structured data for products
export const getProductStructuredData = (product) => {
  if (!product) return null;
  
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://poppaswoodencreations.co.nz/products/${product.slug || product.id}`,
      "priceCurrency": "NZD",
      "price": product.price,
      "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Poppa's Wooden Creations"
      }
    }
  };
};
