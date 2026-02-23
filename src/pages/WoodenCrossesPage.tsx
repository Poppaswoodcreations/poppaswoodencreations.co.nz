import { Helmet } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import { Product } from '../types';

const ProductGrid = lazy(() => import('../components/ProductGrid'));

interface WoodenCrossesPageProps {
  products: Product[];
  onProductSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

const WoodenCrossesPage = ({ products, onProductSelect, onAddToCart }: WoodenCrossesPageProps) => {
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Handcrafted Wooden Crosses — New Zealand Rimu",
    "description": "Meaningful heirloom-quality wooden crosses hand-carved in Whangarei from New Zealand Rimu timber. Perfect for christenings, memorials and special gifts.",
    "url": "https://poppaswoodencreations.co.nz/wooden-crosses",
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
    "name": "Wooden Crosses Collection",
    "description": "Hand-carved wooden crosses from native New Zealand Rimu timber",
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NZD",
      "lowPrice": "80",
      "highPrice": "80",
      "offerCount": "1",
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
        "name": "Wooden Crosses",
        "item": "https://poppaswoodencreations.co.nz/wooden-crosses"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I order a personalised or engraved wooden cross?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, personalisation is available for special occasions such as memorials or christenings. Contact us before ordering to discuss options."
        }
      },
      {
        "@type": "Question",
        "name": "What timber are the crosses made from?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our crosses are hand-carved from New Zealand Rimu — a native timber prized for its rich reddish-brown tones and fine, even grain."
        }
      },
      {
        "@type": "Question",
        "name": "Do you ship wooden crosses throughout New Zealand?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we ship to all New Zealand addresses. Standard shipping is $8.50 NZD."
        }
      },
      {
        "@type": "Question",
        "name": "Is the Rimu timber sustainably sourced?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — all our Rimu comes from legal, sustainable sources, primarily salvaged or recycled timber, to protect New Zealand's native forests."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Handcrafted Rimu Wooden Cross NZ | Memorial & Christening Gift | Poppa's Wooden Creations</title>
        <meta name="description" content="Hand-carved wooden crosses made in Whangarei from New Zealand Rimu timber. Meaningful gifts for christenings, confirmations, memorials and special occasions. Made by hand in NZ." />
        <meta name="keywords" content="wooden cross NZ, Rimu wooden cross, wooden cross gift New Zealand, memorial wooden cross, christening gift NZ, handcrafted cross Whangarei" />
        <link rel="canonical" href="https://poppaswoodencreations.co.nz/wooden-crosses" />

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Handcrafted Wooden Crosses — New Zealand Rimu</h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Meaningful, heirloom-quality wooden crosses hand-carved in Whangarei from beautiful New Zealand 
              Rimu timber. Each cross carries the quiet beauty of genuine local craftsmanship — made to be 
              treasured for a lifetime and passed down through generations.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose a Handcrafted Wooden Cross?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Genuinely Handmade:</strong> Each cross is individually shaped and finished by hand — not machine-cut or mass-produced</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>New Zealand Rimu:</strong> Crafted from one of NZ's most beautiful native timbers, with rich warm tones and fine natural grain</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Meaningful Gift:</strong> Perfect for christenings, confirmations, Easter, memorials, and other significant life occasions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Personalisation Available:</strong> Contact us to discuss engraving or custom options for special occasions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Heirloom Quality:</strong> Built to last generations — a keepsake far beyond anything mass-produced</span>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Rimu?</h2>
            <p className="text-gray-700 leading-relaxed">
              Rimu (Dacrydium cupressinum) is one of New Zealand's most iconic native conifers, revered for its 
              beauty and longevity. The timber displays rich reddish-brown tones with fine, even grain that polishes 
              to a warm, lustrous finish. As a material for meaningful objects like crosses, Rimu carries a natural 
              sense of depth and permanence — qualities that make it particularly fitting for items intended to be 
              treasured for generations. Our Rimu is sourced from legal, sustainable supplies to protect 
              New Zealand's native forests.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">A Thoughtful New Zealand Gift</h2>
            <p className="text-gray-700 leading-relaxed">
              A handcrafted Rimu cross from Poppa's Wooden Creations makes a deeply meaningful gift for 
              christenings, confirmations, Easter, memorials, and significant life moments. Each cross is 
              finished to a smooth, tactile quality that feels as beautiful as it looks. At $80, it represents 
              a genuinely unique, locally made keepsake that carries far more meaning than anything mass-produced. 
              We can discuss personalisation options for special occasions — contact us before ordering.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Made by Hand in Whangarei</h2>
            <p className="text-gray-700 leading-relaxed">
              Every cross we make is crafted entirely by hand in our workshop at Tikipunga, Whangarei. We don't 
              use CNC machines or outsource production — each piece reflects the skill and care of a craftsman 
              with over 15 years of woodworking experience. When you purchase from Poppa's Wooden Creations, 
              you're supporting a genuine New Zealand small business and receiving something made with real human 
              hands and attention to detail. The natural variation in Rimu's grain means every cross is 
              subtly different — truly one of a kind.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Care & Maintenance</h2>
            <p className="text-gray-700 leading-relaxed">
              To keep your wooden cross looking beautiful for years to come, dust regularly with a soft dry cloth. 
              Avoid prolonged exposure to direct sunlight or damp conditions. Occasionally apply a small amount of 
              natural wood oil (such as beeswax or linseed oil) to nourish the timber and maintain its warm lustre. 
              With simple care, a Rimu cross from Poppa's Wooden Creations will remain a cherished piece for 
              decades to come.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Can I order a personalised or engraved cross?</h3>
                <p className="text-gray-700">Yes, personalisation is available for special occasions such as memorials or christenings. Contact us before ordering to discuss options.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">What timber are the crosses made from?</h3>
                <p className="text-gray-700">Our crosses are hand-carved from New Zealand Rimu — a native timber prized for its rich reddish-brown tones and fine, even grain.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Do you ship throughout New Zealand?</h3>
                <p className="text-gray-700">Yes, we ship to all New Zealand addresses. Standard shipping is $8.50 NZD.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Is the Rimu sustainably sourced?</h3>
                <p className="text-gray-700">Yes — all our Rimu comes from legal, sustainable sources, primarily salvaged or recycled timber, to protect New Zealand's native forests.</p>
              </div>
            </div>
          </section>

        </div>

        <Suspense fallback={<div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <ProductGrid
            products={products}
            onProductSelect={onProductSelect}
            onAddToCart={onAddToCart}
            category="wooden-crosses"
          />
        </Suspense>
      </div>
    </>
  );
};

export default WoodenCrossesPage;
