import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  noindex?: boolean;
  canonicalPath?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  noindex = false,
  canonicalPath 
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
    "Discover premium handcrafted wooden toys made in New Zealand. Safe, durable, and educational toys for children of all ages. Free shipping on orders over $150.";

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
    </Helmet>
  );
};

export default SEOHead;
