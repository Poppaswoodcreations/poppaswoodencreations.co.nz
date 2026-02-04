import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ReviewsSchemaProps {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

const ReviewsSchema: React.FC<ReviewsSchemaProps> = ({ 
  ratingValue, 
  reviewCount,
  bestRating = 5,
  worstRating = 1
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Poppa's Wooden Creations",
    "image": "https://poppaswoodencreations.co.nz/hero-image.jpg",
    "url": "https://poppaswoodencreations.co.nz",
    "telephone": "+64210228166",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "102 Kiripaka Rd",
      "addressLocality": "Whangarei",
      "addressRegion": "Northland",
      "postalCode": "0110",
      "addressCountry": "NZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -35.7082,
      "longitude": 174.3190
    },
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toFixed(1),
      "bestRating": bestRating,
      "worstRating": worstRating,
      "reviewCount": reviewCount,
      "ratingCount": reviewCount
    },
    "description": "Handcrafted wooden toys made from native New Zealand timber. Trusted by Montessori schools and eco-conscious families across New Zealand.",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "15:00"
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default ReviewsSchema;
