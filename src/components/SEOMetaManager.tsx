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
  
  // Remove ALL existing tags with this attribute to prevent duplicates
  const existingTags = document.querySelectorAll(`meta[${attribute}="${value}"]`);
  existingTags.forEach(tag => tag.remove());
  
  // Create new tag
  const element = document.createElement('meta');
  element.setAttribute(attribute, value);
  element.content = safeContent;
  element.setAttribute('data-rh', 'true');
  document.head.appendChild(element);
}

/**
 * SEO Meta Manager Component
 * Handles all meta tags, canonical URLs, and prevents duplicate content issues
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
    // Build canonical URL
    const baseUrl = 'https://poppaswoodencreations.co.nz';
    let canonicalUrl = canonical;
    
    if (!canonicalUrl) {
      const pathname = location.pathname.replace(/\/$/, '');
      canonicalUrl = `${baseUrl}${pathname}`;
    }

    // ✅ FIX: Set document title - PREVENT DUPLICATION
    if (title) {
      const titleStr = safeString(title);
      // Only append suffix if title doesn't already contain "Poppa's" or "Creations"
      if (titleStr.includes("Poppa's") || titleStr.includes('Creations')) {
        document.title = titleStr;
      } else {
        document.title = `${titleStr} | Poppa's Wooden Creations`;
      }
    } else {
      // ✅ FIX: Default homepage title (57 characters)
      document.title = "Handmade Wooden Toys NZ | Montessori Toys | Poppa's Wooden Creations";
    }

    // ✅ FIX: Shortened default description (155 characters)
    const defaultDescription = description || "Handcrafted wooden toys from native NZ timber. Trusted by Montessori schools. Shop baby toys, trucks & kitchenware. Made in Whangarei since 2015.";
    
    // Update meta tags - ALL SAFE NOW
    updateMetaTag('name', 'description', defaultDescription);
    updateMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    
    // Open Graph tags
    updateMetaTag('property', 'og:title', title || document.title);
    updateMetaTag('property', 'og:description', defaultDescription);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', type);
    if (image) {
      updateMetaTag('property', 'og:image', image);
    }

    // Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title || document.title);
    updateMetaTag('name', 'twitter:description', defaultDescription);
    if (image) {
      updateMetaTag('name', 'twitter:image', image);
    }

    // Handle canonical link - PREVENT DUPLICATES
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
    const pathname = location.pathname.replace(/\/$/, '');
    const canonicalUrl = props.canonical || `${baseUrl}${pathname}`;

    // ✅ FIX: Set title - PREVENT DUPLICATION
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

    // ✅ FIX: Shortened description
    const defaultDescription = props.description || "Handcrafted wooden toys from native NZ timber. Trusted by Montessori schools. Shop baby toys, trucks & kitchenware. Made in Whangarei since 2015.";

    // Meta tags
    updateMetaTag('name', 'description', defaultDescription);
    updateMetaTag('name', 'robots', props.noindex ? 'noindex, nofollow' : 'index, follow');
    
    // OG tags
    updateMetaTag('property', 'og:title', props.title || document.title);
    updateMetaTag('property', 'og:description', defaultDescription);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', props.type || 'website');
    if (props.image) {
      updateMetaTag('property', 'og:image', props.image);
    }

    // Twitter tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', props.title || document.title);
    updateMetaTag('name', 'twitter:description', defaultDescription);
    if (props.image) {
      updateMetaTag('name', 'twitter:image', props.image);
    }

    // Canonical - PREVENT DUPLICATES
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
