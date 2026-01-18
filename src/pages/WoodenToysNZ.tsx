import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const WoodenToysNZ: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead 
        title="Handmade Wooden Toys NZ | Premium New Zealand Wooden Toys"
        description="Discover premium handmade wooden toys in New Zealand. Crafted from native Kauri, Rimu & Macrocarpa timber. Safe, sustainable childrens wooden toys trusted by Montessori schools. Shop now!"
        canonicalPath="/wooden-toys-nz"
        ogType="website"
        ogImage="https://poppaswoodencreations.co.nz/hero-image.jpg"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Handmade Wooden Toys
              <span className="block text-amber-600 mt-2">New Zealand</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Premium wooden toys for children, handcrafted in Whangarei from native New Zealand timbers. 
              Safe, sustainable, and built to last generations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose New Zealand Wooden Toys?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At Poppa's Wooden Creations, we've been handcrafting premium wooden toys in New Zealand for over 15 years. 
              Each piece is carefully made from native timbers including Kauri, Rimu, and Macrocarpa—woods known for their 
              beautiful grain, durability, and natural warmth.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our childrens wooden toys are more than just playthings. They're heirloom pieces designed to inspire 
              imaginative play, develop fine motor skills, and provide screen-free entertainment that grows with your child. 
              From wooden baby toys safe for teething to complex vehicle sets for older children, every toy is finished with 
              non-toxic, food-safe oils.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-amber-50 p-8 rounded-2xl">
              <div className="text-4xl mb-4">🌲</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Native NZ Timbers</h3>
              <p className="text-gray-700">
                Crafted from premium Kauri, Rimu, and Macrocarpa timber sourced sustainably from New Zealand forests. 
                Each piece showcases the natural beauty and unique grain patterns of these iconic woods.
              </p>
            </div>

            <div className="bg-green-50 p-8 rounded-2xl">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Non-Toxic</h3>
              <p className="text-gray-700">
                All our wooden baby toys and childrens toys are finished with food-safe, non-toxic oils. 
                No harmful chemicals, perfect for teething babies and curious toddlers.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Montessori Approved</h3>
              <p className="text-gray-700">
                Trusted supplier to Montessori schools across New Zealand. Our toys encourage open-ended play, 
                problem-solving, and creativity—core principles of Montessori education.
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-2xl">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Friendly Choice</h3>
              <p className="text-gray-700">
                Choose sustainable wooden toys over plastic. Our handmade toys are biodegradable, durable, 
                and designed to be passed down through generations—reducing waste and environmental impact.
              </p>
            </div>
          </div>

          {/* Product Categories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Wooden Toy Collections</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/wooden-cars')}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-amber-600 hover:shadow-lg transition-all text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🚗</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Wooden Cars</h3>
                <p className="text-gray-600 text-sm">Classic toy cars & vehicles</p>
              </button>

              <button
                onClick={() => navigate('/wooden-baby-toys')}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-amber-600 hover:shadow-lg transition-all text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👶</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Baby Toys</h3>
                <p className="text-gray-600 text-sm">Safe teething & sensory toys</p>
              </button>

              <button
                onClick={() => navigate('/wooden-trains')}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-amber-600 hover:shadow-lg transition-all text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🚂</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Train Sets</h3>
                <p className="text-gray-600 text-sm">Build railways & spark imagination</p>
              </button>

              <button
                onClick={() => navigate('/wooden-trucks')}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-amber-600 hover:shadow-lg transition-all text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🚚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trucks</h3>
                <p className="text-gray-600 text-sm">Dump trucks, fire engines & more</p>
              </button>

              <button
                onClick={() => navigate('/wooden-planes-helicopters')}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-amber-600 hover:shadow-lg transition-all text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✈️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Planes & Helicopters</h3>
                <p className="text-gray-600 text-sm">Aviation toys that soar</p>
              </button>

              <button
                onClick={() => navigate('/wooden-kitchenware')}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-amber-600 hover:shadow-lg transition-all text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🍴</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kitchenware</h3>
                <p className="text-gray-600 text-sm">Utensils & serving boards</p>
              </button>
            </div>
          </div>

          {/* Why Handmade Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Handmade Difference</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike mass-produced plastic toys, each of our handmade wooden toys is individually crafted in our 
              Whangarei workshop. This means every piece receives personal attention to detail, ensuring smooth edges, 
              perfect finishes, and quality that stands the test of time.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We believe wooden toys connect children to nature and simpler times. The natural weight, texture, and 
              warmth of wood create a sensory experience that plastic simply cannot replicate. Many parents tell us 
              their children prefer our wooden toys over electronic alternatives—proving that quality craftsmanship 
              still matters.
            </p>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Parents Say</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex mb-3">
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Beautiful craftsmanship! Our daughter loves her wooden car collection. They're so much nicer 
                  than the plastic toys we had before. Love supporting a NZ business too."
                </p>
                <p className="text-gray-900 font-semibold">— Sarah M., Auckland</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex mb-3">
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "We run a Montessori preschool and have been ordering from Poppa's for years. The quality is 
                  outstanding and the children are always drawn to these toys first."
                </p>
                <p className="text-gray-900 font-semibold">— Lisa K., Wellington</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Are wooden toys safe for babies?</h3>
                <p className="text-gray-700">
                  Yes! Our wooden baby toys are finished with food-safe, non-toxic oils and have no small parts that 
                  could pose a choking hazard. They're perfect for teething and safe for babies to explore.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What timber do you use?</h3>
                <p className="text-gray-700">
                  We use premium native New Zealand timbers including Kauri, Rimu, and Macrocarpa. These woods are 
                  known for their beautiful grain patterns, durability, and natural warmth.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How do I care for wooden toys?</h3>
                <p className="text-gray-700">
                  Simply wipe with a damp cloth and mild soap if needed. Avoid soaking in water. Occasionally apply 
                  food-safe oil to maintain the wood's natural beauty.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Do you ship throughout New Zealand?</h3>
                <p className="text-gray-700">
                  Yes! We offer shipping across New Zealand with free shipping on orders over $1000. We also ship 
                  internationally for customers wanting authentic NZ wooden toys.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-amber-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Choose Quality?</h2>
            <p className="text-xl mb-8 text-amber-50">
              Browse our collection of handmade wooden toys and discover the difference that craftsmanship makes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/wooden-cars')}
                className="bg-white text-amber-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-50 transition-all shadow-lg"
              >
                Shop All Toys
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-800 transition-all border-2 border-white"
              >
                Custom Orders
              </button>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default WoodenToysNZ;
