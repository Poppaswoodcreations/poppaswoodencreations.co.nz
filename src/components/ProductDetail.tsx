import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ShoppingCart, Truck, Shield, Award } from 'lucide-react';
import { Product } from '../types';
import LazyImage from './LazyImage';
import { useSEO } from '../components/SEOMetaManager';

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

const PRODUCT_FAQS = [
  {
    question: "What wood is used to make these toys?",
    answer: "We use premium New Zealand native timbers including Kauri, Rimu, Macrocarpa, and sustainably sourced Pine. Each piece showcases the natural beauty and durability of these exceptional woods."
  },
  {
    question: "Are these toys safe for babies and toddlers?",
    answer: "Yes! All our toys are finished with non-toxic, food-safe oils and are designed with child safety in mind. They have no small parts that could be a choking hazard and are suitable for children from 12 months onwards."
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

// Explicit per-product material overrides. Keyed by product id (slug).
// These take priority over the keyword-guess fallback below, since guessing
// from the name/description text was picking the wrong material for
// multi-timber products and didn't recognise "rewa rewa" at all.
const MATERIAL_OVERRIDES: Record<string, string> = {
  '2-by-4-car-steering-wheel': 'Pine wood',
  '2-by-4-pine-car': 'Pine wood',
  '2-by-4-pine-car-with-roof': 'Pine wood',
  '2-by-4-pine-tow-truck': 'Pine wood',
  '2-by-4-pine-ute': 'Pine wood',
  '2-by-4-set-5': 'Pine wood',
  'baby-rattle': 'Rimu wood',
  'bi-plane': 'Pine wood',
  'big-spatula-flat': 'Rimu wood',
  'big-spatula-flat-2': 'Rimu wood',
  'block-train': 'Kauri wood',
  'car-carrier': 'Kauri wood',
  'car-carrier-and-4-cars': 'Kauri & Macrocarpa wood',
  'dragster': 'Kauri wood',
  'dump-truck': 'Kauri & Macrocarpa wood',
  'egg-cup': 'Rimu wood',
  'fishing-boat': 'Rewa Rewa & Kauri wood',
  'floor-noise-maker': 'Pine wood',
  'french-rolling-pin': 'Rimu wood',
  'gt-coupe': 'Kauri wood',
  'hammer-set': 'Pine wood',
  'happy-go-luck-train': 'Pine wood',
  'helicopter-rimu': 'Rimu wood',
  'hot-pot-stand': 'Rimu wood',
  'kauri-truck-trailer-loader': 'Kauri & Macrocarpa wood',
  'key-holder': 'Rimu wood',
  'logging-truck': 'Kauri & Macrocarpa wood',
  'noise-maker': 'Pine wood',
  'pine-bat-car': 'Pine wood',
  'pine-boat': 'Pine wood',
  'pine-helicopter': 'Pine wood',
  'pine-kiwi': 'Pine wood',
  'pine-plane': 'Pine wood',
  'police-boat': 'Rewa Rewa & Kauri wood',
  'product-pen-kauri-chrome-black': 'Kauri wood',
  'product-pen-kauri-gold-stylus': 'Kauri wood',
  'product-pen-rewa-rewa-antique-bronze': 'Rewa Rewa wood',
  'product-pen-rewa-rewa-chrome-black': 'Rewa Rewa wood',
  'product-pen-rewa-rewa-gold-stylus': 'Rewa Rewa wood',
  'product-pen-rimu-antique-bronze': 'Rimu wood',
  'product-pen-rimu-chrome-black': 'Rimu wood',
  'product-pen-rimu-gold-stylus': 'Rimu wood',
  'product-pen-totara-antique-bronze': 'Totara wood',
  'product-pen-totara-chrome-black': 'Totara wood',
  'product-pen-totara-gold-stylus': 'Totara wood',
  'rimu-wooden-cross': 'Rimu wood',
  'roadster': 'Kauri wood',
  'rolling-pin-2': 'Rimu wood',
  'rubbish-truck': 'Kauri & Macrocarpa wood',
  'salad-forks': 'Rimu wood',
  'small-pine-bus': 'Pine wood',
  'small-pine-car': 'Pine wood',
  'small-pine-helicopter': 'Pine wood',
  'small-pine-truck': 'Pine wood',
  'small-pine-ute': 'Pine wood',
  'small-spatula-curve': 'Rimu wood',
  'small-spatula-flat-1': 'Rimu wood',
  'speedster': 'Kauri wood',
  'sportster': 'Kauri wood',
  't-rex': 'Pine wood',
  'teething-ring': 'Rimu wood',
  'toaster-tongs': 'Kauri wood',
  'tour-bus': 'Pine wood',
  'tour-bus-wooden-car': 'Kauri wood',
  'tractor-exquisite': 'Kauri wood',
  'trolley-and-blocks': 'Pine & Macrocarpa wood',
  'truckster': 'Kauri wood',
  'two-window-coupe': 'Kauri wood',
  'wooden-tea-spoon': 'Kauri wood',
};

const extractMaterial = (id: string, name: string, desc?: string): string => {
  const override = MATERIAL_OVERRIDES[id];
  if (override) return override;

  const text = `${name} ${desc || ''}`.toLowerCase();
  const materials = ['rewa rewa', 'kauri', 'rimu', 'macrocarpa', 'pine', 'totara', 'matai'];
  for (const material of materials) {
    if (text.includes(material)) {
      return material.replace(/\b\w/g, c => c.toUpperCase()) + ' wood';
    }
  }
  return 'Premium New Zealand native timber';
};

const getAgeRange = (name: string, category?: string): string => {
  const text = `${name} ${category || ''}`.toLowerCase();
  if (text.includes('baby') || text.includes('infant') || text.includes('rattle')) return '0-12 months';
  if (text.includes('toddler')) return '1-3 years';
  if (text.includes('preschool')) return '3-5 years';
  return '12 months+';
};

// Formats a weight value (stored in kg) for display.
// Shows in grams if under 1kg for readability, otherwise in kg.
const formatWeight = (weightKg: number): string => {
  if (weightKg < 1) {
    return `${Math.round(weightKg * 1000)} g`;
  }
  return `${weightKg.toFixed(2).replace(/\.?0+$/, '')} kg`;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ products, onAddToCart, isLoading = false }) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const product = products.find(p => p.id === productId);

  const productMaterial = product
    ? extractMaterial(product.id, product.name, product.description)
    : 'Premium New Zealand native timber';

  const ageRange = product
    ? getAgeRange(product.name, product.category)
    : '12 months+';

  const lengthMm = product ? (product as any).length_mm ?? (product as any).lengthMm : undefined;
  const widthMm = product ? (product as any).width_mm ?? (product as any).widthMm : undefined;
  const heightMm = product ? (product as any).height_mm ?? (product as any).heightMm : undefined;
  const weightKg = product ? (product as any).weight ?? undefined : undefined;

  const videoUrl = product ? (product as any).video_url ?? (product as any).videoUrl : undefined;
  const hasVideo = typeof videoUrl === 'string' && videoUrl.length > 0;

  const hasDimensions = lengthMm != null && widthMm != null && heightMm != null;
  const hasWeight = weightKg != null && weightKg !== '';

  const canonicalUrl = `https://poppaswoodencreations.co.nz/products/${productId}`;

  const productImage = product?.images?.[0] || '';
  const fullImageUrl = productImage.startsWith('http')
    ? productImage
    : productImage
      ? `https://poppaswoodencreations.co.nz${productImage}`
      : 'https://poppaswoodencreations.co.nz/og-image.jpg';

  const isTestProduct = productId
    ? (productId.startsWith('SQ') || productId === 'product-8')
    : false;

  const shouldNoIndex = isTestProduct;

  const enhancedDescription = product?.description
    ? `${product.description} Handcrafted in Whangarei, New Zealand from ${productMaterial}. Finished with non-toxic, food-safe oils. Safe for children ${ageRange}. Supplied to schools nationwide.`
    : `Handcrafted wooden toy made from ${productMaterial} in Whangarei, New Zealand. Non-toxic finish, safe for children ${ageRange}. Perfect for Montessori-inspired play and early childhood development.`;

  useSEO({
    title: product?.seoTitle || (product ? `${product.name} | Poppa's Wooden Creations` : `Wooden Toy | Poppa's Wooden Creations`),
    description: (product?.seoDescription || enhancedDescription).substring(0, 160),
    image: fullImageUrl,
    type: 'product',
    canonical: canonicalUrl,
    noindex: shouldNoIndex
  });

  if (isLoading || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

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
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "NZ",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
        "returnPolicyCountry": "NZ"
      },
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
    "category": product.category || "Wooden Toys",
    "material": productMaterial,
    ...(hasWeight ? { "weight": { "@type": "QuantitativeValue", "value": weightKg, "unitCode": "KGM" } } : {}),
    ...(hasDimensions ? {
      "depth": { "@type": "QuantitativeValue", "value": lengthMm, "unitCode": "MMT" },
      "width": { "@type": "QuantitativeValue", "value": widthMm, "unitCode": "MMT" },
      "height": { "@type": "QuantitativeValue", "value": heightMm, "unitCode": "MMT" }
    } : {}),
    "audience": {
      "@type": "PeopleAudience",
      "suggestedMinAge": "1",
      "suggestedMaxAge": "8"
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Age Suitability", "value": ageRange },
      { "@type": "PropertyValue", "name": "Finish", "value": "Non-toxic food-safe oil" },
      { "@type": "PropertyValue", "name": "Origin", "value": "Handcrafted in New Zealand" },
      { "@type": "PropertyValue", "name": "Suitable For", "value": "Montessori-inspired play, early childhood development" },
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
        "name": product.category ? product.category.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Products',
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
              {hasVideo && (
                <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                  <video
                    src={videoUrl}
                    poster={productImage || undefined}
                    muted
                    loop
                    autoPlay
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                    aria-label={`${product.name} - 360 degree turntable video showing ${productMaterial} craftsmanship`}
                  >
                    Your browser does not support embedded videos.
                  </video>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-amber-600">${product.price.toFixed(2)} NZD</span>
                  {product.featured && (
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                  )}
                </div>
              </div>

              {product.description && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

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
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium text-gray-900 ml-2">Suitable for {ageRange}</span>
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
                    <span className="font-medium text-gray-900 ml-2">Montessori-inspired play</span>
                  </div>
                  {hasDimensions && (
                    <div>
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="font-medium text-gray-900 ml-2">{lengthMm} x {widthMm} x {heightMm} mm</span>
                    </div>
                  )}
                  {hasWeight && (
                    <div>
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium text-gray-900 ml-2">{formatWeight(Number(weightKg))}</span>
                    </div>
                  )}
                </div>
              </div>

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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Shipping Information</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• NZ shipping from $10.00 NZD (by weight), FREE on orders over $1000 NZD</p>
                  <p>• Rural delivery: +$6.00 NZD surcharge may apply</p>
                  <p>• Free pickup available from our Whangarei workshop</p>
                  <p>• Worldwide shipping available</p>
                  <p>• Processing time: 1-2 business days</p>
                  <p>• Standard NZ delivery: 2-5 business days</p>
                </div>
              </div>
            </div>
          </div>

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

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <p className="text-gray-600">
              Read genuine customer reviews on our{' '}
              <button onClick={() => navigate('/reviews')} className="text-amber-600 font-medium hover:underline">
                Reviews page
              </button>.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProductDetail;
