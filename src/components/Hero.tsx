import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Award, Truck, Edit, Shield, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onCategorySelect: (category: string) => void;
  products?: Product[];
}

const Hero: React.FC<HeroProps> = ({ onCategorySelect, products = [] }) => {
  const [heroImage, setHeroImage] = useState('');
  const [showImageEditor, setShowImageEditor] = useState(false);

  // Load saved hero image
  useEffect(() => {
    try {
      // Try multiple storage keys for hero image
      const savedHeroImage = localStorage.getItem('poppas-hero-image') || 
                            localStorage.getItem('hero-image') ||
                            localStorage.getItem('main-image');
      
      if (savedHeroImage) {
        console.log('🖼️ HERO: Found saved hero image');
        setHeroImage(savedHeroImage);
      } else {
        console.log('🖼️ HERO: No saved image, using default truck image');
        setHeroImage('https://i.ibb.co/dw3x0Kmm/image.jpg');
      }
    } catch (error) {
      console.error('Error loading hero image:', error);
      setHeroImage('https://i.ibb.co/dw3x0Kmm/image.jpg');
    }
  }, []);

  const handleSaveHeroImage = () => {
    try {
      console.log('💾 HERO: Saving hero image:', heroImage.substring(0, 100) + '...');
      
      // Save to localStorage
      localStorage.setItem('poppas-hero-image', heroImage);
      
      // Force update the state to trigger re-render
      setHeroImage(heroImage);
      
      // Verify save
      const verification = localStorage.getItem('poppas-hero-image');
      if (verification === heroImage) {
        console.log('✅ HERO: Image saved successfully');
        setShowImageEditor(false);
        alert('Hero image updated successfully! Refresh the page to see the change.');
        
        // Force page refresh to show the new image
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error('Save verification failed');
      }
    } catch (error) {
      console.error('❌ HERO: Failed to save hero image:', error);
      alert('Failed to save hero image. Please try again.');
    }
  };

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
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Premium Wooden Toys
                <span className="block text-amber-600">Made with Love</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Discover our collection of beautiful, safe, and sustainable wooden toys handcrafted in New Zealand. 
                Each piece is made from premium timber including Kauri, Rimu, and Macrocarpa, designed to inspire 
                creativity and last for generations. Our toys are not just playthings – they're heirloom pieces 
                that grow with your child and can be passed down through families.
              </p>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
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
                  <h3 className="font-semibold text-gray-900">Premium Quality</h3>
                  <p className="text-sm text-gray-600">Hand-selected NZ timber</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Child Safe</h3>
                  <p className="text-sm text-gray-600">Non-toxic finishes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Truck className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                  <p className="text-sm text-gray-600">Orders over $1000</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onCategorySelect('wooden-baby-toys')}
                className="bg-amber-600 text-white px-6 sm:px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Shop Baby Toys</span>
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

          {/* Hero Image */}
          <div className="relative">
            {/* Edit Button - Always visible */}
            <button
              onClick={() => setShowImageEditor(true)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 bg-amber-600 hover:bg-amber-700 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all"
              title="Edit hero image"
              style={{ zIndex: 30 }}
            >
              <Edit size={16} className="sm:w-5 sm:h-5" />
            </button>
            
            <div className="aspect-square bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden w-full">
              <img
                src={heroImage || 'https://i.ibb.co/FkkjBShk/image.jpg'}
                alt="Handcrafted wooden truck toys - Premium quality wooden toys from Poppa's Wooden Creations made in New Zealand"
                className="w-full h-full object-cover product-image"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log('❌ HERO: Image failed to load, using fallback');
                  target.src = 'https://i.ibb.co/FkkjBShk/image.jpg';
                }}
                onLoad={() => {
                  console.log('✅ HERO: Image loaded successfully');
                }}
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-green-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
              Made in NZ 🇳🇿
            </div>
            
            <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-amber-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
              🚛 Premium Wooden Toys
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;