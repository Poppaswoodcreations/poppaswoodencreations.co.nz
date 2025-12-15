import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Award, Truck, Edit, Shield, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onCategorySelect: (category: string) => void;
  products?: Product[];
}

const Hero: React.FC<HeroProps> = ({ onCategorySelect, products = [] }) => {
  const [heroData, setHeroData] = useState({
    title: "Premium Wooden Toys Made with Love",
    subtitle: "Discover our collection of beautiful, safe, and sustainable wooden toys handcrafted in New Zealand. Each piece is made from premium timber including Kauri, Rimu, and Macrocarpa, designed to inspire creativity and last for generations.",
    backgroundImage: "https://i.ibb.co/20BWhH7J/Messenger-creation-9-D5326-FA-08-DE-471-A-BAB1-6-E385-C838-D90-2-optimized.webp",
    ctaText: "Shop Baby Toys"
  });

  // Load saved hero data from the SAME key the editor uses
  useEffect(() => {
    try {
      const saved = localStorage.getItem('poppas-hero-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHeroData(prev => ({ ...prev, ...parsed }));
        console.log('🎨 HERO: Loaded saved hero data:', parsed);
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
    }
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 hidden md:block">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-8 sm:py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-amber-600">
                <Award size={20} />
                <span className="text-sm font-medium uppercase tracking-wide">Handcrafted in New Zealand</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight" style={{ fontDisplay: 'swap' }}>
                {heroData.title}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl" style={{ fontDisplay: 'swap' }}>
                {heroData.subtitle}
              </p>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed" style={{ fontDisplay: 'swap' }}>
                From our workshop in Whangarei, we create toys that encourage imaginative play, develop fine motor 
                skills, and provide endless hours of screen-free entertainment. Every toy is hand-sanded to a 
                silky smooth finish and finished with child-safe, non-toxic materials.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Premium Quality</h4>
                  <p className="text-sm text-gray-600">Hand-selected NZ timber</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Child Safe</h4>
                  <p className="text-sm text-gray-600">Non-toxic finishes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Truck className="text-purple-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                  <p className="text-sm text-gray-600">Orders over $1000</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onCategorySelect('wooden-baby-toys')}
                className="bg-amber-800 text-white px-6 sm:px-8 py-4 rounded-lg font-bold hover:bg-amber-900 transition-colors flex items-center justify-center space-x-2 group shadow-md"
              >
                <span>{heroData.ctaText}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 pt-4">
              <div className="flex items-center space-x-1 text-sm sm:text-base">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">4.9/5 (150+ reviews)</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Shield size={14} className="text-green-500" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award size={14} className="text-blue-500" />
                  <span>NZ Registered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle size={14} className="text-purple-500" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image - OPTIMIZED FOR PERFORMANCE */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden w-full">
              <img
                src={heroData.backgroundImage}
                alt="Handcrafted wooden toys - Premium quality wooden toys from Poppa's Wooden Creations made in New Zealand"
                className="w-full h-full object-cover product-image"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                width="600"
                height="600"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log('❌ HERO: Image failed to load, using fallback');
                  target.src = 'https://i.ibb.co/FkkjBShk/image.jpg';
                }}
                onLoad={() => {
                  console.log('✅ HERO: Image loaded successfully:', heroData.backgroundImage.substring(0, 50));
                }}
              />
            </div>
            
            {/* Floating Elements - FIXED: Better contrast */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-green-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
              Made in NZ 🇳🇿
            </div>
            
            <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-amber-800 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
              🚛 Premium Wooden Toys
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
