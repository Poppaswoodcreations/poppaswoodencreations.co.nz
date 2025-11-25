import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import ProductDetail from './ProductDetail';
import PayPalSuccess from './PayPalSuccess';
import NotFound from './NotFound';
import { Product } from '../types';

interface RouterProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const Router: React.FC<RouterProps> = ({ products, onAddToCart }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route 
          path="/products/:productId" 
          element={
            <ProductDetail 
              products={products} 
              onAddToCart={onAddToCart} 
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
        <Route path="/privacy" element={<App />} />
        <Route path="/terms" element={<App />} />
        <Route path="/search" element={<App />} />
        <Route path="*" element={<NotFound onGoHome={() => window.location.href = '/'} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;