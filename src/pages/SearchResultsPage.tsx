import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductSearch from '../components/ProductSearch';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const searchTerm = searchParams.get('q') || '';

  useEffect(() => {
    fetchProducts();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItemCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    };
    
    handleCartUpdate();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
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
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    // Get existing cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    // Save and update
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartItemCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    
    // Dispatch event for other components
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleShowAdmin = () => {
    console.log('Admin clicked');
  };

  const handleShowCart = () => {
    setShowCart(!showCart);
  };

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
      <Header 
        onShowAdmin={handleShowAdmin}
        onShowCart={handleShowCart}
        cartItemCount={cartItemCount}
      />
      
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <ProductSearch
          products={products}
          onProductSelect={handleProductSelect}
          onAddToCart={handleAddToCart}
          initialSearchTerm={searchTerm}
        />
      )}
      
      <Footer />
    </>
  );
};

export default SearchResultsPage;
