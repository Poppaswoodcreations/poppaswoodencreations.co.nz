import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
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
import ErrorMonitor from './components/ErrorMonitor';

// Lazy load components that aren't needed for initial render
const ProductGrid = lazy(() => import('./components/ProductGrid'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const ProductSearch = lazy(() => import('./components/ProductSearch'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const ShippingPolicy = lazy(() => import('./components/ShippingPolicy'));
const ReturnsRefunds = lazy(() => import('./components/ReturnsRefunds'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const ReviewsSection = lazy(() => import('./components/ReviewsSection'));
const Reviews = lazy(() => import('./components/Reviews'));
const FeaturedReviews = lazy(() => import('./components/FeaturedReviews'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));
const BlogListView = lazy(() => import('./pages/blog/BlogListView'));
const BlogPostView = lazy(() => import('./pages/blog/BlogPostView'));
const WoodenToysNZ = lazy(() => import('./pages/WoodenToysNZ'));
const ReviewForm = lazy(() => import('./components/ReviewForm'));
const ReviewsAdmin = lazy(() => import('./components/ReviewsAdmin'));

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

// Blog Post Wrapper Component
const BlogPostWrapper: React.FC = () => {
  const { slug } = useParams();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BlogPostView />
    </Suspense>
  );
};

// Search Page Wrapper Component
const SearchPageWrapper: React.FC<{ products: Product[], onProductSelect: (p: Product) => void, onAddToCart: (p: Product) => void }> = ({ products, onProductSelect, onAddToCart }) => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  
  return (
    <ProductSearch
      products={products}
      onProductSelect={onProductSelect}
      onAddToCart={onAddToCart}
      initialSearchTerm={searchTerm}
    />
  );
};

// Track pageviews on route changes
function usePageTracking() {
  const location = useLocation();
  
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'G-VM9XERD2RB', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}

// Main App Content Component
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Track pageviews
  usePageTracking();
  
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

  const featuredProducts = products;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onShowAdmin={() => setShowAdmin(true)}
        onShowCart={() => setShowCart(true)}
        cartItemCount={getCartItemCount()}
      />
      <ErrorMonitor />
      
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={
              <>
                <SEOHead 
                  title="Handmade Wooden Toys NZ"
                  description="Premium handcrafted wooden toys from native NZ timber. Safe, sustainable, educational. Trusted by Montessori schools. Free shipping over $150."
                  image="https://poppaswoodencreations.co.nz/hero-image.jpg"
                  canonicalPath="/"
                />
                <HomePageSchema />
                <Hero onCategorySelect={handleCategorySelect} products={products} />
                <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
                <ProductGrid 
                  products={featuredProducts} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                />
                <FeaturedReviews />
              </>
            } />

            {/* SEO Landing Page */}
            <Route path="/wooden-toys-nz" element={
              <>
                <SEOHead 
                  title="Wooden Toys NZ - Handcrafted Native Timber Toys"
                  description="Premium handcrafted wooden toys made in New Zealand from native Kauri, Rimu & Macrocarpa. Trusted by Montessori schools nationwide."
                  canonicalPath="/wooden-toys-nz"
                  ogType="website"
                />
                <WoodenToysNZ />
              </>
            } />

            {/* All Products Page */}
            <Route path="/products" element={
              <>
                <SEOHead 
                  title="All Products - Wooden Toys & Kitchenware"
                  description="Browse our complete collection of handcrafted wooden toys and kitchenware made from New Zealand native timber."
                  canonicalPath="/products"
                  ogType="website"
                />
                <ProductGrid 
                  products={products} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                />
              </>
            } />

            {/* Product Detail Pages */}
            <Route path="/products/:productId" element={
              <ProductDetail 
                products={products}
                onAddToCart={handleAddToCart}
              />
            } />

            {/* Category Pages */}
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

            {/* Redirect old/incorrect URLs to correct pages */}
            <Route path="/wooden-other-toys" element={
              <>
                <SEOHead 
                  title="Wooden Toys"
                  canonicalPath="/products"
                  ogType="website"
                />
                <ProductGrid 
                  products={products} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                />
              </>
            } />

            <Route path="/kitchen-utensils" element={
              <>
                <SEOHead 
                  title="Wooden Kitchenware"
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

            {/* Info Pages */}
            <Route path="/about" element={
              <>
                <SEOHead 
                  title="About Us - Handcrafted in Whangarei"
                  description="Learn about Poppa's Wooden Creations. Handcrafting premium wooden toys and kitchenware in Whangarei since 2015."
                  canonicalPath="/about"
                  ogType="website"
                />
                <AboutSection />
              </>
            } />

            <Route path="/contact" element={
              <>
                <SEOHead 
                  title="Contact Us - Get in Touch"
                  description="Get in touch with Poppa's Wooden Creations. We're here to help with orders, custom requests, and questions."
                  canonicalPath="/contact"
                  ogType="website"
                />
                <ContactForm />
              </>
            } />

            {/* POLICY PAGES */}
            <Route path="/shipping" element={
              <>
                <SEOHead 
                  title="Shipping Policy | Poppa's Wooden Creations"
                  description="Learn about our worldwide shipping, delivery times, and free shipping offers for handcrafted wooden toys from New Zealand."
                  canonicalPath="/shipping"
                  ogType="website"
                />
                <ShippingPolicy />
              </>
            } />

            <Route path="/returns" element={
              <>
                <SEOHead 
                  title="Returns & Refunds Policy | Poppa's Wooden Creations"
                  description="Our 30-day return policy and quality guarantee for handcrafted wooden toys. Easy returns, full refunds, and lifetime craftsmanship guarantee."
                  canonicalPath="/returns"
                  ogType="website"
                />
                <ReturnsRefunds />
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

            {/* REVIEWS PAGES */}
            <Route path="/reviews" element={
              <>
                <SEOHead 
                  title="Customer Reviews - 5.0/5 Stars"
                  description="Read all 23 verified reviews from our happy customers. 13 Google reviews and 10 website reviews for our handcrafted wooden toys and kitchenware."
                  canonicalPath="/reviews"
                  ogType="website"
                />
                <Reviews />
              </>
            } />

            {/* Customer Review Submission Form */}
            <Route path="/write-review" element={
              <>
                <SEOHead 
                  title="Write a Review - Share Your Experience"
                  description="Share your experience with Poppa's Wooden Creations. Your feedback helps other families discover our handcrafted wooden toys."
                  canonicalPath="/write-review"
                  ogType="website"
                />
                <ReviewForm />
              </>
            } />

            {/* Admin Reviews Management */}
            <Route path="/admin/reviews" element={
              <>
                <SEOHead title="Manage Reviews" noindex={true} />
                <ReviewsAdmin />
              </>
            } />

            {/* Search Page */}
            <Route path="/search" element={
              <>
                <SEOHead 
                  title="Search Products | Poppa's Wooden Creations"
                  description="Search our collection of handcrafted wooden toys made in New Zealand"
                  canonicalPath="/search"
                  ogType="website"
                />
                <SearchPageWrapper 
                  products={products}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                />
              </>
            } />

            {/* Blog Pages */}
            <Route path="/blog" element={
              <>
                <SEOHead 
                  title="Blog - Wooden Toy Tips & Parenting Guides"
                  description="Tips and guides for wooden toys, Montessori education, and sustainable parenting. Expert advice from Poppa's Wooden Creations."
                  canonicalPath="/blog"
                  ogType="website"
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
      
      <PoppaChatbot />
      
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
