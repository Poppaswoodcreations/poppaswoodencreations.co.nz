import React, { useState, useEffect } from 'react';
import { Save, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeroEditorProps {
  onSave: (heroData: any) => void;
}

const HeroEditor: React.FC<HeroEditorProps> = ({ onSave }) => {
  const [heroData, setHeroData] = useState({
    hero_title: "Premium Wooden Toys",
    hero_subtitle: "Made with Love",
    hero_cta_text: "Shop Collection",
    hero_cta_link: "#products",
    hero_bg_image: ""
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load hero data from Supabase
  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading hero data:', error);
        return;
      }

      if (data) {
        setHeroData({
          hero_title: data.hero_title || "Premium Wooden Toys",
          hero_subtitle: data.hero_subtitle || "Made with Love",
          hero_cta_text: data.hero_cta_text || "Shop Collection",
          hero_cta_link: data.hero_cta_link || "#products",
          hero_bg_image: data.hero_bg_image || ""
        });
        console.log('✅ Loaded hero data from Supabase');
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
    }
  };

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
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${timestamp}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update hero data with new image URL
      setHeroData({ ...heroData, hero_bg_image: publicUrl });
      
      console.log('✅ Hero image uploaded successfully');
      setSaveMessage('Image uploaded! Remember to click "Save Hero Changes".');
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    setUploadError(null);

    try {
      // Update site_settings in Supabase
      const { error } = await supabase
        .from('site_settings')
        .update({
          hero_title: heroData.hero_title,
          hero_subtitle: heroData.hero_subtitle,
          hero_cta_text: heroData.hero_cta_text,
          hero_cta_link: heroData.hero_cta_link,
          hero_bg_image: heroData.hero_bg_image
        })
        .eq('id', (await supabase.from('site_settings').select('id').single()).data?.id);

      if (error) {
        throw error;
      }

      console.log('✅ Hero settings saved to Supabase');
      setSaveMessage('Hero section updated successfully! Changes are live.');
      onSave(heroData);

      // Auto-clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
      
    } catch (error) {
      console.error('❌ Failed to save hero settings:', error);
      setUploadError('Failed to save hero settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Hero Section Editor</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Hero Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Success/Error Messages */}
      {saveMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {saveMessage}
        </div>
      )}
      
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {uploadError}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Hero Content</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
            <input
              type="text"
              value={heroData.hero_title}
              onChange={(e) => setHeroData({ ...heroData, hero_title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Premium Wooden Toys"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={heroData.hero_subtitle}
              onChange={(e) => setHeroData({ ...heroData, hero_subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Made with Love"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={heroData.hero_cta_text}
                onChange={(e) => setHeroData({ ...heroData, hero_cta_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Shop Collection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
              <input
                type="text"
                value={heroData.hero_cta_link}
                onChange={(e) => setHeroData({ ...heroData, hero_cta_link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="#products"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
            
            <div className="space-y-3">
              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className={`bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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

              {/* Image URL Input */}
              <input
                type="text"
                value={heroData.hero_bg_image}
                onChange={(e) => setHeroData({ ...heroData, hero_bg_image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                placeholder="https://hfirnolwhesjkxshidxo.supabase.co/storage/v1/object/public/product-images/..."
              />
              
              {/* Image Preview */}
              {heroData.hero_bg_image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={heroData.hero_bg_image}
                    alt="Hero preview"
                    className="w-full max-w-md h-48 object-cover rounded border border-gray-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Hero Section Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep the title short and impactful (e.g., "Premium Wooden Toys")</li>
          <li>• Subtitle appears next to the title in amber color</li>
          <li>• Click "Upload New Image" to upload directly to Supabase Storage</li>
          <li>• Or paste an existing Supabase Storage URL in the text field</li>
          <li>• Recommended image size: 1200x1200px (square format)</li>
          <li>• Changes save to your live website immediately after clicking "Save Hero Changes"</li>
          <li>• Your hero image is stored permanently in Supabase Storage</li>
        </ul>
      </div>
    </div>
  );
};

export default HeroEditor;
