import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Components needed immediately (above the fold)
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead';
import PoppaChatbot from './components/PoppaChatbot';
import { HomePageSchema } from './components/HomePageSchema';
import ErrorMonitor from './components/ErrorMonitor';

// Lazy load components not needed for initial render
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
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const WoodenPlanesHelicoptersPage = lazy(() => import('./pages/WoodenPlanesHelicoptersPage'));
const WoodenPensPage = lazy(() => import('./pages/WoodenPensPage'));
const WoodenCrossesPage = lazy(() => import('./pages/WoodenCrossesPage'));

import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { categories } from './data/products';
import { Product } from './types';

// ─── LOADING FALLBACKS ────────────────────────────────────────────────────────

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 mt-4">Loading...</p>
    </div>
  </div>
);

const ModalLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ─── WRAPPER COMPONENTS ───────────────────────────────────────────────────────

const BlogPostWrapper: React.FC = () => {
  const { slug } = useParams();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BlogPostView />
    </Suspense>
  );
};

const SearchPageWrapper: React.FC<{
  products: Product[];
  onProductSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}> = ({ products, onProductSelect, onAddToCart }) => {
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

// ─── UTM CANONICAL CLEANER ────────────────────────────────────────────────────

function useCleanCanonical() {
  const location = useLocation();
  useEffect(() => {
    const baseUrl = 'https://poppaswoodencreations.co.nz';
    const cleanUrl = baseUrl + location.pathname.replace(/\/$/, '') || baseUrl + '/';

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      canonical.href = cleanUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = cleanUrl;
      document.head.appendChild(canonical);
    }
  }, [location.pathname]);
}

// ─── PAGE TRACKING ────────────────────────────────────────────────────────────

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

// ─── VISUALLY HIDDEN H1 (for SEO, invisible to users) ────────────────────────

const HiddenH1: React.FC<{ text: string }> = ({ text }) => (
  <h1 style={{
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: 0
  }}>{text}</h1>
);

// ─── MAIN APP CONTENT ─────────────────────────────────────────────────────────

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  usePageTracking();
  useCleanCanonical();

  const { products, loading, error, loadProducts } = useProducts();
  const { cart, addToCart, updateQuantity, removeFromCart, getCartItemCount } = useCart();

  const handleCategorySelect = (category: string) => navigate(`/${category}`);
  const handleProductSelect = (product: Product) => addToCart(product);
  const handleAddToCart = (product: Product) => addToCart(product);

  const ErrorBanner = error ? (
    <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-center text-sm text-red-700">
      ⚠️ Some products may not be loading correctly.{' '}
      <button onClick={() => window.location.reload()} className="underline font-medium">
        Reload
      </button>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onShowAdmin={() => setShowAdmin(true)}
        onShowCart={() => setShowCart(true)}
        cartItemCount={getCartItemCount()}
      />
      <ErrorMonitor />
      {ErrorBanner}

      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>

            {/* ── HOME ── */}
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
                  products={products}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                />
                <FeaturedReviews />
              </>
            } />

            {/* ── ORDER CONFIRMATION ── */}
            <Route path="/order-confirmation" element={
              <>
                <SEOHead
                  title="Order Confirmation - Thank You!"
                  description="Thank you for your order from Poppa's Wooden Creations."
                  canonicalPath="/order-confirmation"
                  noindex={true}
                />
                <OrderConfirmation />
              </>
            } />

            {/* ── SEO LANDING PAGE ── */}
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

            {/* ── ALL PRODUCTS ── */}
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

            {/* ── PRODUCT DETAIL ── */}
            <Route path="/products/:productId" element={
              <ProductDetail
                products={products}
                onAddToCart={handleAddToCart}
                isLoading={loading}
              />
            } />

            {/* ── CATEGORY PAGES ── */}
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
                <WoodenPlanesHelicoptersPage />
                <ProductGrid
                  products={(products || []).filter(p => p.category === 'wooden-planes-helicopters')}
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
                <HiddenH1 text="Handcrafted Wooden Kitchenware NZ - Rimu Spatulas & Utensils" />
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

            {/* ── RICH CONTENT CATEGORY PAGES ── */}
            <Route path="/wooden-crosses" element={
              <>
                <WoodenCrossesPage />
                <ProductGrid
                  products={(products || []).filter(p => p.category === 'wooden-crosses')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-crosses"
                />
              </>
            } />

            <Route path="/wooden-pens" element={
              <>
                <WoodenPensPage />
                <ProductGrid
                  products={(products || []).filter(p => p.category === 'wooden-pens')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-pens"
                />
              </>
            } />

            {/* ── LEGACY URL REDIRECTS ── */}
            <Route path="/wooden-other-toys" element={<Navigate to="/products" replace />} />
            <Route path="/kitchen-utensils" element={<Navigate to="/wooden-kitchenware" replace />} />

            {/* ── INFO PAGES ── */}
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

            {/* ── POLICY PAGES ── */}
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

            {/* ── REVIEWS ── */}
            <Route path="/reviews" element={
              <>
                <SEOHead
                  title="Customer Reviews - 5.0/5 Stars"
                  description="Read all 31 verified reviews from our happy customers. Handcrafted wooden toys and kitchenware loved by Kiwi families."
                  canonicalPath="/reviews"
                  ogType="website"
                />
                <Reviews />
              </>
            } />

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

            <Route path="/admin/reviews" element={
              <>
                <SEOHead title="Manage Reviews" noindex={true} />
                <ReviewsAdmin />
              </>
            } />

            {/* ── SEARCH ── */}
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

            {/* ── BLOG ── */}
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

            <Route path="/blog/:slug" element={<BlogPostWrapper />} />

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
              onProductsUpdate={async () => { await loadProducts(); }}
              onClose={() => setShowAdmin(false)}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

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
