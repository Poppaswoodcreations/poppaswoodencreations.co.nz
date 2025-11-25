/**
 * Analytics utilities for tracking user interactions
 */

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

/**
 * Track events (placeholder for Google Analytics, etc.)
 */
export const trackEvent = (eventData: AnalyticsEvent) => {
  // Log to console for development
  console.log('📊 Analytics Event:', eventData);
  
  // Add Google Analytics tracking here when ready
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventData.action, {
      event_category: eventData.category,
      event_label: eventData.label,
      value: eventData.value
    });
  }
};

/**
 * Track product views
 */
export const trackProductView = (product: { id: string; name: string; category: string; price: number }) => {
  trackEvent({
    event: 'view_item',
    category: 'ecommerce',
    action: 'product_view',
    label: product.name,
    value: product.price
  });
};

/**
 * Track add to cart events
 */
export const trackAddToCart = (product: { id: string; name: string; category: string; price: number }, quantity: number = 1) => {
  trackEvent({
    event: 'add_to_cart',
    category: 'ecommerce',
    action: 'add_to_cart',
    label: product.name,
    value: product.price * quantity
  });
};

/**
 * Track purchase events
 */
export const trackPurchase = (orderData: {
  orderId: string;
  total: number;
  items: Array<{ id: string; name: string; category: string; price: number; quantity: number }>;
}) => {
  trackEvent({
    event: 'purchase',
    category: 'ecommerce',
    action: 'purchase',
    label: orderData.orderId,
    value: orderData.total
  });
};

/**
 * Track category views
 */
export const trackCategoryView = (category: string) => {
  trackEvent({
    event: 'view_item_list',
    category: 'navigation',
    action: 'category_view',
    label: category
  });
};

/**
 * Track search events
 */
export const trackSearch = (searchTerm: string, resultCount: number) => {
  trackEvent({
    event: 'search',
    category: 'engagement',
    action: 'search',
    label: searchTerm,
    value: resultCount
  });
};