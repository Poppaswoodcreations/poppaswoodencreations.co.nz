import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import ProductDetail from './ProductDetail';
import PayPalSuccess from './PayPalSuccess';
import NotFound from './NotFound';
import ShippingPolicy from './ShippingPolicy';
import ReturnsRefunds from './ReturnsRefunds';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import Reviews from './Reviews';
import SearchResultsPage from '../pages/SearchResultsPage';
import { Product } from '../types';

interface RouterProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const Router: React.FC<RouterProps> = ({ products, onAddToCart }) => {
  return (
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
      
      {/* Category Routes */}
      <Route path="/wooden-trains" element={<App />} />
      <Route path="/wooden-baby-toys" element={<App />} />
      <Route path="/wooden-trucks" element={<App />} />
      <Route path="/wooden-cars" element={<App />} />
      <Route path="/wooden-planes-helicopters" element={<App />} />
      <Route path="/wooden-kitchenware" element={<App />} />
      <Route path="/wooden-tractors-boats" element={<App />} />
      <Route path="/wooden-other-toys" element={<App />} />
      
      {/* General Pages */}
      <Route path="/about" element={<App />} />
      <Route path="/contact" element={<App />} />
      
      {/* Search Results Page - DEDICATED COMPONENT */}
      <Route path="/search" element={<SearchResultsPage />} />
      
      {/* Reviews Page - DEDICATED COMPONENT */}
      <Route path="/reviews" element={<Reviews />} />
      
      {/* Policy Pages - DEDICATED COMPONENTS */}
      <Route path="/shipping" element={<ShippingPolicy />} />
      <Route path="/returns" element={<ReturnsRefunds />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound onGoHome={() => window.location.href = '/'} />} />
    </Routes>
  );
};

export default Router;
