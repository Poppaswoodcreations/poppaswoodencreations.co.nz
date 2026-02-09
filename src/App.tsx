import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { usePageTracking } from './hooks/usePageTracking';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminBlog from './pages/admin/Blog';
import AdminReviews from './pages/admin/Reviews';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// App content component - must be inside Router to use useLocation
function AppContent() {
  // Track pageviews on route changes
  usePageTracking();

  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:slug" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Protected routes */}
              <Route path="checkout" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              <Route path="profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="orders" element={
                <PrivateRoute>
                  <OrderHistory />
                </PrivateRoute>
              } />

              {/* Admin routes */}
              <Route path="admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="admin/products" element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              } />
              <Route path="admin/orders" element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } />
              <Route path="admin/blog" element={
                <AdminRoute>
                  <AdminBlog />
                </AdminRoute>
              } />
              <Route path="admin/reviews" element={
                <AdminRoute>
                  <AdminReviews />
                </AdminRoute>
              } />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
