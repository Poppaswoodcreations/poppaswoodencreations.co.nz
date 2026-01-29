import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Components that are needed immediately (above the fold)
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead';
import PoppaChatbot from './components/PoppaChatbot';
import { HomePageSchema } from './components/HomePageSchema';
import ErrorMonitor from './components/ErrorMonitor';  // ← ADDED THIS LINE

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
const WoodenToysNZ = lazy(() => import('./pages/WoodenToysNZ'));

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

  // ============================================
  // CANONICAL TAG FIX - Updates on route change
  // ============================================
  useEffect(() => {
    const baseUrl = 'https://poppaswoodencreations.co.nz';
    const currentUrl = baseUrl + location.pathname;
    
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    
    if (canonical) {
      canonical.href = currentUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = currentUrl;
      document.head.appendChild(canonical);
    }
  }, [location.pathname]);
  // ============================================
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

  // FIXED: Show all products on homepage, not just 8 featured
  const featuredProducts = products;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onShowAdmin={() => setShowAdmin(true)}
        onShowCart={() => setShowCart(true)}
        cartItemCount={getCartItemCount()}
      />
      <ErrorMonitor />
      {/* ↑ ADDED ERROR MONITOR HERE */}
      
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={
              <>
                <SEOHead 
                  title="Handmade Wooden Toys Whangarei | Montessori Toys NZ | Poppa's Wooden Creations"
                  description="Premium handmade wooden toys crafted in Whangarei from native Kauri, Rimu & Macrocarpa timber. Trusted by Montessori schools and eco-conscious families. Shop childrens wooden toys, baby toys & kitchenware. Free shipping over $1000."
                  ogImage="https://poppaswoodencreations.co.nz/hero-image.jpg"
                />
                <HomePageSchema />
                <Hero onCategorySelect={handleCategorySelect} products={products} />
                <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
                <ProductGrid 
                  products={featuredProducts} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                />
                <ReviewsSection showAddReview={true} />
              </>
            } />

            {/* SEO Landing Page for Wooden Toys NZ */}
            <Route path="/wooden-toys-nz" element={<WoodenToysNZ />} />

            {/* Individual Product Pages */}
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
                  title="Wooden Vehicles - Handcrafted Toy Cars & Trucks"
                  description="Discover our collection of handcrafted wooden toy vehicles made from New Zealand native timber. Safe, durable, and perfect for imaginative play."
                  canonicalPath="/wooden-vehicles"
                  ogType="website"
                />
                <ProductGrid 
                  products={products.filter(p => 
                    p.category === 'wooden-cars' || 
                    p.category === 'wooden-trucks' || 
                    p.category === 'wooden-trains' || 
                    p.category === 'wooden-planes-helicopters'
                  )} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-vehicles"
                />
              </>
            } />

            <Route path="/wooden-planes-helicopters" element={
              <>
                <SEOHead 
                  title="Wooden Planes & Helicopters - Aviation Toys"
                  description="Handcrafted wooden toy planes and helicopters made from New Zealand native timber. Spark imagination with premium quality aviation toys."
                  canonicalPath="/wooden-planes-helicopters"
                  ogType="website"
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
                  title="Wooden Tractors & Boats - Farm & Water Toys"
                  description="Handcrafted wooden toy tractors and boats made from New Zealand native timber. Perfect for farm and water-themed imaginative play."
                  canonicalPath="/wooden-tractors-boats"
                  ogType="website"
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
                  title="Wooden Baby Toys - Safe & Natural"
                  description="Safe, handcrafted wooden baby toys made from New Zealand native timber with non-toxic finishes. Perfect for teething and sensory development."
                  canonicalPath="/wooden-baby-toys"
                  ogType="website"
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
                  title="Wooden Kitchen Utensils - Native NZ Timber"
                  description="Handcrafted wooden kitchen utensils made from New Zealand native timber. Durable, beautiful, and perfect for any kitchen."
                  canonicalPath="/wooden-kitchen-utensils"
                  ogType="website"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-kitchenware')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-kitchen-utensils"
                />
              </>
            } />

            <Route path="/wooden-serving-boards" element={
              <>
                <SEOHead 
                  title="Wooden Serving Boards - Charcuterie & Cheese Boards"
                  description="Handcrafted wooden serving boards made from New Zealand native timber. Perfect for entertaining and gift-giving."
                  canonicalPath="/wooden-serving-boards"
                  ogType="website"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-kitchenware')} 
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
                  title="Wooden Trucks - Toy Trucks & Fire Engines"
                  description="Handcrafted wooden toy trucks made from New Zealand native timber. Durable, realistic, and perfect for construction-themed play."
                  canonicalPath="/wooden-trucks"
                  ogType="website"
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
                  title="Wooden Cars - Classic Toy Cars"
                  description="Handcrafted wooden toy cars made from New Zealand native timber. Timeless designs that encourage creative play."
                  canonicalPath="/wooden-cars"
                  ogType="website"
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
                  title="Wooden Kitchenware - Serving Boards & Utensils"
                  description="Handcrafted wooden kitchenware made from New Zealand native timber. Beautiful, functional, and built to last."
                  canonicalPath="/wooden-kitchenware"
                  ogType="website"
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
                  title="Wooden Trains - Classic Train Sets"
                  description="Handcrafted wooden toy trains made from New Zealand native timber. Build railways and spark imagination."
                  canonicalPath="/wooden-trains"
                  ogType="website"
                />
                <ProductGrid 
                  products={products.filter(p => p.category === 'wooden-trains')} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-trains"
                />
              </>
            } />

            {/* Info Pages */}
            <Route path="/about" element={
              <>
                <SEOHead 
                  title="About Us - Handcrafted in Whangarei"
                  description="Learn about Poppa's Wooden Creations. Handcrafting premium wooden toys and kitchenware in Whangarei since 2015."
                />
                <AboutSection />
              </>
            } />

            <Route path="/contact" element={
              <>
                <SEOHead 
                  title="Contact Us - Get in Touch"
                  description="Get in touch with Poppa's Wooden Creations. We're here to help with orders, custom requests, and questions."
                />
                <ContactForm />
              </>
            } />

            <Route path="/shipping" element={
              <>
                <SEOHead 
                  title="Shipping Information - Free Shipping Over $1000"
                  description="Free shipping on orders over $1000 NZD. Worldwide shipping available. Learn about our shipping rates and delivery times."
                />
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
                <SEOHead 
                  title="Customer Reviews - 4.9/5 Stars"
                  description="Read reviews from our happy customers. Over 150 5-star reviews for our handcrafted wooden toys and kitchenware."
                />
                <ReviewsSection />
              </>
            } />

            {/* Blog Pages */}
            <Route path="/blog" element={
              <>
                <SEOHead 
                  title="Blog - Wooden Toy Tips & Parenting Guides"
                  description="Tips and guides for wooden toys, Montessori education, and sustainable parenting. Expert advice from Poppa's Wooden Creations."
                />
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
      
      {/* AI Chatbot */}
      <PoppaChatbot />
      
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
