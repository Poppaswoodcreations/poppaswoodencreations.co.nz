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

export const shouldNoIndex = (pathname, productId) => {
  // Don't index old product patterns
  if (pathname.includes('/products/product-')) return true;
  if (pathname.includes('/products/SQ')) return true;
  
  // Don't index search templates
  if (pathname.includes('search_term_string')) return true;
  
  // Don't index if product ID matches old patterns
  if (productId && (productId.startsWith('product-') || productId.startsWith('SQ'))) {
    return true;
  }
  
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
