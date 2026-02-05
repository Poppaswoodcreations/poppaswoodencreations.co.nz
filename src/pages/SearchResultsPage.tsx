import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductSearch from '../components/ProductSearch';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchTerm = searchParams.get('q') || '';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    // Add to cart functionality
    const event = new CustomEvent('addToCart', { detail: product });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const pageTitle = searchTerm 
    ? `Search Results for "${searchTerm}" | Poppa's Wooden Creations`
    : 'Search Products | Poppa\'s Wooden Creations';
    
  const pageDescription = searchTerm
    ? `Find handcrafted wooden toys matching "${searchTerm}" from Poppa's Wooden Creations`
    : 'Search our collection of handcrafted wooden toys made in New Zealand';

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={`https://poppaswoodencreations.co.nz/search${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''}`}
      />
      <ProductSearch
        products={products}
        onProductSelect={handleProductSelect}
        onAddToCart={handleAddToCart}
        initialSearchTerm={searchTerm}
      />
    </>
  );
};

export default SearchResultsPage;
