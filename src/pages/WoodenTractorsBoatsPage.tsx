import { Helmet } from 'react-helmet-async';

const WoodenTractorsBoatsPage = () => {
  // Schema data
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Handcrafted Wooden Tractors and Boats",
    "description": "Wooden tractor and boat toys handcrafted from native New Zealand timber. Perfect for farm and water play. Prices from $20 to $100.",
    "url": "https://poppaswoodencreations.co.nz/wooden-tractors-boats",
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
    "name": "Wooden Tractors and Boats Collection",
    "description": "Handcrafted wooden tractors and boats from native NZ timber",
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NZD",
      "lowPrice": "20",
      "highPrice": "100",
      "offerCount": "10",
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
        "name": "Tractors & Boats",
        "item": "https://poppaswoodencreations.co.nz/wooden-tractors-boats"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Wooden Tractors & Boats NZ $20-$100 | Farm & Water Toys | Poppa's Wooden Creations</title>
        <meta name="description" content="Wooden tractors and boats $20-$100. Handcrafted in Whangarei from Kauri, Rimu & Macrocarpa timber. Perfect for farm and water play." />
        <meta name="keywords" content="wooden tractors NZ, wooden boats, toy tractors, toy boats Whangarei" />
        
        <script type="application/ld+json">
          {JSON.stringify(collectionPageSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(aggregateOfferSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Rich Content Section - ADDED FOR SEO */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Handcrafted Wooden Tractors & Boats</h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Discover our collection of heirloom-quality wooden tractors and boats, handcrafted in Whangarei, 
              New Zealand from sustainable native timbers. Each toy is designed to inspire imaginative play 
              while supporting Montessori educational principles.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Wooden Tractors & Boats?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Farm & Maritime Adventures:</strong> Perfect for encouraging imaginative scenarios about farming, fishing, and water transport</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Generational Durability:</strong> Built to withstand years of play and be passed down through families</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Native NZ Timber:</strong> Crafted from Rimu, Kauri, and Macrocarpa with beautiful natural grain</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Educational Value:</strong> Teaches children about vehicles, farming, and maritime activities while developing motor skills</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Montessori Principles:</strong> Simple, open-ended design encourages creativity without electronic distractions</span>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Age-Appropriate Design</h2>
            <p className="text-gray-700 leading-relaxed">
              Our wooden tractors and boats are sized perfectly for little hands, typically suitable for ages 2-8 years. 
              The simple, robust design makes them ideal for toddlers developing fine motor skills, while older children 
              enjoy incorporating them into complex imaginative play scenarios. Each piece is hand-sanded smooth and 
              finished with child-safe natural oils that bring out the stunning grain of New Zealand native woods.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sustainable & Locally Made</h2>
            <p className="text-gray-700 leading-relaxed">
              Every toy in our tractors and boats collection is made in our Whangarei workshop using sustainably 
              sourced native New Zealand timbers. By choosing wooden toys, you're supporting local craftsmanship 
              and reducing plastic waste in our landfills and oceans. Our toys are completely biodegradable and 
              environmentally friendly. When they eventually reach the end of their very long lifespan, they return 
              to the earth naturally—unlike plastic toys that persist for hundreds of years.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Montessori Educational Benefits</h2>
            <p className="text-gray-700 leading-relaxed">
              Wooden toys align perfectly with Montessori principles of simple, open-ended play. Unlike electronic 
              toys with pre-programmed responses, our tractors and boats encourage creativity, problem-solving, and 
              imaginative thinking. The natural weight and texture of New Zealand native woods provides important 
              sensory feedback for developing minds. For over 10 years, Montessori schools across New Zealand have 
              trusted our wooden toys for their classrooms. The durability that stands up to classroom use makes 
              them perfect for home use too.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Caring for Your Wooden Toys</h2>
            <p className="text-gray-700 leading-relaxed">
              These durable toys require minimal care. Simply wipe with a damp cloth when needed. Avoid soaking in water. 
              Every 6-12 months, you can re-oil with a natural wood oil (such as coconut or mineral oil) to maintain the 
              beautiful finish and protect the native timber. With proper care, these toys will last for generations, 
              becoming treasured family heirlooms that carry memories from one generation to the next.
            </p>
          </section>
        </div>

        {/* YOUR EXISTING PRODUCTS GRID GOES HERE */}
        <div>
          {/* Keep your existing product display code here */}
        </div>
      </div>
    </>
  );
};

export default WoodenTractorsBoatsPage;
