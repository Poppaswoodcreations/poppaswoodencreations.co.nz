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

/**
 * Only noindex known junk patterns.
 * Do NOT use a whitelist — any real product not in the list gets wrongly noindexed.
 * New products added to Supabase are automatically indexable without any code change.
 */
export const shouldNoIndex = (pathname) => {
  const productSlug = pathname.split('/products/')[1]?.replace(/\/$/, '');

  if (!productSlug) {
    return false; // Not a product page
  }

  // Block old Squarespace product IDs
  if (productSlug.startsWith('SQ')) return true;

  // Block placeholder slugs
  if (productSlug.startsWith('product-')) return true;

  // Block search template URLs
  if (pathname.includes('search_term_string')) return true;

  // Everything else is a real product — index it
  return false;
};

export const getRobotsMetaTag = (pathname) => {
  if (shouldNoIndex(pathname)) {
    return 'noindex, follow';
  }
  return 'index, follow';
};

// Structured data for product pages
export const getProductStructuredData = (product) => {
  if (!product) return null;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0] || product.image_url || '',
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
      "availability": product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Poppa's Wooden Creations"
      }
    }
  };
};
