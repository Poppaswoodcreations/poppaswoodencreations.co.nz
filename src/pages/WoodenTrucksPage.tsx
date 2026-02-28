import React from 'react';

const WoodenTrucksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">

      {/* Intro */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Handcrafted Wooden Toy Trucks — New Zealand Macrocarpa & Rimu</h2>
        <p className="text-lg leading-relaxed mb-4">
          Our wooden toy trucks are handcrafted in Whangarei from native New Zealand timbers — primarily Macrocarpa and Rimu. Solid, substantial, and built to withstand the enthusiastic play of children, each truck is shaped and finished entirely by hand in our Tikipunga workshop.
        </p>
        <p className="leading-relaxed">
          These trucks have real weight and presence — nothing like the lightweight plastic alternatives. The natural timber gives them a satisfying heft that children instinctively respond to, making them perfect for construction-themed play, imaginative storytelling, and outdoor adventures.
        </p>
      </section>

      {/* Why Choose */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Why Choose Our Wooden Toy Trucks?</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Solid & Durable:</strong> Built from dense native timbers to withstand years of hard play — far more durable than plastic equivalents</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Genuinely Handmade:</strong> Every truck is individually crafted by hand in our Whangarei workshop — not mass-produced or CNC-cut</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Native NZ Timber:</strong> Crafted from Macrocarpa and Rimu — beautiful, sustainable New Zealand timbers with rich natural character</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Construction Play:</strong> Perfect for imaginative construction and transport-themed play that builds creativity and storytelling skills</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 font-bold mt-1">✓</span>
            <div><strong>Heirloom Quality:</strong> Made to outlast childhood and be passed down through families as a genuine keepsake</div>
          </li>
        </ul>
      </section>

      {/* Timber */}
      <section className="mb-10 bg-amber-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Macrocarpa & Rimu — Strength and Beauty</h2>
        <p className="leading-relaxed mb-4">
          Macrocarpa (Cupressus macrocarpa) is a robust, golden-toned timber with a distinctive aromatic scent and attractive grain. Its density and stability make it ideal for toys that need to handle rough play — it resists denting and wear far better than softwoods, while remaining workable enough for fine hand-shaping.
        </p>
        <p className="leading-relaxed mb-4">
          Rimu adds warmth and richness — its reddish-brown tones and fine grain complement the golden tones of Macrocarpa beautifully. Together, these timbers produce trucks with real visual character and the satisfying solidity that makes wooden toys so enduring.
        </p>
        <p className="leading-relaxed">
          All timber is sourced from legal, sustainable supplies — primarily salvaged or recycled native timber — to protect New Zealand's native forests.
        </p>
      </section>

      {/* Development */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Why Wooden Trucks Support Child Development</h2>
        <p className="leading-relaxed mb-4">
          The natural weight of a wooden truck provides important sensory and proprioceptive feedback that helps children develop strength, coordination, and spatial awareness. Pushing, pulling, loading, and steering a solid wooden truck builds fine and gross motor skills in a natural, unstructured way.
        </p>
        <p className="leading-relaxed">
          Construction and transport play is developmentally rich — it builds problem-solving skills, encourages cooperative play, and supports the kind of imaginative, open-ended storytelling that Montessori educators value highly. Our wooden trucks are used in Montessori classrooms across New Zealand for exactly these reasons.
        </p>
      </section>

      {/* Gift */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">A Genuinely New Zealand Gift</h2>
        <p className="leading-relaxed">
          A handcrafted Macrocarpa or Rimu toy truck from Poppa's Wooden Creations makes a memorable gift for birthdays, Christmas, and special occasions. Made entirely by hand in Whangarei, each truck is a piece of genuine New Zealand craftsmanship — substantial, beautiful, and built to last a lifetime.
        </p>
      </section>

      {/* Care */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Care & Maintenance</h2>
        <p className="leading-relaxed">
          Dust regularly with a soft dry cloth. Avoid prolonged exposure to water or direct sunlight. Every 6–12 months, apply a small amount of natural wood oil to maintain the timber's finish. These trucks are built tough, but a little care will keep them looking beautiful for generations.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-4">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">What age are the wooden trucks suitable for?</h3>
            <p className="leading-relaxed">Our wooden toy trucks are generally suitable for children aged 2 and up. Each product listing includes the specific recommended age range.</p>
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">What timber are the trucks made from?</h3>
            <p className="leading-relaxed">Primarily Macrocarpa and Rimu — native New Zealand timbers sourced from legal, sustainable supplies.</p>
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Are they suitable for outdoor play?</h3>
            <p className="leading-relaxed">Yes, our trucks are solid and durable enough for outdoor play. We recommend bringing them inside when not in use to protect the timber finish from prolonged exposure to weather.</p>
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

export default WoodenTrucksPage;
