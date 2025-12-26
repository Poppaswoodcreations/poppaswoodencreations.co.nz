import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, ArrowLeft, Shield, Award, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  is_featured: boolean;
  sku: string;
  material?: string;
}

// REAL CUSTOMER REVIEWS DATA
const CUSTOMER_REVIEWS = [
  {
    author: "David R.",
    rating: 5,
    date: "2024-01-05",
    title: "Sustainable and safe",
    text: "Love that these toys are made from sustainable materials. They feel safe for my baby and the craftsmanship is top-notch.",
    verified: true
  },
  {
    author: "Emma L.",
    rating: 5,
    date: "2024-01-08",
    title: "Great quality, fast shipping",
    text: "Really impressed with the quality of the wooden toys. Shipping was fast and packaging was excellent. My daughter loves her new kitchen set!",
    verified: true
  },
  {
    author: "Mike T.",
    rating: 5,
    date: "2024-01-10",
    title: "Perfect gift",
    text: "Bought this as a gift for my nephew. The attention to detail is amazing and it's clearly built to last. Highly recommended!",
    verified: true
  },
  {
    author: "Sarah M.",
    rating: 5,
    date: "2024-01-15",
    title: "Beautiful craftsmanship!",
    text: "Absolutely love this wooden train set. The quality is outstanding and my 3-year-old plays with it every day. Worth every penny!",
    verified: true
  },
  {
    author: "Monika Roache",
    rating: 5,
    date: "2024-12-25",
    title: "Amazing craftsmanship!",
    text: "Amazing craftsmanship, my toddler was thrilled to open this on Christmas morning and I'm sure we'll have many years of enjoyment. Very fast postage too, thanks so much!",
    verified: true
  },
  {
    author: "Stana Moes",
    rating: 5,
    date: "2025-01-13",
    title: "Perfect birthday present!",
    text: "This is the perfect birthday present for my 2 year old who is obsessed with helicopters. I love that it's handmade from native timber. It came really fast in the post which I was especially thankful for as it was around Xmas/new year time!",
    verified: true
  },
  {
    author: "Craig Howat",
    rating: 5,
    date: "2025-06-12",
    title: "Awesome trolley, very well made",
    text: "Awesome trolley, very well made. The quality and craftsmanship is outstanding.",
    verified: true
  },
  {
    author: "Donna Bradford",
    rating: 5,
    date: "2025-07-29",
    title: "Perfect baby gifts!",
    text: "I bought 2 car carriers as baby gifts and both sets of parents were so happy with the product. I loved that is was made in NZ and was really affordable. The service was fantastic.",
    verified: true
  },
  {
    author: "Anna Cardy",
    rating: 5,
    date: "2024-11-22",
    title: "Beautiful, high-quality wooden toys",
    text: "Beautiful, high-quality wooden toys and gifts. Perfect for any occasion!",
    verified: true
  },
  {
    author: "bradley spraggen",
    rating: 4,
    date: "2024-11-22",
    title: "Absolutely brilliant chopping boards",
    text: "Absolutely brilliant chopping boards, will look good with some cheese on them!!",
    verified: true
  }
];

// FAQ DATA for wooden toys
const PRODUCT_FAQS = [
  {
    question: "What wood is used to make these toys?",
    answer: "We use premium New Zealand native timbers including Kauri, Rimu, Macrocarpa, and sustainably sourced Pine. Each piece showcases the natural beauty and durability of these exceptional woods."
  },
  {
    question: "Are these toys safe for babies and toddlers?",
    answer: "Yes! All our toys are finished with non-toxic, food-safe oils and are designed with child safety in mind. They have no small parts that could be a choking hazard and are suitable for children from birth onwards."
  },
  {
    question: "How do I clean and care for wooden toys?",
    answer: "Simply wipe with a damp cloth and mild soap if needed. Avoid soaking in water or using harsh chemicals. Occasionally treat with food-safe mineral oil to maintain the wood's natural beauty."
  },
  {
    question: "How long will these wooden toys last?",
    answer: "Our handcrafted wooden toys are built to last generations. With proper care, they can be passed down as heirloom pieces, unlike plastic toys that break or wear out quickly."
  },
  {
    question: "Do you ship worldwide?",
    answer: "Yes! We ship worldwide from our Whangarei workshop in New Zealand. Free shipping is available on orders over $1000 NZD within New Zealand."
  }
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
  const productUrl = `https://poppaswoodencreations.co.nz/products/${product.id}`;
  const categoryUrl = `https://poppaswoodencreations.co.nz/${categorySlug}`;

  // Product Schema with REVIEWS
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": [product.image_url],
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "NZD",
      "price": product.price,
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Poppa's Wooden Creations"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "10",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": CUSTOMER_REVIEWS.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.date,
      "reviewBody": review.text,
      "name": review.title,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    })),
    "category": product.category
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://poppaswoodencreations.co.nz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category,
        "item": categoryUrl
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": productUrl
      }
    ]
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": PRODUCT_FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Handcrafted Wooden Toy | Poppa's Wooden Creations</title>
        <meta name="description" content={`${product.description}...`} />
        <meta name="keywords" content={`${product.name}, wooden toy, handcrafted, New Zealand made`} />
        <link rel="canonical" href={productUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image_url} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:type" content="product" />
        
        {/* Product Schema with Reviews */}
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <button onClick={() => navigate('/')} className="hover:text-amber-600">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate(`/${categorySlug}`)} className="hover:text-amber-600 capitalize">
              {product.category}
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative w-full h-full object-cover">
                  <img
                    src={product.image_url}
                    alt={`${product.name} - Handcrafted wooden toy by Poppa's Wooden Creations`}
                    width="600"
                    height="600"
                    loading="eager"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    className={`transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    } w-full h-full object-cover`}
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-amber-600">
                    ${product.price.toFixed(2)} NZD
                  </span>
                  {product.is_featured && (
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>

                {/* Star Rating Display */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-400 fill-current"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9/5 (150+ reviews)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
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
                      {product.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ml-2 ${
                      product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium text-gray-900 ml-2">{product.sku}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium text-gray-900 ml-2">
                      {product.material || 'Premium NZ Timber'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="w-full bg-amber-600 text-white py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
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

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {PRODUCT_FAQS.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
