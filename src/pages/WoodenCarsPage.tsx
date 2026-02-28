import React from 'react';

const WoodenCarsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">

      {/* Intro */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Handcrafted Wooden Toy Cars — New Zealand Kauri & Rimu</h2>
        <p className="text-lg leading-relaxed mb-4">
          Our wooden toy cars are individually handcrafted in Whangarei from beautiful native New Zealand timbers — primarily Kauri and Rimu. Each car is shaped, sanded, and finished entirely by hand in our Tikipunga workshop, resulting in a toy with the warmth, weight, and character that only genuine handcrafted woodwork can deliver.
        </p>
        <p className="leading-relaxed">
          These are not mass-produced toys. Every car reflects over 15 years of woodworking experience and the natural beauty of New Zealand's finest native timbers. The natural grain variation means no two cars are ever exactly alike — each one is truly one of a kind.
        </p>
      </section>

      {/* Why Choose */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Why Choose Our Wooden Toy Cars?</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Genuinely Handmade:</strong> Each car is individually shaped and finished by hand — not CNC-cut or factory produced</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Native NZ Timber:</strong> Crafted from Kauri and Rimu — timbers prized for their beauty, durability, and fine natural grain</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Open-Ended Play:</strong> Simple, classic designs that encourage imaginative storytelling and creative play without batteries or screens</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Montessori-Friendly:</strong> Trusted by Montessori schools across New Zealand for their simplicity and natural materials</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Heirloom Quality:</strong> Built to outlast childhood and become a keepsake passed down through families</div>
          </li>
        </ul>
      </section>

      {/* Timber */}
      <section className="mb-10 bg-amber-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Kauri & Rimu — New Zealand's Finest Timbers</h2>
        <p className="leading-relaxed mb-4">
          Kauri (Agathis australis) is one of New Zealand's most iconic native trees, producing a pale golden timber with a fine, straight grain that carves and finishes beautifully. Its natural lustre and smooth texture make it ideal for toys that will be handled constantly by children.
        </p>
        <p className="leading-relaxed mb-4">
          Rimu (Dacrydium cupressinum) brings richer, warmer tones — a reddish-brown timber with fine grain and natural depth that polishes to a warm, lustrous finish. Together, these two timbers create toy cars with a distinctly New Zealand character.
        </p>
        <p className="leading-relaxed">
          All our timber is sourced from legal, sustainable supplies — primarily salvaged or recycled native timber — to protect New Zealand's native forests.
        </p>
      </section>

      {/* Development */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Developmental Benefits of Wooden Toy Cars</h2>
        <p className="leading-relaxed mb-4">
          Wooden toy cars offer developmental benefits that electronic alternatives simply cannot. The natural weight provides important proprioceptive feedback, helping children develop grip strength and fine motor control. Pushing and steering a wooden car builds hand-eye coordination while encouraging creative, imaginative play.
        </p>
        <p className="leading-relaxed">
          Unlike toys with flashing lights and pre-programmed sounds, our wooden cars invite children to create their own stories — roads become adventures, and simple cars become characters in rich imaginary worlds. This kind of open-ended play is at the heart of Montessori educational philosophy.
        </p>
      </section>

      {/* Gift */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">A Classic New Zealand Gift</h2>
        <p className="leading-relaxed">
          A handcrafted Kauri or Rimu toy car from Poppa's Wooden Creations makes a timeless gift for birthdays, Christmas, and special occasions. Each piece is made entirely by hand in our Whangarei workshop — a genuine New Zealand-made keepsake that carries far more meaning than anything mass-produced overseas.
        </p>
      </section>

      {/* Care */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Care & Maintenance</h2>
        <p className="leading-relaxed">
          Dust regularly with a soft dry cloth. Avoid prolonged exposure to direct sunlight or damp conditions. Every 6–12 months, apply a small amount of natural wood oil (such as beeswax or linseed oil) to nourish the timber and maintain its warm finish. With simple care, a wooden toy car from Poppa's Wooden Creations will remain beautiful for decades.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-4">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">What age are the wooden cars suitable for?</h3>
            <p className="leading-relaxed">Our wooden toy cars are generally suitable for children aged 2 and up. Each product listing includes the specific recommended age range.</p>
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">What timber are the cars made from?</h3>
            <p className="leading-relaxed">Primarily Kauri and Rimu — native New Zealand timbers sourced from legal, sustainable supplies.</p>
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Are the finishes child-safe?</h3>
            <p className="leading-relaxed">Yes — all our toys are finished with natural, child-safe oils. No synthetic varnishes or lacquers are used.</p>
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Do you ship throughout New Zealand?</h3>
            <p className="leading-relaxed">Yes, we ship to all New Zealand addresses. Standard shipping is $8.50 NZD, with free shipping on orders over $150.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default WoodenCarsPage;
