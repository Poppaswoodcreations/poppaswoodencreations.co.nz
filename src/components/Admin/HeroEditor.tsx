import React, { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon, RefreshCw, Eye } from 'lucide-react';

interface HeroEditorProps {
  onSave: (heroData: any) => void;
}

const HeroEditor: React.FC<HeroEditorProps> = ({ onSave }) => {
  const [heroData, setHeroData] = useState({
    title: "Premium Wooden Toys Made with Love",
    subtitle: "Discover our collection of beautiful, safe, and sustainable wooden toys handcrafted in New Zealand. Each piece is made from premium timber including Kauri, Rimu, and Macrocarpa, designed to inspire creativity and last for generations.",
    ctaText: "Shop Baby Toys",
    secondaryCtaText: "Learn More",
    backgroundImage: "https://i.ibb.co/FkkjBShk/image.jpg",
    badges: {
      topRight: "Made in NZ 🇳🇿",
      bottomLeft: "🚛 Premium Wooden Toys"
    }
  });

  // Load saved hero data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('poppas-hero-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHeroData({ ...heroData, ...parsed });
        console.log('🎨 Loaded saved hero data');
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('poppas-hero-settings', JSON.stringify(heroData));
      console.log('💾 Hero settings saved:', heroData);
      onSave(heroData);
      alert('Hero section updated successfully!');
    } catch (error) {
      console.error('❌ Failed to save hero settings:', error);
      alert('Failed to save hero settings. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Hero Section Editor</h3>
        <button
          onClick={handleSave}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save Hero</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Hero Content</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle/Description</label>
            <textarea
              rows={4}
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Text</label>
              <input
                type="text"
                value={heroData.ctaText}
                onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Text</label>
              <input
                type="text"
                value={heroData.secondaryCtaText}
                onChange={(e) => setHeroData({ ...heroData, secondaryCtaText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
            <input
              type="text"
              value={heroData.backgroundImage}
              onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Image URL or upload from Image Manager"
            />
            {heroData.backgroundImage && (
              <div className="mt-2">
                <img
                  src={heroData.backgroundImage}
                  alt="Hero preview"
                  className="w-32 h-24 object-cover rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/FB_IMG_1640827671355.jpg';
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Top Right Badge</label>
              <input
                type="text"
                value={heroData.badges.topRight}
                onChange={(e) => setHeroData({ 
                  ...heroData, 
                  badges: { ...heroData.badges, topRight: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bottom Left Badge</label>
              <input
                type="text"
                value={heroData.badges.bottomLeft}
                onChange={(e) => setHeroData({ 
                  ...heroData, 
                  badges: { ...heroData.badges, bottomLeft: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Hero Section Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep the title short and impactful</li>
          <li>• Use the subtitle to explain your value proposition</li>
          <li>• Upload hero images through the Image Manager</li>
          <li>• Test different call-to-action button text</li>
          <li>• Changes take effect immediately after saving</li>
        </ul>
      </div>
    </div>
  );
};

export default HeroEditor;