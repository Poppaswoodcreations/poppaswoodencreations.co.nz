import { useMemo } from 'react';

/**
 * Hook to convert Supabase product data to Schema.org format
 * Assumes your products table has similar structure to what you've been working with
 */
export const useProductSchema = (product: any) => {
  return useMemo(() => {
    if (!product) return null;

    // Get the primary image or first available image
    const images = product.images || [];
    const primaryImage = images[0] || '';

    return {
      name: product.name || product.title,
      description: product.description || product.meta_description || '',
      image: images.length > 0 ? images : [primaryImage],
      sku: product.id || product.sku,
      brand: "Poppa's Wooden Creations",
      offers: {
        price: parseFloat(product.price || 0),
        priceCurrency: "NZD",
        availability: product.stock > 0 ? "InStock" : "OutOfStock",
        url: `https://poppaswoodencreations.co.nz/products/${product.slug}`
      },
      category: product.category || product.product_type,
      material: extractMaterial(product.name, product.description)
    };
  }, [product]);
};

/**
 * Hook to convert blog post data to Article Schema format
 */
export const useArticleSchema = (post: any) => {
  return useMemo(() => {
    if (!post) return null;

    // Get featured image and additional images
    const images = [];
    if (post.featured_image) images.push(post.featured_image);
    if (post.images && post.images.length > 0) images.push(...post.images);

    return {
      headline: post.title,
      description: post.excerpt || post.meta_description || post.description,
      image: images.length > 0 ? images : ['https://poppaswoodencreations.co.nz/default-blog-image.jpg'],
      datePublished: post.published_at || post.created_at,
      dateModified: post.updated_at || post.published_at || post.created_at,
      author: {
        name: post.author || "Adrian - Poppa's Wooden Creations",
        url: "https://poppaswoodencreations.co.nz/about"
      },
      publisher: {
        name: "Poppa's Wooden Creations",
        logo: "https://poppaswoodencreations.co.nz/logo.png"
      }
    };
  }, [post]);
};

/**
 * Generate breadcrumb schema for product pages
 */
export const useProductBreadcrumb = (product: any) => {
  return useMemo(() => {
    if (!product) return null;

    const items = [
      {
        name: "Home",
        url: "https://poppaswoodencreations.co.nz"
      }
    ];

    // Add category if available
    if (product.category) {
      items.push({
        name: product.category,
        url: `https://poppaswoodencreations.co.nz/category/${encodeURIComponent(product.category.toLowerCase())}`
      });
    }

    // Add product
    items.push({
      name: product.name || product.title,
      url: `https://poppaswoodencreations.co.nz/products/${product.slug}`
    });

    return { items };
  }, [product]);
};

/**
 * Generate breadcrumb schema for blog posts
 */
export const useBlogBreadcrumb = (post: any) => {
  return useMemo(() => {
    if (!post) return null;

    const items = [
      {
        name: "Home",
        url: "https://poppaswoodencreations.co.nz"
      },
      {
        name: "Blog",
        url: "https://poppaswoodencreations.co.nz/blog"
      }
    ];

    // Add category if available
    if (post.category) {
      items.push({
        name: post.category,
        url: `https://poppaswoodencreations.co.nz/blog/category/${encodeURIComponent(post.category.toLowerCase())}`
      });
    }

    // Add post
    items.push({
      name: post.title,
      url: `https://poppaswoodencreations.co.nz/blog/${post.slug}`
    });

    return { items };
  }, [post]);
};

/**
 * Extract material from product name or description
 * Looks for native NZ timber types
 */
function extractMaterial(name: string = '', description: string = ''): string {
  const text = `${name} ${description}`.toLowerCase();
  
  const materials = [
    'kauri',
    'rimu',
    'macrocarpa',
    'pine',
    'totara',
    'matai',
    'beech'
  ];

  for (const material of materials) {
    if (text.includes(material)) {
      return material.charAt(0).toUpperCase() + material.slice(1) + ' Wood';
    }
  }

  return 'Premium New Zealand Native Timber';
}

/**
 * Complete schema data for a product page
 */
export const useProductPageSchema = (product: any) => {
  const productSchema = useProductSchema(product);
  const breadcrumbSchema = useProductBreadcrumb(product);

  return useMemo(() => {
    if (!productSchema || !breadcrumbSchema) return [];

    return [
      { type: 'product' as const, data: productSchema },
      { type: 'breadcrumb' as const, data: breadcrumbSchema }
    ];
  }, [productSchema, breadcrumbSchema]);
};

/**
 * Complete schema data for a blog post page
 */
export const useBlogPageSchema = (post: any) => {
  const articleSchema = useArticleSchema(post);
  const breadcrumbSchema = useBlogBreadcrumb(post);

  return useMemo(() => {
    if (!articleSchema || !breadcrumbSchema) return [];

    return [
      { type: 'article' as const, data: articleSchema },
      { type: 'breadcrumb' as const, data: breadcrumbSchema }
    ];
  }, [articleSchema, breadcrumbSchema]);
};
