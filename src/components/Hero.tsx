import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface HeroProps {
  onCategorySelect: (category: string) => void;
  products: Product[];
}

const Hero: React.FC<HeroProps> = ({ onCategorySelect, products }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const featuredProduct = products.find(p => p.featured) || products[0];

  // Preload the first image
  useEffect(() => {
    if (featuredProduct?.images?.[0]) {
      const img = new Image();
      img.src = featuredProduct.images[0];
      img.onload = () => setImageLoaded(true);
    }
  }, [featuredProduct]);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/wood-texture.png')] opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-amber-600 bg-amber-100 px-4 py-2 rounded-full">
                ⭐ Handcrafted in New Zealand
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Premium Wooden Toys
              <span className="block text-amber-600 mt-2">Made with Love</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Discover our collection of beautiful, safe, and sustainable wooden toys handcrafted in New Zealand.
              Each piece is made from premium timber including Kauri, Rimu, and Macrocarpa, designed to inspire
              creativity and last for generations.
            </p>
            
            <p className="text-base text-gray-500 mt-4 max-w-2xl">
              From our workshop in Whangarei, we create toys that encourage imaginative play, develop fine motor
              skills, and provide endless hours of screen-free entertainment.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => onCategorySelect('wooden-vehicles')}
                className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Shop Collection
              </button>
              
              <button
                onClick={() => window.location.href = '/about'}
                className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-amber-600"
              >
                Our Story
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-amber-600">100+</div>
                <div className="text-sm text-gray-600 mt-1">Products</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-amber-600">15+</div>
                <div className="text-sm text-gray-600 mt-1">Years Experience</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-amber-600">★★★★★</div>
                <div className="text-sm text-gray-600 mt-1">5 Star Rated</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image - Optimized with lazy loading */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-3 transition-transform hover:rotate-0 duration-500">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 animate-pulse"></div>
              )}
              {featuredProduct?.images?.[0] && (
                <img
                  src={featuredProduct.images[0]}
                  alt={featuredProduct.name || "Premium Wooden Toy"}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="eager"
                  decoding="async"
                  width="600"
                  height="600"
                />
              )}
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-400 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 sm:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 L0,120 L1200,120 L1200,0 Q900,60 600,0 Q300,60 0,0 Z" fill="rgb(249, 250, 251)"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
