import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOMetaProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  image?: string;
  type?: string;
}

/**
 * Helper function to safely convert value to string
 */
function safeString(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return String(value);
}

/**
 * Helper function to update or create meta tags - PREVENTS DUPLICATES
 */
function updateMetaTag(attribute: string, value: string, content: any) {
  const safeContent = safeString(content);
  
  const existingTags = document.querySelectorAll(`meta[${attribute}="${value}"]`);
  existingTags.forEach(tag => tag.remove());
  
  const element = document.createElement('meta');
  element.setAttribute(attribute, value);
  element.content = safeContent;
  element.setAttribute('data-rh', 'true');
  document.head.appendChild(element);
}

/**
 * SEO Meta Manager Component
 */
export const SEOMetaManager: React.FC<SEOMetaProps> = ({
  title,
  description,
  canonical,
  noindex = false,
  image,
  type = 'website'
}) => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://poppaswoodencreations.co.nz';
    
    // ✅ FIXED: Always use current URL path as canonical unless explicitly provided
    // Never fall back to homepage '/' for product pages
    const pathname = location.pathname.replace(/\/$/, '') || '/';
    const canonicalUrl = canonical && canonical !== baseUrl && canonical !== `${baseUrl}/`
      ? canonical
      : `${baseUrl}${pathname}`;

    if (title) {
      const titleStr = safeString(title);
      if (titleStr.includes("Poppa's") || titleStr.includes('Creations')) {
        document.title = titleStr;
      } else {
        document.title = `${titleStr} | Poppa's Wooden Creations`;
      }
    } else {
      document.title = "Handmade Wooden Toys NZ | Montessori Toys | Poppa's Wooden Creations";
    }

    const defaultDescription = description || "Handcrafted wooden toys from native NZ timber. Trusted by Montessori schools. Shop baby toys, trucks & kitchenware. Made in Whangarei since 2015.";
    
    updateMetaTag('name', 'description', defaultDescription);
    // ✅ FIXED: Never set noindex unless explicitly true AND canonical is correct
    updateMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    
    updateMetaTag('property', 'og:title', title || document.title);
    updateMetaTag('property', 'og:description', defaultDescription);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', type);
    if (image) {
      updateMetaTag('property', 'og:image', image);
    }

    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title || document.title);
    updateMetaTag('name', 'twitter:description', defaultDescription);
    if (image) {
      updateMetaTag('name', 'twitter:image', image);
    }

    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach(link => link.remove());
    
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonicalUrl;
    canonicalLink.setAttribute('data-rh', 'true');
    document.head.appendChild(canonicalLink);

  }, [title, description, canonical, noindex, image, type, location]);

  return null;
};

/**
 * Hook for easy SEO management in functional components
 */
export const useSEO = (props: SEOMetaProps) => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://poppaswoodencreations.co.nz';
    const pathname = location.pathname.replace(/\/$/, '') || '/';
    
    // ✅ FIXED: Always use current URL as canonical, never fall back to homepage
    const canonicalUrl = props.canonical && props.canonical !== baseUrl && props.canonical !== `${baseUrl}/`
      ? props.canonical
      : `${baseUrl}${pathname}`;

    if (props.title) {
      const titleStr = safeString(props.title);
      if (titleStr.includes("Poppa's") || titleStr.includes('Creations')) {
        document.title = titleStr;
      } else {
        document.title = `${titleStr} | Poppa's Wooden Creations`;
      }
    } else {
      document.title = "Handmade Wooden Toys NZ | Montessori Toys | Poppa's Wooden Creations";
    }

    const defaultDescription = props.description || "Handcrafted wooden toys from native NZ timber. Trusted by Montessori schools. Shop baby toys, trucks & kitchenware. Made in Whangarei since 2015.";

    updateMetaTag('name', 'description', defaultDescription);
    // ✅ FIXED: Only noindex when explicitly true - never noindex loading states
    updateMetaTag('name', 'robots', props.noindex === true ? 'noindex, nofollow' : 'index, follow');
    
    updateMetaTag('property', 'og:title', props.title || document.title);
    updateMetaTag('property', 'og:description', defaultDescription);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', props.type || 'website');
    if (props.image) {
      updateMetaTag('property', 'og:image', props.image);
    }

    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', props.title || document.title);
    updateMetaTag('name', 'twitter:description', defaultDescription);
    if (props.image) {
      updateMetaTag('name', 'twitter:image', props.image);
    }

    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach(link => link.remove());
    
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonicalUrl;
    canonicalLink.setAttribute('data-rh', 'true');
    document.head.appendChild(canonicalLink);

  }, [props, location]);
};

export default SEOMetaManager;
