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
    slug: 'montessori-wooden-toys-complete-guide',
    title: 'Montessori Wooden Toys: Complete Guide for Parents (2025)',
    metaDescription: 'Complete guide to Montessori wooden toys for ages 0-5. Learn principles, best toys by age, DIY setup tips. Expert advice from Whangarei, NZ craftsmen.',
    excerpt: 'Discover how Montessori wooden toys support natural development from birth to age 5. Complete guide to choosing, using, and organizing quality wooden toys that align with Montessori principles.',
    author: 'Poppa\'s Wooden Creations',
    date: '2025-01-03',
    readTime: '10 min read',
    category: 'Child Development',
    tags: ['montessori', 'wooden toys', 'child development', 'educational toys', 'parenting'],
    featuredImage: 'https://hfirnolwhesjkxshidxo.supabase.co/storage/v1/object/public/product-images/HELICOPTER%20-%20Rimu-optimized.webp',
    imageAlt: 'Handcrafted Montessori wooden toys made from New Zealand native timber - Kauri, Rimu, Macrocarpa'
  },
  {
    slug: 'why-kauri-wood-makes-superior-toys',
    title: 'Why Kauri Wood Makes Superior Toys: New Zealand\'s Premium Timber',
    metaDescription: 'Discover why Kauri wood creates superior wooden toys. Learn about this rare NZ native timber\'s unique properties, durability & heirloom quality from Whangarei.',
    excerpt: 'Kauri is New Zealand\'s most prized native timber, known for its exceptional strength, beautiful grain, and longevity. Discover why our handcrafted Kauri toys from Whangarei are built to become treasured family heirlooms lasting generations.',
    author: 'Poppa\'s Wooden Creations',
    date: '2025-01-03',
    readTime: '8 min read',
    category: 'Products',
    tags: ['kauri wood', 'wooden toys', 'new zealand timber', 'heirloom toys', 'premium toys', 'native timber', 'whangarei'],
    featuredImage: 'https://hfirnolwhesjkxshidxo.supabase.co/storage/v1/object/public/product-images/DUMP%20TRUCK-optimized.webp',
    imageAlt: 'Premium handcrafted wooden toys made from rare New Zealand Kauri timber in Whangarei',
    faqs: [
      {
        question: 'Is Kauri wood safe for teething babies?',
        answer: 'Yes, absolutely. We finish our Kauri toys with food-safe natural oils that are completely safe for babies to mouth. Kauri\'s fine grain and smooth finish mean no splinter risk, and the wood\'s natural resins are non-toxic.'
      },
      {
        question: 'Why is Kauri more expensive than other wooden toys?',
        answer: 'Kauri is a premium native New Zealand timber that\'s no longer commercially harvested. We source reclaimed and swamp Kauri through regulated channels. The wood\'s exceptional properties—strength, durability, fine grain—combined with its rarity make it more costly, but a Kauri toy will outlast cheaper alternatives by decades.'
      },
      {
        question: 'How long will a Kauri toy last?',
        answer: 'With basic care, a well-crafted Kauri toy will last for generations. We\'ve seen Kauri toys from the early 1900s still in beautiful condition. The wood\'s natural durability and resistance to decay mean your Kauri toy can become a genuine family heirloom.'
      },
      {
        question: 'Is using Kauri wood environmentally responsible?',
        answer: 'Yes. We only use reclaimed Kauri from old buildings or swamp Kauri excavated under permit—never from living trees. Living Kauri are protected. By transforming salvaged timber into heirloom toys used for generations, we\'re honoring this timber rather than letting it go to waste.'
      },
      {
        question: 'What\'s the difference between regular Kauri and swamp Kauri?',
        answer: 'Swamp Kauri has been preserved in peat swamps for thousands of years. It\'s even denser and more stable than regular Kauri, with sometimes darker, richer coloring. Both are excellent for toys, but swamp Kauri is particularly prized for its history and unique character.'
      },
      {
        question: 'Can damaged Kauri toys be repaired?',
        answer: 'Yes, one of Kauri\'s great advantages is repairability. Minor scratches can be sanded out and the toy refinished with food-safe oil. Unlike plastic toys that break permanently, Kauri toys can be restored to like-new condition even after decades of use.'
      }
    ]
  },
  {
    slug: 'best-first-birthday-wooden-toys',
    title: 'Best First Birthday Gifts: Handcrafted Wooden Toys That Last',
    metaDescription: 'Celebrate baby\'s first birthday with heirloom wooden toys from Whangarei, NZ. Handcrafted from Kauri, Rimu & Macrocarpa. Safe, durable, cherished for life.',
    excerpt: 'The first birthday is a milestone deserving a special keepsake. Discover why handcrafted wooden toys from native NZ timbers make the perfect first birthday gift - safe, durable, and treasured for generations.',
    author: 'Poppa\'s Wooden Creations',
    date: '2025-01-03',
    readTime: '6 min read',
    category: 'Buying Guide',
    tags: ['first birthday gifts', 'wooden toys', 'handcrafted toys', 'kauri', 'rimu', 'macrocarpa', 'heirloom toys', 'baby gifts'],
    featuredImage: 'https://hfirnolwhesjkxshidxo.supabase.co/storage/v1/object/public/product-images/FLOOR%20NOISE%20MAKER-optimized.webp',
    imageAlt: 'Handcrafted wooden first birthday gifts made from New Zealand Kauri, Rimu, and Macrocarpa timber'
  },
  {
    slug: 'why-natural-wood-toys-beat-plastic',
    title: 'Why Natural Wood Toys Beat Plastic: A Parent\'s Guide',
    metaDescription: 'Discover why natural wooden toys beat plastic for safety, durability & development. Expert guide from NZ craftsmen at Poppa\'s Wooden Creations, Whangarei.',
    excerpt: 'Discover why natural wooden toys are safer, more durable, and better for child development than plastic alternatives. Expert insights from Poppa\'s Wooden Creations.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-22',
    readTime: '6 min read',
    category: 'Buying Guide',
    tags: ['wooden toys', 'vs plastic', 'buying guide', 'safety', 'sustainability'],
    featuredImage: 'https://i.ibb.co/wZnNwr2H/58174bef133e.webp',
    imageAlt: 'Handcrafted wooden toy car made from Kauri timber',
    faqs: [
      {
        question: 'Are wooden toys really safer than plastic toys?',
        answer: 'Yes, quality wooden toys are typically safer than plastic alternatives. They contain no harmful chemicals like BPA, phthalates, or PVC that can leach from plastic. Wooden toys finished with natural, food-safe oils are completely safe even when babies mouth them during teething.'
      },
      {
        question: 'How long do wooden toys last compared to plastic?',
        answer: 'Well-crafted wooden toys can last for generations, while plastic toys typically last 1-2 years before breaking or fading. A quality wooden toy can be passed down through multiple children and even to the next generation, making it more economical over time despite higher upfront costs.'
      },
      {
        question: 'Do wooden toys help with child development?',
        answer: 'Absolutely. Wooden toys provide rich sensory experiences through natural textures and weight variations. Their open-ended nature encourages imaginative play, problem-solving, and creativity. The solid weight of wooden toys also helps develop fine motor skills and spatial awareness in ways lightweight plastic cannot.'
      },
      {
        question: 'Are wooden toys environmentally friendly?',
        answer: 'Yes, wooden toys from sustainable sources are far more eco-friendly than plastic. They\'re biodegradable, made from renewable resources, and often crafted locally (reducing shipping emissions). Unlike plastic toys that sit in landfills for 400+ years, wooden toys are sustainable and often get passed down rather than discarded.'
      },
      {
        question: 'What should I look for when buying wooden toys?',
        answer: 'Look for solid hardwood construction (not laminated or composite), natural finishes or food-safe paints, smooth edges with no splinters, appropriate sizing for your child\'s age, and locally crafted options when possible. Quality craftsmanship should be visible and tactile.'
      }
    ]
  },

  {
    slug: 'poppas-wooden-creations-handmade-wooden-pine-trolley-and-blocks',
    title: 'Poppa\'s Wooden Creations: Handmade Wooden Pine Trolley and Blocks',
    metaDescription: 'Discover the magic of Poppa\'s Wooden Creations, handcrafted wooden toys made from New Zealand\'s native timbers. Learn about our Wooden Pine Trolley and Blocks.',
    excerpt: 'Experience the charm of handmade wooden toys with Poppa\'s Wooden Creations. Our Wooden Pine Trolley and Blocks are not just toys, but a commitment to sustainability, safety and quality.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-14',
    readTime: '2 min read',
    category: 'Baby Toys',
    tags: ['Handmade Toys', 'Wooden Toys', 'Sustainability', 'Child Safety', 'New Zealand'],
    featuredImage: 'https://i.ibb.co/R8myyxx/05f82f2aa051.webp',
    imageAlt: 'Handmade wooden pine trolley and blocks',
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
    slug: 'wooden-toys-by-age-the-complete-guide-for-0-5-years-2025',
    title: 'Wooden Toys by Age: The Complete Guide for 0-5 Years (2025)',
    metaDescription: 'Complete guide to choosing wooden toys by age from 0-5 years. Expert advice on safe, developmental toys from native NZ timber for every stage.',
    excerpt: 'Discover the perfect wooden toys for each developmental stage from birth to 5 years. Expert guide to choosing safe, engaging toys from native New Zealand timber.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-25',
    readTime: '7 min read',
    category: 'Buying Guide',
    tags: ['wooden toys', 'handcrafted', 'NZ made', 'age guide', 'child development'],
    featuredImage: 'https://i.ibb.co/wh5GjzgJ/bcc2e0763a5d.webp',
    imageAlt: 'handmade wooden toys',
    faqs: [
      {
        question: "What wooden toys are best for babies 0-6 months?",
        answer: "For babies 0-6 months, focus on simple teething rings and lightweight rattles. Our Rimu teething rings are perfect first toys—they're safe for mouthing, the right size for tiny hands, and the natural wood feels good on sore gums. Avoid anything with small parts, sharp edges, or toxic finishes. At this age, babies explore everything orally, so safety is paramount. Look for smooth, well-sanded surfaces and food-safe natural oil finishes like we use on all our baby toys."
      },
      {
        question: "When can babies start playing with wooden blocks?",
        answer: "Babies can begin exploring wooden blocks around 6-8 months when they develop sitting stability and intentional grasping. Initially, they'll mouth them, bang them together, and practice transferring between hands. True stacking typically begins around 12-15 months. Our large wooden building blocks are sized appropriately for little hands and provide the satisfying weight that helps develop motor skills. The natural wood grain also provides visual interest that supports development."
      },
      {
        question: "Are wooden toys safe for toddlers who still mouth everything?",
        answer: "Quality wooden toys with proper finishes are completely safe for mouthing toddlers. We finish all our toys with food-safe natural oils that contain no harmful chemicals. The key is choosing toys from reputable makers who use non-toxic finishes and solid hardwoods without composite materials or adhesives. Avoid painted wooden toys unless you can verify the paint is non-toxic and lead-free. Natural wood finished with oils is the safest choice for children who still explore orally."
      },
      {
        question: "What's the best age for wooden train sets?",
        answer: "Simple wooden trains can be enjoyed from around 18 months as push toys, but complex train sets with tracks work best for ages 2.5-5 years. At 2-3 years, children enjoy pushing trains along tracks but may need help with setup. By 3-4 years, they can plan layouts, connect tracks, and create elaborate scenarios. Our Happy-Go-Lucky Train is perfect for younger toddlers (18 months+) while full train sets with multiple pieces suit preschoolers who can handle the spatial planning and fine motor demands."
      },
      {
        question: "How many wooden toys does a child really need?",
        answer: "Children benefit more from a few high-quality toys they use repeatedly than a room full of options that overwhelm them. A good starting collection includes: teething ring/rattle (0-12m), simple vehicle (6m+), building blocks (12m+), push toy (12-36m), and one complex pretend play toy (2y+). This core collection provides years of developmental play. Add toys gradually based on your child's interests rather than accumulating everything at once. Quality over quantity makes play more meaningful and sustainable."
      },
      {
        question: "Do wooden toys work for both boys and girls?",
        answer: "Absolutely. Developmental needs are the same regardless of gender. Our wooden trucks are equally loved by all children, just as our wooden kitchen toys appeal across the board. The 'gendered toy' concept is largely marketing. Children benefit from diverse play experiences—building toys develop spatial skills, pretend play develops social skills, and both are important for all children. Choose toys based on your child's developmental stage and interests, not arbitrary gender categories."
      },
      {
        question: "Can wooden toys keep up with active preschoolers?",
        answer: "Quality wooden toys are actually more durable than plastic for active play. Our toys are crafted from solid Kauri, Rimu, and Macrocarpa—native New Zealand hardwoods that withstand years of enthusiastic play. Plastic toys crack, break, and fade. Wooden toys might get scratched or dented, but this adds character rather than requiring replacement. We've seen our toys pass through multiple siblings and still look beautiful. For active preschoolers, the weight and solidity of wooden toys actually enhances play—they don't tip over easily and they feel substantial in small hands."
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
    slug: 'teething-ring',
    title: 'Rimu Teething Ring - Handcrafted Natural Baby Toy',
    metaDescription: 'Handcrafted rimu teething rings from Whangarei, NZ. Natural, safe wooden baby toys made by Poppa\'s Wooden Creations. Perfect for soothing sore gums and early development.',
    excerpt: 'Lovingly handcrafted natural wooden teething rings from beautiful rimu. Safe, smooth, and perfectly sized for tiny hands. A treasured NZ-made keepsake.',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-12',
    readTime: '5 min read',
    category: 'Baby Toys',
    tags: ['teething ring', 'baby toys', 'rimu', 'wooden baby toys', 'NZ made'],
    featuredImage: 'https://i.ibb.co/fYQTbN8V/20201218-104927-optimized.webp',
    imageAlt: 'Handcrafted rimu teething ring with wooden beads'
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
    slug: 'happy-go-luck-train',
    title: 'Happy-go-luck-train',
    metaDescription: 'The Happy-go-luck-train handmade from brings timeless charm to playtime. Handcrafted from premium New Zealand pine, it inspires endless adventures.',
    excerpt: 'handmade wooden toys made in whangarei new Zealand by poppas wooden creations',
    author: 'Poppa\'s Wooden Creations',
    date: '2024-12-16',
    readTime: '3 min read',
    category: 'Products',
    tags: ['wooden train toy', 'handcrafted train', 'toy train NZ', 'handcrafted toys NZ', 'handmade wooden products', 'New Zealand wooden toys', 'Poppa\'s Wooden Creations'],
    featuredImage: 'https://i.ibb.co/p673PM37/8443ece5600c.webp',
    imageAlt: 'handmade wooden train by poppas wooden creations'
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
    imageAlt: 'Handcrafted rimu wood spatulas  in Whangarei  - Poppa\'s Wooden Creations'
  }
];
