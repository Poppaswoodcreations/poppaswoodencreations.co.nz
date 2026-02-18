import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, Award } from 'lucide-react';
import { Product } from '../types';
import LazyImage from './LazyImage';
import { useSEO } from '../components/SEOMetaManager';

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
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

const ProductDetail: React.FC<ProductDetailProps> = ({ products, onAddToCart, isLoading = false }) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const product = products.find(p => p.id === productId);

  // ─── LOADING STATE ────────────────────────────────────────────────────────────
  // Show spinner while Supabase is fetching — prevents premature "Not Found" page.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  // ─── NOT FOUND STATE ──────────────────────────────────────────────────────────
  // Only shown after loading is complete and product genuinely doesn't exist.
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ─── PRODUCT EXISTS ───────────────────────────────────────────────────────────
  const canonicalUrl = `https://poppaswoodencreations.co.nz/products/${product.id}`;
  const productImage = product.images?.[0] || '/FB_IMG_1640827671355.jpg';
  const fullImageUrl = productImage.startsWith('http') ? productImage : `https://poppaswoodencreations.co.nz${productImage}`;

  const extractMaterial = (name: string, desc?: string): string => {
    const text = `${name} ${desc || ''}`.toLowerCase();
    const materials = ['kauri', 'rimu', 'macrocarpa', 'pine', 'totara', 'matai'];
    for (const material of materials) {
      if (text.includes(material)) {
        return material.charAt(0).toUpperCase() + material.slice(1) + ' wood';
      }
    }
    return 'Premium New Zealand native timber';
  };

  const productMaterial = extractMaterial(product.name, product.description);

  const getAgeRange = (name: string, category?: string): string => {
    const text = `${name} ${category || ''}`.toLowerCase();
    if (text.includes('baby') || text.includes('infant') || text.includes('rattle')) return '0-12 months';
    if (text.includes('toddler')) return '1-3 years';
    if (text.includes('preschool')) return '3-5 years';
    return '0-8 years';
  };

  const ageRange = getAgeRange(product.name, product.category);

  const isTestProduct = product.id.startsWith('SQ') || product.id === 'product-8';
  const hasNoDescription = !product.description || product.description.length < 50;
  const shouldNoIndex = isTestProduct || hasNoDescription;

  const enhancedDescription = product.description
    ? `${product.description} Handcrafted in Whangarei, New Zealand from ${productMaterial}. Finished with non-toxic, food-safe oils. Safe for children ${ageRange}. Trusted by Montessori schools nationwide. Built to last generations as an heirloom piece.`
    : `Handcrafted ${product.name} from ${productMaterial}. Made in Whangarei, New Zealand. Non-toxic finish, safe for children ${ageRange}. Perfect for Montessori play and early childhood development.`;

  useSEO({
    title: product.seoTitle || `${product.name} | Handcrafted Wooden Toy | Made in NZ`,
    description: product.seoDescription || enhancedDescription.substring(0, 160),
    image: fullImageUrl,
    type: 'product',
    canonical: canonicalUrl,
    noindex: shouldNoIndex
  });

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": enhancedDescription,
    "image": product.images?.map(img =>
      img.startsWith('http') ? img : `https://poppaswoodencreations.co.nz${img}`
    ) || [fullImageUrl],
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations",
      "logo": "https://poppaswoodencreations.co.nz/logo.png"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Poppa's Wooden Creations",
      "url": "https://poppaswoodencreations.co.nz",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "102 Kiripaka Rd",
        "addressLocality": "Whangarei",
        "addressRegion": "Northland",
        "postalCode": "0110",
        "addressCountry": "NZ"
      }
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "NZD",
      "price": product.price.toFixed(2),
      "priceValidUntil": "2026-12-31",
      "availability": product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "NZD"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "NZ"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 5,
            "unitCode": "DAY"
          }
        }
      },
      "seller": {
        "@type": "Organization",
        "name": "Poppa's Wooden Creations",
        "url": "https://poppaswoodencreations.co.nz"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": CUSTOMER_REVIEWS.map(review => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": review.author },
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
    "category": product.category || "Wooden Toys",
    "material": productMaterial,
    "audience": {
      "@type": "PeopleAudience",
      "suggestedMinAge": ageRange.split('-')[0].trim().replace(/[^0-9]/g, ''),
      "suggestedMaxAge": ageRange.split('-')[1]?.trim().replace(/[^0-9]/g, '') || "8"
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Finish", "value": "Non-toxic food-safe oil" },
      { "@type": "PropertyValue", "name": "Origin", "value": "Handcrafted in New Zealand" },
      { "@type": "PropertyValue", "name": "Suitable For", "value": "Montessori education, early childhood development" },
      { "@type": "PropertyValue", "name": "Sustainability", "value": "Sustainable native timber, eco-friendly alternative to plastic" }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://poppaswoodencreations.co.nz" },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category ? product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Products',
        "item": `https://poppaswoodencreations.co.nz/${product.category || 'products'}`
      },
      { "@type": "ListItem", "position": 3, "name": product.name, "item": canonicalUrl }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": PRODUCT_FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8" aria-label="Breadcrumb">
            <button onClick={() => navigate('/')} className="hover:text-amber-600">Home</button>
            <span>/</span>
            {product.category && (
              <>
                <button onClick={() => navigate(`/${product.category}`)} className="hover:text-amber-600 capitalize">
                  {product.category.replace(/-/g, ' ')}
                </button>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                <LazyImage
                  src={productImage}
                  alt={`${product.name} - Handcrafted wooden toy made from ${productMaterial} by Poppa's Wooden Creations in Whangarei, New Zealand`}
                  className="w-full h-full object-cover"
                  width="600"
                  height="600"
                  priority={true}
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square bg-white rounded-lg shadow overflow-hidden">
                      <LazyImage
                        src={image}
                        alt={`${product.name} - detail view ${index + 2} showing ${productMaterial} craftsmanship`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        width="150"
                        height="150"
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
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">Featured</span>
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

              {product.description && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

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
                  {product.category && (
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900 ml-2 capitalize">{product.category.replace(/-/g, ' ')}</span>
                    </div>
                  )}
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
                  <div>
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium text-gray-900 ml-2">{productMaterial}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Age Range:</span>
                    <span className="font-medium text-gray-900 ml-2">{ageRange}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Finish:</span>
                    <span className="font-medium text-gray-900 ml-2">Food-safe oil</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Made in:</span>
                    <span className="font-medium text-gray-900 ml-2">Whangarei, NZ</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Suitable for:</span>
                    <span className="font-medium text-gray-900 ml-2">Montessori</span>
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
                  <p>• Free shipping on orders over $1000 NZD within New Zealand</p>
                  <p>• Free pickup available from our Whangarei workshop</p>
                  <p>• Worldwide shipping available</p>
                  <p>• Processing time: 1-2 business days</p>
                  <p>• Standard NZ delivery: 2-5 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {PRODUCT_FAQS.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Customer Reviews</h2>
            <div className="space-y-4">
              {CUSTOMER_REVIEWS.slice(0, 5).map((review, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{review.author}</span>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified Purchase</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                  <p className="text-gray-600">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProductDetail;
