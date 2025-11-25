import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ProductGrid from './components/ProductGrid';
import AboutSection from './components/AboutSection';
import ContactForm from './components/ContactForm';
import ShippingInfo from './components/ShippingInfo';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ReviewsSection from './components/Reviews/ReviewsSection';
import Cart from './components/Cart/Cart';
import AdminDashboard from './components/Admin/AdminDashboard';
import SEO from './components/SEO';
import ErrorBoundary from './components/ErrorBoundary';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { categories } from './data/products';
import { Product } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const { products, loading, error, loadProducts } = useProducts();
  const { cart, addToCart, updateQuantity, removeFromCart, getCartItemCount } = useCart();


  const handleCategorySelect = (category: string) => {
    setCurrentView(category);
  };

  const handleProductSelect = (product: Product) => {
    addToCart(product);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const filteredProducts = currentView === 'home' 
    ? products.filter(p => p.featured).slice(0, 8)
    : products.filter(p => p.category === currentView);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">🪵</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Poppa's Wooden Creations</h1>
            <p className="text-xl text-gray-600 mb-8">Handcrafted in New Zealand</p>
            <div className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Loading website...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Loading Error</h1>
            <p className="text-xl text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onCategorySelect={handleCategorySelect} products={products} />
            <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
            <ProductGrid 
              products={filteredProducts} 
              onProductSelect={handleProductSelect}
              onAddToCart={handleAddToCart}
            />
          </>
        );
      case 'about':
        return <AboutSection />;
      case 'contact':
        return <ContactForm />;
      case 'shipping':
        return <ShippingInfo />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'reviews':
        return <ReviewsSection />;
      default:
        return (
          <ProductGrid 
            products={filteredProducts} 
            onProductSelect={handleProductSelect}
            onAddToCart={handleAddToCart}
            category={currentView}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <SEO currentPage={currentView} />
      <div className="min-h-screen bg-gray-50">
        <Header 
          onCategorySelect={handleCategorySelect}
          onShowAdmin={() => setShowAdmin(true)}
          onShowCart={() => setShowCart(true)}
          cartItemCount={getCartItemCount()}
        />
        
        <main>
          {renderContent()}
        </main>
        
        <Footer />
        
        {/* Cart Modal */}
        {showCart && (
          <Cart
            items={cart}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
          />
        )}
        
        {/* Admin Dashboard Modal */}
        {showAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50" style={{ zIndex: 9999 }}>
          <AdminDashboard
            products={products}
            onProductsUpdate={async () => {
              await loadProducts();
            }}
            onClose={() => setShowAdmin(false)}
          />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;