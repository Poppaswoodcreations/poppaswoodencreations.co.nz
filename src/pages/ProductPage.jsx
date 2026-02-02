// src/pages/ProductPage.jsx
// Updated with proper canonical URLs and noindex tags

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getRobotsMetaTag, getProductStructuredData } from '../utils/seoUtils';
import { supabase } from '../supabaseClient'; // Adjust import path as needed

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
      // Fetch from Supabase using the product slug (id from URL)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Redirect old URLs
  if (shouldRedirect) {
    return <Navigate to="/products" replace />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const canonicalUrl = getCanonicalUrl(location.pathname);
  const robotsTag = getRobotsMetaTag(location.pathname, id);
  const structuredData = getProductStructuredData(product);

  // Get first image from images array if it exists
  const productImage = product.images?.[0] || product.image_url || '';
  
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
        <meta property="og:image" content={productImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description?.substring(0, 155)} />
        <meta name="twitter:image" content={productImage} />
        
        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      <div className="product-page">
        {/* Your existing product page content - keep your existing JSX below */}
        <div className="product-container">
          <div className="product-image-section">
            {productImage && (
              <img 
                src={productImage} 
                alt={product.name} 
                className="product-image"
              />
            )}
          </div>
          
          <div className="product-info-section">
            <h1>{product.name}</h1>
            
            {product.price && (
              <p className="price">${product.price} NZD</p>
            )}
            
            {product.description && (
              <div className="product-description">
                <p>{product.description}</p>
              </div>
            )}
            
            {product.category && (
              <p className="product-category">
                <strong>Category:</strong> {product.category}
              </p>
            )}
            
            {product.in_stock !== undefined && (
              <p className="stock-status">
                <strong>Availability:</strong> {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </p>
            )}
            
            {product.weight && (
              <p className="product-weight">
                <strong>Weight:</strong> {product.weight}kg
              </p>
            )}

            {/* Add your existing buttons, add to cart, etc. here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
