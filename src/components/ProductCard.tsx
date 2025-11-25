import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart }) => {
  // Get the first image from the product's images array
  const getProductImage = () => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      if (firstImage && firstImage.trim() !== '') {
        return firstImage;
      }
    }

    return 'https://i.ibb.co/dw3x0Kmm/image.jpg';
  };

  const productImage = getProductImage();

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleProductClick = () => {
    onAddToCart(product);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleProductClick}
    >
      <div className="relative h-48 bg-gradient-to-br from-amber-100 to-amber-200 overflow-hidden">
        <img
          src={productImage}
          alt={`${product.name} - Handcrafted wooden toy by Poppa's Wooden Creations`}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        {product.featured && (
          <div className="absolute top-2 left-2 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 mb-3 text-sm line-clamp-2">
          {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-amber-600">
            ${product.price.toFixed(2)} NZD
          </span>
          <div className="text-right">
            {product.inStock ? (
              <div>
                <span className="text-green-600 text-xs font-medium">In Stock</span>
                {product.stockQuantity && (
                  <div className="text-gray-500 text-xs">
                    {product.stockQuantity} available
                  </div>
                )}
              </div>
            ) : (
              <span className="text-red-600 text-xs font-medium">Out of Stock</span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleAddToCartClick}
          disabled={!product.inStock}
          className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;