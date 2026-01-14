import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  noindex?: boolean;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  structuredData?: any[]; // Array of schema objects
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  noindex = false,
  canonicalPath,
  ogImage,
  ogType = 'website',
  structuredData
}) => {
  const location = useLocation();
  const baseUrl = 'https://poppaswoodencreations.co.nz';
  
  // Remove trailing slash and use provided path or current location
  const cleanPath = (canonicalPath || location.pathname).replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}${cleanPath}`;
  
  const pageTitle = title 
    ? `${title} | Poppa's Wooden Creations`
    : "Poppa's Wooden Creations - Premium Handcrafted Wooden Toys Made in New Zealand";
  
  const pageDescription = description || 
    "Discover premium handcrafted wooden toys made in New Zealand from native Kauri, Rimu, and Macrocarpa timber. Safe, sustainable, and educational toys for children. Free shipping on orders over $1000.";

  const defaultOgImage = `${baseUrl}/og-default.jpg`;
  const ogImageUrl = ogImage || defaultOgImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Poppa's Wooden Creations" />
      <meta property="og:locale" content="en_NZ" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Additional SEO */}
      <meta name="author" content="Poppa's Wooden Creations" />
      <meta name="geo.region" content="NZ-NTL" />
      <meta name="geo.placename" content="Whangarei" />
      
      {/* Structured Data */}
      {structuredData && structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
