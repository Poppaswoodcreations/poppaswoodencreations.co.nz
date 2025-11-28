import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  currentPage?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Poppa's Wooden Creations - Handcrafted Wooden Toys NZ",
  description = "Discover premium handcrafted wooden toys and kitchenware made with love in New Zealand. Safe, sustainable, and built to last. Free shipping over $150 NZD.",
  keywords = "wooden toys, handcrafted toys, New Zealand made, sustainable toys, children toys, wooden kitchenware, safe toys, eco-friendly toys",
  currentPage = "home"
}) => {
  // Get the actual current URL from the browser
  const getCanonicalUrl = () => {
    // Use window.location for the actual URL
    const currentPath = window.location.pathname;
    const baseUrl = 'https://poppaswoodencreations.co.nz';
    
    // Homepage
    if (currentPath === '/' || currentPath === '') {
      return baseUrl;
    }
    
    // Remove trailing slash and construct canonical URL
    const cleanPath = currentPath.replace(/\/$/, '');
    return `${baseUrl}${cleanPath}`;
  };
  
  const canonicalUrl = getCanonicalUrl();
  
  // Generate page-specific titles based on current page
  const getPageTitle = () => {
    if (currentPage === 'home' || currentPage === '') {
      return title;
    }
    
    // Category page titles
    const categoryTitles: { [key: string]: string } = {
      'wooden-trains': 'Wooden Train Sets | Handcrafted in NZ | Poppa\'s Wooden Creations',
      'wooden-baby-toys': 'Safe Wooden Baby Toys | Made in NZ | Poppa\'s Wooden Creations',
      'wooden-trucks': 'Wooden Toy Trucks | Handcrafted in NZ | Poppa\'s Wooden Creations',
      'wooden-cars': 'Wooden Toy Cars | Handcrafted in NZ | Poppa\'s Wooden Creations',
      'wooden-planes-helicopters': 'Wooden Planes & Helicopters | Made in NZ | Poppa\'s Wooden Creations',
      'wooden-kitchenware': 'Wooden Kitchenware | Handcrafted in NZ | Poppa\'s Wooden Creations',
      'wooden-tractors-boats': 'Wooden Tractors & Boats | Made in NZ | Poppa\'s Wooden Creations',
      'wooden-other-toys': 'Unique Wooden Toys | Handcrafted in NZ | Poppa\'s Wooden Creations',
      'about': 'About Us | Poppa\'s Wooden Creations',
      'contact': 'Contact Us | Poppa\'s Wooden Creations',
      'shipping': 'Shipping Information | Poppa\'s Wooden Creations',
      'privacy': 'Privacy Policy | Poppa\'s Wooden Creations',
      'terms': 'Terms of Service | Poppa\'s Wooden Creations',
      'reviews': 'Customer Reviews | Poppa\'s Wooden Creations',
      'blog': 'Blog | Poppa\'s Wooden Creations'
    };
    
    return categoryTitles[currentPage] || title;
  };
  
  const pageTitle = getPageTitle();
  
  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://poppaswoodencreations.co.nz/images/image copy copy copy copy copy copy.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Handcrafted wooden toys by Poppa's Wooden Creations" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://poppaswoodencreations.co.nz/images/image copy copy copy copy copy copy.png" />
      <meta name="twitter:image:alt" content="Handcrafted wooden toys by Poppa's Wooden Creations" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Poppa's Wooden Creations",
          "description": "Premium handcrafted wooden toys and kitchenware made in New Zealand",
          "url": "https://poppaswoodencreations.co.nz",
          "logo": "https://poppaswoodencreations.co.nz/images/image copy copy copy copy copy copy.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+64-21-022-8166",
            "contactType": "customer service",
            "email": "poppas.wooden.creations@gmail.com"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "102 Kiripaka Rd",
            "addressLocality": "Whangarei",
            "addressRegion": "Northland",
            "postalCode": "0110",
            "addressCountry": "NZ"
          },
          "areaServed": [
            {
              "@type": "Country",
              "name": "New Zealand"
            },
            {
              "@type": "Country", 
              "name": "Australia"
            },
            {
              "@type": "Country",
              "name": "United States"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "150"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
