import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface FeaturedProductsProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  products, 
  onProductSelect, 
  onAddToCart 
}) => {
  const displayProducts = products.slice(0, 6);
  
  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Rich Content Section - ADDED FOR SEO */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Wooden Toys for Children</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Handmade wooden toys crafted in New Zealand from native timbers. Trusted by Montessori schools 
              and eco-conscious families across NZ
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-8 text-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Wooden Toys?</h3>
            <p className="mb-4">
              Wooden toys offer benefits that plastic alternatives simply cannot match. They're durable enough 
              to last for generations, making them true heirlooms that can be passed down through your family. 
              The natural weight and texture provide important sensory feedback that supports child development. 
              Unlike electronic toys, wooden toys encourage open-ended imaginative play and creativity.
            </p>
            <p className="mb-4">
              Our toys are crafted from native New Zealand timbers including Rimu, Kauri, and Macrocarpa, each 
              with its own unique grain and character. Every piece is completely natural, biodegradable, and 
              free from harmful plastics, chemicals, or electronic components. The simple beauty of natural wood 
              connects children to the physical world in a way that plastic toys cannot replicate.
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-8 text-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Montessori Schools for Over 10 Years</h3>
            <p className="mb-4">
              Montessori schools throughout New Zealand have trusted our wooden toys for their classrooms for 
              over a decade. Our simple, beautifully crafted toys align perfectly with Montessori educational 
              principles, encouraging independent play, concentration, and motor skill development. The durability 
              that withstands daily classroom use makes them perfect for home environments too. What works in 
              Montessori classrooms works beautifully at home.
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-8 text-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Handcrafted in Whangarei, New Zealand</h3>
            <p className="mb-4">
              Since 2015, we've been creating beautiful wooden toys in our Whangarei workshop. Each piece is 
              individually handcrafted with attention to quality and detail. We believe in creating toys that 
              tell a story—the story of New Zealand's beautiful native timbers, the story of traditional 
              craftsmanship, and the story that your child will create through imaginative play.
            </p>
            <p>
              By choosing our toys, you're supporting local New Zealand artisans and sustainable practices. 
              Every toy is made with care, hand-sanded to a silky-smooth finish, and treated with child-safe 
              natural oils. We take pride in creating products that are safe for children and gentle on our 
              environment.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onProductSelect}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
