/**
 * SEO utilities for generating meta tags and structured data
 */

import { Product, Category } from '../types';

const BASE_URL = 'https://poppaswoodencreations.co.nz';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
  structuredData?: any;
}

// ─── Canonical & robots helpers ───────────────────────────────────────────────

export const getCanonicalUrl = (pathname: string): string => {
  const cleanPath = pathname.replace(/\/$/, '');
  if (!cleanPath || cleanPath === '') return BASE_URL;
  return `${BASE_URL}${cleanPath}`;
};

/**
 * Only noindex known junk patterns.
 * Do NOT use a whitelist — any real product not in the list gets wrongly noindexed.
 * New products added to Supabase are automatically indexable without any code change.
 */
export const shouldNoIndex = (pathname: string): boolean => {
  const productSlug = pathname.split('/products/')[1]?.replace(/\/$/, '');

  if (!productSlug) return false; // Not a product page

  if (productSlug.startsWith('SQ')) return true;           // Old Squarespace IDs
  if (productSlug.startsWith('product-')) return true;     // Placeholder slugs
  if (pathname.includes('search_term_string')) return true; // Search templates

  return false; // Everything else is a real product — index it
};

export const getRobotsMetaTag = (pathname: string): string => {
  return shouldNoIndex(pathname) ? 'noindex, follow' : 'index, follow';
};

// ─── Product SEO ──────────────────────────────────────────────────────────────

export const generateProductSEO = (product: Product): SEOData => {
  const title = product.seoTitle ||
    `${product.name} | Handcrafted Wooden Toy | Poppa's Wooden Creations`;

  const description = product.seoDescription ||
    `${product.description.substring(0, 150)}... Handcrafted in New Zealand from premium timber. Price: $${product.price} NZD.`;

  const keywords = product.seoKeywords ||
    `${product.name}, wooden toy, handcrafted, New Zealand made, ${product.category.replace('-', ' ')}`;

  const canonicalUrl = `${BASE_URL}/products/${product.id}`;
  const ogImage = product.images?.[0] || DEFAULT_OG_IMAGE;

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
      "availability": product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
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

  return { title, description, keywords, canonicalUrl, ogImage, structuredData };
};

// ─── Category SEO ─────────────────────────────────────────────────────────────

export const generateCategorySEO = (category: Category): SEOData => {
  const title = category.seoTitle ||
    `${category.name} | Handcrafted Wooden Toys | Poppa's Wooden Creations`;

  const description = category.seoDescription ||
    `${category.description} Browse our collection of ${category.productCount} handcrafted wooden toys made in New Zealand.`;

  const keywords = category.seoKeywords ||
    `${category.name}, wooden toys, handcrafted, New Zealand made, children toys`;

  const canonicalUrl = `${BASE_URL}/${category.slug}`;

  return { title, description, keywords, canonicalUrl, ogImage: category.image };
};

// ─── Static page SEO ──────────────────────────────────────────────────────────

export const generatePageSEO = (page: string): SEOData => {
  const seoData: { [key: string]: SEOData } = {
    about: {
      title: "About Poppa's Wooden Creations | Handcrafted in Whangarei NZ Since 2015",
      description: 'Learn about our family business handcrafting wooden toys and kitchenware from native NZ timber in Whangarei since 2015. Premium quality, sustainable materials, child-safe finishes.',
      keywords: "about poppa's wooden creations, New Zealand wooden toys, Whangarei craftsman, handcrafted toys, sustainable toys",
      canonicalUrl: `${BASE_URL}/about`,
    },
    contact: {
      title: "Contact Poppa's Wooden Creations | Whangarei NZ",
      description: 'Contact us for custom wooden toy orders, product questions, or general inquiries. Located in Whangarei, Northland, New Zealand. Phone: +64 21 022 88166.',
      keywords: "contact poppa's wooden creations, custom wooden toys, New Zealand toy maker, Whangarei workshop",
      canonicalUrl: `${BASE_URL}/contact`,
    },
    shipping: {
      title: "Shipping Policy | Poppa's Wooden Creations NZ",
      description: 'NZ-wide tracked courier delivery in 2–5 business days. International shipping available. Eco-friendly packaging. Orders processed within 1–3 business days.',
      keywords: 'shipping wooden toys, New Zealand delivery, international shipping, courier tracked',
      canonicalUrl: `${BASE_URL}/shipping`,
    },
    returns: {
      title: "Returns & Refunds Policy | Poppa's Wooden Creations NZ",
      description: '30-day return policy on all handcrafted wooden toys. Full refund or exchange. Faulty items replaced at no cost. Covered by NZ Consumer Guarantees Act.',
      keywords: 'returns policy, refund wooden toys, 30 day returns, consumer guarantees',
      canonicalUrl: `${BASE_URL}/returns`,
    },
    reviews: {
      title: "Customer Reviews | Poppa's Wooden Creations NZ",
      description: "Read verified customer reviews of Poppa's Wooden Creations handcrafted wooden toys. Trusted by NZ families and Montessori schools since 2015.",
      keywords: 'wooden toy reviews, customer testimonials, verified reviews, Montessori toys NZ',
      canonicalUrl: `${BASE_URL}/reviews`,
    },
    privacy: {
      title: "Privacy Policy | Poppa's Wooden Creations NZ",
      description: 'Our privacy policy explains how we collect, use, and protect your personal information under the NZ Privacy Act 2020.',
      keywords: 'privacy policy, data protection, NZ Privacy Act, secure shopping',
      canonicalUrl: `${BASE_URL}/privacy`,
    },
    terms: {
      title: "Terms of Service | Poppa's Wooden Creations NZ",
      description: "Terms and conditions for purchasing from Poppa's Wooden Creations. Covered by the NZ Consumer Guarantees Act 1993 and Fair Trading Act 1986.",
      keywords: 'terms of service, purchase terms, consumer guarantees act, NZ',
      canonicalUrl: `${BASE_URL}/terms`,
    },
  };

  return seoData[page] || {
    title: "Poppa's Wooden Creations - Handcrafted Wooden Toys NZ",
    description: 'Premium handcrafted wooden toys and kitchenware made from native New Zealand timber in Whangarei since 2015.',
    keywords: 'wooden toys NZ, handcrafted, New Zealand made, Whangarei',
    canonicalUrl: BASE_URL,
  };
};
