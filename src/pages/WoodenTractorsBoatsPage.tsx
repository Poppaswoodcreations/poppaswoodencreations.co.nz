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

      {/* YOUR EXISTING PAGE CONTENT GOES BELOW - DON'T DELETE IT! */}
      <div>
        <h1>Wooden Tractors & Boats</h1>
        {/* ... keep all your existing content here ... */}
      </div>
    </>
  );
};

export default WoodenTractorsBoatsPage;
