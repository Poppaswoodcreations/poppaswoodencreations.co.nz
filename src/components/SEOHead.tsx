import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'product' | 'article';
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = '',
  description = '',
  keywords = 'handcrafted wooden toys, New Zealand, eco-friendly, Montessori, heirloom toys',
  image = 'https://poppaswoodencreations.co.nz/og-image.jpg',
  noindex = false,
  type = 'website'
}) => {
  const location = useLocation();
  const baseUrl = 'https://poppaswoodencreations.co.nz';
  
  // Clean the pathname - remove trailing slashes for canonical
  const cleanPathname = location.pathname.replace(/\/$/, '') || '/';
  const canonicalUrl = `${baseUrl}${cleanPathname}`;
  
  const siteName = "Poppa's Wooden Creations";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "Handcrafted wooden toys and kitchenware made in Whangarei, New Zealand. Heirloom quality products from native NZ timbers including Kauri, Rimu, and Macrocarpa.";
  const metaDescription = description || defaultDescription;

  // Determine robots meta tag
  // Only noindex for: privacy, terms, cart, and admin pages
  const shouldNoindex = noindex || 
    cleanPathname === '/privacy' || 
    cleanPathname === '/terms' || 
    cleanPathname === '/cart' ||
    cleanPathname.startsWith('/admin');

  const robotsContent = shouldNoindex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      
      {/* CRITICAL: Robots Meta Tag - Always Present */}
      <meta name="robots" content={robotsContent} />
      
      {/* CRITICAL: Canonical URL - Always Present, No Trailing Slash */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="author" content="Poppa's Wooden Creations" />
      <meta name="geo.region" content="NZ-NTL" />
      <meta name="geo.placename" content="Whangarei" />
      <meta name="geo.position" content="-35.7256;174.3186" />
      <meta name="ICBM" content="-35.7256, 174.3186" />
    </Helmet>
  );
};

export default SEOHead;
