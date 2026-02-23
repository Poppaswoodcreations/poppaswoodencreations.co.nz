import { Helmet } from 'react-helmet-async';

const WoodenPlanesHelicoptersPage = () => {
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Handcrafted Wooden Planes and Helicopters",
    "description": "Wooden airplane and helicopter toys handcrafted from native New Zealand timber. Perfect for imaginative flight play. Prices from $20 to $40.",
    "url": "https://poppaswoodencreations.co.nz/wooden-planes-helicopters",
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
    "name": "Wooden Planes and Helicopters Collection",
    "description": "Handcrafted wooden aircraft toys from native NZ timber",
    "brand": { "@type": "Brand", "name": "Poppa's Wooden Creations" },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NZD",
      "lowPrice": "20",
      "highPrice": "40",
      "offerCount": "6",
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://poppaswoodencreations.co.nz" },
      { "@type": "ListItem", "position": 2, "name": "Planes & Helicopters", "item": "https://poppaswoodencreations.co.nz/wooden-planes-helicopters" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What age are the wooden planes and helicopters suitable for?", "acceptedAnswer": { "@type": "Answer", "text": "Our wooden aircraft are suitable for children aged 3 and up. All pieces are sanded smooth with no sharp edges." } },
      { "@type": "Question", "name": "What timber are the planes made from?", "acceptedAnswer": { "@type": "Answer", "text": "Our range uses New Zealand Pine and Rimu. The Rimu Helicopter is made from native Rimu, while the Pine Plane, Pine Helicopter, Small Pine Helicopter, and Biplane use New Zealand Pine." } },
      { "@type": "Question", "name": "Are these toys safe and non-toxic?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — we use only child-safe finishes on all our toys. All pieces are sanded smooth by hand to remove any sharp edges." } },
      { "@type": "Question", "name": "Can I buy these for a Montessori school?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely — we supply Montessori schools across New Zealand and offer school orders. Contact us to discuss bulk pricing." } }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Handcrafted Wooden Planes & Helicopters NZ | Montessori Toys | Poppa's Wooden Creations</title>
        <meta name="description" content="Hand-carved wooden planes and helicopters made in Whangarei, New Zealand from native Rimu and Pine. Heirloom-quality Montessori wooden toys for children aged 3+." />
        <meta name="keywords" content="wooden planes NZ, wooden helicopters, toy aircraft, wooden airplanes Whangarei, Montessori wooden toys NZ, wooden toy plane New Zealand" />
        <link rel="canonical" href="https://poppaswoodencreations.co.nz/wooden-planes-helicopters" />
        <script type="application/ld+json">{JSON.stringify(collectionPageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(aggregateOfferSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Handcrafted Wooden Planes & Helicopters</h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Take to the skies with our handcrafted wooden planes and helicopters, made from beautiful New Zealand
              native timbers in our Whangarei workshop. Designed to inspire open-ended imaginative play, these toys
              are built to the same heirloom standard as all our products — sturdy enough to be passed down through
              generations, beautiful enough to display on a shelf.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Wooden Aircraft?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start"><span className="text-green-600 mr-2 mt-1">✓</span><span><strong>Aviation Adventures:</strong> Encourages imaginative play and storytelling about travel, exploration, and adventure</span></li>
              <li className="flex items-start"><span className="text-green-600 mr-2 mt-1">✓</span><span><strong>Montessori Aligned:</strong> Open-ended play without batteries or electronics — children create their own narratives</span></li>
              <li className="flex items-start"><span className="text-green-600 mr-2 mt-1">✓</span><span><strong>Native NZ Timber:</strong> Crafted from Rimu and Pine with stunning natural grain patterns unique to each piece</span></li>
              <li className="flex items-start"><span className="text-green-600 mr-2 mt-1">✓</span><span><strong>Child Safe:</strong> Hand-sanded smooth with child-safe natural finishes — no sharp edges or toxic materials</span></li>
              <li className="flex items-start"><span className="text-green-600 mr-2 mt-1">✓</span><span><strong>Heirloom Quality:</strong> Built to last generations and become treasured family keepsakes</span></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Wooden Aircraft Range</h2>
            <p className="text-gray-700 leading-relaxed">
              Our range includes the classic Pine Plane, the Biplane with its distinctive double-wing design,
              the Rimu Helicopter crafted from rich native Rimu, and the Pine Helicopter and Small Pine Helicopter
              for younger children. Each aircraft has its own character, shaped by the natural variation of the timber used.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfect for Growing Pilots</h2>
            <p className="text-gray-700 leading-relaxed">
              Suitable for ages 3 and up. The substantial weight and smooth finish provide important sensory
              feedback, while the simple shape encourages creative interpretation. Trusted by Montessori schools
              throughout New Zealand, these toys foster independent play, concentration, and fine motor development.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sustainably Crafted in New Zealand</h2>
            <p className="text-gray-700 leading-relaxed">
              Every plane and helicopter is individually handcrafted in our Whangarei workshop from sustainably
              sourced New Zealand native timbers. Completely natural, biodegradable, and free from harmful plastics
              or chemicals. No two toys are exactly alike.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">What age are these suitable for?</h3>
                <p className="text-gray-700">Our wooden aircraft are suitable for children aged 3 and up. All pieces are sanded smooth with no sharp edges.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">What timber are the planes made from?</h3>
                <p className="text-gray-700">Our range uses New Zealand Pine and Rimu. The Rimu Helicopter uses native Rimu, while the Biplane and Pine Helicopters use New Zealand Pine.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Are these toys safe and non-toxic?</h3>
                <p className="text-gray-700">Yes — we use only child-safe finishes. All pieces are sanded smooth by hand to remove any sharp edges.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Can I buy these for a Montessori school?</h3>
                <p className="text-gray-700">Absolutely — we supply Montessori schools across New Zealand. Contact us to discuss bulk pricing.</p>
              </div>
            </div>
          </section>
      </div>
    </>
  );
};

export default WoodenPlanesHelicoptersPage;
