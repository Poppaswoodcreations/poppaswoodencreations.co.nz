/**
 * Form type definitions
 */

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormState {
  data: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
  touched: { [key: string]: boolean };
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  weight: number;
  stockQuantity: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  orderType: string;
}

export interface ShippingFormData {
  email: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryMethod: 'shipping' | 'pickup';
}

export interface PaymentFormData {
  paymentMethod: 'stripe' | 'paypal';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}