import { Helmet } from 'react-helmet-async';

const WoodenPlanesHelicoptersPage = () => {
  // Schema data
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
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
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
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://poppaswoodencreations.co.nz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Planes & Helicopters",
        "item": "https://poppaswoodencreations.co.nz/wooden-planes-helicopters"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Wooden Planes & Helicopters NZ $20-$40 | Toy Aircraft | Poppa's Wooden Creations</title>
        <meta name="description" content="Wooden airplanes and helicopters $20-$40. Handcrafted in Whangarei from native NZ timber. Perfect for imaginative flight play." />
        <meta name="keywords" content="wooden planes NZ, wooden helicopters, toy aircraft, wooden airplanes Whangarei" />
        
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Handcrafted Wooden Planes & Helicopters</h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Take flight with our handcrafted wooden planes and helicopters, made from beautiful New Zealand 
              native timbers. These aviation-themed toys inspire dreams of adventure while providing tactile, 
              screen-free play experiences that develop imagination and motor skills.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Wooden Aircraft?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Aviation Adventures:</strong> Encourages imaginative play and storytelling about travel, exploration, and adventure</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Simple Design Philosophy:</strong> Aligns with Montessori principles of open-ended, creative play without batteries or electronics</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Native NZ Timber:</strong> Crafted from Rimu, Kauri, and Macrocarpa with stunning natural grain patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Motor Skill Development:</strong> Perfect size and weight for developing hand-eye coordination and grip strength</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span><strong>Heirloom Quality:</strong> Built to last generations and become treasured family keepsakes</span>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfect for Growing Pilots</h2>
            <p className="text-gray-700 leading-relaxed">
              Suitable for ages 2-8 years, our wooden aircraft are designed with young pilots in mind. The substantial 
              weight and smooth finish provide important sensory feedback, while the simple shape encourages creative 
              interpretation rather than passive play. Each piece is hand-sanded to a silky-smooth finish and treated 
              with child-safe natural oils that enhance the natural beauty of the wood grain. These toys are sized 
              perfectly for little hands learning to grasp, manipulate, and navigate objects through space.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sustainably Crafted in New Zealand</h2>
            <p className="text-gray-700 leading-relaxed">
              Every plane and helicopter is individually handcrafted in our Whangarei workshop from sustainably 
              sourced New Zealand native timbers including Rimu, Kauri, and Macrocarpa. These toys are completely 
              natural, biodegradable, and free from harmful plastics or chemicals. By choosing wooden toys, you're 
              making an environmentally responsible choice that supports local New Zealand craftsmanship. Each piece 
              showcases the unique character and beauty of our native timbers, with no two toys exactly alike.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Play Value</h2>
            <p className="text-gray-700 leading-relaxed">
              Our wooden aircraft support Montessori educational principles by providing simple, beautiful objects 
              that encourage imaginative play. Without electronic sounds or lights, children must create their own 
              narratives and sound effects, developing creativity, language skills, and problem-solving abilities. 
              The natural materials connect children to the physical world in a way plastic toys cannot. Trusted by 
              Montessori schools throughout New Zealand for over 10 years, these toys foster independent play, 
              concentration, and fine motor development.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Care & Maintenance</h2>
            <p className="text-gray-700 leading-relaxed">
              These toys are built to last generations with minimal care. Clean with a damp cloth and dry immediately. 
              Store in a dry place away from direct sunlight. The natural finish will develop a beautiful patina over 
              time, adding character to each piece. Apply natural wood oil (such as coconut or mineral oil) annually 
              to maintain protection and enhance the timber's natural beauty. With proper care, these aircraft will 
              become beloved family heirlooms that can be passed down through generations.
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

export default WoodenPlanesHelicoptersPage;
