import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, Award } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../types';

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, onAddToCart }) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <>
        <Helmet>
          <title>Product Not Found | Poppa's Wooden Creations</title>
          <meta name="description" content="The product you're looking for is not available. Browse our collection of handcrafted wooden toys." />
          <link rel="canonical" href={`https://poppaswoodencreations.co.nz/products/${productId}`} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  const canonicalUrl = `https://poppaswoodencreations.co.nz/products/${product.id}`;
  const productImage = product.images?.[0] || '/FB_IMG_1640827671355.jpg';

  return (
    <>
      <Helmet>
        <title>{product.seoTitle || `${product.name} | Handcrafted Wooden Toy | Poppa's Wooden Creations`}</title>
        <meta name="description" content={product.seoDescription || `${product.description.substring(0, 160)}...`} />
        <meta name="keywords" content={product.seoKeywords || `${product.name}, wooden toy, handcrafted, New Zealand made`} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={productImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        
        {/* Product Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": productImage,
            "url": canonicalUrl,
            "brand": {
              "@type": "Brand",
              "name": "Poppa's Wooden Creations"
            },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "NZD",
              "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Poppa's Wooden Creations"
              }
            },
            "category": product.category,
            "weight": {
              "@type": "QuantitativeValue",
              "value": product.weight || 0.5,
              "unitCode": "KGM"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <button onClick={() => navigate('/')} className="hover:text-amber-600">Home</button>
            <span>/</span>
            <button 
              onClick={() => navigate(`/${product.category}`)} 
              className="hover:text-amber-600 capitalize"
            >
              {product.category.replace('-', ' ')}
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src={productImage}
                  alt={`${product.name} - Handcrafted wooden toy by Poppa's Wooden Creations`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/FB_IMG_1640827671355.jpg';
                  }}
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 2}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/FB_IMG_1640827671355.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-amber-600">${product.price.toFixed(2)} NZD</span>
                  {product.featured && (
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9/5 (150+ reviews)</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="text-green-600" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">Child Safe</div>
                    <div className="text-sm text-gray-600">Non-toxic finish</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="text-blue-600" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">Handcrafted</div>
                    <div className="text-sm text-gray-600">Made in NZ</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Truck className="text-purple-600" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">Free Shipping</div>
                    <div className="text-sm text-gray-600">Orders over $1000</div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900 ml-2 capitalize">
                      {product.category.replace('-', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium text-gray-900 ml-2">{product.weight || 0.5}kg</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ml-2 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium text-gray-900 ml-2">{product.id}</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={!product.inStock}
                  className="w-full bg-amber-600 text-white py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
                
                <button
                  onClick={() => navigate(-1)}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Products</span>
                </button>
              </div>

              {/* Shipping Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Shipping Information</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Free shipping on orders over $1000 NZD</p>
                  <p>• Free pickup available from our Whangarei workshop</p>
                  <p>• Worldwide shipping available</p>
                  <p>• Processing time: 1-2 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;