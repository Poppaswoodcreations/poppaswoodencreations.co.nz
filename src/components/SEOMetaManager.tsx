import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOMetaManagerProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

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

const SEOMetaManager = ({
  title = 'Handmade Wooden Toys NZ | Montessori Toys | Poppa\'s',
  description = 'Premium handmade wooden toys crafted in Whangarei from native Kauri, Rimu & Macrocarpa timber. Trusted by Montessori schools and eco-conscious families. Shop childrens wooden toys, baby toys & kitchenware. Free shipping over $1000.',
  keywords = 'handcrafted wooden toys, New Zealand, eco-friendly, Montessori, heirloom toys',
  ogImage = 'https://poppaswoodencreations.co.nz/og-image.jpg',
  ogType = 'website',
  canonicalUrl,
  structuredData
}: SEOMetaManagerProps) => {
  const location = useLocation();

  useEffect(() => {
    // Update title - DO NOT append "| Poppa's Wooden Creations" as it's already in the title
    document.title = title;

    // Update basic meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'robots', 'index, follow');

    // Update Open Graph tags
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:url', canonicalUrl || `https://poppaswoodencreations.co.nz${location.pathname}`);
    updateMetaTag('property', 'og:site_name', 'Poppa\'s Wooden Creations');

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);

    // Update other important meta tags
    updateMetaTag('name', 'author', 'Poppa\'s Wooden Creations');
    updateMetaTag('name', 'geo.region', 'NZ-NTL');
    updateMetaTag('name', 'geo.placename', 'Whangarei');
    updateMetaTag('name', 'geo.position', '-35.7256;174.3186');
    updateMetaTag('name', 'ICBM', '-35.7256, 174.3186');

    // Update canonical URL - Remove ALL existing canonical links first
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach(link => link.remove());
    
    // Create new canonical link
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', canonicalUrl || `https://poppaswoodencreations.co.nz${location.pathname}`);
    canonical.setAttribute('data-rh', 'true');
    document.head.appendChild(canonical);

    // Update structured data
    if (structuredData) {
      // Remove existing structured data with data-rh attribute
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-rh="true"]');
      existingScripts.forEach(script => script.remove());

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-rh', 'true');
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogImage, ogType, canonicalUrl, structuredData, location.pathname]);

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

    // Set title - append site name if not already present
    if (props.title) {
      const titleText = props.title.includes('Poppa\'s') 
        ? props.title 
        : `${safeString(props.title)} | Poppa's Wooden Creations`;
      document.title = titleText;
    }

    // Meta tags - PREVENTS DUPLICATES
    updateMetaTag('name', 'description', props.description || '');
    updateMetaTag('name', 'robots', props.noindex ? 'noindex, nofollow' : 'index, follow');
    
    // OG tags
    updateMetaTag('property', 'og:title', props.title || '');
    updateMetaTag('property', 'og:description', props.description || '');
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', props.type || 'website');
    if (props.image) {
      updateMetaTag('property', 'og:image', props.image);
    }

    // Twitter tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', props.title || '');
    updateMetaTag('name', 'twitter:description', props.description || '');
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
