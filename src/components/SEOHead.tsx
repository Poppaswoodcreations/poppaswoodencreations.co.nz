import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonicalPath?: string;
  noindex?: boolean;
  ogType?: 'website' | 'product' | 'article';
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = '',
  description = '',
  keywords = 'handcrafted wooden toys, New Zealand, eco-friendly, Montessori, heirloom toys',
  image = 'https://poppaswoodencreations.co.nz/og-image.jpg',
  canonicalPath = '',
  noindex = false,
  ogType = 'website'
}) => {
  const baseUrl = 'https://poppaswoodencreations.co.nz';
  const siteName = "Poppa's Wooden Creations";
  
  const canonicalUrl = canonicalPath 
    ? `${baseUrl}${canonicalPath}`
    : baseUrl;
  
  const pageTitle = title 
    ? `${title} | ${siteName}`
    : "Handmade Wooden Toys NZ | Poppa's Creations";
  
  const defaultDesc = "Handcrafted wooden toys from native NZ timber. Trusted by Montessori schools. Shop baby toys, trucks & kitchenware. Made in Whangarei.";
  const pageDescription = description || defaultDesc;
  
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
  
  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />
      
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEOHead;
