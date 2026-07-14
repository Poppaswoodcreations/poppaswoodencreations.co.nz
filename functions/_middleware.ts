// functions/_middleware.ts  (Cloudflare Pages)
// Detects Google/Bing/bot crawlers and serves fully populated HTML.
// Real users get the normal React SPA (served via context.next()).
// Ported from the Netlify edge function — identical logic, Cloudflare runtime.

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebot',
  'ia_archiver',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'applebot',
  'Google-InspectionTool',
  'Google-PageRenderer',
  'storebot-google',
  'google-shopping',
  'adsbot-google',
  'apis-google',
  'mediapartners-google',
  'googleother',
];

// ─────────────────────────────────────────────────────────────
// GHOST PRODUCT SLUGS — 410 Gone for ALL visitors
// These URLs were never valid products on this site.
// ─────────────────────────────────────────────────────────────
const GHOST_SLUGS = new Set([
  'small-pine-train',
  'ice-cream-truck',
  'butter-knife',
  'small-sports-car',
  'mini-buss-rimu',
  'fire-truck',
  'front-end-loader',
  'humming-top',
  'bowl',
  'kauri-bowl',
  'sedan',
  'baby-blocks-native-rimu-8-pack',
  'school-bus-small',
  'rimu-salad-bowl',
  'salad-servers',
  'chopping-board',
  'rimu-car',
  'race-car',
  'police-car',
  'cargo-truck',
  'tanker-truck',
  'small-road-trains',
  'kauri-planes',
  'backhoe',
  'paddle-boat',
  'submarine',
  'skateboard',
  'pull-along-duck',
  'stacking-toy',
  'bongo-drum',
  'gliders',
]);

// ─────────────────────────────────────────────────────────────
// GHOST BLOG SLUGS — 410 Gone for ALL visitors
// Fast-path blocklist; any slug not in Supabase also gets 410
// via the Supabase lookup fallback in step 12.
// ─────────────────────────────────────────────────────────────
const GHOST_BLOG_SLUGS = new Set([
  'choosing-best-wooden-toy-cars',
  'sensory-toys-for-babies',
  'benefits-of-wooden-toys',
]);

// ─────────────────────────────────────────────────────────────
// GHOST CATEGORY SLUGS — 410 Gone for ALL visitors
// (was handled by netlify.toml; now lives here for parity)
// ─────────────────────────────────────────────────────────────
const GHOST_CATEGORIES = new Set([
  'wooden-other-toys',
]);

// ─────────────────────────────────────────────────────────────
// RENAMED BLOG SLUGS — 301 to the current published slug
// Old/truncated slugs Google still has indexed -> live post.
// ─────────────────────────────────────────────────────────────
const BLOG_SLUG_REDIRECTS: Record<string, string> = {
  'how-to-clean-wooden-toys-naturally': 'how-to-clean-wooden-toys-naturally-and-safely',
};

// ─────────────────────────────────────────────────────────────
// RENAMED PRODUCT SLUGS — 301 to the current product id
// Old slugs Google still has indexed -> live product in Supabase.
// Recovers ranking instead of throwing it away with a 410.
// ─────────────────────────────────────────────────────────────
const PRODUCT_SLUG_REDIRECTS: Record<string, string> = {
  'small-pine-cars': 'small-pine-car',
  'log-truck': 'logging-truck',
  'rimu-teething-ring': 'teething-ring',
  'rattle': 'baby-rattle',
  'garbage-truck': 'rubbish-truck',
  'tipper-truck': 'dump-truck',
  'kauri-helicopter': 'pine-helicopter',
  'helicopter-macrocarpa': 'pine-helicopter',
  'the-block-train-made-from-kauri': 'block-train',
  'happy-go-lucky-train': 'happy-go-luck-train',
};

// Supabase credentials are read per-request from context.env inside the handler.
// (Cloudflare Workers do not expose environment variables at module load time.)
const BASE_URL = 'https://poppaswoodencreations.co.nz';

// ─────────────────────────────────────────────────────────────
// HOME PAGE META
// ─────────────────────────────────────────────────────────────
const HOME_META = {
  title: "Handmade Wooden Toys Whangarei & Tikipunga | Poppa's Wooden Creations",
  description: "Poppa's Wooden Creations is a handcrafted toy manufacturer based in Tikipunga, Whangarei, making premium wooden toys from native NZ timber. Safe, sustainable, trusted by Montessori schools. Free shipping over $150.",
  h1: 'Handmade Wooden Toys & Kitchenware from New Zealand',
  intro: 'Premium wooden toys for children, handcrafted from native New Zealand timbers including Kauri, Rimu, and Macrocarpa. Safe, sustainable, and built to last generations.',
  paragraphs: [
    "From our Whangarei workshop, we create children's wooden toys that inspire imaginative play and develop fine motor skills. Trusted by Montessori schools and eco-conscious families across New Zealand since 2015.",
    "Based in Tikipunga, on the edge of Whangarei, our workshop has been turning native New Zealand timber into heirloom-quality toys since 2015. As a small toy manufacturer and woodworker, every piece — from our wooden trucks and cars to trains, planes and kitchenware — starts as a rough length of Kauri, Rimu or Macrocarpa before it's shaped, sanded, and finished by hand.",
    "We don't outsource or mass-produce. Each toy that leaves our Tikipunga workshop has been made and checked by us personally, which is part of why Montessori schools and eco-conscious families across New Zealand keep coming back. Wood grain, weight, and finish vary slightly from piece to piece — that's not a flaw, it's the mark of something actually handmade rather than stamped out on a factory line.",
    "Whether you're after a first Montessori-style toy for a baby, a durable truck that'll survive years of rough play, or a set of kitchenware built to last, everything is designed to be safe, non-toxic, and made to be passed down rather than thrown away.",
  ],
  categories: [
    { name: 'Wooden Trains', slug: 'wooden-trains', desc: 'Handcrafted wooden train sets and railway accessories' },
    { name: 'Wooden Baby Toys', slug: 'wooden-baby-toys', desc: 'Safe, natural wooden toys for babies and toddlers' },
    { name: 'Wooden Trucks', slug: 'wooden-trucks', desc: 'Heavy-duty wooden trucks for construction play' },
    { name: 'Wooden Cars', slug: 'wooden-cars', desc: 'Fast and fun wooden cars for racing adventures' },
    { name: 'Wooden Planes & Helicopters', slug: 'wooden-planes-helicopters', desc: 'Take flight with wooden aircraft and helicopters' },
    { name: 'Wooden Kitchenware', slug: 'wooden-kitchenware', desc: 'Beautiful and functional wooden kitchen tools' },
    { name: 'Wooden Tractors & Boats', slug: 'wooden-tractors-boats', desc: 'Farm tractors and sailing boats for adventure play' },
    { name: 'Wooden Crosses', slug: 'wooden-crosses', desc: 'Handcrafted wooden crosses made from native New Zealand timber. Beautiful religious gifts and heirloom pieces.' },
    { name: 'Wooden Pens', slug: 'wooden-pens', desc: 'Handcrafted wooden pens turned from native New Zealand timber. Unique gifts and heirloom writing instruments.' },
  ],
};

// ─────────────────────────────────────────────────────────────
// CATEGORY META
// ─────────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, {
  title: string;
  description: string;
  h1: string;
  intro: string;
  features: string[];
  extendedContent?: string;
  faqs?: { question: string; answer: string }[];
}> = {
  'wooden-kitchenware': {
    title: 'Wooden Kitchenware NZ | Handcrafted Serving Boards & Utensils',
    description: 'Handcrafted wooden kitchenware made from New Zealand native timber. Beautiful Rimu and Kauri serving boards, rolling pins and utensils built to last generations.',
    h1: 'Handcrafted Wooden Kitchenware',
    intro: 'Discover our collection of handcrafted wooden kitchenware, made from premium New Zealand native timber including Rimu, Kauri and Macrocarpa. Each piece is finished with food-safe oils and crafted by hand in Whangarei.',
    features: [
      'Made from native NZ timbers — Rimu, Kauri, Macrocarpa',
      'Food-safe, non-toxic oil finish',
      'Handcrafted in Whangarei since 2015',
      'Unique grain patterns — no two pieces identical',
      'Heirloom quality built to last generations',
    ],
  },
  'wooden-baby-toys': {
    title: 'Wooden Baby Toys NZ | Safe Handcrafted Toys for Infants & Toddlers',
    description: 'Safe, handcrafted wooden baby toys from New Zealand native timber. Non-toxic finish, smooth edges, Montessori-inspired designs trusted by NZ families and schools since 2015. Shop online, ships nationwide.',
    h1: 'Wooden Baby Toys NZ — Handcrafted from Native Timber',
    intro: `Our wooden baby toys are lovingly handcrafted in Whangarei, New Zealand, from native Kauri, Rimu and Macrocarpa timber. Every toy is finished with a non-toxic, baby-safe oil and designed with smooth, splinter-free edges — safe from the very first touch.

We have been making wooden baby toys for New Zealand families and Montessori schools since 2015. Each piece is made by hand in our Tikipunga workshop — we are not a dropshipper or importer. When you buy a wooden baby toy from Poppa's Wooden Creations, you are getting a genuine, handcrafted NZ-made product that will outlast any plastic toy and can be passed down through generations.

Our wooden baby toys support sensory development, fine motor skills and open-ended Montessori play. The natural weight and texture of real New Zealand timber gives babies and toddlers a rich tactile experience that plastic simply cannot replicate.`,
    features: [
      'Non-toxic, food-safe finish — completely safe for teething babies',
      'Smooth, splinter-free edges handcrafted for little hands',
      'Montessori-inspired open-ended play that supports development',
      'Trusted by NZ Montessori schools and eco-conscious families since 2015',
      'Made from native Kauri, Rimu and Macrocarpa — no two pieces identical',
      'Ships nationwide across New Zealand — rural delivery available',
      'Heirloom quality built to be passed down through generations',
    ],
    extendedContent: `
      <section>
        <h2>Why Wooden Baby Toys Are Better Than Plastic</h2>
        <p>Wooden baby toys have been trusted by parents and educators for generations — and for good reason. Unlike plastic toys, genuine hardwood toys from native New Zealand timber are free from BPA, phthalates, and other synthetic chemicals. They are durable enough to survive the roughest toddler play and beautiful enough to display in your home.</p>
        <p>The natural weight of a real timber toy gives babies important sensory feedback as they reach, grasp and manipulate objects. Research into Montessori early learning consistently shows that open-ended, natural-material toys support cognitive development more effectively than electronic or single-purpose plastic toys.</p>
        <p>Our wooden baby toys are made from Kauri, Rimu and Macrocarpa — three of New Zealand's most beautiful native timbers. Each piece has a unique grain pattern, meaning your baby's toy is genuinely one of a kind.</p>
      </section>
      <section>
        <h2>Safe Wooden Baby Toys — Our Finishing Process</h2>
        <p>Every wooden baby toy we make goes through a careful finishing process. After shaping and sanding to a fine finish, each toy is hand-coated with a food-safe, non-toxic oil that brings out the natural beauty of the timber. There are no paints, varnishes or synthetic coatings — only natural oils that are safe even if a baby puts the toy in their mouth.</p>
        <p>All edges and corners are rounded and sanded smooth by hand. We check every toy before it leaves our Whangarei workshop to make sure it meets our quality standards and is completely safe for babies and toddlers.</p>
      </section>
      <section>
        <h2>Wooden Baby Toys for Montessori Play</h2>
        <p>Montessori education places a strong emphasis on natural materials, open-ended play and sensory-rich environments. Our wooden baby toys are used in Montessori classrooms and playgroups across New Zealand because they fit perfectly with these principles.</p>
        <p>Simple, well-crafted wooden toys encourage babies and toddlers to use their imagination, develop fine motor skills and explore cause and effect — without flashing lights, sounds or batteries. Our toys grow with your child, remaining engaging from early infancy through toddlerhood and beyond.</p>
      </section>
      <section>
        <h2>Handcrafted in Whangarei, Northland</h2>
        <p>Every wooden baby toy in our range is made by hand by Adrian at Poppa's Wooden Creations, 102 Kiripaka Road, Tikipunga, Whangarei. We have been crafting wooden toys from native NZ timber since 2015 and every product we sell is made in our own workshop — not imported, not dropshipped.</p>
        <p>We ship our wooden baby toys nationwide across New Zealand including rural addresses. International shipping is also available. If you would like to discuss a custom wooden baby toy — perhaps a personalised first toy for a new arrival — please <a href="${BASE_URL}/contact">contact us</a> and we will be happy to help.</p>
      </section>
    `,
    faqs: [
      {
        question: 'Are your wooden baby toys safe for newborns and infants?',
        answer: 'Yes. All our wooden baby toys are finished with a non-toxic, food-safe oil — no paints, varnishes or synthetic coatings. Every toy is hand-sanded to a smooth, splinter-free finish with rounded edges, making them completely safe for babies from birth. They are safe even if a baby puts them in their mouth.',
      },
      {
        question: 'What timber do you use for your wooden baby toys?',
        answer: 'We use native New Zealand timbers — primarily Kauri, Rimu and Macrocarpa. These are beautiful, dense hardwoods that are naturally smooth and durable. Because we use real native NZ timber, every toy has a unique grain pattern and no two pieces are identical.',
      },
      {
        question: 'Do you ship wooden baby toys throughout New Zealand?',
        answer: 'Yes, we ship to all New Zealand addresses including rural delivery. Shipping costs are calculated at checkout. We also offer international shipping for customers outside New Zealand.',
      },
      {
        question: 'Are your wooden baby toys suitable for Montessori play?',
        answer: 'Absolutely. Our wooden baby toys are used in Montessori schools and playgroups across New Zealand. They are made from natural materials, designed for open-ended play, and free from electronic components — all key principles of Montessori early childhood education.',
      },
      {
        question: 'Can I order a custom wooden baby toy?',
        answer: 'Yes. We love working on custom orders — whether that is a personalised toy with a name engraved, a specific timber, or a bespoke design. Contact us at poppas.wooden.creations@gmail.com or call +64 21 022 88166 to discuss your idea.',
      },
      {
        question: 'How do I care for a wooden baby toy?',
        answer: 'Wipe clean with a damp cloth and dry immediately. Do not soak in water or put in the dishwasher. Occasionally re-oiling with a food-safe oil (such as coconut oil) will keep the timber nourished and looking its best. Avoid prolonged exposure to direct sunlight.',
      },
    ],
  },
  'wooden-trucks': {
    title: 'Wooden Trucks NZ | Handcrafted Toy Trucks from Native Timber',
    description: 'Handcrafted wooden toy trucks made from New Zealand native timber. Durable, smooth-rolling and built to last. Perfect for imaginative play.',
    h1: 'Handcrafted Wooden Trucks',
    intro: 'Our wooden trucks are handcrafted in Whangarei from premium New Zealand native timber. Smooth rolling wheels, chunky proportions perfect for small hands, and a non-toxic finish make these a favourite with kids and parents alike.',
    features: [
      'Smooth-rolling solid timber wheels',
      'Chunky design perfect for toddlers',
      'Made from native NZ timber — Kauri, Rimu, Macrocarpa',
      'Non-toxic finish, safe for children',
      'Built heirloom-quality to outlast plastic toys',
    ],
  },
  'wooden-tractors-boats': {
    title: 'Wooden Tractors & Boats NZ | Handcrafted Farm & Water Toys',
    description: 'Handcrafted wooden toy tractors and boats from New Zealand native timber. Beautifully detailed, non-toxic and built to last for Montessori and imaginative play.',
    h1: 'Handcrafted Wooden Tractors & Boats',
    intro: 'Spark imagination with our handcrafted wooden tractors and boats, made in Whangarei from New Zealand native timber. Whether your child loves the farm or the sea, these heirloom-quality toys are built to inspire years of play.',
    features: [
      'Beautifully detailed farm and water toys',
      'Made from native NZ timber',
      'Non-toxic, child-safe finish',
      'Montessori-friendly open-ended play',
      'Heirloom quality — built to be passed down',
    ],
  },
  'wooden-cars': {
    title: 'Wooden Toy Cars NZ | Handcrafted Cars from Native NZ Timber',
    description: 'Handcrafted wooden toy cars made in New Zealand from native Kauri, Rimu and Macrocarpa. Smooth, safe and built for imaginative play.',
    h1: 'Handcrafted Wooden Toy Cars',
    intro: 'Our wooden toy cars are handcrafted in Whangarei from premium New Zealand native timber. With smooth rolling wheels and satisfying weight, they are a timeless alternative to plastic toys.',
    features: [
      'Smooth-rolling solid timber wheels',
      'Made from Kauri, Rimu and Macrocarpa',
      'Non-toxic finish safe for children',
      'Montessori open-ended play',
      'Heirloom quality built to last',
    ],
  },
  'wooden-trains': {
    title: 'Wooden Train Sets NZ | Handcrafted Trains from Native Timber',
    description: 'Handcrafted wooden train sets made from New Zealand native timber. Classic designs with a non-toxic finish, perfect for Montessori and imaginative railway play.',
    h1: 'Handcrafted Wooden Trains',
    intro: 'Build railways and spark imagination with our handcrafted wooden trains, made in Whangarei from New Zealand native timber. Classic in design and built to the highest quality standards.',
    features: [
      'Classic train designs loved by generations',
      'Made from native NZ timber',
      'Non-toxic, child-safe finish',
      'Perfect for Montessori railway play',
      'Heirloom quality built to last',
    ],
  },
  'wooden-planes-helicopters': {
    title: 'Wooden Planes & Helicopters NZ | Handcrafted Aviation Toys',
    description: 'Handcrafted wooden toy planes and helicopters from New Zealand native timber. Beautifully crafted aviation toys with non-toxic finish, perfect for imaginative play.',
    h1: 'Handcrafted Wooden Planes & Helicopters',
    intro: 'Take imagination to new heights with our handcrafted wooden planes and helicopters, made in Whangarei from premium New Zealand native timber.',
    features: [
      'Beautifully detailed aviation toys',
      'Made from native NZ timber',
      'Non-toxic, child-safe finish',
      'Open-ended imaginative play',
      'Heirloom quality built to last',
    ],
  },
  'wooden-pens': {
    title: "Handcrafted Wooden Pens NZ | Native Timber Pens | Poppa's Wooden Creations",
    description: 'Handcrafted wooden pens turned from native New Zealand timber — Kauri, Rimu, Rewa-Rewa and Totara. Unique heirloom gifts made in Whangarei.',
    h1: 'Handcrafted Wooden Pens',
    intro: 'Our wooden pens are hand-turned in Whangarei from rare native New Zealand timbers including ancient Kauri, Rimu, Rewa-Rewa and Totara. Available as click pens, stylus pens and larger ballpoint pens — each one completely unique.',
    features: [
      'Hand-turned from native NZ timber — Kauri, Rimu, Rewa-Rewa, Totara',
      'Chrome, black chrome, gold and antique bronze fittings',
      'Click pens, stylus pens and larger ballpoint options',
      'No two pens identical — unique grain patterns',
      'Handcrafted in Whangarei — a rare NZ-made gift',
    ],
  },
  'wooden-crosses': {
    title: "Handcrafted Wooden Crosses NZ | Native Timber | Poppa's Wooden Creations",
    description: 'Handcrafted wooden crosses made from native New Zealand Rimu timber. Beautiful religious gifts and heirloom pieces, made by hand in Whangarei.',
    h1: 'Handcrafted Wooden Crosses',
    intro: 'Our wooden crosses are handcrafted in Whangarei from native New Zealand Rimu timber. A meaningful and lasting gift for baptisms, confirmations, Easter and other occasions.',
    features: [
      'Made from native NZ Rimu timber',
      'Handcrafted in Whangarei since 2015',
      'Beautiful grain — no two pieces identical',
      'Non-toxic finish',
      'Heirloom quality — built to last generations',
    ],
  },
  'wooden-toys-nz': {
    title: "Handmade Wooden Toys NZ | Kauri, Rimu & Macrocarpa | Poppa's Wooden Creations",
    description: "Premium handcrafted wooden toys made in Whangarei from native Kauri, Rimu & Macrocarpa. Safe, non-toxic, Montessori-approved. NZ's trusted wooden toy maker since 2015.",
    h1: 'Handcrafted Wooden Toys NZ',
    intro: "Browse our full collection of handcrafted wooden toys, made in Whangarei from premium native New Zealand timber. Every piece is handmade by Adrian at Poppa's Wooden Creations — trusted by Montessori schools and eco-conscious families since 2015.",
    features: [
      'Handcrafted from native NZ timber — Kauri, Rimu, Macrocarpa',
      'Non-toxic, food-safe finish — safe for babies and toddlers',
      'Trusted by Montessori schools across New Zealand since 2015',
      'Unique grain patterns — no two pieces identical',
      'Heirloom quality built to last generations',
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// POLICY PAGES
// ─────────────────────────────────────────────────────────────
const POLICY_PAGES: Record<string, {
  title: string;
  description: string;
  h1: string;
  noindex: boolean;
  content: string;
}> = {
  '/shipping': {
    title: "Shipping Policy | Poppa's Wooden Creations NZ",
    description: "Learn about shipping times, costs, and delivery options for handcrafted wooden toys from Poppa's Wooden Creations in Whangarei, New Zealand.",
    h1: 'Shipping Policy',
    noindex: false,
    content: `
      <section>
        <h2>New Zealand Shipping</h2>
        <p>We ship all orders within New Zealand using tracked courier services. Standard delivery typically takes 2–5 business days to most NZ addresses. Rural deliveries may take an additional 1–2 days.</p>
        <p>Shipping rates are calculated at checkout based on order size and delivery address.</p>
      </section>
      <section>
        <h2>International Shipping</h2>
        <p>We ship worldwide. International shipping times and costs vary by destination and are calculated at checkout. Most international orders are delivered within 7–21 business days depending on the destination country.</p>
      </section>
      <section>
        <h2>Order Processing</h2>
        <p>Orders are processed within 1–3 business days of payment confirmation. You will receive a tracking number by email once your order has been dispatched.</p>
      </section>
      <section>
        <h2>Packaging</h2>
        <p>All items are carefully packed to prevent damage during transit. We use eco-friendly packaging materials wherever possible, in keeping with our commitment to sustainability.</p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>If you have any questions about your shipment, please contact us at <a href="mailto:poppas.wooden.creations@gmail.com">poppas.wooden.creations@gmail.com</a> or call <a href="tel:+642102288166">+64 21 022 88166</a>.</p>
      </section>
    `,
  },
  '/returns': {
    title: "Returns & Refunds Policy | Poppa's Wooden Creations NZ",
    description: 'Our 30-day return policy and quality guarantee for handcrafted wooden toys. Easy returns, full refunds, and lifetime craftsmanship guarantee.',
    h1: 'Returns & Refunds Policy',
    noindex: false,
    content: `
      <section>
        <h2>Our 30-Day Return Policy</h2>
        <p>We want you to be completely happy with your purchase. If you are not satisfied for any reason, you may return your item within 30 days of delivery for a full refund or exchange.</p>
        <p>Items must be returned in their original condition and packaging. Custom or personalised orders may not be eligible for return unless faulty.</p>
      </section>
      <section>
        <h2>Faulty or Damaged Items</h2>
        <p>In the unlikely event that your item arrives damaged or faulty, please contact us within 7 days of receipt with photos of the damage. We will arrange a replacement or full refund at no cost to you, including return shipping.</p>
      </section>
      <section>
        <h2>How to Return an Item</h2>
        <p>To initiate a return, please email us at <a href="mailto:poppas.wooden.creations@gmail.com">poppas.wooden.creations@gmail.com</a> with your order details and reason for return. We will provide you with return instructions within 1–2 business days.</p>
      </section>
      <section>
        <h2>Refunds</h2>
        <p>Once we receive and inspect your return, refunds are processed within 5 business days back to your original payment method.</p>
      </section>
      <section>
        <h2>Consumer Guarantees Act</h2>
        <p>All purchases are covered by the New Zealand Consumer Guarantees Act 1993. If a product is faulty, not fit for purpose, or does not match its description, you are entitled to a repair, replacement, or refund.</p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>Phone: <a href="tel:+642102288166">+64 21 022 88166</a><br/>
        Email: <a href="mailto:poppas.wooden.creations@gmail.com">poppas.wooden.creations@gmail.com</a><br/>
        Address: 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand</p>
      </section>
    `,
  },
  '/privacy': {
    title: "Privacy Policy | Poppa's Wooden Creations NZ",
    description: "Privacy policy for Poppa's Wooden Creations. How we collect, use, and protect your personal information.",
    h1: 'Privacy Policy',
    noindex: true,
    content: `
      <section>
        <h2>Information We Collect</h2>
        <p>We collect personal information you provide when placing an order, contacting us, or signing up for updates. This includes your name, email address, shipping address, and payment information.</p>
        <p>We also collect technical data such as IP addresses and browser information through our website analytics (Google Analytics).</p>
      </section>
      <section>
        <h2>How We Use Your Information</h2>
        <p>We use your personal information to process and fulfil orders, communicate with you about your orders, and send you occasional updates about new products (if you have opted in). We do not sell or share your personal information with third parties except as required to fulfil your order (e.g. courier services).</p>
      </section>
      <section>
        <h2>Payment Security</h2>
        <p>All payment transactions are processed securely through PayPal and Stripe. We do not store your credit card or payment details on our systems.</p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>Our website uses cookies to improve your browsing experience and to collect analytics data. You can disable cookies in your browser settings, though this may affect some website functionality.</p>
      </section>
      <section>
        <h2>Your Rights</h2>
        <p>Under the New Zealand Privacy Act 2020, you have the right to access and correct personal information we hold about you. To make a request, please contact us at <a href="mailto:poppas.wooden.creations@gmail.com">poppas.wooden.creations@gmail.com</a>.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Privacy Officer: Adrian Barber<br/>
        Email: <a href="mailto:poppas.wooden.creations@gmail.com">poppas.wooden.creations@gmail.com</a><br/>
        Address: 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand</p>
      </section>
    `,
  },
  '/terms': {
    title: "Terms of Service | Poppa's Wooden Creations NZ",
    description: "Terms and conditions for purchasing from Poppa's Wooden Creations handcrafted wooden toys and kitchenware in New Zealand.",
    h1: 'Terms of Service',
    noindex: true,
    content: `
      <section>
        <h2>About Us</h2>
        <p>Poppa's Wooden Creations is a New Zealand sole trader business operated by Adrian Barber, located at 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand. We have been handcrafting wooden toys and kitchenware from native NZ timber since 2015.</p>
      </section>
      <section>
        <h2>Orders & Payment</h2>
        <p>By placing an order on our website you agree to these terms. All prices are in New Zealand Dollars (NZD) and include GST where applicable. We accept payment via PayPal and major credit cards. Orders are confirmed by email after successful payment.</p>
      </section>
      <section>
        <h2>Product Descriptions</h2>
        <p>We take care to accurately describe and photograph all products. As all items are handcrafted from natural timber, there will be natural variation in grain, colour, and appearance between individual pieces. This is a feature of natural handcrafted goods, not a defect.</p>
      </section>
      <section>
        <h2>Pricing</h2>
        <p>All prices displayed on our website are the final price you pay, plus applicable shipping costs calculated at checkout. There are no hidden fees.</p>
      </section>
      <section>
        <h2>Consumer Rights</h2>
        <p>Your purchase is covered by the New Zealand Consumer Guarantees Act 1993 and Fair Trading Act 1986. Nothing in these terms limits your statutory consumer rights.</p>
      </section>
      <section>
        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of New Zealand. Any disputes will be subject to the jurisdiction of the New Zealand courts.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Phone: <a href="tel:+642102288166">+64 21 022 88166</a><br/>
        Email: <a href="mailto:poppas.wooden.creations@gmail.com">poppas.wooden.creations@gmail.com</a><br/>
        Address: 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand</p>
      </section>
    `,
  },
};

// ─────────────────────────────────────────────────────────────
// INFO PAGES
// ─────────────────────────────────────────────────────────────
const INFO_PAGES: Record<string, {
  title: string;
  description: string;
  h1: string;
  content: string;
}> = {
  '/about': {
    title: "About Us | Handcrafted in Whangarei NZ Since 2015 | Poppa's Wooden Creations",
    description: "Learn about Poppa's Wooden Creations. Handcrafting premium wooden toys and kitchenware from native NZ timber in Whangarei, Northland, since 2015.",
    h1: "About Poppa's Wooden Creations",
    content: `
      <section>
        <h2>Handcrafted in Whangarei Since 2015</h2>
        <p>Poppa's Wooden Creations is a New Zealand family business operated by Adrian Barber from our workshop at 102 Kiripaka Road, Tikipunga, Whangarei. We have been handcrafting premium wooden toys and kitchenware from native New Zealand timber since 2015.</p>
        <p>Every single product we sell is made by hand in our Whangarei workshop. We are not a dropshipper or reseller — we craft every toy and kitchenware item ourselves using native NZ timbers including Kauri, Rimu, and Macrocarpa.</p>
      </section>
      <section>
        <h2>Our Materials</h2>
        <p>We use only premium native New Zealand timbers — Kauri, Rimu, and Macrocarpa — sourced responsibly from NZ suppliers. All finishes are non-toxic and food-safe, making our products safe for babies, toddlers, and use in the kitchen.</p>
      </section>
      <section>
        <h2>Trusted by Montessori Schools</h2>
        <p>Our wooden toys are used in Montessori schools across New Zealand. We design our toys with open-ended, imaginative play in mind — encouraging children to explore, create, and learn through play.</p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>Phone: <a href="tel:+642102288166">+64 21 022 88166</a><br/>
        Email: <a href="mailto:poppas.wooden.creations@gmail.com">poppas.wooden.creations@gmail.com</a><br/>
        Address: 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand</p>
      </section>
    `,
  },
  '/contact': {
    title: "Contact Us | Poppa's Wooden Creations Whangarei NZ",
    description: "Contact Poppa's Wooden Creations in Whangarei, NZ. Phone, email, or visit us. We're here to help with orders, custom wooden toy requests, and any questions.",
    h1: "Contact Poppa's Wooden Creations",
    content: `
      <section>
        <h2>Get in Touch</h2>
        <p>We'd love to hear from you. Whether you have a question about our products, want to discuss a custom order, or just want to say hello — we're here to help.</p>
        <ul>
          <li><strong>Phone:</strong> <a href="tel:+642102288166">+64 21 022 88166</a></li>
          <li><strong>Email:</strong> <a href="mailto:poppas.wooden.creations@gmail.com">poppas.wooden.creations@gmail.com</a></li>
          <li><strong>Address:</strong> 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand</li>
        </ul>
      </section>
      <section>
        <h2>Business Hours</h2>
        <p>Monday – Friday: 9:00am – 5:00pm NZST<br/>
        Saturday: 9:00am – 12:00pm NZST<br/>
        Sunday: Closed</p>
      </section>
      <section>
        <h2>Custom Orders</h2>
        <p>Interested in a custom wooden toy or kitchenware piece? We love working with customers on bespoke items. Contact us to discuss your ideas and we'll provide a quote.</p>
      </section>
    `,
  },
  '/reviews': {
    title: "Customer Reviews | Poppa's Wooden Creations NZ",
    description: "Read genuine customer reviews of Poppa's Wooden Creations handcrafted wooden toys and kitchenware. Trusted by NZ families and Montessori schools since 2015.",
    h1: 'Customer Reviews',
    content: `
      <section>
        <h2>What Our Customers Say</h2>
        <p>We are proud to be trusted by families and Montessori schools across New Zealand. Here is what some of our customers have to say about Poppa's Wooden Creations.</p>
      </section>
      <section>
        <h2>Leave a Review</h2>
        <p>Have you purchased from us? We'd love to hear your feedback. Please leave us a Google review or get in touch directly.</p>
        <p>Email: <a href="mailto:poppas.wooden.creations@gmail.com">poppas.wooden.creations@gmail.com</a></p>
      </section>
    `,
  },
  '/blog': {
    title: "Blog | Wooden Toys & Craftsmanship | Poppa's Wooden Creations NZ",
    description: "Read our blog for tips on wooden toys, Montessori play, NZ timber craftsmanship and more. Handcrafted wooden toys made in Whangarei since 2015.",
    h1: "Poppa's Wooden Creations Blog",
    content: `
      <section>
        <h2>Tips, Ideas & Craftsmanship</h2>
        <p>Welcome to the Poppa's Wooden Creations blog. Here we share tips on choosing wooden toys, the benefits of Montessori play, insights into New Zealand native timber, and stories from our Whangarei workshop.</p>
      </section>
    `,
  },
};

// ─────────────────────────────────────────────────────────────
// SHARED LAYOUT HELPERS
// ─────────────────────────────────────────────────────────────
function buildSharedNav(currentPath: string): string {
  return `
  <header style="background:#78350f;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;">
    <a href="${BASE_URL}" style="color:#fef3c7;font-weight:bold;font-size:1.2em;text-decoration:none;">Poppa's Wooden Creations</a>
    <nav style="display:flex;gap:16px;">
      <a href="${BASE_URL}/wooden-toys-nz" style="color:#fef3c7;text-decoration:none;">Shop</a>
      <a href="${BASE_URL}/about" style="color:#fef3c7;text-decoration:none;">About</a>
      <a href="${BASE_URL}/blog" style="color:#fef3c7;text-decoration:none;">Blog</a>
      <a href="${BASE_URL}/reviews" style="color:#fef3c7;text-decoration:none;">Reviews</a>
      <a href="${BASE_URL}/contact" style="color:#fef3c7;text-decoration:none;">Contact</a>
    </nav>
  </header>`;
}

function buildSharedFooter(): string {
  return `
  <footer style="background:#1c1917;color:#d6d3d1;padding:32px 24px;margin-top:48px;">
    <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;">
      <div>
        <h3 style="color:#fef3c7;margin-bottom:12px;">Poppa's Wooden Creations</h3>
        <p style="margin:4px 0;">102 Kiripaka Road, Tikipunga</p>
        <p style="margin:4px 0;">Whangarei 0112, New Zealand</p>
        <p style="margin:4px 0;"><a href="tel:+642102288166" style="color:#fcd34d;">+64 21 022 88166</a></p>
        <p style="margin:4px 0;"><a href="mailto:poppas.wooden.creations@gmail.com" style="color:#fcd34d;">poppas.wooden.creations@gmail.com</a></p>
      </div>
      <div>
        <h3 style="color:#fef3c7;margin-bottom:12px;">Shop</h3>
        <ul style="list-style:none;padding:0;margin:0;">
          <li><a href="${BASE_URL}/wooden-baby-toys" style="color:#d6d3d1;text-decoration:none;">Wooden Baby Toys</a></li>
          <li><a href="${BASE_URL}/wooden-cars" style="color:#d6d3d1;text-decoration:none;">Wooden Cars</a></li>
          <li><a href="${BASE_URL}/wooden-trucks" style="color:#d6d3d1;text-decoration:none;">Wooden Trucks</a></li>
          <li><a href="${BASE_URL}/wooden-trains" style="color:#d6d3d1;text-decoration:none;">Wooden Trains</a></li>
          <li><a href="${BASE_URL}/wooden-kitchenware" style="color:#d6d3d1;text-decoration:none;">Wooden Kitchenware</a></li>
          <li><a href="${BASE_URL}/wooden-pens" style="color:#d6d3d1;text-decoration:none;">Wooden Pens</a></li>
          <li><a href="${BASE_URL}/wooden-crosses" style="color:#d6d3d1;text-decoration:none;">Wooden Crosses</a></li>
        </ul>
      </div>
      <div>
        <h3 style="color:#fef3c7;margin-bottom:12px;">Information</h3>
        <ul style="list-style:none;padding:0;margin:0;">
          <li><a href="${BASE_URL}/about" style="color:#d6d3d1;text-decoration:none;">About Us</a></li>
          <li><a href="${BASE_URL}/contact" style="color:#d6d3d1;text-decoration:none;">Contact Us</a></li>
          <li><a href="${BASE_URL}/shipping" style="color:#d6d3d1;text-decoration:none;">Shipping Policy</a></li>
          <li><a href="${BASE_URL}/returns" style="color:#d6d3d1;text-decoration:none;">Returns &amp; Refunds</a></li>
          <li><a href="${BASE_URL}/privacy" style="color:#d6d3d1;text-decoration:none;">Privacy Policy</a></li>
          <li><a href="${BASE_URL}/terms" style="color:#d6d3d1;text-decoration:none;">Terms of Service</a></li>
        </ul>
      </div>
      <div>
        <h3 style="color:#fef3c7;margin-bottom:12px;">Payments Accepted</h3>
        <p style="margin:4px 0;">PayPal</p>
        <p style="margin:4px 0;">Visa / Mastercard</p>
        <p style="margin:4px 0;">American Express</p>
        <p style="margin:8px 0;font-size:0.85em;color:#a8a29e;">Secure checkout via PayPal &amp; Stripe. All transactions encrypted with SSL.</p>
        <p style="margin:8px 0;font-size:0.85em;color:#a8a29e;">Handcrafted in Whangarei, NZ since 2015.</p>
      </div>
    </div>
    <div style="border-top:1px solid #44403c;margin-top:24px;padding-top:16px;text-align:center;font-size:0.85em;color:#78716c;">
      &copy; 2026 Poppa's Wooden Creations. All rights reserved. | NZ Sole Trader | Whangarei, Northland, New Zealand
    </div>
  </footer>`;
}

const SHARED_CSS = `
  body { font-family: Georgia, serif; max-width: 900px; margin: 0 auto; padding: 0; background: #fafaf9; color: #1c1917; line-height: 1.7; }
  main { padding: 40px 24px; }
  h1 { color: #78350f; font-size: 2em; margin-bottom: 8px; }
  h2 { color: #92400e; font-size: 1.3em; margin-top: 32px; }
  a { color: #b45309; }
  section { margin-bottom: 24px; }
  nav.breadcrumb { padding: 12px 24px; background: #fef3c7; font-size: 0.9em; }
  nav.breadcrumb a { color: #92400e; text-decoration: none; }
`;

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────
function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function extractProductId(pathname: string): string | null {
  const match = pathname.match(/^\/products\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function extractCategorySlug(pathname: string): string | null {
  const clean = pathname.replace(/\/$/, '').replace(/^\//, '');
  return CATEGORY_META[clean] ? clean : null;
}

function extractBlogSlug(pathname: string): string | null {
  const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function isPolicyPage(pathname: string): boolean {
  return pathname.replace(/\/$/, '') in POLICY_PAGES;
}

function isInfoPage(pathname: string): boolean {
  return pathname.replace(/\/$/, '') in INFO_PAGES;
}

function buildCanonicalUrl(pathname: string): string {
  return `${BASE_URL}${pathname}`;
}

function isLegacySquarespaceSlug(productId: string): boolean {
  return /^SQ\d+$/i.test(productId);
}

function isPlaceholderSlug(productId: string): boolean {
  return /^product-\d+$/i.test(productId);
}

function hasSearchTemplatePlaceholder(search: string): boolean {
  return search.includes('search_term_string') || search.includes('%7Bsearch_term_string%7D');
}

function hasTrackingParams(searchParams: URLSearchParams): boolean {
  for (const key of searchParams.keys()) {
    if (key.startsWith('utm_') || key === 'gclid' || key === 'fbclid' || key === 'ref') {
      return true;
    }
  }
  return false;
}

// ─────────────────────────────────────────────────────────────
// SUPABASE FETCHERS
// ─────────────────────────────────────────────────────────────
async function fetchProduct(supabaseUrl: string, supabaseKey: string, productId: string): Promise<any | null> {
  if (!supabaseUrl || !supabaseKey) {
    console.error('[bot-prerender] Missing Supabase env vars');
    return null;
  }
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(productId)}&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.[0] || null;
  } catch (err) {
    console.error('[bot-prerender] fetchProduct error:', err);
    return null;
  }
}

async function fetchCategoryProducts(supabaseUrl: string, supabaseKey: string, slug: string): Promise<any[]> {
  if (!supabaseUrl || !supabaseKey) return [];
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/products?category=eq.${encodeURIComponent(slug)}&select=id,name,price,description,images&limit=12`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

async function fetchFeaturedProducts(supabaseUrl: string, supabaseKey: string): Promise<any[]> {
  if (!supabaseUrl || !supabaseKey) return [];
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/products?select=id,name,price,description,images,category&order=created_at.desc&limit=8`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

async function fetchBlogPost(supabaseUrl: string, supabaseKey: string, slug: string): Promise<any | null> {
  if (!supabaseUrl || !supabaseKey) return null;
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.[0] || null;
  } catch (err) {
    console.error('[bot-prerender] fetchBlogPost error:', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// HTML BUILDERS
// ─────────────────────────────────────────────────────────────
function buildHomeHTML(featuredProducts: any[]): string {
  const canonicalUrl = BASE_URL;

  const categoryCards = HOME_META.categories.map(c => `
    <article>
      <a href="${BASE_URL}/${c.slug}">
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
      </a>
    </article>`).join('\n');

  const featuredItems = featuredProducts.slice(0, 8).map(p => {
    const img = (p.images?.[0] || `${BASE_URL}/og-image.jpg`);
    const fullImg = img.startsWith('http') ? img : `${BASE_URL}${img}`;
    const price = parseFloat(p.price || 0).toFixed(2);
    return `
    <article>
      <a href="${BASE_URL}/products/${p.id}">
        <img src="${fullImg}" alt="${p.name} - handcrafted wooden toy NZ" width="300" height="300" loading="lazy" />
        <h3>${p.name}</h3>
        <p>$${price} NZD</p>
      </a>
    </article>`;
  }).join('\n');

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
    ],
  });

  const itemListSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Wooden Toy Categories",
    "numberOfItems": HOME_META.categories.length,
    "itemListElement": HOME_META.categories.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": c.name,
      "url": `${BASE_URL}/${c.slug}`,
    })),
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${HOME_META.title}</title>
  <meta name="description" content="${HOME_META.description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${HOME_META.title}" />
  <meta property="og:description" content="${HOME_META.description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Poppa's Wooden Creations" />
  <meta property="og:locale" content="en_NZ" />
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <script type="application/ld+json">${itemListSchema}</script>
  <style>
    body { font-family: Georgia, serif; max-width: 1100px; margin: 0 auto; padding: 0; background: #fafaf9; color: #1c1917; line-height: 1.7; }
    main { padding: 40px 24px; }
    h1 { color: #78350f; font-size: 2em; margin-bottom: 8px; }
    h2 { color: #92400e; font-size: 1.3em; margin-top: 32px; }
    h3 { color: #78350f; }
    a { color: #b45309; }
    section { margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    article { border: 1px solid #e7e5e4; border-radius: 8px; padding: 12px; }
    article a { text-decoration: none; color: inherit; display: block; }
    img { max-width: 100%; border-radius: 6px; }
  </style>
</head>
<body>
  ${buildSharedNav('/')}
  <main>
    <h1>${HOME_META.h1}</h1>
    <p>${HOME_META.intro}</p>
    ${HOME_META.paragraphs.map(p => `<p>${p}</p>`).join('\n    ')}
    <section>
      <h2>Shop by Category</h2>
      <div class="grid">${categoryCards}</div>
    </section>
    ${featuredProducts.length > 0 ? `
    <section>
      <h2>Featured Products</h2>
      <div class="grid">${featuredItems}</div>
    </section>` : ''}
    <section>
      <h2>Handcrafted in Tikipunga, Whangarei</h2>
      <p>Poppa's Wooden Creations is a toy manufacturer and woodworker based in Tikipunga, Whangarei. Every product is made and checked by hand in our own workshop — we don't outsource or import. Trusted by Montessori schools and eco-conscious families across New Zealand since 2015.</p>
    </section>
  </main>
  ${buildSharedFooter()}
</body>
</html>`;
}

function buildPolicyHTML(pathname: string): string {
  const clean = pathname.replace(/\/$/, '');
  const page = POLICY_PAGES[clean];
  const canonicalUrl = buildCanonicalUrl(clean);
  const robotsContent = page.noindex ? 'noindex, nofollow' : 'index, follow';
  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": page.h1, "item": canonicalUrl },
    ],
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <meta name="robots" content="${robotsContent}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Poppa's Wooden Creations" />
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <style>${SHARED_CSS}</style>
</head>
<body>
  ${buildSharedNav(clean)}
  <nav class="breadcrumb">
    <a href="${BASE_URL}">Home</a> &rsaquo; <span>${page.h1}</span>
  </nav>
  <main>
    <h1>${page.h1}</h1>
    ${page.content}
  </main>
  ${buildSharedFooter()}
</body>
</html>`;
}

function buildInfoHTML(pathname: string): string {
  const clean = pathname.replace(/\/$/, '');
  const page = INFO_PAGES[clean];
  const canonicalUrl = buildCanonicalUrl(clean);
  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": page.h1, "item": canonicalUrl },
    ],
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Poppa's Wooden Creations" />
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <style>${SHARED_CSS}</style>
</head>
<body>
  ${buildSharedNav(clean)}
  <nav class="breadcrumb">
    <a href="${BASE_URL}">Home</a> &rsaquo; <span>${page.h1}</span>
  </nav>
  <main>
    <h1>${page.h1}</h1>
    ${page.content}
  </main>
  ${buildSharedFooter()}
</body>
</html>`;
}

function buildCategoryHTML(slug: string, products: any[]): string {
  const meta = CATEGORY_META[slug];
  const canonicalUrl = `${BASE_URL}/${slug}`;
  const productListItems = products.map(p => {
    const img = (p.images?.[0] || `${BASE_URL}/og-image.jpg`);
    const fullImg = img.startsWith('http') ? img : `${BASE_URL}${img}`;
    const price = parseFloat(p.price || 0).toFixed(2);
    return `
    <article>
      <a href="${BASE_URL}/products/${p.id}">
        <img src="${fullImg}" alt="${p.name} - handcrafted wooden toy NZ" width="400" height="400" loading="lazy" />
        <h3>${p.name}</h3>
        <p>$${price} NZD</p>
        <p>${(p.description || '').substring(0, 120)}...</p>
      </a>
    </article>`;
  }).join('\n');

  const itemListSchema = products.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": meta.h1,
    "url": canonicalUrl,
    "numberOfItems": products.length,
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.name,
      "url": `${BASE_URL}/products/${p.id}`,
    })),
  }) : null;

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": meta.h1, "item": canonicalUrl },
    ],
  });

  const collectionSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": meta.h1,
    "description": meta.description,
    "url": canonicalUrl,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Poppa's Wooden Creations",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "102 Kiripaka Road, Tikipunga",
        "addressLocality": "Whangarei",
        "addressRegion": "Northland",
        "postalCode": "0112",
        "addressCountry": "NZ",
      },
    },
  });

  // Build FAQ schema if this category has FAQs
  const faqSchema = meta.faqs && meta.faqs.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": meta.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  }) : null;

  // Build FAQ HTML if this category has FAQs
  const faqHTML = meta.faqs && meta.faqs.length > 0 ? `
    <section>
      <h2>Frequently Asked Questions</h2>
      ${meta.faqs.map(f => `
      <div style="margin-bottom:20px;">
        <h3 style="color:#78350f;font-size:1.05em;margin-bottom:6px;">${f.question}</h3>
        <p style="margin:0;">${f.answer}</p>
      </div>`).join('')}
    </section>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Poppa's Wooden Creations" />
  <meta property="og:locale" content="en_NZ" />
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <script type="application/ld+json">${collectionSchema}</script>
  ${itemListSchema ? `<script type="application/ld+json">${itemListSchema}</script>` : ''}
  ${faqSchema ? `<script type="application/ld+json">${faqSchema}</script>` : ''}
  <style>
    body { font-family: Georgia, serif; max-width: 1100px; margin: 0 auto; padding: 0; background: #fafaf9; color: #1c1917; line-height: 1.7; }
    main { padding: 40px 24px; }
    h1 { color: #78350f; font-size: 2em; margin-bottom: 8px; }
    h2 { color: #92400e; font-size: 1.3em; margin-top: 32px; }
    h3 { color: #78350f; }
    a { color: #b45309; }
    section { margin-bottom: 24px; }
    nav.breadcrumb { padding: 12px 24px; background: #fef3c7; font-size: 0.9em; }
    nav.breadcrumb a { color: #92400e; text-decoration: none; }
  </style>
</head>
<body>
  ${buildSharedNav(`/${slug}`)}
  <nav class="breadcrumb">
    <a href="${BASE_URL}">Home</a> &rsaquo; <span>${meta.h1}</span>
  </nav>
  <main>
    <h1>${meta.h1}</h1>
    <p>${meta.intro}</p>
    <section>
      <h2>Why Choose Poppa's ${meta.h1}?</h2>
      <ul>
        ${meta.features.map(f => `<li>${f}</li>`).join('\n        ')}
      </ul>
    </section>
    ${products.length > 0 ? `
    <section>
      <h2>Our ${meta.h1} Collection</h2>
      <div>${productListItems}</div>
    </section>` : ''}
    ${meta.extendedContent || ''}
    ${faqHTML}
    <section>
      <h2>Handcrafted in Whangarei, New Zealand</h2>
      <p>Every piece in our ${meta.h1.toLowerCase()} range is handcrafted by Adrian at Poppa's Wooden Creations in Tikipunga, Whangarei. Using only native New Zealand timbers — Kauri, Rimu, and Macrocarpa — and finished with non-toxic, food-safe oils, each piece is unique and built to last generations.</p>
      <p>We have been trusted by Montessori schools and eco-conscious families across New Zealand since 2015.</p>
    </section>
  </main>
  ${buildSharedFooter()}
</body>
</html>`;
}

function buildProductHTML(product: any, productId: string): string {
  const canonicalUrl = `${BASE_URL}/products/${productId}`;
  const name = product.name || 'Handcrafted Wooden Toy';
  const description = product.description || `Handcrafted wooden toy made from premium New Zealand native timber in Whangarei. Non-toxic finish, safe for children. Perfect for Montessori play.`;
  const price = parseFloat(product.price || 0).toFixed(2);
  const image = (product.images?.[0] || `${BASE_URL}/og-image.jpg`);
  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const inStock = product.in_stock !== false;
  const category = (product.category || 'wooden-toys').replace(/-/g, ' ');
  const seoTitle = product.seo_title || `${name} | Handcrafted Wooden Toy | Made in NZ | Poppa's Wooden Creations`;
  const seoDescription = product.seo_description || description.substring(0, 160);
  const ageLabel = product.age_label || '';
  const productSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": fullImage,
    "sku": productId,
    "brand": { "@type": "Brand", "name": "Poppa's Wooden Creations" },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "NZD",
      "price": price,
      "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": { "@type": "Organization", "name": "Poppa's Wooden Creations" },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "10",
      "bestRating": "5",
    },
  });
  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": category.replace(/\b\w/g, l => l.toUpperCase()), "item": `${BASE_URL}/${product.category || 'wooden-toys-nz'}` },
      { "@type": "ListItem", "position": 3, "name": name, "item": canonicalUrl },
    ],
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${seoTitle}</title>
  <meta name="description" content="${seoDescription}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${name} | Poppa's Wooden Creations" />
  <meta property="og:description" content="${seoDescription}" />
  <meta property="og:image" content="${fullImage}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Poppa's Wooden Creations" />
  <meta property="og:locale" content="en_NZ" />
  <script type="application/ld+json">${productSchema}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <style>
    ${SHARED_CSS}
    .product-meta { background: #fef3c7; border-radius: 8px; padding: 16px 20px; margin: 16px 0; }
    .product-meta p { margin: 6px 0; }
    .price { font-size: 1.4em; font-weight: bold; color: #78350f; }
    .stock-in { color: #15803d; font-weight: bold; }
    .stock-out { color: #dc2626; font-weight: bold; }
  </style>
</head>
<body>
  ${buildSharedNav(`/products/${productId}`)}
  <nav class="breadcrumb">
    <a href="${BASE_URL}">Home</a> &rsaquo;
    <a href="${BASE_URL}/${product.category || 'wooden-toys-nz'}">${category.replace(/\b\w/g, (l: string) => l.toUpperCase())}</a> &rsaquo;
    <span>${name}</span>
  </nav>
  <main>
    <h1>${name}</h1>
    <img src="${fullImage}" alt="${name} - Handcrafted wooden toy from New Zealand" width="600" height="600" style="max-width:100%;border-radius:8px;" />
    <div class="product-meta">
      <p class="price">$${price} NZD</p>
      <p class="${inStock ? 'stock-in' : 'stock-out'}">${inStock ? '✓ In Stock' : '✗ Out of Stock'}</p>
      ${ageLabel ? `<p><strong>Age:</strong> ${ageLabel}</p>` : ''}
      <p><strong>Material:</strong> Premium New Zealand native timber (Kauri, Rimu or Macrocarpa)</p>
      <p><strong>Made in:</strong> Whangarei, New Zealand</p>
      <p><strong>Finish:</strong> Non-toxic, food-safe oil</p>
    </div>
    <section>
      <h2>About This Product</h2>
      <p>${description}</p>
    </section>
    <section>
      <h2>Why Choose Poppa's Wooden Creations?</h2>
      <ul>
        <li>Handcrafted from native New Zealand timber (Kauri, Rimu, Macrocarpa)</li>
        <li>Non-toxic, food-safe finish — safe for babies and toddlers</li>
        <li>Built to last generations as heirloom pieces</li>
        <li>Trusted by Montessori schools nationwide since 2015</li>
        <li>Every piece unique — natural grain variation is a feature, not a flaw</li>
      </ul>
    </section>
    <section>
      <h2>Handcrafted in Whangarei</h2>
      <p>This product is handcrafted by Adrian at Poppa's Wooden Creations in Tikipunga, Whangarei, New Zealand. We are not a dropshipper — every item is made in our own workshop from native NZ timber.</p>
      <p><a href="${BASE_URL}/contact">Contact us</a> if you'd like to discuss a custom order or have any questions.</p>
    </section>
  </main>
  ${buildSharedFooter()}
</body>
</html>`;
}

function buildBlogPostHTML(post: any, slug: string): string {
  const canonicalUrl = `${BASE_URL}/blog/${slug}`;
  const title = post.title || "Blog | Poppa's Wooden Creations";
  const metaDesc = post.meta_description || post.excerpt || title;
  const excerpt = post.excerpt || '';
  const image = post.featured_image || `${BASE_URL}/og-image.jpg`;
  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const content = post.content || '';
  const datePublished = post.published_at || post.created_at || '';
  const author = post.author || 'Adrian - Poppa';
  const readTime = post.read_time || '';

  let faqSchema = '';
  try {
    const faqs = typeof post.faqs === 'string' ? JSON.parse(post.faqs) : (post.faqs || []);
    if (Array.isArray(faqs) && faqs.length > 0) {
      faqSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f: any) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer },
        })),
      });
    }
  } catch {
    // faqs not parseable — skip
  }

  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": metaDesc,
    "image": fullImage,
    "url": canonicalUrl,
    "datePublished": datePublished,
    "dateModified": post.updated_at || datePublished,
    "author": { "@type": "Person", "name": author },
    "publisher": {
      "@type": "Organization",
      "name": "Poppa's Wooden Creations",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/og-image.jpg` },
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": title, "item": canonicalUrl },
    ],
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Poppa's Wooden Creations</title>
  <meta name="description" content="${metaDesc}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta property="og:image" content="${fullImage}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Poppa's Wooden Creations" />
  <meta property="og:locale" content="en_NZ" />
  <meta property="article:published_time" content="${datePublished}" />
  <meta property="article:author" content="${author}" />
  <script type="application/ld+json">${articleSchema}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
  ${faqSchema ? `<script type="application/ld+json">${faqSchema}</script>` : ''}
  <style>
    ${SHARED_CSS}
    body { max-width: 860px; }
    .blog-hero { width: 100%; max-height: 420px; object-fit: cover; border-radius: 8px; margin-bottom: 24px; }
    .blog-meta { font-size: 0.9em; color: #78716c; margin-bottom: 24px; }
    .blog-content { line-height: 1.85; }
    .blog-content h2 { color: #92400e; margin-top: 36px; }
    .blog-content p { margin-bottom: 1.2em; }
    .blog-content ul, .blog-content ol { margin-bottom: 1.2em; padding-left: 1.5em; }
    .blog-content li { margin-bottom: 0.4em; }
    .cta-box { background: #fef3c7; border-left: 4px solid #78350f; border-radius: 6px; padding: 20px 24px; margin-top: 48px; }
    .cta-box h2 { margin-top: 0; }
  </style>
</head>
<body>
  ${buildSharedNav(`/blog/${slug}`)}
  <nav class="breadcrumb">
    <a href="${BASE_URL}">Home</a> &rsaquo;
    <a href="${BASE_URL}/blog">Blog</a> &rsaquo;
    <span>${title}</span>
  </nav>
  <main>
    <h1>${title}</h1>
    <p class="blog-meta">
      By ${author}${readTime ? ` &nbsp;·&nbsp; ${readTime}` : ''}${datePublished ? ` &nbsp;·&nbsp; ${new Date(datePublished).toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
    </p>
    ${fullImage !== `${BASE_URL}/og-image.jpg` ? `<img src="${fullImage}" alt="${title}" class="blog-hero" width="860" height="420" />` : ''}
    ${excerpt ? `<p style="font-size:1.1em;color:#57534e;font-style:italic;margin-bottom:24px;">${excerpt}</p>` : ''}
    <div class="blog-content">${content}</div>
    <div class="cta-box">
      <h2>Shop Handcrafted Wooden Toys</h2>
      <p>Browse our full range of handcrafted wooden toys and kitchenware, made from native New Zealand timber in Whangarei.</p>
      <p><a href="${BASE_URL}/wooden-toys-nz">Browse all wooden toys →</a></p>
    </div>
  </main>
  ${buildSharedFooter()}
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────
export const onRequest = async (context: any): Promise<Response> => {
  const request: Request = context.request;
  const env: Env = context.env || {};
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || '';
  const supabaseKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || '';

  const url = new URL(request.url);
  const pathname = url.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  // ── 1. Kill the search template URL immediately ──────────────────────
  if (hasSearchTemplatePlaceholder(url.search)) {
    return new Response('Gone', {
      status: 410,
      headers: {
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // ── 2. Strip tracking params for bots ───────────────────────────────
  if (isBot(userAgent) && hasTrackingParams(url.searchParams)) {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': `${BASE_URL}${pathname}`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // ── 2.5 Renamed product slugs — 301 to the current product id ───────
  // Runs BEFORE the ghost 410 check so a renamed slug always redirects.
  const renamedProduct = extractProductId(pathname);
  if (renamedProduct && PRODUCT_SLUG_REDIRECTS[renamedProduct]) {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': `${BASE_URL}/products/${PRODUCT_SLUG_REDIRECTS[renamedProduct]}`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }

  // ── 3. Ghost product slug check — 410 for ALL visitors ──────────────
  const productId = extractProductId(pathname);
  if (productId) {
    if (
      isLegacySquarespaceSlug(productId) ||
      isPlaceholderSlug(productId) ||
      GHOST_SLUGS.has(productId)
    ) {
      return new Response('Gone', {
        status: 410,
        headers: {
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
  }

  // ── 3.5 Renamed blog slugs — 301 to the current published slug ──────
  const renamedBlog = extractBlogSlug(pathname);
  if (renamedBlog && BLOG_SLUG_REDIRECTS[renamedBlog]) {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': `${BASE_URL}/blog/${BLOG_SLUG_REDIRECTS[renamedBlog]}`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }

  // ── 4. Ghost blog slug check — 410 for ALL visitors ─────────────────
  const blogSlugEarly = extractBlogSlug(pathname);
  if (blogSlugEarly && GHOST_BLOG_SLUGS.has(blogSlugEarly)) {
    return new Response('Gone', {
      status: 410,
      headers: {
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // ── 4.5 Ghost category check — 410 for ALL visitors ────────────────
  const ghostCat = pathname.replace(/^\//, '').replace(/\/$/, '');
  if (GHOST_CATEGORIES.has(ghostCat)) {
    return new Response('Gone', {
      status: 410,
      headers: {
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // ── 5. Pass real users straight through to the React SPA ────────────
  if (!isBot(userAgent)) {
    return context.next();
  }

  // ── 6. Canonicalise trailing slashes ────────────────────────────────
  if (pathname !== '/' && pathname.endsWith('/')) {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': `${BASE_URL}${pathname.slice(0, -1)}`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }

  // ── 7. /wooden-planes → /wooden-planes-helicopters ──────────────────
  if (pathname === '/wooden-planes') {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': `${BASE_URL}/wooden-planes-helicopters`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }

  // ── 7.5 Homepage (bot only beyond this point) ───────────────────────
  if (pathname === '/') {
    const featured = await fetchFeaturedProducts(supabaseUrl, supabaseKey);
    const html = buildHomeHTML(featured);
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'index, follow',
      },
    });
  }

  // ── 8. Product pages (bot only beyond this point) ───────────────────
  if (productId) {
    const product = await fetchProduct(supabaseUrl, supabaseKey, productId);
    if (!product) {
      if (!supabaseUrl || !supabaseKey) return context.next();
      return new Response('Gone', {
        status: 410,
        headers: {
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    const html = buildProductHTML(product, productId);
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'index, follow',
      },
    });
  }

  // ── 9. Category pages ───────────────────────────────────────────────
  const categorySlug = extractCategorySlug(pathname);
  if (categorySlug) {
    const products = await fetchCategoryProducts(supabaseUrl, supabaseKey, categorySlug);
    const html = buildCategoryHTML(categorySlug, products);
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'index, follow',
      },
    });
  }

  // ── 10. Policy pages ────────────────────────────────────────────────
  if (isPolicyPage(pathname)) {
    const clean = pathname.replace(/\/$/, '');
    const page = POLICY_PAGES[clean];
    const html = buildPolicyHTML(pathname);
    const robotsTag = page.noindex ? 'noindex, nofollow' : 'index, follow';
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'X-Robots-Tag': robotsTag,
      },
    });
  }

  // ── 11. Info pages ──────────────────────────────────────────────────
  if (isInfoPage(pathname)) {
    const html = buildInfoHTML(pathname);
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'X-Robots-Tag': 'index, follow',
      },
    });
  }

  // ── 12. Individual blog posts (/blog/:slug) ──────────────────────────
  const blogSlug = extractBlogSlug(pathname);
  if (blogSlug) {
    const post = await fetchBlogPost(supabaseUrl, supabaseKey, blogSlug);
    if (!post) {
      return new Response('Gone', {
        status: 410,
        headers: {
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    const html = buildBlogPostHTML(post, blogSlug);
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'index, follow',
      },
    });
  }

  // ── 13. Anything else — pass through to React SPA ───────────────────
  return context.next();
}
