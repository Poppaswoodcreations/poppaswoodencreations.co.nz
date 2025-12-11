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
    content: null
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
  {
    slug: 'how-to-clean-wooden-toys-naturally',
    title: 'How to Clean Wooden Toys Naturally: A Simple Step-by-Step Guide',
    metaDescription: 'Learn how to clean wooden toys naturally using kitchen staples like vinegar and lemon. Safe, effective, and eco-friendly cleaning tips for parents.',
    excerpt: 'Keep your wooden toys safe and clean using natural ingredients you already have. A complete guide to gentle, effective cleaning without harsh chemicals.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-11-27',
    readTime: '8 min read',
    category: 'Care & Maintenance',
    tags: ['cleaning', 'natural cleaning', 'toy care', 'maintenance'],
    featuredImage: '/images/blog/cleaning-wooden-toys.jpg',
    imageAlt: 'Natural cleaning supplies for wooden toys',
    content: null
  },
  {
    slug: 'tractor-exquisite',
    title: 'Tractor Exquisite',
    metaDescription: 'Discover the Tractor Exquisite, handcrafted from kauri in Whangarei, NZ. A timeless treasure from Poppa\'s Wooden Creations, blending beauty and durability.',
    excerpt: 'Discover the Tractor Exquisite, handcrafted from kauri in Whangarei, NZ. A timeless treasure from Poppa\'s Wooden Creations, blending beauty and durability.',
    author: 'Poppa\'s Wooden Creations',
    date: '2025-12-04',
    readTime: '6 min read',
    category: 'Product Spotlight',
    tags: ['kauri toys', 'wooden toys', 'Whangarei', 'handcrafted', 'NZ made'],
    featuredImage: 'https://i.ibb.co/6JJCJj8S/Messenger-creation-278-DDA3-E-23-C9-4-CBF-9-A96-6-FCB56-F987-CD-2-Copy-optimized-1.webp',
    imageAlt: 'Handcrafted kauri tractor toy from Whangarei',
    content: null
  },
  {
    slug: 'choosing-the-best-wooden-toy-cars-for-toddlers-a-practical-b',
    title: 'Choosing the Best Wooden Toy Cars for Toddlers: A Practical Buying Guide',
    metaDescription: 'Expert guide to choosing safe, durable wooden toy cars for toddlers. Learn what to look for in quality, safety, and developmental benefits from Poppa\'s Wooden Creations.',
    excerpt: 'Expert guide to choosing safe, durable wooden toy cars for toddlers. Learn what to look for in quality, safety, and developmental benefits.',
    author: 'Poppa\'s Wooden Creations',
    date: '2025-12-10',
    readTime: '7 min read',
    category: 'Buying Guide',
    tags: ['wooden toy cars', 'toddler toys', 'buying guide', 'toy safety', 'wooden vehicles'],
    featuredImage: 'https://i.ibb.co/B5GrTKdc/33c3d1345f55.webp',
    imageAlt: 'Collection of handcrafted wooden toy cars for toddlers',
    content: null
 },
  {
  slug: 'teething-ring',
  title: 'Rimu Teething Ring - Handcrafted Natural Baby Toy',
  metaDescription: 'Handcrafted rimu teething rings from Whangarei, NZ. Natural, safe wooden baby toys made by Poppa\'s Wooden Creations. Perfect for soothing sore gums and early development.',
  excerpt: 'Lovingly handcrafted natural wooden teething rings from beautiful rimu. Safe, smooth, and perfectly sized for tiny hands. A treasured NZ-made keepsake.',
  author: 'Poppa\'s Wooden Creations',
  date: '2025-12-12',
  readTime: '5 min read',
  category: 'Baby Toys',
  tags: ['teething ring', 'baby toys', 'rimu', 'wooden baby toys', 'NZ made'],
  featuredImage: 'https://i.ibb.co/fYQTbN8V/20201218-104927-optimized.webp',
  imageAlt: 'Handcrafted rimu teething ring with wooden beads',
  content: null

  },
  {
    slug: 'best-handmade-wooden-toys-from-whangarei-new-zealand',
    title: 'Best Handmade Wooden Toys from Whangarei, New Zealand',
    metaDescription: 'Handcrafted Wooden rubbish truck from exquisite kauri with smooth wheels and sturdy construction. Built to last and inspire imaginative play. Made with love ...',
    excerpt: 'Wooden rubbish truck made from  Kauri and macrocarpa',
    author: 'Poppa\'s Wooden Creations',
    date: '2025-12-11',
    readTime: '8 min read',
    category: 'Products',
    tags: ['wooden toys', 'handcrafted', 'NZ made', 'baby toys', 'natural toys'],
    featuredImage: 'https://i.ibb.co/bgTnCW9d/13c0ec8a8ded.webp',
    imageAlt: 'handmade wooden toys by poppawoodencreations.co.nz',
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
