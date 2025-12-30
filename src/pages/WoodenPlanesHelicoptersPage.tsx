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

      {/* YOUR EXISTING PAGE CONTENT GOES BELOW - DON'T DELETE IT! */}
      <div>
        <h1>Wooden Planes & Helicopters</h1>
        {/* ... keep all your existing content here ... */}
      </div>
    </>
  );
};

export default WoodenPlanesHelicoptersPage;
