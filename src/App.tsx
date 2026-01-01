import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Components that are needed immediately (above the fold)
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead'; // Import SEOHead

// Lazy load components that aren't needed for initial render
const ProductGrid = lazy(() => import('./components/ProductGrid'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const ShippingInfo = lazy(() => import('./components/ShippingInfo'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const ReviewsSection = lazy(() => import('./components/Reviews/ReviewsSection'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));
const BlogListView = lazy(() => import('./pages/blog/BlogListView'));
const BlogPostView = lazy(() => import('./pages/blog/BlogPostView'));

import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { categories } from './data/products';
import { Product } from './types';

// Loading component for lazy-loaded routes
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 mt-4">Loading...</p>
    </div>
  </div>
);

// Smaller loading component for modals
const ModalLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Blog Post Wrapper Component - Gets slug from URL
const BlogPostWrapper: React.FC = () => {
  const { slug } = useParams();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BlogPostView />
    </Suspense>
  );
};

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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={
              <>
                <SEOHead 
                  title="Home - Premium Handcrafted Wooden Toys"
                  description="Premium handcrafted wooden toys made in New Zealand from native timbers. Safe, sustainable, and built to last generations."
                />
                <Hero onCategorySelect={handleCategorySelect} products={products} />
                <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
                <ProductGrid 
                  products={featuredProducts} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                />
              </>
            } />

            {/* Individual Product Pages - ProductDetail has its own SEO */}
            <Route path="/products/:productId" element={
              <ProductDetail 
                products={products}
                onAddToCart={handleAddToCart}
              />
            } />

            {/* Category Pages - Main Categories */}
            <Route path="/wooden-vehicles" element={
              <>
                <SEOHead 
                  title="Wooden Vehicles"
                  description="Handcrafted wooden toy vehicles made from New Zealand native timber"
                  canonicalPath="/wooden-vehicles"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-vehicles')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-vehicles"
                />
              </>
            } />

            <Route path="/wooden-planes-helicopters" element={
              <>
                <SEOHead 
                  title="Wooden Planes & Helicopters"
                  description="Handcrafted wooden toy planes and helicopters made from New Zealand native timber"
                  canonicalPath="/wooden-planes-helicopters"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-planes-helicopters')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-planes-helicopters"
                />
              </>
            } />

            <Route path="/wooden-tractors-boats" element={
              <>
                <SEOHead 
                  title="Wooden Tractors & Boats"
                  description="Handcrafted wooden toy tractors and boats made from New Zealand native timber"
                  canonicalPath="/wooden-tractors-boats"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-tractors-boats')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-tractors-boats"
                />
              </>
            } />

            <Route path="/wooden-baby-toys" element={
              <>
                <SEOHead 
                  title="Wooden Baby Toys"
                  description="Safe, handcrafted wooden baby toys made from New Zealand native timber with non-toxic finishes"
                  canonicalPath="/wooden-baby-toys"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-baby-toys')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-baby-toys"
                />
              </>
            } />

            <Route path="/wooden-kitchen-utensils" element={
              <>
                <SEOHead 
                  title="Wooden Kitchen Utensils"
                  description="Handcrafted wooden kitchen utensils made from New Zealand native timber"
                  canonicalPath="/wooden-kitchen-utensils"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-kitchen-utensils')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-kitchen-utensils"
                />
              </>
            } />

            <Route path="/wooden-serving-boards" element={
              <>
                <SEOHead 
                  title="Wooden Serving Boards"
                  description="Handcrafted wooden serving boards made from New Zealand native timber"
                  canonicalPath="/wooden-serving-boards"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-serving-boards')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-serving-boards"
                />
              </>
            } />

            {/* Additional Category Routes */}
            <Route path="/trucks" element={
              <>
                <SEOHead canonicalPath="/wooden-trucks" />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-trucks')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-trucks"
                />
              </>
            } />

            <Route path="/wooden-trucks" element={
              <>
                <SEOHead 
                  title="Wooden Trucks"
                  description="Handcrafted wooden toy trucks made from New Zealand native timber"
                  canonicalPath="/wooden-trucks"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-trucks')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-trucks"
                />
              </>
            } />

            <Route path="/cars" element={
              <>
                <SEOHead canonicalPath="/wooden-cars" />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-cars')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-cars"
                />
              </>
            } />

            <Route path="/wooden-cars" element={
              <>
                <SEOHead 
                  title="Wooden Cars"
                  description="Handcrafted wooden toy cars made from New Zealand native timber"
                  canonicalPath="/wooden-cars"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-cars')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-cars"
                />
              </>
            } />

            <Route path="/planes" element={
              <>
                <SEOHead canonicalPath="/wooden-planes-helicopters" />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-planes-helicopters')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-planes-helicopters"
                />
              </>
            } />

            <Route path="/kitchen" element={
              <>
                <SEOHead canonicalPath="/wooden-kitchenware" />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-kitchenware')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-kitchenware"
                />
              </>
            } />

            <Route path="/wooden-kitchenware" element={
              <>
                <SEOHead 
                  title="Wooden Kitchenware"
                  description="Handcrafted wooden kitchenware made from New Zealand native timber"
                  canonicalPath="/wooden-kitchenware"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-kitchenware')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-kitchenware"
                />
              </>
            } />

            <Route path="/trains" element={
              <>
                <SEOHead canonicalPath="/wooden-trains" />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-trains')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-trains"
                />
              </>
            } />

            <Route path="/wooden-trains" element={
              <>
                <SEOHead 
                  title="Wooden Trains"
                  description="Handcrafted wooden toy trains made from New Zealand native timber"
                  canonicalPath="/wooden-trains"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-trains')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-trains"
                />
              </>
            } />

            {/* Info Pages - NOINDEX */}
            <Route path="/about" element={
              <>
                <SEOHead title="About Us" description="Learn about Poppa's Wooden Creations" />
                <AboutSection />
              </>
            } />

            <Route path="/contact" element={
              <>
                <SEOHead title="Contact Us" description="Get in touch with Poppa's Wooden Creations" />
                <ContactForm />
              </>
            } />

            <Route path="/shipping" element={
              <>
                <SEOHead title="Shipping Information" description="Shipping and delivery information" />
                <ShippingInfo />
              </>
            } />

            <Route path="/privacy" element={
              <>
                <SEOHead title="Privacy Policy" noindex={true} />
                <PrivacyPolicy />
              </>
            } />

            <Route path="/terms" element={
              <>
                <SEOHead title="Terms of Service" noindex={true} />
                <TermsOfService />
              </>
            } />

            <Route path="/reviews" element={
              <>
                <SEOHead title="Customer Reviews" description="Read reviews from our happy customers" />
                <ReviewsSection />
              </>
            } />

            {/* Blog Pages */}
            <Route path="/blog" element={
              <>
                <SEOHead title="Blog" description="Tips and guides for wooden toys and parenting" />
                <BlogListView />
              </>
            } />
            
            <Route path="/blog/:slug" element={
              <BlogPostWrapper />
            } />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
      
      {/* Cart Modal - NOINDEX */}
      {showCart && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <SEOHead noindex={true} />
          <Cart
            items={cart}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
          />
        </Suspense>
      )}
      
      {/* Admin Dashboard Modal - NOINDEX */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50" style={{ zIndex: 9999 }}>
          <Suspense fallback={<ModalLoadingFallback />}>
            <SEOHead noindex={true} />
            <AdminDashboard
              products={products}
              onProductsUpdate={async () => {
                await loadProducts();
              }}
              onClose={() => setShowAdmin(false)}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
