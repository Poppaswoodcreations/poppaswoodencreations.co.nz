import { Helmet } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import { Product } from '../types';

const ProductGrid = lazy(() => import('../components/ProductGrid'));

interface WoodenPensPageProps {
  products: Product[];
  onProductSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

const WoodenPensPage = ({ products, onProductSelect, onAddToCart }: WoodenPensPageProps) => {
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Handcrafted Wooden Pens — New Zealand Native Timber",
    "description": "Luxury hand-turned wooden pens crafted in Whangarei from native NZ Kauri, Rimu, Totara and Rewa-Rewa timber. Unique gifts and writing instruments from $45.",
    "url": "https://poppaswoodencreations.co.nz/wooden-pens",
    "inLanguage": "en-NZ",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Poppa's Wooden Creations",
      "url": "https://poppaswoodencreations.co.nz"
    }
  };

  const aggregateOfferSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wooden Pens Collection",
    "description": "Hand-turned wooden pens from native New Zealand Kauri, Rimu, Totara and Rewa-Rewa timber",
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NZD",
      "lowPrice": "45",
      "highPrice": "45",
      "offerCount": "11",
      "availability": "https://schema.org/InStock"
    }
  };

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
        "name": "Wooden Pens",
        "item": "https://poppaswoodencreations.co.nz/wooden-pens"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What refill do your wooden pens use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our pens use standard international Parker-style refills, available from most stationery and office supply stores in New Zealand."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get a wooden pen engraved or personalised?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — contact us before ordering and we can discuss personalisation options for special gifts or corporate orders."
        }
      },
      {
        "@type": "Question",
        "name": "Are the timbers in your pens sustainably sourced?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All our native timbers are sourced from legal, sustainable sources — primarily recycled and salvaged timber — to protect New Zealand's native forests."
        }
      },
      {
        "@type": "Question",
        "name": "Do you ship wooden pens throughout New Zealand?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we ship to all New Zealand addresses. Standard shipping is $8.50 NZD."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Handcrafted Wooden Pens NZ | Kauri, Rimu, Totara & Rewa-Rewa | Poppa's Wooden Creations</title>
        <meta name="description" content="Hand-turned wooden pens made in Whangarei, New Zealand from native Kauri, Rimu, Totara and Rewa-Rewa timber. Luxury writing instruments and unique NZ gifts from $45." />
        <meta name="keywords" content="wooden pens NZ, Kauri pen, Rimu pen, Totara pen, Rewa-Rewa pen, handcrafted pen New Zealand, wooden pen gift NZ, luxury writing instrument NZ" />
        <link rel="canonical" href="https://poppaswoodencreations.co.nz/wooden-pens" />

        <script type="application/ld+json">
          {JSON.stringify(collectionPageSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(aggregateOfferSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Handcrafted Wooden Pens — New Zealand Native Timber</h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Luxury writing instruments hand-turned in our Whangarei workshop from Kauri, Rimu, Totara, and 
              Rewa-Rewa — each pen a unique piece of New Zealand craftsmanship. No two pens are ever identical, 
              making every one a genuinely personal treasure.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Wooden Pens?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Truly One of a Kind:</strong> Natural grain variation means every pen is completely unique — no two are ever the same</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Premium Native Timbers:</strong> Crafted from Kauri, Rimu, Totara, and Rewa-Rewa — four of New Zealand's most treasured native woods</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Three Fitting Styles:</strong> Choose from Chrome Black Click, Gold Touch Stylus, or Antique Bronze Polish to suit your taste</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Standard Refills:</strong> All pens use Parker-style refills available at any NZ stationery store</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Exceptional Gift:</strong> Beautifully finished and ready to gift — perfect for birthdays, retirements, and corporate occasions</span>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">New Zealand Timbers We Use</h2>
            <p className="text-gray-700 leading-relaxed">
              Our pens are crafted from four of New Zealand's most treasured native timbers. Kauri is celebrated 
              for its warm golden tones and extraordinary grain clarity — one of the most prized woods in the world. 
              Rimu displays rich reddish-brown hues with fine, rippling grain that catches light beautifully. 
              Totara offers deep, warm tones with a smooth, even texture that turns exceptionally well. 
              Rewa-Rewa (New Zealand Honeysuckle) is perhaps the most striking of all — its dramatic dark streaks 
              and contrasting grain make every pen a genuine conversation piece.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pen Styles and Fittings</h2>
            <p className="text-gray-700 leading-relaxed">
              Each timber is available in three premium fitting styles. The <strong>Chrome Black Click Pen</strong> offers 
              a sleek, contemporary look with a satisfying click mechanism. The <strong>Gold Touch Stylus Pen</strong> combines 
              a traditional gold finish with a built-in stylus tip for use on touchscreens — perfect for the modern 
              professional. The <strong>Antique Bronze Polish Larger Ball Pen</strong> delivers a classic, weighty feel with 
              a warm bronze finish that develops character over time. All pens use standard international refills, 
              easily replaced at any stationery store.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Perfect New Zealand Gift</h2>
            <p className="text-gray-700 leading-relaxed">
              A handcrafted wooden pen from Poppa's Wooden Creations makes an exceptional gift for birthdays, 
              retirements, graduations, and corporate occasions. Each pen is finished ready to gift and can be 
              personalised on request. At $45, they represent outstanding value for a genuinely handmade luxury 
              item that will be used and admired every day. By choosing one of our pens, you're supporting a small 
              New Zealand workshop and giving something no department store can offer — a piece of real, local 
              craftsmanship with a story behind it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Handmade in Whangarei, New Zealand</h2>
            <p className="text-gray-700 leading-relaxed">
              Every pen is individually hand-turned on a lathe in our workshop at Tikipunga, Whangarei by a craftsman 
              with over 15 years of woodworking experience. We don't use CNC machines or outsourced production. 
              Each blank is carefully selected for grain quality, turned to shape, sanded through progressive grits 
              to a glass-smooth finish, and fitted with precision brass hardware. The result is a writing instrument 
              that feels as beautiful as it looks — and carries the genuine warmth of something made by hand.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">What refill do your pens use?</h3>
                <p className="text-gray-700">Our pens use standard international Parker-style refills, available from most stationery and office supply stores in New Zealand.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Can I get a pen engraved or personalised?</h3>
                <p className="text-gray-700">Yes — contact us before ordering and we can discuss personalisation options for special gifts or corporate orders.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Do you ship wooden pens throughout New Zealand?</h3>
                <p className="text-gray-700">Yes, we ship to all New Zealand addresses. Standard shipping is $8.50 NZD.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Are the timbers sustainably sourced?</h3>
                <p className="text-gray-700">All our native timbers are sourced from legal, sustainable sources — primarily recycled and salvaged timber — to protect New Zealand's native forests.</p>
              </div>
            </div>
          </section>

        </div>

        <Suspense fallback={<div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <ProductGrid
            products={products}
            onProductSelect={onProductSelect}
            onAddToCart={onAddToCart}
            category="wooden-pens"
          />
        </Suspense>
      </div>
    </>
  );
};

export default WoodenPensPage;
