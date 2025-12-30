import { Helmet } from 'react-helmet-async';

const WoodenCarsPage = () => {
  // Schema data
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Handcrafted Wooden Cars",
    "description": "Wooden toy cars handcrafted from native New Zealand timber. From simple cars to premium models. Prices from $5 to $190.",
    "url": "https://poppaswoodencreations.co.nz/wooden-cars",
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
    "name": "Wooden Cars Collection",
    "description": "Handcrafted wooden toy cars from native NZ timber",
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NZD",
      "lowPrice": "5",
      "highPrice": "190",
      "offerCount": "12",
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
        "name": "Wooden Cars",
        "item": "https://poppaswoodencreations.co.nz/wooden-cars"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Wooden Toy Cars NZ $5-$190 | Handcrafted Kauri Cars | Poppa's Wooden Creations</title>
        <meta name="description" content="Wooden toy cars $5-$190. Handcrafted in Whangarei from Kauri, Rimu & Macrocarpa timber. From simple cars to premium models." />
        <meta name="keywords" content="wooden toy cars NZ, Kauri cars, wooden cars Whangarei, handcrafted toy cars" />
        
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
        <h1>Wooden Cars</h1>
        {/* ... keep all your existing content here ... */}
      </div>
    </>
  );
};

export default WoodenCarsPage;
