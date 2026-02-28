import React from 'react';

const WoodenBabyToysPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">

      {/* Intro */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Handcrafted Wooden Baby Toys — Safe, Natural & Made in New Zealand</h2>
        <p className="text-lg leading-relaxed mb-4">
          Our wooden baby toys are handcrafted in Whangarei from native New Zealand timbers including Kauri, Rimu, and Macrocarpa. Every piece is shaped, sanded, and finished by hand — designed to be safe for the youngest children while providing the sensory richness that only natural wood can offer.
        </p>
        <p className="leading-relaxed">
          Unlike plastic toys, our baby toys are free from harmful chemicals, BPA, and synthetic materials. They're warm to the touch, naturally smooth, and finished with child-safe natural oils that are completely safe for teething babies.
        </p>
      </section>

      {/* Why Choose */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Why Choose Wooden Baby Toys?</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>100% Natural & Non-Toxic:</strong> Finished with food-safe natural oils — completely safe for babies who mouth and chew their toys</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Sensory Development:</strong> The natural weight, texture, and warmth of real wood provides rich sensory feedback that plastic simply cannot replicate</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Montessori-Aligned:</strong> Simple, open-ended designs that encourage exploration and discovery — trusted by Montessori schools across New Zealand</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Heirloom Quality:</strong> Built to last well beyond babyhood — toys that can be passed down to siblings and future generations</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Native NZ Timber:</strong> Crafted from beautiful Kauri, Rimu, and Macrocarpa with natural grain patterns that make every piece unique</div>
          </li>
        </ul>
      </section>

      {/* Timber Section */}
      <section className="mb-10 bg-amber-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">New Zealand Timber for Baby Toys</h2>
        <p className="leading-relaxed mb-4">
          We carefully select timbers that are naturally smooth-grained and easy to finish to a silky, splinter-free surface. Kauri is our preferred timber for baby toys — it has a fine, even grain that polishes beautifully and is naturally gentle on delicate baby skin. Rimu adds warm reddish-brown tones, while Macrocarpa brings a lighter, honey-coloured finish.
        </p>
        <p className="leading-relaxed">
          All our timber is sourced from legal, sustainable supplies — primarily salvaged or recycled native timber — to protect New Zealand's precious native forests.
        </p>
      </section>

      {/* Safety */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Safety First</h2>
        <p className="leading-relaxed mb-4">
          Every baby toy we make is hand-sanded through multiple grits to achieve a completely smooth, splinter-free finish. All edges and corners are rounded by hand. We use only natural, food-safe oils for finishing — no varnishes, lacquers, or synthetic coatings that could be harmful if mouthed or chewed.
        </p>
        <p className="leading-relaxed">
          Our toys are designed and crafted with over 15 years of woodworking experience, with baby safety always the primary consideration.
        </p>
      </section>

      {/* Gift */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">A Meaningful New Zealand Baby Gift</h2>
        <p className="leading-relaxed">
          A handcrafted wooden baby toy from Poppa's Wooden Creations makes a genuinely special gift for new babies, baby showers, christenings, and first birthdays. Each piece is made by hand in our Tikipunga workshop in Whangarei — a gift that carries the story of genuine New Zealand craftsmanship and will be treasured long after babyhood has passed.
        </p>
      </section>

      {/* Care */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Care & Maintenance</h2>
        <p className="leading-relaxed">
          Wipe clean with a damp cloth after use. Do not soak in water or put in a dishwasher. Allow to dry naturally. Every few months, apply a small amount of natural food-safe oil (such as coconut oil or beeswax) to nourish the timber and maintain its smooth finish. With simple care, these toys will remain beautiful and safe for years to come.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-4">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">What age are the baby toys suitable for?</h3>
            <p className="leading-relaxed">Our wooden baby toys are designed for babies and toddlers from around 6 months and up, depending on the specific toy. Each product listing includes the recommended age range.</p>
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Are the finishes safe for teething babies?</h3>
            <p className="leading-relaxed">Yes — we use only natural, food-safe oils for finishing. No varnishes, lacquers, or synthetic coatings are used on our baby toys.</p>
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">What timber are the baby toys made from?</h3>
            <p className="leading-relaxed">Primarily Kauri, Rimu, and Macrocarpa — all native New Zealand timbers sourced from legal, sustainable supplies.</p>
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

export default WoodenBabyToysPage;
