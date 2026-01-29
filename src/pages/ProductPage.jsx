// src/components/ProductPage.jsx
// Updated with proper canonical URLs and noindex tags

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getRobotsMetaTag, getProductStructuredData } from '../utils/seoUtils';

const ProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Check if this is an old URL pattern that should redirect
    if (id && (id.startsWith('product-') || id.startsWith('SQ'))) {
      setShouldRedirect(true);
      return;
    }

    // Fetch product data
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // Your existing product fetch logic
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect old URLs
  if (shouldRedirect) {
    return <Navigate to="/products" replace />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const canonicalUrl = getCanonicalUrl(location.pathname);
  const robotsTag = getRobotsMetaTag(location.pathname, id);
  const structuredData = getProductStructuredData(product);

  return (
    <>
      <Helmet>
        <title>{product.name} - Handcrafted NZ Wooden Toy | Poppa's Wooden Creations</title>
        <meta name="description" content={product.description?.substring(0, 155)} />
        <meta name="robots" content={robotsTag} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description?.substring(0, 155)} />
        <meta property="og:image" content={product.image_url} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description?.substring(0, 155)} />
        <meta name="twitter:image" content={product.image_url} />
        
        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      <div className="product-page">
        {/* Your existing product page content */}
        <h1>{product.name}</h1>
        <img src={product.image_url} alt={product.name} />
        <p>{product.description}</p>
        <p className="price">${product.price}</p>
        {/* Rest of your product page */}
      </div>
    </>
  );
};

export default ProductPage;
