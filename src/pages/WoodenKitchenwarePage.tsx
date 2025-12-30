import { Helmet } from 'react-helmet-async';

const WoodenKitchenwarePage = () => {
  // Schema data
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Handcrafted Wooden Kitchenware",
    "description": "Premium wooden kitchen utensils handcrafted from native New Zealand timber. Durable, beautiful, and sustainably sourced. Prices from $20 to $40.",
    "url": "https://poppaswoodencreations.co.nz/wooden-kitchenware",
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
    "name": "Wooden Kitchenware Collection",
    "description": "Premium wooden kitchen utensils from native NZ timber",
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NZD",
      "lowPrice": "20",
      "highPrice": "40",
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
        "name": "Kitchenware",
        "item": "https://poppaswoodencreations.co.nz/wooden-kitchenware"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Wooden Kitchenware NZ $20-$40 | Rimu Spatulas & Utensils | Poppa's Wooden Creations</title>
        <meta name="description" content="Premium wooden kitchen utensils $20-$40. Handcrafted in Whangarei from Rimu, Kauri & Macrocarpa timber. Durable and beautiful." />
        <meta name="keywords" content="wooden kitchenware NZ, Rimu spatula, wooden spoons, wooden utensils Whangarei" />
        
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
        <h1>Wooden Kitchenware</h1>
        {/* ... keep all your existing content here ... */}
      </div>
    </>
  );
};

export default WoodenKitchenwarePage;
