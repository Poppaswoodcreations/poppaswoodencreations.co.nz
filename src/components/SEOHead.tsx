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
  
  // Clean pathname - remove trailing slashes
  const cleanPathname = location.pathname.replace(/\/$/, '') || '/';
  const canonicalUrl = `${baseUrl}${cleanPathname}`;
  
  const siteName = "Poppa's Wooden Creations";
  
  // Optimized title - 50-60 characters for Bing/Google
  const fullTitle = title 
    ? (title.includes("Poppa's") || title.includes("Creations") 
        ? title 
        : `${title} | ${siteName}`)
    : "Handmade Wooden Toys NZ | Poppa's Creations";
  
  // Optimized description - 120-155 characters for Bing
  const defaultDescription = "Handcrafted wooden toys from native NZ timber. Trusted by Montessori schools. Shop baby toys, trucks & kitchenware. Made in Whangarei.";
  const metaDescription = description || defaultDescription;
  
  // Robots meta tag
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
      
      {/* Robots & Canonical */}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Geo Tags */}
      <meta name="author" content="Poppa's Wooden Creations" />
      <meta name="geo.region" content="NZ-NTL" />
      <meta name="geo.placename" content="Whangarei" />
      <meta name="geo.position" content="-35.7256;174.3186" />
      <meta name="ICBM" content="-35.7256, 174.3186" />
    </Helmet>
  );
};

export default SEOHead;
