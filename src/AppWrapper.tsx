import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import ProductDetail from './components/ProductDetail';
import PayPalSuccess from './components/PayPalSuccess';
import NotFound from './components/NotFound';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';

const AppWrapper: React.FC = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route 
        path="/products/:productId" 
        element={
          <ProductDetail 
            products={products} 
            onAddToCart={addToCart} 
          />
        } 
      />
      <Route path="/paypal-success" element={<PayPalSuccess />} />
      <Route path="/wooden-trains" element={<App />} />
      <Route path="/wooden-baby-toys" element={<App />} />
      <Route path="/wooden-trucks" element={<App />} />
      <Route path="/wooden-cars" element={<App />} />
      <Route path="/wooden-planes-helicopters" element={<App />} />
      <Route path="/wooden-kitchenware" element={<App />} />
      <Route path="/wooden-tractors-boats" element={<App />} />
      <Route path="/wooden-other-toys" element={<App />} />
      <Route path="/about" element={<App />} />
      <Route path="/contact" element={<App />} />
      <Route path="/reviews" element={<App />} />
      <Route path="/shipping" element={<App />} />
      <Route path="/blog" element={<App />} />
      <Route path="/privacy" element={<App />} />
      <Route path="/terms" element={<App />} />
      <Route path="/search" element={<App />} />
      <Route path="*" element={<NotFound onGoHome={() => window.location.href = '/'} />} />
    </Routes>
  );
};

export default AppWrapper;
