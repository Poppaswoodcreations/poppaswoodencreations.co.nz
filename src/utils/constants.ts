/**
 * Application constants
 */

export const SITE_CONFIG = {
  name: "Poppa's Wooden Creations",
  tagline: "Handcrafted in New Zealand",
  description: "Premium handcrafted wooden toys and kitchenware made with love in New Zealand",
  url: "https://poppaswoodencreations.co.nz",
  email: "poppas.wooden.creations@gmail.com",
  phone: "+64 21 022 8166",
  address: {
    street: "102 Kiripaka Rd",
    city: "Whangarei",
    region: "Northland",
    postalCode: "0110",
    country: "New Zealand"
  },
  businessHours: {
    weekdays: "Monday-Friday 9AM-3PM NZST",
    weekend: "Closed"
  },
  established: "2015",
  socialMedia: {
    facebook: "https://facebook.com/poppaswooden",
    instagram: "https://instagram.com/poppaswooden"
  }
};

export const PRODUCT_CATEGORIES = [
  {
    slug: 'wooden-trains',
    name: 'Wooden Trains',
    description: 'Handcrafted wooden train sets and railway accessories'
  },
  {
    slug: 'wooden-baby-toys',
    name: 'Baby Toys',
    description: 'Safe, natural wooden toys for babies and toddlers'
  },
  {
    slug: 'wooden-trucks',
    name: 'Trucks',
    description: 'Heavy-duty wooden trucks for construction play'
  },
  {
    slug: 'wooden-cars',
    name: 'Cars',
    description: 'Fast and fun wooden cars for racing adventures'
  },
  {
    slug: 'wooden-planes-helicopters',
    name: 'Planes & Helicopters',
    description: 'Take flight with wooden aircraft and helicopters'
  },
  {
    slug: 'wooden-kitchenware',
    name: 'Kitchenware',
    description: 'Beautiful and functional wooden kitchen tools'
  },
  {
    slug: 'wooden-tractors-boats',
    name: 'Tractors & Boats',
    description: 'Farm tractors and sailing boats for adventure play'
  },
  {
    slug: 'wooden-other-toys',
    name: 'Other Toys',
    description: 'Unique wooden toys and educational games'
  }
];

export const SHIPPING_CONFIG = {
  freeShippingThreshold: 1000, // NZD
  weightUnit: 'kg',
  currency: 'NZD',
  defaultProcessingTime: '1-2 business days',
  customOrderTime: '2-4 weeks'
};

export const PAYMENT_METHODS = [
  {
    id: 'stripe',
    name: 'Credit Card',
    description: 'Visa, Mastercard, American Express',
    icon: '💳'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: '🅿️'
  }
];

export const ADMIN_PASSWORDS = ['Adrianbar1?', 'admin', 'poppa', 'password', 'poppas'];

export const DEFAULT_PRODUCT_IMAGE = '/FB_IMG_1640827671355.jpg';
export const FALLBACK_PRODUCT_IMAGE = 'https://i.ibb.co/FkkjBShk/image.jpg';

export const SEO_DEFAULTS = {
  title: "Poppa's Wooden Creations - Handcrafted Wooden Toys NZ",
  description: "Discover premium handcrafted wooden toys and kitchenware made with love in New Zealand. Safe, sustainable, and built to last.",
  keywords: "wooden toys, handcrafted toys, New Zealand made, sustainable toys, children toys, wooden kitchenware",
  ogImage: "https://poppaswoodencreations.co.nz/images/image copy copy copy copy copy copy.png"
};