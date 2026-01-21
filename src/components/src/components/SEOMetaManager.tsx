import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Meta Manager - Prevents accidental noindexing
 * 
 * This component manages robots meta tags across your site to ensure
 * Google can properly index your important pages.
 * 
 * RULES:
 * - Product pages: ALWAYS indexable (unless explicitly marked)
 * - Category pages: ALWAYS indexable
 * - Blog pages: ALWAYS indexable
 * - Privacy/Terms: noindex (don't waste crawl budget)
 * - Search results: noindex (duplicate content)
 * - Out of stock products: noindex (optional)
 */

interface SEOConfig {
  shouldIndex: boolean;
  shouldFollow: boolean;
  canonical?: string;
  reason?: string;
}

export function SEOMetaManager() {
  const location = useLocation();

  useEffect(() => {
    const config = getSEOConfig(location.pathname);
    updateMetaTags(config);
  }, [location.pathname]);

  return null; // This component doesn't render anything
}

/**
 * Determines SEO configuration based on current URL path
 */
function getSEOConfig(pathname: string): SEOConfig {
  const path = pathname.toLowerCase();

  // ==========================================
  // NOINDEX PAGES (Don't want Google to index)
  // ==========================================
  
  // Privacy and legal pages
  if (path.includes('/privacy') || 
      path.includes('/terms') || 
      path.includes('/refund')) {
    return {
      shouldIndex: false,
      shouldFollow: true,
      reason: 'Legal page - no SEO value'
    };
  }

  // Search results pages
  if (path.includes('/search')) {
    return {
      shouldIndex: false,
      shouldFollow: true,
      reason: 'Search results - duplicate content'
    };
  }

  // Cart and checkout pages
  if (path.includes('/cart') || 
      path.includes('/checkout')) {
    return {
      shouldIndex: false,
      shouldFollow: false,
      reason: 'Transactional page'
    };
  }

  // Thank you / confirmation pages
  if (path.includes('/thank-you') || 
      path.includes('/order-confirmation')) {
    return {
      shouldIndex: false,
      shouldFollow: false,
      reason: 'Post-purchase page'
    };
  }

  // ==========================================
  // INDEX PAGES (Want Google to index)
  // ==========================================

  // Homepage
  if (path === '/') {
    return {
      shouldIndex: true,
      shouldFollow: true,
      canonical: 'https://poppaswoodencreations.co.nz/',
      reason: 'Homepage - most important page'
    };
  }

  // Product pages
  if (path.includes('/products/')) {
    return {
      shouldIndex: true,
      shouldFollow: true,
      canonical: `https://poppaswoodencreations.co.nz${pathname}`,
      reason: 'Product page - revenue generating'
    };
  }

  // Category pages (wooden-baby-toys, wooden-kitchenware, etc.)
  if (path.includes('/wooden-') || 
      path.includes('/category')) {
    // Remove trailing slash for canonical
    const cleanPath = pathname.replace(/\/$/, '');
    return {
      shouldIndex: true,
      shouldFollow: true,
      canonical: `https://poppaswoodencreations.co.nz${cleanPath}`,
      reason: 'Category page - high SEO value'
    };
  }

  // Blog pages
  if (path.includes('/blog')) {
    return {
      shouldIndex: true,
      shouldFollow: true,
      canonical: `https://poppaswoodencreations.co.nz${pathname}`,
      reason: 'Blog content - SEO asset'
    };
  }

  // About, Contact, Shipping, Reviews pages
  if (path.includes('/about') || 
      path.includes('/contact') || 
      path.includes('/shipping') ||
      path.includes('/reviews')) {
    return {
      shouldIndex: true,
      shouldFollow: true,
      canonical: `https://poppaswoodencreations.co.nz${pathname}`,
      reason: 'Informational page - builds trust'
    };
  }

  // ==========================================
  // DEFAULT: INDEX EVERYTHING ELSE
  // ==========================================
  return {
    shouldIndex: true,
    shouldFollow: true,
    canonical: `https://poppaswoodencreations.co.nz${pathname}`,
    reason: 'Default - index by default'
  };
}

/**
 * Updates meta tags in the document head
 */
function updateMetaTags(config: SEOConfig) {
  // Remove existing robots meta tag
  const existingRobots = document.querySelector('meta[name="robots"]');
  if (existingRobots) {
    existingRobots.remove();
  }

  // Add new robots meta tag
  const robotsTag = document.createElement('meta');
  robotsTag.name = 'robots';
  
  const indexValue = config.shouldIndex ? 'index' : 'noindex';
  const followValue = config.shouldFollow ? 'follow' : 'nofollow';
  robotsTag.content = `${indexValue}, ${followValue}`;
  
  document.head.appendChild(robotsTag);

  // Update canonical tag
  if (config.canonical) {
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    
    canonicalTag.href = config.canonical;
  }

  // Log in development mode
  if (import.meta.env.DEV) {
    console.log('🔍 SEO Meta Manager:', {
      path: window.location.pathname,
      robots: `${indexValue}, ${followValue}`,
      canonical: config.canonical,
      reason: config.reason
    });
  }
}

/**
 * Hook to manually control SEO for specific components
 * 
 * Usage:
 * ```tsx
 * function OutOfStockProduct() {
 *   useSEOControl({ shouldIndex: false, shouldFollow: true });
 *   return <div>...</div>
 * }
 * ```
 */
export function useSEOControl(config: Partial<SEOConfig>) {
  useEffect(() => {
    const fullConfig: SEOConfig = {
      shouldIndex: config.shouldIndex ?? true,
      shouldFollow: config.shouldFollow ?? true,
      canonical: config.canonical,
      reason: config.reason ?? 'Manual override'
    };
    
    updateMetaTags(fullConfig);
  }, [config.shouldIndex, config.shouldFollow, config.canonical]);
}

/**
 * Utility to check if current page should be indexed
 */
export function useIsIndexable(): boolean {
  const location = useLocation();
  const config = getSEOConfig(location.pathname);
  return config.shouldIndex;
}
