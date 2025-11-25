/**
 * Application configuration
 */

export const config = {
  // Site information
  site: {
    name: "Poppa's Wooden Creations",
    tagline: "Handcrafted in New Zealand",
    description: "Premium handcrafted wooden toys and kitchenware made with love in New Zealand",
    url: "https://poppaswoodencreations.co.nz",
    logo: "/logo.png",
    favicon: "/favicon.ico"
  },

  // Business information
  business: {
    name: "Poppa's Wooden Creations",
    email: "poppas.wooden.creations@gmail.com",
    phone: "+64 21 022 8166",
    address: {
      street: "102 Kiripaka Rd",
      city: "Whangarei",
      region: "Northland",
      postalCode: "0110",
      country: "New Zealand"
    },
    hours: {
      weekdays: "Monday-Friday 9AM-3PM NZST",
      weekend: "Closed"
    },
    established: "2015"
  },

  // E-commerce settings
  ecommerce: {
    currency: "NZD",
    freeShippingThreshold: 1000,
    defaultShipping: 8.50,
    taxRate: 0.15, // 15% GST for NZ
    returnPeriod: 30 // days
  },

  // SEO settings
  seo: {
    defaultTitle: "Poppa's Wooden Creations - Handcrafted Wooden Toys NZ",
    defaultDescription: "Discover premium handcrafted wooden toys and kitchenware made with love in New Zealand. Safe, sustainable, and built to last.",
    defaultKeywords: "wooden toys, handcrafted toys, New Zealand made, sustainable toys, children toys, wooden kitchenware",
    ogImage: "https://poppaswoodencreations.co.nz/images/image copy copy copy copy copy copy.png"
  },

  // Social media
  social: {
    facebook: "https://facebook.com/poppaswooden",
    instagram: "https://instagram.com/poppaswooden",
    twitter: ""
  },

  // Features
  features: {
    enableReviews: true,
    enableWishlist: false,
    enableCompare: false,
    enableQuickView: true,
    enableSearch: true,
    enableFilters: true
  },

  // Pagination
  pagination: {
    productsPerPage: 12,
    reviewsPerPage: 10,
    ordersPerPage: 20
  },

  // Image settings
  images: {
    maxUploadSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    thumbnailSize: 300,
    mediumSize: 600,
    largeSize: 1200
  },

  // Performance
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCaching: true,
    cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours
  }
};

export default config;