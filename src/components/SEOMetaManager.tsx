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
    // Update title
    document.title = title;

    // Helper function to safely update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      
      // Remove ALL existing tags with this property/name (including those with data-rh="true")
      const existingTags = document.querySelectorAll(`meta[${attribute}="${property}"]`);
      existingTags.forEach(tag => tag.remove());
      
      // Create new tag
      const meta = document.createElement('meta');
      meta.setAttribute(attribute, property);
      meta.setAttribute('content', content);
      meta.setAttribute('data-rh', 'true');
      document.head.appendChild(meta);
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');

    // Update Open Graph tags
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', canonicalUrl || `https://poppaswoodencreations.co.nz${location.pathname}`, true);
    updateMetaTag('og:site_name', 'Poppa\'s Wooden Creations', true);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Update other important meta tags
    updateMetaTag('author', 'Poppa\'s Wooden Creations');
    updateMetaTag('geo.region', 'NZ-NTL');
    updateMetaTag('geo.placename', 'Whangarei');
    updateMetaTag('geo.position', '-35.7256;174.3186');
    updateMetaTag('ICBM', '-35.7256, 174.3186');

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

export default SEOMetaManager;
