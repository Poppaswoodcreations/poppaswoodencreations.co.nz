import React from 'react';
import { Helmet } from 'react-helmet-async';

// FAQ Schema for product pages or dedicated FAQ section
export interface FAQSchema {
  questions: {
    question: string;
    answer: string;
  }[];
}

// Review Schema for individual product reviews
export interface ReviewSchema {
  itemReviewed: {
    name: string;
    type: 'Product';
  };
  reviewRating: {
    ratingValue: number;
    bestRating: number;
  };
  author: {
    name: string;
  };
  reviewBody: string;
  datePublished: string;
}

// ItemList Schema for category/collection pages
export interface ItemListSchema {
  name: string;
  description?: string;
  numberOfItems: number;
  itemListElement: {
    position: number;
    name: string;
    url: string;
    image?: string;
    price?: number;
    priceCurrency?: string;
  }[];
}

// Video Schema for product demos or tutorials
export interface VideoSchema {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string; // ISO 8601 duration format (PT1M30S = 1 min 30 sec)
}

// How-To Schema for tutorial blog posts
export interface HowToSchema {
  name: string;
  description: string;
  image?: string[];
  totalTime?: string; // ISO 8601 duration
  estimatedCost?: {
    currency: string;
    value: number;
  };
  supply?: string[];
  tool?: string[];
  step: {
    name: string;
    text: string;
    image?: string;
    url?: string;
  }[];
}

interface AdditionalSchemaProps {
  type: 'faq' | 'review' | 'itemList' | 'video' | 'howTo';
  data: FAQSchema | ReviewSchema | ItemListSchema | VideoSchema | HowToSchema;
}

export const AdditionalSchema: React.FC<AdditionalSchemaProps> = ({ type, data }) => {
  const generateSchema = () => {
    switch (type) {
      case 'faq':
        return generateFAQSchema(data as FAQSchema);
      case 'review':
        return generateReviewSchema(data as ReviewSchema);
      case 'itemList':
        return generateItemListSchema(data as ItemListSchema);
      case 'video':
        return generateVideoSchema(data as VideoSchema);
      case 'howTo':
        return generateHowToSchema(data as HowToSchema);
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

// FAQ Schema Generator
function generateFAQSchema(data: FAQSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  };
}

// Review Schema Generator
function generateReviewSchema(data: ReviewSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': data.itemReviewed.type,
      name: data.itemReviewed.name
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: data.reviewRating.ratingValue,
      bestRating: data.reviewRating.bestRating
    },
    author: {
      '@type': 'Person',
      name: data.author.name
    },
    reviewBody: data.reviewBody,
    datePublished: data.datePublished
  };
}

// ItemList Schema Generator (for category/collection pages)
function generateItemListSchema(data: ItemListSchema) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.name,
    numberOfItems: data.numberOfItems,
    itemListElement: data.itemListElement.map((item, index) => {
      const element: any = {
        '@type': 'ListItem',
        position: item.position || index + 1,
        name: item.name,
        url: item.url
      };

      // Add product-specific fields if available
      if (item.image || item.price) {
        element.item = {
          '@type': 'Product',
          name: item.name,
          url: item.url
        };

        if (item.image) {
          element.item.image = item.image;
        }

        if (item.price && item.priceCurrency) {
          element.item.offers = {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: item.priceCurrency
          };
        }
      }

      return element;
    })
  };

  if (data.description) {
    schema.description = data.description;
  }

  return schema;
}

// Video Schema Generator
function generateVideoSchema(data: VideoSchema) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate
  };

  if (data.contentUrl) {
    schema.contentUrl = data.contentUrl;
  }

  if (data.embedUrl) {
    schema.embedUrl = data.embedUrl;
  }

  if (data.duration) {
    schema.duration = data.duration;
  }

  return schema;
}

// How-To Schema Generator
function generateHowToSchema(data: HowToSchema) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    step: data.step.map((step, index) => {
      const stepData: any = {
        '@type': 'HowToStep',
        name: step.name,
        text: step.text,
        position: index + 1
      };

      if (step.image) {
        stepData.image = step.image;
      }

      if (step.url) {
        stepData.url = step.url;
      }

      return stepData;
    })
  };

  if (data.image && data.image.length > 0) {
    schema.image = data.image;
  }

  if (data.totalTime) {
    schema.totalTime = data.totalTime;
  }

  if (data.estimatedCost) {
    schema.estimatedCost = {
      '@type': 'MonetaryAmount',
      currency: data.estimatedCost.currency,
      value: data.estimatedCost.value
    };
  }

  if (data.supply && data.supply.length > 0) {
    schema.supply = data.supply.map(item => ({
      '@type': 'HowToSupply',
      name: item
    }));
  }

  if (data.tool && data.tool.length > 0) {
    schema.tool = data.tool.map(item => ({
      '@type': 'HowToTool',
      name: item
    }));
  }

  return schema;
}

// Example Components for Common Use Cases

// FAQ Component for Product Pages
export const ProductFAQ: React.FC<{ productName: string }> = ({ productName }) => {
  const faqData: FAQSchema = {
    questions: [
      {
        question: `What timber is the ${productName} made from?`,
        answer: `The ${productName} is handcrafted from premium native New Zealand timber, including Kauri, Rimu, or Macrocarpa, depending on availability. Each piece showcases the natural beauty and unique grain patterns of these sustainable hardwoods.`
      },
      {
        question: "Is this toy safe for young children?",
        answer: "Yes, all our wooden toys are finished with food-safe, non-toxic oils and are designed to meet New Zealand safety standards for children's toys. They are suitable for ages 0-5 years with appropriate supervision."
      },
      {
        question: "How should I care for wooden toys?",
        answer: "Simply wipe with a damp cloth when needed. Avoid soaking in water. To maintain the natural beauty, you can occasionally apply a small amount of food-safe oil. Store in a dry place away from direct sunlight."
      },
      {
        question: "Are these products made in New Zealand?",
        answer: "Yes, every item is handcrafted in Whangarei, Northland, New Zealand by skilled local artisans committed to quality craftsmanship and sustainable practices."
      }
    ]
  };

  return <AdditionalSchema type="faq" data={faqData} />;
};

// Collection/Category Page Schema
export const CategorySchema: React.FC<{
  categoryName: string;
  products: any[];
}> = ({ categoryName, products }) => {
  const itemListData: ItemListSchema = {
    name: `${categoryName} - Poppa's Wooden Creations`,
    description: `Browse our collection of handcrafted ${categoryName.toLowerCase()} made from native New Zealand timber`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      position: index + 1,
      name: product.name,
      url: `https://poppaswoodencreations.co.nz/products/${product.slug}`,
      image: product.images?.[0],
      price: parseFloat(product.price),
      priceCurrency: 'NZD'
    }))
  };

  return <AdditionalSchema type="itemList" data={itemListData} />;
};
