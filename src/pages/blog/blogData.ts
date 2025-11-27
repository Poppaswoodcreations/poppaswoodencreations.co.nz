// src/pages/blog/blogData.ts
// Central location for all blog post content

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featuredImage: string;
  imageAlt: string;
  content: React.ReactNode;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'benefits-wooden-toys-child-development',
    title: '5 Benefits of Wooden Toys for Child Development',
    metaDescription: 'Discover why wooden toys are better for your child\'s development. Learn how they enhance motor skills, creativity, and more from New Zealand\'s wooden toy experts.',
    excerpt: 'Discover why wooden toys are better for your child\'s development, from motor skills to creativity and environmental responsibility. Expert insights from Poppa\'s Wooden Creations.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-11-01',
    readTime: '8 min read',
    category: 'Child Development',
    tags: ['wooden toys', 'child development', 'parenting tips', 'educational toys'],
    featuredImage: '/images/blog/wooden-toys-benefits.jpg',
    imageAlt: 'Child playing with wooden blocks',
    content: null // Will be filled with JSX content below
  },
  {
    slug: 'baby-toy-cars-handcrafted-new-zealand',
    title: 'Discovering Magic in Every Grain: Baby Toy Cars',
    metaDescription: 'Explore our handcrafted baby toy cars made from premium New Zealand timber. Safe, durable, and perfect for developing young minds.',
    excerpt: 'Explore the craftsmanship and heritage behind our handcrafted baby toy cars, made from premium New Zealand native timbers.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-06-13',
    readTime: '5 min read',
    category: 'Products',
    tags: ['baby toys', 'toy cars', 'NZ made', 'wooden vehicles'],
    featuredImage: '/images/blog/baby-toy-cars.jpg',
    imageAlt: 'Handcrafted wooden toy cars for babies',
    content: null
  },
  {
    slug: 'sensory-wooden-toys-babies',
    title: 'Best Sensory Wooden Toys for Babies: A Complete Guide',
    metaDescription: 'Learn how sensory wooden toys support your baby\'s development. Expert guide to choosing safe, engaging sensory toys for infants.',
    excerpt: 'A comprehensive guide to sensory wooden toys and how they support crucial early development in babies aged 0-18 months.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-11-07',
    readTime: '6 min read',
    category: 'Baby Development',
    tags: ['sensory toys', 'baby development', 'infant toys', 'sensory play'],
    featuredImage: '/images/blog/sensory-toys-babies.jpg',
    imageAlt: 'Baby exploring wooden sensory toy',
    content: null
  },
];

// Template for adding new blog posts:
/*
{
  slug: 'url-friendly-title',
  title: 'Your Blog Post Title',
  metaDescription: 'SEO description 150-160 characters',
  excerpt: 'Brief summary for blog listing page',
  author: 'Poppa\'s Wooden Creations',
  date: 'YYYY-MM-DD',
  readTime: 'X min read',
  category: 'Category Name',
  tags: ['tag1', 'tag2', 'tag3'],
  featuredImage: '/images/blog/your-image.jpg',
  imageAlt: 'Description of image',
  content: null // Add JSX content in BlogPost.tsx
}
*/
