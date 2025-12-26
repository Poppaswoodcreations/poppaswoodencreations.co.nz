import React from 'react';
import { Helmet } from 'react-helmet-async';

// Types for different schema structures
export interface ProductSchema {
  name: string;
  description: string;
  image: string[];
  sku?: string;
  brand?: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  category?: string;
  material?: string;
}

export interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email: string;
  };
  sameAs?: string[];
}

export interface LocalBusinessSchema {
  name: string;
  image: string;
  url: string;
  telephone?: string;
  email?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  servesCuisine?: string;
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
}

export interface BreadcrumbSchema {
  items: {
    name: string;
    url: string;
  }[];
}

interface SchemaMarkupProps {
  type: 'product' | 'organization' | 'localBusiness' | 'article' | 'breadcrumb';
  data: ProductSchema | OrganizationSchema | LocalBusinessSchema | ArticleSchema | BreadcrumbSchema;
}

export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data }) => {
  const generateSchema = () => {
    switch (type) {
      case 'product':
        return generateProductSchema(data as ProductSchema);
      case 'organization':
        return generateOrganizationSchema(data as OrganizationSchema);
      case 'localBusiness':
        return generateLocalBusinessSchema(data as LocalBusinessSchema);
      case 'article':
        return generateArticleSchema(data as ArticleSchema);
      case 'breadcrumb':
        return generateBreadcrumbSchema(data as BreadcrumbSchema);
      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Product Schema Generator
function generateProductSchema(data: ProductSchema) {
  const schema: any = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    brand: {
      '@type': 'Brand',
      name: data.brand || "Poppa's Wooden Creations"
    },
    offers: {
      '@type': 'Offer',
      url: data.offers.url,
      priceCurrency: data.offers.priceCurrency,
      price: data.offers.price,
      availability: `https://schema.org/${data.offers.availability}`,
      seller: {
        '@type': 'Organization',
        name: "Poppa's Wooden Creations"
      }
    }
  };

  if (data.sku) {
    schema.sku = data.sku;
  }

  if (data.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      reviewCount: data.aggregateRating.reviewCount
    };
  }

  if (data.category) {
    schema.category = data.category;
  }

  if (data.material) {
    schema.material = data.material;
  }

  return schema;
}

// Organization Schema Generator
function generateOrganizationSchema(data: OrganizationSchema) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description
  };

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry
    };
  }

  if (data.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: data.contactPoint.telephone,
      contactType: data.contactPoint.contactType,
      email: data.contactPoint.email
    };
  }

  if (data.sameAs && data.sameAs.length > 0) {
    schema.sameAs = data.sameAs;
  }

  return schema;
}

// Local Business Schema Generator
function generateLocalBusinessSchema(data: LocalBusinessSchema) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    image: data.image,
    url: data.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry
    }
  };

  if (data.telephone) {
    schema.telephone = data.telephone;
  }

  if (data.email) {
    schema.email = data.email;
  }

  if (data.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude
    };
  }

  if (data.openingHours && data.openingHours.length > 0) {
    schema.openingHoursSpecification = data.openingHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0],
      opens: hours.split(' ')[1],
      closes: hours.split(' ')[2]
    }));
  }

  if (data.priceRange) {
    schema.priceRange = data.priceRange;
  }

  return schema;
}

// Article Schema Generator
function generateArticleSchema(data: ArticleSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: data.publisher.logo
      }
    }
  };
}

// Breadcrumb Schema Generator
function generateBreadcrumbSchema(data: BreadcrumbSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Convenience component for multiple schemas on one page
interface MultiSchemaProps {
  schemas: {
    type: 'product' | 'organization' | 'localBusiness' | 'article' | 'breadcrumb';
    data: any;
  }[];
}

export const MultiSchema: React.FC<MultiSchemaProps> = ({ schemas }) => {
  return (
    <>
      {schemas.map((schema, index) => (
        <SchemaMarkup key={index} type={schema.type} data={schema.data} />
      ))}
    </>
  );
};
