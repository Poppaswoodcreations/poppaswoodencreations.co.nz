// src/utils/imageOptimizer.ts
// Utility for optimizing Supabase Storage images

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'png' | 'jpeg';
  resize?: 'contain' | 'cover' | 'fill';
}

/**
 * Optimizes Supabase Storage image URLs with transformation parameters
 * 
 * @param imageUrl - Original Supabase image URL
 * @param options - Optimization options (width, height, quality, format)
 * @returns Optimized image URL with transformation parameters
 * 
 * @example
 * const optimized = optimizeSupabaseImage(
 *   'https://...supabase.co/storage/v1/object/public/product-images/toy.webp',
 *   { width: 800, quality: 85 }
 * );
 */
export function optimizeSupabaseImage(
  imageUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  // Return original URL if not a Supabase URL
  if (!imageUrl || !imageUrl.includes('supabase.co')) {
    return imageUrl;
  }

  // Default options for optimal performance
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    resize = 'contain'
  } = options;

  // Check if URL already uses the render endpoint
  const isRenderUrl = imageUrl.includes('/render/image/');
  
  if (isRenderUrl) {
    // Already optimized, return as-is
    return imageUrl;
  }

  // Convert standard URL to render URL
  // From: /storage/v1/object/public/bucket/path
  // To: /storage/v1/render/image/public/bucket/path?params
  const renderUrl = imageUrl.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  );

  // Build query parameters
  const params = new URLSearchParams();
  
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  params.append('quality', quality.toString());
  params.append('format', format);
  params.append('resize', resize);

  return `${renderUrl}?${params.toString()}`;
}

/**
 * Pre-configured image optimization presets for common use cases
 */
export const imagePresets = {
  // Blog featured images (large, high quality)
  blogFeatured: (url: string) => optimizeSupabaseImage(url, {
    width: 1200,
    quality: 90,
    format: 'webp'
  }),

  // Blog listing thumbnails (medium, balanced)
  blogThumbnail: (url: string) => optimizeSupabaseImage(url, {
    width: 600,
    quality: 85,
    format: 'webp'
  }),

  // Product images (optimized for detail)
  productMain: (url: string) => optimizeSupabaseImage(url, {
    width: 800,
    quality: 90,
    format: 'webp'
  }),

  // Product thumbnails (small, fast)
  productThumbnail: (url: string) => optimizeSupabaseImage(url, {
    width: 400,
    quality: 80,
    format: 'webp'
  }),

  // Hero images (large, high quality)
  hero: (url: string) => optimizeSupabaseImage(url, {
    width: 1920,
    quality: 90,
    format: 'webp'
  }),

  // Mobile hero (smaller for mobile devices)
  heroMobile: (url: string) => optimizeSupabaseImage(url, {
    width: 800,
    quality: 85,
    format: 'webp'
  }),

  // Gallery images (balanced)
  gallery: (url: string) => optimizeSupabaseImage(url, {
    width: 600,
    quality: 85,
    format: 'webp'
  }),

  // Thumbnails (very small, fast loading)
  thumbnail: (url: string) => optimizeSupabaseImage(url, {
    width: 200,
    quality: 75,
    format: 'webp'
  })
};

/**
 * Generate responsive image srcSet for different screen sizes
 * 
 * @param imageUrl - Original image URL
 * @param sizes - Array of widths to generate
 * @returns srcSet string for responsive images
 * 
 * @example
 * const srcSet = generateResponsiveSrcSet(imageUrl, [400, 800, 1200]);
 * <img src={imageUrl} srcSet={srcSet} sizes="(max-width: 768px) 400px, 800px" />
 */
export function generateResponsiveSrcSet(
  imageUrl: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string {
  return sizes
    .map(width => {
      const optimized = optimizeSupabaseImage(imageUrl, { width, quality: 85 });
      return `${optimized} ${width}w`;
    })
    .join(', ');
}

/**
 * Check if image is from Supabase Storage
 */
export function isSupabaseImage(url: string): boolean {
  return url.includes('supabase.co/storage');
}

/**
 * Extract filename from Supabase URL
 */
export function getImageFilename(url: string): string {
  try {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
  } catch {
    return '';
  }
}
