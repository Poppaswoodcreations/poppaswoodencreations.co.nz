import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams, Navigate } from 'react-router-dom';

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
const CustomOrderPage = lazy(() => import('./pages/CustomOrderPage'));
import WoodenPlanesHelicoptersPage from './pages/WoodenPlanesHelicoptersPage';
import WoodenPensPage from './pages/WoodenPensPage';
import WoodenCrossesPage from './pages/WoodenCrossesPage';
import WoodenBabyToysPage from './pages/WoodenBabyToysPage';
import WoodenCarsPage from './pages/WoodenCarsPage';
import WoodenTrucksPage from './pages/WoodenTrucksPage';
import WoodenTrainsPage from './pages/WoodenTrainsPage';
import WoodenKitchenwarePage from './pages/WoodenKitchenwarePage';
import WoodenTractorsBoatsPage from './pages/WoodenTractorsBoatsPage';

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

// ─── CATEGORY PAGE HEADER ─────────────────────────────────────────────────────

const CategoryHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-amber-50 border-b border-amber-100 py-8 px-4 text-center">
    <h1 className="text-3xl sm:text-4xl font-bold text-amber-900">{title}</h1>
    <p className="text-amber-700 mt-2 text-lg">{subtitle}</p>
  </div>
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

            {/* ── CUSTOM ORDER ── */}
            <Route path="/custom-order" element={
              <>
                <SEOHead
                  title="Custom Wooden Toy Orders NZ"
                  description="Order a custom handcrafted wooden toy or kitchenware item from Poppa's Wooden Creations. Choose your timber, size, and finish."
                  canonicalPath="/custom-order"
                  ogType="website"
                />
                <CustomOrderPage />
              </>
            } />

            {/* ── SEO LANDING PAGE ── */}
            <Route path="/wooden-toys-nz" element={
              <>
                <SEOHead
                  title="Wooden Toys NZ - Native Timber"
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
                  title="All Wooden Toys & Kitchenware NZ"
                  description="Browse our complete collection of handcrafted wooden toys & kitchenware made from native New Zealand timber. Kauri, Rimu, Macrocarpa. Free shipping over $150."
                  canonicalPath="/products"
                  ogType="website"
                />
                <CategoryHeader
                  title="All Wooden Toys & Kitchenware"
                  subtitle="Handcrafted from native New Zealand timber"
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
                  title="Wooden Toy Trucks NZ"
                  description="Handcrafted wooden toy trucks made from New Zealand native timber. Durable, realistic, and perfect for construction-themed play."
                  canonicalPath="/wooden-trucks"
                  ogType="website"
                />
                <CategoryHeader
                  title="Wooden Toy Trucks NZ"
                  subtitle="Handcrafted from native New Zealand timber"
                />
                <ProductGrid
                  products={products.filter(p => p.category === 'wooden-trucks')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-trucks"
                />
                <WoodenTrucksPage />
              </>
            } />

            <Route path="/wooden-cars" element={
              <>
                <SEOHead
                  title="Wooden Toy Cars NZ"
                  description="Handcrafted wooden toy cars made from native New Zealand Kauri and Rimu timber. Timeless heirloom designs that encourage creative, imaginative play in children."
                  canonicalPath="/wooden-cars"
                  ogType="website"
                />
                <CategoryHeader
                  title="Wooden Toy Cars NZ"
                  subtitle="Timeless handcrafted designs from native timber"
                />
                <ProductGrid
                  products={products.filter(p => p.category === 'wooden-cars')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-cars"
                />
                <WoodenCarsPage />
              </>
            } />

            <Route path="/wooden-trains" element={
              <>
                <SEOHead
                  title="Wooden Train Sets NZ"
                  description="Handcrafted wooden toy trains made from native New Zealand timber. Build railways, spark imagination, and inspire creative play. Montessori-friendly."
                  canonicalPath="/wooden-trains"
                  ogType="website"
                />
                <CategoryHeader
                  title="Wooden Train Sets NZ"
                  subtitle="Spark imagination with handcrafted native timber railways"
                />
                <ProductGrid
                  products={products.filter(p => p.category === 'wooden-trains')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-trains"
                />
                <WoodenTrainsPage />
              </>
            } />

            <Route path="/wooden-planes-helicopters" element={
              <>
                <SEOHead
                  title="Wooden Airplane & Helicopter Toys NZ"
                  description="Handcrafted wooden airplane and helicopter toys made from native New Zealand timber. Safe, sustainable, and beautifully crafted for children."
                  canonicalPath="/wooden-planes-helicopters"
                  ogType="website"
                />
                <CategoryHeader
                  title="Wooden Planes & Helicopters NZ"
                  subtitle="Handcrafted from native New Zealand timber"
                />
                <ProductGrid
                  products={products.filter(p => p.category === 'wooden-planes-helicopters')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-planes-helicopters"
                  loading={loading}
                />
                <WoodenPlanesHelicoptersPage />
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
                <CategoryHeader
                  title="Wooden Baby Toys NZ"
                  subtitle="Safe, natural & non-toxic — crafted from native NZ timber"
                />
                <ProductGrid
                  products={products.filter(p => p.category === 'wooden-baby-toys')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-baby-toys"
                />
                <WoodenBabyToysPage />
              </>
            } />

            <Route path="/wooden-kitchenware" element={
              <>
                <SEOHead
                  title="Wooden Kitchenware NZ"
                  description="Handcrafted wooden kitchenware made from New Zealand native Rimu and Macrocarpa timber. Beautiful, functional, and built to last a lifetime."
                  canonicalPath="/wooden-kitchenware"
                  ogType="website"
                />
                <CategoryHeader
                  title="Wooden Kitchenware NZ"
                  subtitle="Handcrafted from native Rimu & Macrocarpa timber"
                />
                <ProductGrid
                  products={products.filter(p => p.category === 'wooden-kitchenware')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-kitchenware"
                />
                <WoodenKitchenwarePage />
              </>
            } />

            <Route path="/wooden-tractors-boats" element={
              <>
                <SEOHead
                  title="Wooden Tractors & Boats NZ"
                  description="Handcrafted wooden toy tractors and boats made from New Zealand native timber. Perfect for farm and water-themed imaginative play."
                  canonicalPath="/wooden-tractors-boats"
                  ogType="website"
                />
                <CategoryHeader
                  title="Wooden Tractors & Boats NZ"
                  subtitle="Farm and water toys handcrafted from native timber"
                />
                <ProductGrid
                  products={products.filter(p => p.category === 'wooden-tractors-boats')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-tractors-boats"
                />
                <WoodenTractorsBoatsPage />
              </>
            } />

            {/* ── RICH CONTENT CATEGORY PAGES ── */}
            <Route path="/wooden-crosses" element={
              <>
                <SEOHead
                  title="Wooden Crosses NZ"
                  description="Handcrafted wooden crosses made from native New Zealand timber. Beautiful, meaningful gifts handcrafted in Whangarei."
                  canonicalPath="/wooden-crosses"
                  ogType="website"
                />
                <ProductGrid
                  products={products.filter(p => p.category === 'wooden-crosses')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-crosses"
                  loading={loading}
                />
                <WoodenCrossesPage />
              </>
            } />

            <Route path="/wooden-pens" element={
              <>
                <SEOHead
                  title="Wooden Pens NZ"
                  description="Handcrafted wooden pens made from native New Zealand timber. Unique, beautiful, and perfect as gifts. Made in Whangarei."
                  canonicalPath="/wooden-pens"
                  ogType="website"
                />
                <ProductGrid
                  products={products.filter(p => p.category === 'wooden-pens')}
                  onProductSelect={handleProductSelect}
                  onAddToCart={handleAddToCart}
                  category="wooden-pens"
                  loading={loading}
                />
                <WoodenPensPage />
              </>
            } />

            {/* ── LEGACY URL REDIRECTS ── */}
            <Route path="/wooden-other-toys" element={<Navigate to="/products" replace />} />
            <Route path="/kitchen-utensils" element={<Navigate to="/wooden-kitchenware" replace />} />
            <Route path="/kitchenware" element={<Navigate to="/wooden-kitchenware" replace />} />
            <Route path="/baby-toys" element={<Navigate to="/wooden-baby-toys" replace />} />

            {/* ── INFO PAGES ── */}
            <Route path="/about" element={
              <>
                <SEOHead
                  title="About Us - Made in Whangarei NZ"
                  description="Learn about Poppa's Wooden Creations. Handcrafting premium wooden toys and kitchenware from native NZ timber in Whangarei, Northland, since 2015."
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
                  description="Contact Poppa's Wooden Creations in Whangarei, NZ. We're here to help with orders, custom wooden toy requests, and any questions you may have."
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
                  title="Shipping Policy"
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
                  title="Returns & Refunds Policy"
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
                  description="Read verified reviews from happy customers. Handcrafted wooden toys and kitchenware loved by Kiwi families and Montessori schools across New Zealand."
                  canonicalPath="/reviews"
                  ogType="website"
                />
                <Reviews />
              </>
            } />

            <Route path="/write-review" element={
              <>
                <SEOHead
                  title="Write a Review"
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
                  title="Search Products"
                  description="Search our collection of handcrafted wooden toys and kitchenware made from native New Zealand timber. Find the perfect Montessori-friendly toy for any child."
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
                  title="Blog - Wooden Toy Tips"
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
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
