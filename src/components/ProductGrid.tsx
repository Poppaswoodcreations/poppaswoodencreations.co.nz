import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  category?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect, onAddToCart, category }) => {
  // Add SEO for category pages
  const getCategoryTitle = (cat: string) => {
    const categoryNames: { [key: string]: string } = {
      'wooden-trains': 'Wooden Train Sets & Railway Toys',
      'wooden-baby-toys': 'Safe Wooden Baby Toys',
      'wooden-trucks': 'Wooden Truck Toys',
      'wooden-cars': 'Wooden Car Toys',
      'wooden-planes-helicopters': 'Wooden Airplane & Helicopter Toys',
      'wooden-kitchenware': 'Wooden Kitchen Toys & Utensils',
      'wooden-tractors-boats': 'Wooden Tractor & Boat Toys',
      'wooden-other-toys': 'Educational Wooden Toys'
    };
    return categoryNames[cat] || 'Wooden Toys';
  };

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🪵</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h2>
          <p className="text-gray-500 mb-4">No products in this category yet</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {category && (
        <Helmet>
          <title>{getCategoryTitle(category)} | Handcrafted in New Zealand | Poppa's Wooden Creations</title>
          <meta name="description" content={`Browse our collection of ${getCategoryTitle(category).toLowerCase()} handcrafted in New Zealand. Safe, sustainable wooden toys for children.`} />
          <link rel="canonical" href={`https://poppaswoodencreations.co.nz/${category}`} />
        </Helmet>
      )}
      <div className="container mx-auto px-4 bg-white min-h-screen w-full">
        {category && (
          <div className="mb-8 pt-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {getCategoryTitle(category)}
            </h1>
            <p className="text-gray-600">
              Showing {products.length} product{products.length !== 1 ? 's' : ''} in this category
            </p>
          </div>
        )}
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-8 w-full">
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
    </>
  );
};

export default ProductGrid;