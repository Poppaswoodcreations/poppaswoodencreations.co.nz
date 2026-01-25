import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface HeroProps {
  onCategorySelect: (category: string) => void;
  products: Product[];
}

interface SiteSettings {
  hero_bg_image?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  hero_cta_link?: string;
}

const Hero: React.FC<HeroProps> = ({ onCategorySelect, products }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const featuredProduct = products.find(p => p.featured) || products[0];

  // Load site settings from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single();
        
        if (error) {
          console.error('Error loading site settings:', error);
        } else if (data) {
          setSiteSettings(data);
        }
      } catch (err) {
        console.error('Error loading site settings:', err);
      }
    };
    
    loadSettings();
  }, []);

  // Determine which image to use - settings override featured product
  const heroImage = siteSettings.hero_bg_image || featuredProduct?.images?.[0];

  // Preload the hero image with high priority
  useEffect(() => {
    if (heroImage) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      
      const img = new Image();
      img.src = heroImage;
      img.onload = () => setImageLoaded(true);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [heroImage]);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/wood-texture.png')] opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-amber-600 bg-amber-100 px-4 py-2 rounded-full">
                ⭐ Handmade in New Zealand
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {siteSettings.hero_title || 'Handmade Wooden Toys'}
              <span className="block text-amber-600 mt-2">
                {siteSettings.hero_subtitle || 'Whangarei, New Zealand'}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Premium wooden toys for children, handcrafted from native New Zealand timbers including Kauri, Rimu, and Macrocarpa. 
              Safe, sustainable, and built to last generations.
            </p>
            
            <p className="text-base text-gray-500 mt-4 max-w-2xl">
              From our Whangarei workshop, we create childrens wooden toys that inspire imaginative play and develop 
              fine motor skills. Trusted by Montessori schools and eco-conscious families across New Zealand since 2015.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => onCategorySelect('wooden-vehicles')}
                className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {siteSettings.hero_cta_text || 'Shop Wooden Toys'}
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
          
          {/* Hero Image - Now pulls from site_settings */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-3 transition-transform hover:rotate-0 duration-500">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 animate-pulse"></div>
              )}
              {heroImage && (
                <img
                  src={heroImage}
                  alt="Handmade wooden toys New Zealand - Premium childrens wooden toys"
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
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
