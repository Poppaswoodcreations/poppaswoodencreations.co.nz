import { Helmet } from 'react-helmet-async';

export const HomePageSchema = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://poppaswoodencreations.co.nz/#organization",
    "name": "Poppa's Wooden Creations",
    "url": "https://poppaswoodencreations.co.nz",
    "logo": {
      "@type": "ImageObject",
      "url": "https://poppaswoodencreations.co.nz/logo.png",
      "width": 250,
      "height": 60
    },
    "description": "Handmade wooden toys and kitchenware from native New Zealand timbers including Kauri, Rimu, and Macrocarpa. Specializing in children's wooden toys, Montessori educational toys, and premium wooden baby toys. Serving eco-conscious families across New Zealand since 2015.",
    "foundingDate": "2015",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Whangarei",
      "addressRegion": "Northland",
      "postalCode": "0110",
      "addressCountry": "NZ"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@poppaswoodencreations.co.nz",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://www.facebook.com/poppaswoodencreations",
      "https://www.instagram.com/poppaswoodencreations"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": "https://poppaswoodencreations.co.nz/#store",
    "name": "Poppa's Wooden Creations",
    "image": "https://poppaswoodencreations.co.nz/og-image.jpg",
    "description": "Premium handmade wooden toys NZ. Specializing in children's wooden toys, wooden baby toys, and Montessori-aligned educational toys crafted from native New Zealand timbers (Kauri, Rimu, Macrocarpa). Trusted supplier to Montessori schools across New Zealand.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Whangarei",
      "addressRegion": "Northland",
      "postalCode": "0110",
      "addressCountry": "NZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -35.7275,
      "longitude": 174.3166
    },
    "url": "https://poppaswoodencreations.co.nz",
    "email": "contact@poppaswoodencreations.co.nz",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "paymentAccepted": ["Credit Card", "Bank Transfer"],
    "currenciesAccepted": "NZD",
    "areaServed": {
      "@type": "Country",
      "name": "New Zealand"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://poppaswoodencreations.co.nz/#website",
    "name": "Poppa's Wooden Creations",
    "url": "https://poppaswoodencreations.co.nz",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://poppaswoodencreations.co.nz/products?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@id": "https://poppaswoodencreations.co.nz/#organization"
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
        "item": "https://poppaswoodencreations.co.nz/"
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};
