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
    backgroundImage: "https://i.ibb.co/20BWhH7J/Messenger-creation-9-D5326-FA-08-DE-471-A-BAB1-6-E385-C838-D90-2-optimized.webp",
    badges: {
      topRight: "Made in NZ 🇳🇿",
      bottomLeft: "🚛 Premium Wooden Toys"
    }
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
      const filename = `hero-${timestamp}-${sanitizedName}`;

      // Convert to WebP for optimization
      const webpBlob = await convertToWebP(file);
      
      // Create form data
      const formData = new FormData();
      formData.append('image', webpBlob, filename.replace(/\.[^.]+$/, '.webp'));

      // Upload to your Netlify images folder
      // Note: You'll need to have an upload endpoint set up
      // For now, we'll use a simple approach with base64
      const base64 = await fileToBase64(webpBlob);
      
      // Store the image as a data URL temporarily
      // In production, you'd upload this to Netlify's images folder
      setHeroData({ ...heroData, backgroundImage: base64 });
      
      console.log('✅ Hero image uploaded successfully');
      alert('Image uploaded! Remember to save your changes.');
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Convert image to WebP format for optimization
  const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size (max width 1920px for hero images)
        const maxWidth = 1920;
        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        }, 'image/webp', 0.85);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Convert file to base64
  const fileToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

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
          <span>Save Hero Changes</span>
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
            
            {/* Image Upload Button */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {uploading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        <span>Upload New Image</span>
                      </>
                    )}
                  </div>
                </label>
                
                <span className="text-sm text-gray-500">or paste URL below</span>
              </div>

              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}

              <input
                type="text"
                value={heroData.backgroundImage}
                onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Or paste image URL here"
              />
              
              {heroData.backgroundImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={heroData.backgroundImage}
                    alt="Hero preview"
                    className="w-full max-w-md h-48 object-cover rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/FB_IMG_1640827671355.jpg';
                    }}
                  />
                </div>
              )}
            </div>
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
          <li>• Click "Upload New Image" to select an image from your computer</li>
          <li>• Recommended image size: 1920x1080px or larger</li>
          <li>• Images are automatically optimized to WebP format</li>
          <li>• Test different call-to-action button text</li>
          <li>• Click "Save Hero Changes" when you're done editing</li>
        </ul>
      </div>
    </div>
  );
};

export default HeroEditor;
