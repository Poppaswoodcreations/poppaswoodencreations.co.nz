import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  category?: string;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect, onAddToCart, category, loading = false }) => {

  // Show spinner while loading
  if (loading || products.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-12">
          {loading ? (
            <>
              <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🪵</div>
              <p className="text-2xl font-bold text-gray-900 mb-4">No Products Found</p>
              <p className="text-gray-500 mb-4">No products in this category yet</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 bg-white min-h-screen w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 py-8 w-full">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
