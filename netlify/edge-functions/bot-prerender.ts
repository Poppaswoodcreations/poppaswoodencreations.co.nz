// netlify/edge-functions/bot-prerender.ts
// Detects Google/bot crawlers and serves fully populated HTML
// Real users get the normal React SPA as usual

import type { Context } from "https://edge.netlify.com";

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
];

const SUPABASE_URL = Deno.env.get('VITE_SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('VITE_SUPABASE_ANON_KEY') || '';
const BASE_URL = 'https://poppaswoodencreations.co.nz';

// ─── Category page metadata ───────────────────────────────────────────────────
const CATEGORY_META: Record<string, {
  title: string;
  description: string;
  h1: string;
  intro: string;
  features: string[];
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
    description: 'Safe, handcrafted wooden baby toys from New Zealand native timber. Non-toxic finish, Montessori-inspired designs trusted by NZ families and schools since 2015.',
    h1: 'Handcrafted Wooden Baby Toys',
    intro: 'Our wooden baby toys are lovingly handcrafted in Whangarei from New Zealand native timber. Finished with non-toxic, baby-safe oils and designed for sensory development and open-ended Montessori play.',
    features: [
      'Non-toxic, food-safe finish — safe for teething babies',
      'Montessori-inspired, open-ended play',
      'Trusted by NZ Montessori schools since 2015',
      'Made from Kauri, Rimu and Macrocarpa',
      'Smooth, splinter-free edges for little hands',
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
};

// ─── Policy page metadata ─────────────────────────────────────────────────────
const POLICY_PAGES: Record<string, {
  title: string;
  description: string;
  h1: string;
  noindex: boolean;
  content: string;
}> = {
  '/shipping': {
    title: 'Shipping Policy | Poppa\'s Wooden Creations NZ',
    description: 'Learn about shipping times, costs, and delivery options for handcrafted wooden toys from Poppa\'s Wooden Creations in Whangarei, New Zealand.',
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
        <p>If you have any questions about your shipment, please contact us at <a href="mailto:poppaswoodencreations@gmail.com">poppaswoodencreations@gmail.com</a> or call <a href="tel:+6421022881​66">+64 21 022 88166</a>.</p>
      </section>
    `,
  },
  '/returns': {
    title: 'Returns & Refunds Policy | Poppa\'s Wooden Creations NZ',
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
        <p>To initiate a return, please email us at <a href="mailto:poppaswoodencreations@gmail.com">poppaswoodencreations@gmail.com</a> with your order details and reason for return. We will provide you with return instructions within 1–2 business days.</p>
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
        <p>Phone: <a href="tel:+6421022881​66">+64 21 022 88166</a><br/>
        Email: <a href="mailto:poppaswoodencreations@gmail.com">poppaswoodencreations@gmail.com</a><br/>
        Address: 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand</p>
      </section>
    `,
  },
  '/privacy': {
    title: 'Privacy Policy | Poppa\'s Wooden Creations NZ',
    description: 'Privacy policy for Poppa\'s Wooden Creations. How we collect, use, and protect your personal information.',
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
        <p>All payment transactions are processed securely through PayPal. We do not store your credit card or payment details on our systems.</p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>Our website uses cookies to improve your browsing experience and to collect analytics data. You can disable cookies in your browser settings, though this may affect some website functionality.</p>
      </section>
      <section>
        <h2>Your Rights</h2>
        <p>Under the New Zealand Privacy Act 2020, you have the right to access and correct personal information we hold about you. To make a request, please contact us at <a href="mailto:poppaswoodencreations@gmail.com">poppaswoodencreations@gmail.com</a>.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Privacy Officer: Adrian Barber<br/>
        Email: <a href="mailto:poppaswoodencreations@gmail.com">poppaswoodencreations@gmail.com</a><br/>
        Address: 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand</p>
      </section>
    `,
  },
  '/terms': {
    title: 'Terms of Service | Poppa\'s Wooden Creations NZ',
    description: 'Terms and conditions for purchasing from Poppa\'s Wooden Creations handcrafted wooden toys and kitchenware in New Zealand.',
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
        <p>Phone: <a href="tel:+6421022881​66">+64 21 022 88166</a><br/>
        Email: <a href="mailto:poppaswoodencreations@gmail.com">poppaswoodencreations@gmail.com</a><br/>
        Address: 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand</p>
      </section>
    `,
  },
};

// ─── Info page metadata ───────────────────────────────────────────────────────
const INFO_PAGES: Record<string, {
  title: string;
  description: string;
  h1: string;
  content: string;
}> = {
  '/about': {
    title: 'About Us | Handcrafted in Whangarei NZ Since 2015 | Poppa\'s Wooden Creations',
    description: 'Learn about Poppa\'s Wooden Creations. Handcrafting premium wooden toys and kitchenware from native NZ timber in Whangarei, Northland, since 2015.',
    h1: 'About Poppa\'s Wooden Creations',
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
        <p>We love hearing from our customers. Get in touch with any questions about our products or to discuss a custom order.</p>
        <p>Phone: <a href="tel:+6421022881​66">+64 21 022 88166</a><br/>
        Email: <a href="mailto:poppaswoodencreations@gmail.com">poppaswoodencreations@gmail.com</a><br/>
        Address: 102 Kiripaka Road, Tikipunga, Whangarei 0112, New Zealand</p>
      </section>
    `,
  },
  '/contact': {
    title: 'Contact Us | Poppa\'s Wooden Creations Whangarei NZ',
    description: 'Contact Poppa\'s Wooden Creations in Whangarei, NZ. Phone, email, or visit us. We\'re here to help with orders, custom wooden toy requests, and any questions.',
    h1: 'Contact Poppa\'s Wooden Creations',
    content: `
      <section>
        <h2>Get in Touch</h2>
        <p>We'd love to hear from you. Whether you have a question about our products, want to discuss a custom order, or just want to say hello — we're here to help.</p>
        <ul>
          <li><strong>Phone:</strong> <a href="tel:+6421022881​66">+64 21 022 88166</a></li>
          <li><strong>Email:</strong> <a href="mailto:poppaswoodencreations@gmail.com">poppaswoodencreations@gmail.com</a></li>
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
};

// ─── Shared footer & nav HTML ─────────────────────────────────────────────────
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
        <p style="margin:4px 0;"><a href="tel:+6421022881​66" style="color:#fcd34d;">+64 21 022 88166</a></p>
        <p style="margin:4px 0;"><a href="mailto:poppaswoodencreations@gmail.com" style="color:#fcd34d;">poppaswoodencreations@gmail.com</a></p>
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
        <p style="margin:8px 0;font-size:0.85em;color:#a8a29e;">Secure checkout via PayPal. All transactions encrypted with SSL.</p>
        <p style="margin:8px 0;font-size:0.85em;color:#a8a29e;">Handcrafted in Whangarei, NZ since 2015.</p>
      </div>
    </div>
    <div style="border-top:1px solid #44403c;margin-top:24px;padding-top:16px;text-align:center;font-size:0.85em;color:#78716c;">
      &copy; 2025 Poppa's Wooden Creations. All rights reserved. | ABN/NZBN: NZ Sole Trader | Whangarei, Northland, New Zealand
    </div>
  </footer>`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function extractProductId(pathname: string): string | null {
  const match = pathname.match(/^\/products\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

function extractCategorySlug(pathname: string): string | null {
  // Strip trailing slash before lookup — canonical URLs have no trailing slash
  const clean = pathname.replace(/\/$/, '');
  const slug = clean.replace(/^\//, '');
  return CATEGORY_META[slug] ? slug : null;
}

function isPolicyPage(pathname: string): boolean {
  const clean = pathname.replace(/\/$/, '');
  return clean in POLICY_PAGES;
}

function isInfoPage(pathname: string): boolean {
  const clean = pathname.replace(/\/$/, '');
  return clean in INFO_PAGES;
}

async function fetchProduct(productId: string): Promise<any | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(productId)}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchCategoryProducts(slug: string): Promise<any[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?category=eq.${encodeURIComponent(slug)}&select=id,name,price,description,images&limit=12`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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

// ─── HTML builders ────────────────────────────────────────────────────────────

function buildPolicyHTML(pathname: string): string {
  const clean = pathname.replace(/\/$/, '');
  const page = POLICY_PAGES[clean];
  const canonicalUrl = `${BASE_URL}${clean}`;
  const robotsContent = page.noindex ? 'noindex, nofollow' : 'index, follow';

  const localBusinessSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Poppa's Wooden Creations",
    "url": BASE_URL,
    "telephone": "+6421022881​66",
    "email": "poppaswoodencreations@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "102 Kiripaka Road, Tikipunga",
      "addressLocality": "Whangarei",
      "addressRegion": "Northland",
      "postalCode": "0112",
      "addressCountry": "NZ",
    },
  });

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
  <script type="application/ld+json">${localBusinessSchema}</script>
  <style>
    body { font-family: Georgia, serif; max-width: 900px; margin: 0 auto; padding: 0; background: #fafaf9; color: #1c1917; line-height: 1.7; }
    main { padding: 40px 24px; }
    h1 { color: #78350f; font-size: 2em; margin-bottom: 8px; }
    h2 { color: #92400e; font-size: 1.3em; margin-top: 32px; }
    a { color: #b45309; }
    section { margin-bottom: 24px; }
    nav.breadcrumb { padding: 12px 24px; background: #fef3c7; font-size: 0.9em; }
    nav.breadcrumb a { color: #92400e; text-decoration: none; }
  </style>
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
  const canonicalUrl = `${BASE_URL}${clean}`;

  const localBusinessSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Poppa's Wooden Creations",
    "description": "Handcrafted wooden toys and kitchenware from native NZ timber, made in Whangarei since 2015.",
    "url": BASE_URL,
    "telephone": "+6421022881​66",
    "email": "poppaswoodencreations@gmail.com",
    "foundingDate": "2015",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "102 Kiripaka Road, Tikipunga",
      "addressLocality": "Whangarei",
      "addressRegion": "Northland",
      "postalCode": "0112",
      "addressCountry": "NZ",
    },
  });

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
  <script type="application/ld+json">${localBusinessSchema}</script>
  <style>
    body { font-family: Georgia, serif; max-width: 900px; margin: 0 auto; padding: 0; background: #fafaf9; color: #1c1917; line-height: 1.7; }
    main { padding: 40px 24px; }
    h1 { color: #78350f; font-size: 2em; margin-bottom: 8px; }
    h2 { color: #92400e; font-size: 1.3em; margin-top: 32px; }
    a { color: #b45309; }
    section { margin-bottom: 24px; }
    nav.breadcrumb { padding: 12px 24px; background: #fef3c7; font-size: 0.9em; }
    nav.breadcrumb a { color: #92400e; text-decoration: none; }
  </style>
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
  <style>
    body { font-family: Georgia, serif; max-width: 1100px; margin: 0 auto; padding: 0; background: #fafaf9; color: #1c1917; line-height: 1.7; }
    main { padding: 40px 24px; }
    h1 { color: #78350f; font-size: 2em; margin-bottom: 8px; }
    h2 { color: #92400e; font-size: 1.3em; margin-top: 32px; }
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
      <div>
        ${productListItems}
      </div>
    </section>` : ''}

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
      "reviewCount": "150",
      "bestRating": "5",
    },
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": category.replace(/\b\w/g, l => l.toUpperCase()), "item": `${BASE_URL}/${product.category || 'products'}` },
      { "@type": "ListItem", "position": 3, "name": name, "item": canonicalUrl },
    ],
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} | Handcrafted Wooden Toy | Made in NZ | Poppa's Wooden Creations</title>
  <meta name="description" content="${description.substring(0, 160)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${name} | Poppa's Wooden Creations" />
  <meta property="og:description" content="${description.substring(0, 160)}" />
  <meta property="og:image" content="${fullImage}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="product" />
  <script type="application/ld+json">${productSchema}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <style>
    body { font-family: Georgia, serif; max-width: 900px; margin: 0 auto; padding: 0; background: #fafaf9; color: #1c1917; line-height: 1.7; }
    main { padding: 40px 24px; }
    h1 { color: #78350f; font-size: 2em; margin-bottom: 8px; }
    h2 { color: #92400e; font-size: 1.3em; margin-top: 32px; }
    nav.breadcrumb { padding: 12px 24px; background: #fef3c7; font-size: 0.9em; }
    nav.breadcrumb a { color: #92400e; text-decoration: none; }
  </style>
</head>
<body>
  ${buildSharedNav(`/products/${productId}`)}
  <nav class="breadcrumb">
    <a href="${BASE_URL}">Home</a> &rsaquo;
    <a href="${BASE_URL}/${product.category || 'products'}">${category.replace(/\b\w/g, (l: string) => l.toUpperCase())}</a> &rsaquo;
    <span>${name}</span>
  </nav>
  <main>
    <h1>${name}</h1>
    <p>${description}</p>
    <div><strong>Price:</strong> $${price} NZD</div>
    <div><strong>Availability:</strong> ${inStock ? 'In Stock' : 'Out of Stock'}</div>
    <div><strong>Material:</strong> Premium New Zealand native timber</div>
    <div><strong>Made in:</strong> Whangarei, New Zealand</div>
    <div><strong>Category:</strong> ${category.replace(/\b\w/g, (l: string) => l.toUpperCase())}</div>
    <img src="${fullImage}" alt="${name} - Handcrafted wooden toy from New Zealand" width="600" height="600" />
    <section>
      <h2>About This Product</h2>
      <p>Handcrafted in Whangarei, New Zealand from premium native timber.
      Finished with non-toxic, food-safe oils. Safe for children of all ages.
      Trusted by Montessori schools across New Zealand since 2015.</p>
    </section>
    <section>
      <h2>Why Choose Poppa's Wooden Creations?</h2>
      <ul>
        <li>Handcrafted from native New Zealand timber (Kauri, Rimu, Macrocarpa)</li>
        <li>Non-toxic, food-safe finish — safe for babies and toddlers</li>
        <li>Built to last generations as heirloom pieces</li>
        <li>Trusted by Montessori schools nationwide since 2015</li>
      </ul>
    </section>
  </main>
  ${buildSharedFooter()}
</body>
</html>`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(request: Request, context: Context) {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only intercept bots
  if (!isBot(userAgent)) {
    return context.next();
  }

  // ── Trailing-slash normalisation for bots ──────────────────────────────────
  // If a bot requests /wooden-trucks/ redirect to /wooden-trucks (the canonical).
  // This ensures Google always indexes the no-trailing-slash version.
  if (pathname !== '/' && pathname.endsWith('/')) {
    const canonical = pathname.slice(0, -1);
    return new Response(null, {
      status: 301,
      headers: {
        'Location': `${BASE_URL}${canonical}${url.search}`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }

  // ── Product pages ──────────────────────────────────────────────────────────
  const productId = extractProductId(pathname);
  if (productId) {
    const product = await fetchProduct(productId);
    if (!product) return context.next();
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

  // ── Category pages ─────────────────────────────────────────────────────────
  const categorySlug = extractCategorySlug(pathname);
  if (categorySlug) {
    const products = await fetchCategoryProducts(categorySlug);
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

  // ── Policy pages (/shipping, /returns, /privacy, /terms) ──────────────────
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

  // ── Info pages (/about, /contact) ─────────────────────────────────────────
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

  // Everything else — let React handle it
  return context.next();
}

// ── FIXED: Added trailing-slash variants so the edge function fires for both
// /wooden-trucks AND /wooden-trucks/ (and all other bot-rendered paths)
export const config = {
  path: [
    '/products/*',
    '/wooden-*',
    '/wooden-*/',
    '/shipping',
    '/shipping/',
    '/returns',
    '/returns/',
    '/privacy',
    '/privacy/',
    '/terms',
    '/terms/',
    '/about',
    '/about/',
    '/contact',
    '/contact/',
  ],
};
