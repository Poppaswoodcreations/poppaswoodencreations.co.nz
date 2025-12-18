import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords,
  image = 'https://poppaswoodencreations.co.nz/FB_IMG_1640827671355.jpg',
  type = 'website'
}) => {
  const location = useLocation();
  const baseUrl = 'https://poppaswoodencreations.co.nz';
  const canonicalUrl = `${baseUrl}${location.pathname}`;

  // Default meta data
  const defaultTitle = 'Poppa\'s Wooden Creations | Handcrafted Wooden Toys & Kitchen Utensils | Whangarei, NZ';
  const defaultDescription = 'Premium handcrafted wooden toys and kitchen utensils made in Whangarei, New Zealand. Using native timbers including Kauri, Rimu, and Macrocarpa. Safe, sustainable, and built to last generations.';
  const defaultKeywords = 'wooden toys New Zealand, handcrafted toys, Montessori toys, wooden kitchen utensils, native timber, Kauri, Rimu, Macrocarpa, Whangarei';

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;

  // Get page-specific schema based on route
  const getSchemaMarkup = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Poppa's Wooden Creations",
      "image": image,
      "description": pageDescription,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "102 Kiripaka Road",
        "addressLocality": "Whangarei",
        "addressRegion": "Northland",
        "addressCountry": "NZ"
      },
      "url": canonicalUrl,
      "telephone": "+64-9-430-4321",
      "priceRange": "$$",
      "openingHours": "Mo-Fr 09:00-17:00"
    };

    // Add breadcrumb for non-home pages
    if (location.pathname !== '/') {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          ...pathSegments.map((segment, index) => ({
            "@type": "ListItem",
            "position": index + 2,
            "name": segment.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            "item": `${baseUrl}/${pathSegments.slice(0, index + 1).join('/')}`
          }))
        ]
      };

      return [baseSchema, breadcrumbList];
    }

    return baseSchema;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      
      {/* Canonical URL - CRITICAL FOR SEO */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Poppa's Wooden Creations" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Poppa's Wooden Creations" />
      <meta name="geo.region" content="NZ-NTL" />
      <meta name="geo.placename" content="Whangarei" />
      <meta name="geo.position" content="-35.7252;174.3183" />
      <meta name="ICBM" content="-35.7252, 174.3183" />
      
      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getSchemaMarkup())}
      </script>
    </Helmet>
  );
};

export default SEO;
