/**
 * Validation utilities for forms and data
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (flexible format)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone);
};

/**
 * Validate product data
 */
export const validateProduct = (product: any): ValidationResult => {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!product.description || product.description.trim().length === 0) {
    errors.push('Product description is required');
  }

  if (!product.price || product.price <= 0) {
    errors.push('Product price must be greater than 0');
  }

  if (!product.category || product.category.trim().length === 0) {
    errors.push('Product category is required');
  }

  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    errors.push('At least one product image is required');
  }

  if (product.weight && product.weight < 0) {
    errors.push('Product weight cannot be negative');
  }

  if (product.stockQuantity && product.stockQuantity < 0) {
    errors.push('Stock quantity cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate contact form data
 */
export const validateContactForm = (formData: any): ValidationResult => {
  const errors: string[] = [];

  if (!formData.name || formData.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.push('Valid email address is required');
  }

  if (!formData.subject || formData.subject.trim().length === 0) {
    errors.push('Subject is required');
  }

  if (!formData.message || formData.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.push('Phone number format is invalid');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate checkout form data
 */
export const validateCheckoutForm = (formData: any): ValidationResult => {
  const errors: string[] = [];

  if (!formData.email || !validateEmail(formData.email)) {
    errors.push('Valid email address is required');
  }

  if (formData.deliveryMethod === 'shipping') {
    if (!formData.name || formData.name.trim().length === 0) {
      errors.push('Full name is required for shipping');
    }

    if (!formData.address || formData.address.trim().length === 0) {
      errors.push('Shipping address is required');
    }

    if (!formData.city || formData.city.trim().length === 0) {
      errors.push('City is required');
    }

    if (!formData.postalCode || formData.postalCode.trim().length === 0) {
      errors.push('Postal code is required');
    }

    if (!formData.country || formData.country.trim().length === 0) {
      errors.push('Country is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize HTML input to prevent XSS
 */
export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate and sanitize user input
 */
export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input) return '';
  
  // Remove HTML tags and limit length
  const sanitized = sanitizeHtml(input);
  return sanitized.length > maxLength 
    ? sanitized.substring(0, maxLength) + '...'
    : sanitized;
};