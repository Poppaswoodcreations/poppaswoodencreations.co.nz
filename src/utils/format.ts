/**
 * Formatting utilities
 */

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('64')) {
    // New Zealand format
    const match = cleaned.match(/^64(\d{1,2})(\d{3})(\d{4})$/);
    if (match) {
      return `+64 ${match[1]} ${match[2]} ${match[3]}`;
    }
  }
  
  return phone;
};

/**
 * Format address for display
 */
export const formatAddress = (address: {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.region,
    address.postalCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Format business hours
 */
export const formatBusinessHours = (hours: string): string => {
  return hours.replace(/\n/g, '<br>');
};

/**
 * Format product category for display
 */
export const formatCategory = (category: string): string => {
  return category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Format product name for URL
 */
export const formatProductSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Format review rating for display
 */
export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)}★`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, total: number): string => {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Format order number
 */
export const formatOrderNumber = (id: string): string => {
  return `#${id.toUpperCase()}`;
};

/**
 * Format stock status
 */
export const formatStockStatus = (quantity: number): {
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  label: string;
  color: string;
} => {
  if (quantity === 0) {
    return {
      status: 'out-of-stock',
      label: 'Out of Stock',
      color: 'text-red-600'
    };
  }
  
  if (quantity <= 5) {
    return {
      status: 'low-stock',
      label: `Low Stock (${quantity} left)`,
      color: 'text-yellow-600'
    };
  }
  
  return {
    status: 'in-stock',
    label: 'In Stock',
    color: 'text-green-600'
  };
};