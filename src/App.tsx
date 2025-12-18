import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './pages/ProductDetail.tsx';
import AboutSection from './components/AboutSection';
import ContactForm from './components/ContactForm';
import ShippingInfo from './components/ShippingInfo';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ReviewsSection from './components/Reviews/ReviewsSection';
import Cart from './components/Cart/Cart';
import AdminDashboard from './components/Admin/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { BlogListView } from './pages/blog/BlogListView';
import { BlogPostView } from './pages/blog/BlogPostView';

import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { categories } from './data/products';
import { Product } from './types';

// Main App Content Component
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const { products, loading, error, loadProducts } = useProducts();
  const { cart, addToCart, updateQuantity, removeFromCart, getCartItemCount } = useCart();

  const handleCategorySelect = (category: string) => {
    navigate(`/${category}`);
  };

  const handleProductSelect = (product: Product) => {
    addToCart(product);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleBlogPostSelect = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

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

  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onShowAdmin={() => setShowAdmin(true)}
        onShowCart={() => setShowCart(true)}
        cartItemCount={getCartItemCount()}
      />
      
      <main>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={
            <>
              <Hero onCategorySelect={handleCategorySelect} products={products} />
              <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
              <ProductGrid 
                products={featuredProducts} 
                onProductSelect={handleProductSelect}
                onAddToCart={handleAddToCart}
              />
            </>
          } />

          {/* Individual Product Pages */}
          <Route path="/products/:productId" element={
            <ProductDetail 
              products={products}
              onAddToCart={handleAddToCart}
            />
          } />

          {/* Category Pages */}
          <Route path="/wooden-vehicles" element={
            <ProductGrid 
              products={products.filter(p => p.category === 'wooden-vehicles')} 
              onProductSelect={handleProductSelect}
              onAddToCart={handleAddToCart}
              category="wooden-vehicles"
            />
          } />

          <Route path="/wooden-planes-helicopters" element={
            <ProductGrid 
              products={products.filter(p => p.category === 'wooden-planes-helicopters')} 
              onProductSelect={handleProductSelect}
              onAddToCart={handleAddToCart}
              category="wooden-planes-helicopters"
            />
          } />

          <Route path="/wooden-tractors-boats" element={
            <ProductGrid 
              products={products.filter(p => p.category === 'wooden-tractors-boats')} 
              onProductSelect={handleProductSelect}
              onAddToCart={handleAddToCart}
              category="wooden-tractors-boats"
            />
          } />

          <Route path="/wooden-baby-toys" element={
            <ProductGrid 
              products={products.filter(p => p.category === 'wooden-baby-toys')} 
              onProductSelect={handleProductSelect}
              onAddToCart={handleAddToCart}
              category="wooden-baby-toys"
            />
          } />

          <Route path="/wooden-kitchen-utensils" element={
            <ProductGrid 
              products={products.filter(p => p.category === 'wooden-kitchen-utensils')} 
              onProductSelect={handleProductSelect}
              onAddToCart={handleAddToCart}
              category="wooden-kitchen-utensils"
            />
          } />

          <Route path="/wooden-serving-boards" element={
            <ProductGrid 
              products={products.filter(p => p.category === 'wooden-serving-boards')} 
              onProductSelect={handleProductSelect}
              onAddToCart={handleAddToCart}
              category="wooden-serving-boards"
            />
          } />

          {/* Info Pages */}
          <Route path="/about" element={<AboutSection />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/reviews" element={<ReviewsSection />} />

          {/* Blog Pages */}
          <Route path="/blog" element={
            <BlogListView 
              onPostSelect={handleBlogPostSelect} 
              onNavigate={handleCategorySelect} 
            />
          } />
          
          <Route path="/blog/:slug" element={
            <BlogPostView 
              slug={null}
              onNavigate={handleCategorySelect} 
              onPostSelect={handleBlogPostSelect} 
            />
          } />
        </Routes>
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
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
