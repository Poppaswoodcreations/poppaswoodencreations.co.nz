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
      // Remove trailing slash and create canonical
      const pathname = location.pathname.replace(/\/$/, '');
      canonicalUrl = `${baseUrl}${pathname}`;
    }

    // Set document title
    if (title) {
      document.title = `${title} | Poppa's Wooden Creations`;
    }

    // Update or create meta tags
    updateMetaTag('name', 'description', description || '');
    updateMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    
    // Open Graph tags
    updateMetaTag('property', 'og:title', title || '');
    updateMetaTag('property', 'og:description', description || '');
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', type);
    if (image) {
      updateMetaTag('property', 'og:image', image);
    }

    // Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title || '');
    updateMetaTag('name', 'twitter:description', description || '');
    if (image) {
      updateMetaTag('name', 'twitter:image', image);
    }

    // Handle canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonicalUrl;
      document.head.appendChild(canonicalLink);
    }

    // Cleanup function
    return () => {
      // Optional: cleanup if needed
    };
  }, [title, description, canonical, noindex, image, type, location]);

  return null; // This component doesn't render anything
};

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(attribute: string, value: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
  
  if (element) {
    element.content = content;
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    element.content = content;
    document.head.appendChild(element);
  }
}

/**
 * Hook for easy SEO management in functional components
 */
export const useSEO = (props: SEOMetaProps) => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://poppaswoodencreations.co.nz';
    const pathname = location.pathname.replace(/\/$/, '');
    const canonicalUrl = props.canonical || `${baseUrl}${pathname}`;

    // Set title
    if (props.title) {
      document.title = `${props.title} | Poppa's Wooden Creations`;
    }

    // Meta tags
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

    // Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonicalUrl;
      document.head.appendChild(canonicalLink);
    }
  }, [props, location]);
};

export default SEOMetaManager;
