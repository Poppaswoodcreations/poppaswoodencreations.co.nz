import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  productName?: string;
  category?: string;
  price?: number;
  description?: string;
  context?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  priority = false,
  className = '',
  width = 800,
  height = 600,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Optimize image URL for better compression
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('squarespace-cdn.com')) {
      return `${originalSrc.split('?')[0]}?format=webp&w=${width}&q=75`;
    }
    return originalSrc;
  };

  useEffect(() => {
    const optimizedSrc = getOptimizedSrc(src);
    console.log('🖼️ OptimizedImage: Setting src from', src, 'to', optimizedSrc);
    setCurrentSrc(optimizedSrc);
  }, [src, width]);

  const handleLoad = () => {
    console.log('✅ OptimizedImage: Successfully loaded:', currentSrc);
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.log('❌ OptimizedImage: Error loading image:', currentSrc);
    if (!hasError) {
      setHasError(true);
      console.log('🔄 OptimizedImage: Trying fallback image');
      setCurrentSrc('/FB_IMG_1640827671355.jpg');
      onError?.();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 animate-pulse"
          style={{ width: '100%', height: '100%' }}
        />
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
        sizes={sizes}
      />
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-100">
          <div className="text-center text-amber-700">
            <div className="text-4xl mb-2">🪵</div>
            <div className="text-sm">Wooden Toy</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;