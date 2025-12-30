import { Helmet } from 'react-helmet-async';

const WoodenTrainsPage = () => {
  // Schema data
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Handcrafted Wooden Train Toys",
    "description": "Premium wooden train sets and toy trains handcrafted from native New Zealand timber. Kauri, Rimu, and Macrocarpa train toys built to last generations. Prices from $30 to $100.",
    "url": "https://poppaswoodencreations.co.nz/wooden-trains",
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
    "name": "Wooden Train Toys Collection",
    "description": "Handcrafted wooden train sets from native New Zealand timber",
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NZD",
      "lowPrice": "30",
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
        "name": "Wooden Trains",
        "item": "https://poppaswoodencreations.co.nz/wooden-trains"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Wooden Train Toys NZ $30-$100 | Handcrafted Kauri & Rimu | Poppa's Wooden Creations</title>
        <meta name="description" content="Premium wooden train sets $30-$100. Handcrafted in Whangarei from native Kauri, Rimu & Macrocarpa timber. Heirloom-quality trains built to last generations." />
        <meta name="keywords" content="wooden train toys NZ, Kauri train set, wooden trains Whangarei, handcrafted toy trains" />
        
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
        <h1>Wooden Trains</h1>
        {/* ... keep all your existing content here ... */}
      </div>
    </>
  );
};

export default WoodenTrainsPage;
