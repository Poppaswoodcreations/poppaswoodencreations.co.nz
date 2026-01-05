// src/pages/blog/blogData.ts
// Central location for all blog post metadata and FAQs

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
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'teething-ring-rimu-handcrafted-natural-baby-toy',
    title: 'Rimu Teething Ring - Natural Baby Toy',
    metaDescription: 'Handcrafted rimu teething rings from Whangarei, NZ. Natural, safe wooden baby toys. Perfect for soothing sore gums and early development.',
    excerpt: 'Lovingly handcrafted natural wooden teething rings from beautiful rimu. Safe, smooth, and perfectly sized for tiny hands. A treasured NZ-made keepsake.',
    author: 'Poppa\'s Wooden Creations',
    date: '2026-01-06',
    readTime: '5 min read',
    category: 'Baby Toys',
    tags: ['teething ring', 'baby toys', 'rimu', 'wooden baby toys', 'NZ made', 'natural teething', 'infant toys', 'teething relief'],
    featuredImage: 'https://hfirnolwhesjkxshidxo.supabase.co/storage/v1/object/public/product-images/TEETHING%20RING-optimized.webp',
    imageAlt: 'Handcrafted rimu teething ring with wooden beads - Poppa\'s Wooden Creations Whangarei',
    faqs: [
      {
        question: 'Is rimu wood safe for babies to put in their mouths?',
        answer: 'Yes, rimu is completely safe for babies. This native New Zealand timber has natural antimicrobial properties and is finished only with food-safe, non-toxic oils. Unlike plastic teethers that may contain harmful chemicals like BPA, rimu offers a pure, natural alternative that meets all safety standards.'
      },
      {
        question: 'At what age can babies start using a wooden teething ring?',
        answer: 'Babies can begin using wooden teething rings around 3-4 months when they start grasping objects and bringing them to their mouth. The teething ring is safe for this age because it is large enough to prevent choking hazards and smooth enough for sensitive gums.'
      },
      {
        question: 'How do I clean a wooden teething ring?',
        answer: 'Simply wipe the teething ring with a slightly damp cloth after use and allow it to air dry completely. Never soak it in water or put it in the dishwasher. Occasionally apply food-safe oil or beeswax to maintain the finish. Proper care ensures the ring stays hygienic and beautiful.'
      },
      {
        question: 'Will the teething ring splinter or become rough over time?',
        answer: 'No, rimu\'s dense grain and quality craftsmanship prevent splintering. Each ring is hand-sanded to a silky-smooth finish and carefully inspected. With proper care, the wood maintains its smooth texture through months of use. The natural oils and regular cleaning help preserve the finish.'
      },
      {
        question: 'Can I cool the wooden teething ring in the refrigerator?',
        answer: 'Yes, you can place it in the refrigerator (not freezer) for gentle cooling that may provide additional relief for sore gums. Never freeze wooden teething rings as extreme cold can damage the wood. The slight coolness from refrigeration is usually sufficient and more comfortable for babies than frozen teethers.'
      }
    ]
  },
  {
    slug: 'poppas-wooden-creations-handmade-wooden-pine-trolley-and-blocks',
    title: 'Handmade Wooden Pine Trolley and Blocks',
    metaDescription: 'Discover our handmade wooden pine trolley and blocks set. Perfect for toddlers, handcrafted in Whangarei from NZ pine. Durable, safe, educational play.',
    excerpt: 'Experience the charm of handmade wooden toys with our Pine Trolley and Blocks set. More than just toys - a commitment to sustainability, safety, and quality craftsmanship.',
    author: 'Poppa\'s Wooden Creations',
    date: '2026-01-05',
    readTime: '4 min read',
    category: 'Baby Toys',
    tags: ['wooden blocks', 'pine trolley', 'handmade toys', 'baby toys', 'NZ made', 'toddler toys', 'educational toys'],
    featuredImage: 'https://hfirnolwhesjkxshidxo.supabase.co/storage/v1/object/public/product-images/TROLLEY%20AND%20BLOCKS.jpg',
    imageAlt: 'Handmade wooden pine trolley with colorful blocks - Poppa\'s Wooden Creations Whangarei',
    faqs: [
      {
        question: 'Is New Zealand pine durable enough for daily play?',
        answer: 'Absolutely! New Zealand pine is surprisingly durable despite being lighter than hardwoods. Its fine, even grain resists splintering, and the wood maintains its smooth finish through years of use. With proper care, this set will easily serve multiple children and remain in excellent condition.'
      },
      {
        question: 'How do I clean and maintain the wooden trolley and blocks?',
        answer: 'Simply wipe with a slightly damp cloth and mild soap when needed. Avoid soaking the wood or using harsh chemicals. Periodically applying food-safe wood oil or beeswax helps maintain the natural finish. Store in a dry area away from direct sunlight to preserve the wood\'s color.'
      }
    ]
  },
  {
    slug: 'montessori-wooden-toys-complete-guide-for-parents-2026',
    title: 'Montessori Wooden Toys: Complete Guide for Parents (2026)',
    metaDescription: 'Complete guide to Montessori wooden toys for parents. Learn which toys support child development at each age, from birth to 5 years. Expert NZ advice.',
    excerpt: 'Learn which Montessori wooden toys support your child\'s development at each stage, from birth to 5 years. Expert guidance from Poppa\'s Wooden Creations.',
    author: 'Poppa\'s Wooden Creations',
    date: '2026-01-06',
    readTime: '8 min read',
    category: 'Child Development',
    tags: ['montessori', 'wooden toys', 'child development', 'educational toys', 'age guide'],
    featuredImage: 'https://hfirnolwhesjkxshidxo.supabase.co/storage/v1/object/public/product-images/HELICOPTER%20-%20Rimu-optimized.webp',
    imageAlt: 'Montessori wooden toys arranged by age group - handcrafted in Whangarei, New Zealand',
    faqs: [
      {
        question: 'What age should I start with Montessori wooden toys?',
        answer: 'You can introduce wooden toys from birth. Start with simple teething rings made from food-safe native wood around 3-4 months when babies begin grasping objects. Each developmental stage has appropriate wooden toys that support learning'
      },
      {
        question: 'Are wooden toys safe for babies who put everything in their mouths?',
        answer: 'Yes, when properly crafted. Choose wooden toys finished with food-safe oils only, with no small detachable parts, and at least 45mm in diameter to prevent choking. Native New Zealand timbers like Kauri and Rimu are naturally antimicrobial.'
      },
      {
        question: 'How many wooden toys does my child need?',
        answer: 'The Montessori approach emphasizes quality over quantity. Start with 3-5 well-chosen toys appropriate for your child\'s developmental stage, rotating them to maintain interest. This prevents overwhelm and encourages deeper, more focused play.'
      },
      {
        question: 'Why are wooden toys better than plastic for Montessori learning?',
        answer: 'Wooden toys provide authentic sensory experiences through natural weight, texture, and warmth. They are durable, beautiful, and support open-ended play. The connection to natural materials is fundamental to Montessori philosophy.'
      },
      {
        question: 'Can wooden toys grow with my child?',
        answer: 'Absolutely. Quality wooden toys like blocks, vehicles, and building sets remain engaging across multiple developmental stages. A simple wooden car that delights a 1-year-old becomes part of elaborate play scenarios at age 4.'
      }
    ]
  },
  {
    slug: 'why-kauri-wood-makes-superior-toys-new-zealands',
    title: 'Why Kauri Wood Makes Superior Toys: New Zealand\'s',
    metaDescription: 'Explore the unique properties of Kauri wood that make it ideal for children\'s toys. Durable, safe, and beautiful - discover New Zealand\'s premium timber.',
    excerpt: 'Discover why Kauri wood has been treasured for generations. Learn what makes this native New Zealand timber the perfect choice for heirloom-quality toys.',
    author: 'Poppa\'s Wooden Creations',
    date: '2026-01-05',
    readTime: '4 min read time',
    category: 'Buying Guide',
    tags: ['wooden toy car', 'handmade car toy', 'wooden cars NZ', 'toy vehicles', 'kauri wood', 'NZ kauri', 'New Zealand wooden toys', 'Poppa\'s Wooden Creations', 'eco-friendly wooden toys'],
    featuredImage: 'https://hfirnolwhesjkxshidxo.supabase.co/storage/v1/object/public/product-images/DUMP%20TRUCK-optimized.webp',
    imageAlt: 'Handcrafted wooden dump truck toy made from premium New Zealand Kauri wood, featuring smooth natural finish and child-safe design by Poppa\'s Wooden Creations',
    faqs: [
      {
        question: 'Is Kauri wood safe for babies and toddlers?',
        answer: 'Yes, Kauri wood is exceptionally safe for young children. The timber has natural antimicrobial properties and, when finished with food-safe, non-toxic oils or waxes, provides a completely safe surface for teething and mouthing. Unlike plastic toys that may contain harmful chemicals like BPA or phthalates, Kauri offers a pure, natural alternative. Its density also means fewer splinters compared to softer woods, and the smooth finish remains consistent even after repeated washing and handling.'
      },
      {
        question: 'How does Kauri wood compare to other woods used for toys?',
        answer: 'Kauri stands apart from common toy woods like pine, beech, or bamboo in several key ways. it is significantly more durable and resistant to dents and wear, meaning toys maintain their appearance and integrity far longer. The timber\'s beautiful grain patterns and warm honey tones are more distinctive than many alternatives. Additionally, as a native New Zealand timber with proper sustainable sourcing, Kauri carries unique heritage value. While woods like maple or oak are excellent choices, Kauri\'s combination of strength, beauty, and cultural significance makes it premium-tier material for heirloom-quality toys.'
      },
      {
        question: 'Will Kauri wood toys last long enough to pass down to multiple children?',
        answer: 'Absolutely. Kauri\'s exceptional durability is precisely why it is considered heirloom-quality material. With proper care—simple cleaning with a damp cloth and occasional treatment with food-safe oil—Kauri toys can easily serve multiple generations. The timber\'s resistance to wear means that wooden toy cars, trucks, and vehicles maintain their structural integrity and aesthetic appeal through decades of play. Many families find that well-crafted Kauri toys actually improve with age, developing a rich patina that adds to their character and story.'
      }
    ]
  },
  {
    slug: 'happy-go-lucky-train',
    title: 'Happy-Go-Lucky Train: Handcrafted Wooden Toy Magic',
    metaDescription: 'Discover our handcrafted Happy-Go-Lucky Train made from NZ Pine in Whangarei. Safe, durable wooden toy with detachable carriages. Perfect for ages 18 months+.',
    excerpt: 'Experience the joy of traditional play with our Happy-Go-Lucky Train, lovingly handcrafted from New Zealand Pine in Whangarei. This charming wooden train with detachable carriages sparks imagination, develops fine motor skills, and becomes a treasured keepsake for generations.',
    author: 'Poppa\'s Wooden Creations',
    date: '2025-01-03',
    readTime: '5 min read',
    category: 'Product Spotlight',
    tags: ['happy-go-lucky train', 'wooden train', 'handcrafted toys', 'nz pine', 'wooden toys', 'toddler toys', 'imaginative play'],
    featuredImage: 'https://hfirnolwhesjkxshidxo.supabase.co/storage/v1/object/public/product-images/HAPPY-GO-LUCK-TRAIN-optimized.webp',
    imageAlt: 'Happy-Go-Lucky wooden train handcrafted from New Zealand Pine with detachable carriages',
    faqs: [
      {
        question: 'What age is the Happy-Go-Lucky Train suitable for?',
        answer: 'The Happy-Go-Lucky Train is perfect for children aged 18 months and up. The detachable carriages help develop fine motor skills, while the sturdy construction can withstand enthusiastic toddler play. As children grow, the train becomes a cherished imaginative play companion for preschoolers as well.'
      },
      {
        question: 'Is New Zealand Pine durable enough for active play?',
        answer: 'Absolutely! New Zealand Pine is known for its strength and resilience. We specifically choose this timber because it can handle the rough-and-tumble of everyday play while maintaining its beautiful appearance. The fine grain means minimal splintering, and with proper care, your Happy-Go-Lucky Train will last for years—even generations.'
      },
      {
        question: 'How do I clean and maintain the Happy-Go-Lucky Train?',
        answer: 'Cleaning is simple! Wipe the train with a slightly damp cloth and mild soap if needed. Avoid soaking the wood or using harsh chemicals. Occasionally, apply a food-safe wood oil or beeswax to maintain the natural finish and protect the timber. Store in a dry place away from direct sunlight to preserve the wood\'s beautiful color.'
      },
      {
        question: 'Are the paints and finishes safe for young children?',
        answer: 'Yes, absolutely. We use only non-toxic, child-safe paints and natural finishes on all our toys, including the Happy-Go-Lucky Train. Parents can have complete peace of mind knowing their little ones can safely explore and play, even during the mouthing stage.'
      },
      {
        question: 'Can I purchase extra carriages or customize the train?',
        answer: 'While the Happy-Go-Lucky Train comes as a complete set with the engine and two carriages, we love creating custom pieces! Contact us directly to discuss adding extra carriages, personalization options, or creating a custom train set that perfectly matches your child\'s interests. Each piece is handcrafted with the same care and attention to detail.'
      }
    ]
  },
  {
    slug: 'why-natural-wood-toys-beat-plastic',
    title: 'Why Natural Wood Toys Beat Plastic: A Parent\'s Guide',
    metaDescription: 'Discover why natural wooden toys are safer, more durable, and better for child development than plastic alternatives. Expert insights from Poppa\'s Wooden Creations.',
    excerpt: 'Discover why natural wooden toys are safer, more durable, and better for child development than plastic alternatives. Expert insights from Poppa\'s Wooden Creations.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-22',
    readTime: '6 min read',
    category: 'Buying Guide',
    tags: ['wooden toys', 'vs plastic', 'buying guide', 'safety', 'sustainability'],
    featuredImage: 'https://i.ibb.co/wZnNwr2H/58174bef133e.webp',
    imageAlt: 'Handcrafted wooden toy car made from Kauri timber'
  },
  {
    slug: 'benefits-wooden-toys-child-development',
    title: '5 Benefits of Wooden Toys for Child Development',
    metaDescription: 'Discover why wooden toys are better for your child\'s development, from motor skills to creativity and environmental responsibility.',
    excerpt: 'Discover why wooden toys are better for your child\'s development, from motor skills to creativity and environmental responsibility. Expert insights from Poppa\'s Wooden Creations.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-11-01',
    readTime: '8 min read',
    category: 'Child Development',
    tags: ['child development', 'educational toys', 'wooden toys', 'parenting'],
    featuredImage: '/images/blog/wooden-toys-benefits.jpg',
    imageAlt: 'Child playing with wooden educational toys'
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
    imageAlt: 'Handcrafted wooden toy cars for babies'
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
    imageAlt: 'Baby exploring wooden sensory toy'
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
    imageAlt: 'Natural cleaning supplies for wooden toys'
  },
  {
    slug: 'tractor-exquisite',
    title: 'Tractor Exquisite',
    metaDescription: 'Discover the Tractor Exquisite, handcrafted from kauri in Whangarei, NZ. A timeless treasure from Poppa\'s Wooden Creations, blending beauty and durability.',
    excerpt: 'Discover the Tractor Exquisite, handcrafted from kauri in Whangarei, NZ. A timeless treasure from Poppa\'s Wooden Creations, blending beauty and durability.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-04',
    readTime: '6 min read',
    category: 'Product Spotlight',
    tags: ['kauri toys', 'wooden toys', 'Whangarei', 'handcrafted', 'NZ made'],
    featuredImage: 'https://i.ibb.co/6JJCJj8S/Messenger-creation-278-DDA3-E-23-C9-4-CBF-9-A96-6-FCB56-F987-CD-2-Copy-optimized-1.webp',
    imageAlt: 'Handcrafted kauri tractor toy from Whangarei'
  },
  {
    slug: 'choosing-the-best-wooden-toy-cars-for-toddlers-a-practical-b',
    title: 'Choosing the Best Wooden Toy Cars for Toddlers: A Practical Buying Guide',
    metaDescription: 'Expert guide to choosing safe, durable wooden toy cars for toddlers. Learn what to look for in quality, safety, and developmental benefits from Poppa\'s Wooden Creations.',
    excerpt: 'Expert guide to choosing safe, durable wooden toy cars for toddlers. Learn what to look for in quality, safety, and developmental benefits.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-10',
    readTime: '7 min read',
    category: 'Buying Guide',
    tags: ['wooden toy cars', 'toddler toys', 'buying guide', 'toy safety', 'wooden vehicles'],
    featuredImage: 'https://i.ibb.co/B5GrTKdc/33c3d1345f55.webp',
    imageAlt: 'Collection of handcrafted wooden toy cars for toddlers'
  },
{
    slug: 'best-handmade-wooden-toys-from-whangarei-new-zealand',
    title: 'Best Handmade Wooden Toys from Whangarei, New Zealand',
    metaDescription: 'Handcrafted Wooden rubbish truck from exquisite kauri with smooth wheels and sturdy construction. Built to last and inspire imaginative play. Made with love ...',
    excerpt: 'Wooden rubbish truck made from  Kauri and macrocarpa',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-11',
    readTime: '8 min read',
    category: 'Products',
    tags: ['wooden toys', 'handcrafted', 'NZ made', 'baby toys', 'natural toys'],
    featuredImage: 'https://i.ibb.co/bgTnCW9d/13c0ec8a8ded.webp',
    imageAlt: 'handmade wooden toys by poppawoodencreations.co.nz'
  },
  {
    slug: 'why-rimu-wood-makes-the-best-kitchen-utensils',
    title: 'Why Rimu Wood Makes the Best Kitchen Utensils',
    metaDescription: 'Discover why rimu wood makes exceptional kitchen utensils. Handcrafted in Whangarei, NZ from native timber - durable, beautiful, and sustainably sourced.',
    excerpt: 'Handcrafted rimu spatulas showcase natural warmth and quality. Discover why this native NZ timber is the perfect choice for kitchen utensils.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-29',
    readTime: '3 min read',
    category: 'Products',
    tags: ['rimu wood', 'kitchen utensils', 'wooden spatulas', 'handcrafted kitchenware', 'NZ made'],
    featuredImage: 'https://i.ibb.co/rRTH8z2c/FB-IMG-1641578366807-optimized.webp',
    imageAlt: 'Handcrafted rimu wood spatulas in Whangarei - Poppa Wooden Creations'
  }
];
