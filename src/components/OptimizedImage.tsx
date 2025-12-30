// src/components/OptimizedImage.tsx
// High-performance image component with lazy loading and Supabase optimization

import React, { useState } from 'react';
import { optimizeSupabaseImage, isSupabaseImage } from '../utils/imageOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  objectFit?: 'contain' | 'cover' | 'fill';
}

/**
 * OptimizedImage Component
 * 
 * Automatically optimizes Supabase images and provides lazy loading
 * 
 * @example
 * <OptimizedImage
 *   src="https://...supabase.co/.../image.webp"
 *   alt="Product image"
 *   width={800}
 *   height={600}
 *   loading="lazy"
 * />
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  quality = 85,
  sizes,
  onLoad,
  onError,
  objectFit = 'cover'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Optimize Supabase images
  const optimizedSrc = isSupabaseImage(src)
    ? optimizeSupabaseImage(src, { width, height, quality })
    : src;

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Fallback image
  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300
          ${objectFit === 'cover' ? 'object-cover' : ''}
          ${objectFit === 'contain' ? 'object-contain' : ''}
          ${objectFit === 'fill' ? 'object-fill' : ''}
        `}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

/**
 * Pre-configured image components for common use cases
 */

// Blog featured image
export const BlogFeaturedImage: React.FC<Omit<OptimizedImageProps, 'width' | 'height'>> = (props) => (
  <OptimizedImage
    {...props}
    width={1200}
    height={675}
    quality={90}
    loading="eager"
    priority
  />
);

// Blog thumbnail
export const BlogThumbnail: React.FC<Omit<OptimizedImageProps, 'width' | 'height'>> = (props) => (
  <OptimizedImage
    {...props}
    width={600}
    height={400}
    quality={85}
    loading="lazy"
  />
);

// Product main image
export const ProductImage: React.FC<Omit<OptimizedImageProps, 'width' | 'height'>> = (props) => (
  <OptimizedImage
    {...props}
    width={800}
    height={800}
    quality={90}
    loading="lazy"
    objectFit="contain"
  />
);

// Product thumbnail
export const ProductThumbnail: React.FC<Omit<OptimizedImageProps, 'width' | 'height'>> = (props) => (
  <OptimizedImage
    {...props}
    width={200}
    height={200}
    quality={80}
    loading="lazy"
  />
);

// Hero image (above the fold)
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'width' | 'height'>> = (props) => (
  <OptimizedImage
    {...props}
    width={1920}
    height={1080}
    quality={90}
    loading="eager"
    priority
  />
);

export default OptimizedImage;
