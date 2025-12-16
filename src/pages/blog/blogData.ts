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
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'poppas-wooden-creations-handmade-wooden-pine-trolley-and-blocks',
    title: 'Poppa\'s Wooden Creations: Handmade Wooden Pine Trolley and Blocks',
    metaDescription: 'Discover the magic of Poppa\'s Wooden Creations, handcrafted wooden toys made from New Zealand\'s native timbers. Learn about our Wooden Pine Trolley and Blocks.',
    excerpt: 'Experience the charm of handmade wooden toys with Poppa\'s Wooden Creations. Our Wooden Pine Trolley and Blocks are not just toys, but a commitment to sustainability, safety and quality.',
    author: 'Poppa\'s Wooden Creations',
    date: '2025-12-14',
    readTime: '2 min read',
    category: 'Baby Toys',
    tags: ['Handmade Toys', 'Wooden Toys', 'Sustainability', 'Child Safety', 'New Zealand'],
    featuredImage: 'https://i.ibb.co/R8myyxx/05f82f2aa051.webp',
    imageAlt: 'Handmade wooden pine trolley and blocks',
    content: null,
    faqs: [
      {
        question: "What types of wood does Poppa\'s Wooden Creations use?",
        answer: "Poppa\'s Wooden Creations uses native New Zealand timbers like Kauri, Rimu, and Macrocarpa to create our toys. These woods are not only beautiful but also sustainable."
      },
      {
        question: "Why choose wooden toys over plastic ones?",
        answer: "Wooden toys offer a unique sensory experience for children. The texture, weight, and natural variations provide a rich, engaging play experience that plastic toys can\'t match. Plus, they\'re more environmentally friendly."
      },
      {
        question: "Are the toys from Poppa\'s Wooden Creations safe for children?",
        answer: "Absolutely! All of our toys are designed with safety in mind. They are smooth and well-rounded to prevent injuries, and our trolleys are sturdy and balanced to avoid tipping. We also use non-toxic finishes on all our toys."
      },
      {
        question: "How does Poppa\'s Wooden Creations contribute to sustainability?",
        answer: "We believe in creating toys that are gentle on our planet. We use sustainable timbers and incorporate eco-friendly practices in our workshop. This way, we\'re doing our part to preserve New Zealand\'s beautiful native forests for future generations."
      }
    ]
  },

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
    content: null,
    faqs: [
      {
        question: "What age are wooden toys best for?",
        answer: "Wooden toys are suitable for all ages from newborn onwards. For babies 0-6 months, choose smooth teething rings and simple rattles. Toddlers 1-3 years benefit from stacking toys, push toys, and simple vehicles. Preschoolers 3-5 years can enjoy more complex puzzles, building blocks, and imaginative play toys. Our handcrafted wooden toys are designed with age-appropriate features and safety standards."
      },
      {
        question: "Are wooden toys safer than plastic toys?",
        answer: "Yes, quality wooden toys are generally safer than plastic alternatives. They contain no harmful chemicals like BPA, phthalates, or PVC found in many plastic toys. Our toys are made from natural New Zealand native timbers (Kauri, Rimu, Macrocarpa) finished with food-safe, non-toxic oils. They're also more durable and won't break into sharp pieces like plastic can."
      },
      {
        question: "How do wooden toys help with motor skills development?",
        answer: "Wooden toys support motor skills through their natural weight, texture, and construction. The slightly heavier weight helps babies and toddlers develop hand strength and grip control. The varied textures of different wood grains provide sensory feedback. Activities like stacking, pushing, and manipulating wooden toys build fine and gross motor coordination essential for later skills like writing and sports."
      },
      {
        question: "Do wooden toys last longer than plastic toys?",
        answer: "Absolutely. Quality handcrafted wooden toys can last for generations when properly cared for. Unlike plastic toys that crack, fade, and break, wooden toys become family heirlooms. Our toys are crafted from durable native timbers that withstand years of play. With simple cleaning and occasional re-oiling, they maintain their beauty and functionality indefinitely."
      },
      {
        question: "Why are wooden toys better for the environment?",
        answer: "Wooden toys are sustainable and biodegradable, unlike plastic toys that contribute to landfill waste for hundreds of years. We source our timber from sustainably managed New Zealand forests. Wood is a renewable resource that stores carbon rather than releasing it. When a wooden toy eventually reaches end of life, it naturally decomposes without releasing harmful chemicals into the environment."
      },
      {
        question: "Are wooden toys worth the higher price?",
        answer: "Yes, wooden toys offer exceptional value despite higher upfront costs. They last decades rather than months, often becoming family heirlooms passed down through generations. Their durability means you won't need replacements. Wooden toys also hold their resale value well. Most importantly, they provide superior developmental benefits and safety compared to mass-produced plastic alternatives."
      }
    ]
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
  {
    slug: 'happy-go-luck-train',
    title: 'Happy-go-luck-train',
    metaDescription: 'The Happy-go-luck-train handmade from brings timeless charm to playtime. Handcrafted from premium New Zealand pine, it inspires endless adventures.',
    excerpt: 'handmade wooden toys made in whangarei new Zealand by poppas wooden creations',
    author: 'Poppa\'s Wooden Creations',
    date: '2025-12-16',
    readTime: '3 min read',
    category: 'Products',
    tags: ['wooden train toy', 'handcrafted train', 'toy train NZ', 'handcrafted toys NZ', 'handmade wooden products', 'New Zealand wooden toys', 'Poppa\'s Wooden Creations'],
    featuredImage: 'https://i.ibb.co/p673PM37/8443ece5600c.webp',
    imageAlt: 'handmade wooden train by poppas wooden creations',
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
