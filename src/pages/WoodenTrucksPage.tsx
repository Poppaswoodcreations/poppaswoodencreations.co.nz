import { Helmet } from 'react-helmet-async';

const WoodenTrucksPage = () => {
  // Schema data
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Handcrafted Wooden Trucks",
    "description": "Premium wooden toy trucks handcrafted from native New Zealand timber. Kauri and Macrocarpa trucks built to last generations. Prices from $100 to $400.",
    "url": "https://poppaswoodencreations.co.nz/wooden-trucks",
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
    "name": "Wooden Trucks Collection",
    "description": "Premium handcrafted wooden toy trucks from native NZ timber",
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NZD",
      "lowPrice": "100",
      "highPrice": "400",
      "offerCount": "8",
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
        "name": "Wooden Trucks",
        "item": "https://poppaswoodencreations.co.nz/wooden-trucks"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Wooden Toy Trucks NZ $100-$400 | Premium Kauri Trucks | Poppa's Wooden Creations</title>
        <meta name="description" content="Premium wooden toy trucks $100-$400. Handcrafted in Whangarei from Kauri & Macrocarpa timber. Built to last generations." />
        <meta name="keywords" content="wooden toy trucks NZ, Kauri trucks, wooden trucks Whangarei, handcrafted toy trucks" />
        
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

      {/* YOUR EXISTING PAGE CONTENT GOES BELOW - DON'T DELETE IT! */}
      <div>
        <h1>Wooden Trucks</h1>
        {/* ... keep all your existing content here ... */}
      </div>
    </>
  );
};

export default WoodenTrucksPage;
