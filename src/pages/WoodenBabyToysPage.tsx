import { Helmet } from 'react-helmet-async';

const WoodenBabyToysPage = () => {
  // Schema data
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Handcrafted Wooden Baby Toys",
    "description": "Safe, non-toxic wooden baby toys handcrafted from native New Zealand timber. Montessori-inspired sensory toys for babies 0-18 months. Prices from $20 to $120.",
    "url": "https://poppaswoodencreations.co.nz/wooden-baby-toys",
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
    "name": "Wooden Baby Toys Collection",
    "description": "Safe, non-toxic wooden baby toys from native NZ timber",
    "brand": {
      "@type": "Brand",
      "name": "Poppa's Wooden Creations"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NZD",
      "lowPrice": "20",
      "highPrice": "120",
      "offerCount": "15",
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
        "name": "Baby Toys",
        "item": "https://poppaswoodencreations.co.nz/wooden-baby-toys"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Wooden Baby Toys NZ $20-$120 | Safe Teething Toys & Rattles | Poppa's Wooden Creations</title>
        <meta name="description" content="Safe, non-toxic wooden baby toys $20-$120. Handcrafted in Whangarei from Rimu & Kauri with food-safe finishes. For babies 0-18 months." />
        <meta name="keywords" content="wooden baby toys NZ, teething ring Rimu, safe baby toys Whangarei, Montessori baby toys" />
        
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
        <h1>Wooden Baby Toys</h1>
        {/* ... keep all your existing content here ... */}
      </div>
    </>
  );
};

export default WoodenBabyToysPage;
