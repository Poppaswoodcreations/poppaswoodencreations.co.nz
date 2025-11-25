/**
 * SEO utilities for generating meta tags and structured data
 */

import { Product, Category } from '../types';

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
  structuredData?: any;
}

/**
 * Generate SEO data for product pages
 */
export const generateProductSEO = (product: Product): SEOData => {
  const title = product.seoTitle || `${product.name} | Handcrafted Wooden Toy | Poppa's Wooden Creations`;
  const description = product.seoDescription || `${product.description.substring(0, 150)}... Handcrafted in New Zealand from premium timber. Price: $${product.price} NZD.`;
  const keywords = product.seoKeywords || `${product.name}, wooden toy, handcrafted, New Zealand made, ${product.category.replace('-', ' ')}`;
  const canonicalUrl = `https://poppaswoodencreations.co.nz/products/${product.id}`;
  const ogImage = product.images?.[0] || 'https://poppaswoodencreations.co.nz/images/image copy copy copy copy copy copy.png';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": ogImage,
    "url": canonicalUrl,
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "NZD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Poppa's Wooden Creations"
      }
    },
    "category": product.category,
    "weight": {
      "@type": "QuantitativeValue",
      "value": product.weight || 0.5,
      "unitCode": "KGM"
    }
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    structuredData
  };
};

/**
 * Generate SEO data for category pages
 */
export const generateCategorySEO = (category: Category): SEOData => {
  const title = category.seoTitle || `${category.name} | Handcrafted Wooden Toys | Poppa's Wooden Creations`;
  const description = category.seoDescription || `${category.description} Browse our collection of ${category.productCount} handcrafted wooden toys made in New Zealand.`;
  const keywords = category.seoKeywords || `${category.name}, wooden toys, handcrafted, New Zealand made, children toys`;
  const canonicalUrl = `https://poppaswoodencreations.co.nz/${category.slug}`;

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage: category.image
  };
};

/**
 * Generate SEO data for static pages
 */
export const generatePageSEO = (page: string): SEOData => {
  const seoData: { [key: string]: SEOData } = {
    about: {
      title: 'About Poppa\'s Wooden Creations | Handcrafted Toys Since 2015',
      description: 'Learn about our family business creating beautiful wooden toys in New Zealand since 2015. Premium quality, sustainable materials, child-safe finishes.',
      keywords: 'about poppa\'s wooden creations, New Zealand wooden toys, family business, handcrafted toys, sustainable toys',
      canonicalUrl: 'https://poppaswoodencreations.co.nz/about'
    },
    contact: {
      title: 'Contact Poppa\'s Wooden Creations | Custom Orders & Support',
      description: 'Contact us for custom wooden toy orders, product support, or general inquiries. Located in Whangarei, New Zealand. Phone: +64 21 022 8166',
      keywords: 'contact poppa\'s wooden creations, custom wooden toys, New Zealand toy maker, Whangarei workshop',
      canonicalUrl: 'https://poppaswoodencreations.co.nz/contact'
    },
    shipping: {
      title: 'Shipping & Returns | Worldwide Delivery | Poppa\'s Wooden Creations',
      description: 'Free shipping on orders over $1000 NZD. Worldwide delivery available. 30-day return policy. Secure packaging for all wooden toys.',
      keywords: 'shipping wooden toys, free shipping New Zealand, worldwide delivery, returns policy',
      canonicalUrl: 'https://poppaswoodencreations.co.nz/shipping'
    },
    reviews: {
      title: 'Customer Reviews | 4.9★ Rating | Poppa\'s Wooden Creations',
      description: 'Read verified customer reviews of our handcrafted wooden toys. 4.9/5 star rating from 150+ happy families worldwide.',
      keywords: 'wooden toy reviews, customer testimonials, verified reviews, toy quality',
      canonicalUrl: 'https://poppaswoodencreations.co.nz/reviews'
    },
    privacy: {
      title: 'Privacy Policy | Data Protection | Poppa\'s Wooden Creations',
      description: 'Our privacy policy explains how we collect, use, and protect your personal information. GDPR compliant and secure.',
      keywords: 'privacy policy, data protection, GDPR, secure shopping',
      canonicalUrl: 'https://poppaswoodencreations.co.nz/privacy'
    },
    terms: {
      title: 'Terms of Service | Purchase Terms | Poppa\'s Wooden Creations',
      description: 'Terms and conditions for purchasing our handcrafted wooden toys. Warranty information, return policy, and legal terms.',
      keywords: 'terms of service, purchase terms, warranty, return policy',
      canonicalUrl: 'https://poppaswoodencreations.co.nz/terms'
    }
  };

  return seoData[page] || {
    title: 'Poppa\'s Wooden Creations - Handcrafted Wooden Toys',
    description: 'Premium handcrafted wooden toys made in New Zealand',
    keywords: 'wooden toys, handcrafted, New Zealand',
    canonicalUrl: 'https://poppaswoodencreations.co.nz'
  };
};