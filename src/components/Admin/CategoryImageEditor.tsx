import React, { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon, RefreshCw, Eye } from 'lucide-react';
import { categories } from '../../data/products';
import { supabase } from '../../lib/supabase';
import ImageUpload from '../ImageUpload';

const ADMIN_PASSWORD = 'Adrianbar1?';

interface CategoryImageEditorProps {
  onSave: (categoryImages: { [key: string]: string }) => void;
}

// FIX (16 Aug 2026): previously saved only to
// localStorage['poppas-category-images'] — edits never reached the live
// site for real visitors. Rewired to load from and save to the
// site_settings table (same pattern as HeroEditor), via the existing
// /api/admin-site-settings endpoint. Auto-save-on-every-keystroke to
// localStorage removed; changes now save explicitly via "Save All Changes"
// to avoid firing a network request per keystroke.
const CategoryImageEditor: React.FC<CategoryImageEditorProps> = ({ onSave }) => {
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [categoryImageIds, setCategoryImageIds] = useState<{ [key: string]: string }>({});
  const [displayImages, setDisplayImages] = useState<{ [key: string]: string }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const getImageUrl = (imageIdOrUrl: string): string => {
    if (!imageIdOrUrl) return '';
    if (imageIdOrUrl.startsWith('http') || imageIdOrUrl.startsWith('data:') || imageIdOrUrl.startsWith('/')) {
      return imageIdOrUrl;
    }
    try {
      const storedImages = JSON.parse(localStorage.getItem('poppa-images') || '[]');
      const foundImage = storedImages.find((img: any) => img.id === imageIdOrUrl);
      return foundImage ? foundImage.dataUrl : imageIdOrUrl;
    } catch (error) {
      console.error('Error retrieving image:', error);
      return imageIdOrUrl;
    }
  };

  useEffect(() => {
    loadCategoryImages();
  }, []);

  const loadCategoryImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading category images from Supabase:', error);
        applyDefaults();
        return;
      }

      if (data) {
        setSettingsId(data.id);
        const stored = data.category_images;
        if (stored && typeof stored === 'object' && Object.keys(stored).length > 0) {
          setDisplayImages(stored);
          setCategoryImageIds(stored);
          console.log('📸 Loaded category images from Supabase:', Object.keys(stored));
        } else {
          applyDefaults();
        }
      }
    } catch (error) {
      console.error('Error loading category images:', error);
      applyDefaults();
    } finally {
      setLoading(false);
    }
  };

  const applyDefaults = () => {
    const defaultDisplay: { [key: string]: string } = {};
    categories.forEach(cat => {
      defaultDisplay[cat.slug] = cat.image;
    });
    setCategoryImageIds(defaultDisplay);
    setDisplayImages(defaultDisplay);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      if (!settingsId) {
        throw new Error('Missing site_settings row id — try refreshing the page.');
      }
      const res = await fetch('/api/admin-site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: ADMIN_PASSWORD,
          action: 'update',
          id: settingsId,
          updates: { category_images: displayImages },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to save category images');

      onSave(displayImages);
      setSaveMessage('Category images saved successfully! Changes are live.');
      console.log('💾 Saved category images to Supabase');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving category images:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save category images.');
    } finally {
      setSaving(false);
    }
  };

  const updateCategoryImage = (categorySlug: string, imageUrl: string) => {
    const newImageIds = { ...categoryImageIds, [categorySlug]: imageUrl };
    const newDisplayImages = { ...displayImages, [categorySlug]: getImageUrl(imageUrl) };
    setCategoryImageIds(newImageIds);
    setDisplayImages(newDisplayImages);
  };

  const handleImageUpload = (images: { id: string; url: string }[]) => {
    if (images.length > 0 && selectedCategory) {
      updateCategoryImage(selectedCategory, images[0].id);
      setShowImageUpload(false);
      setSelectedCategory('');
    }
  };

  const resetToDefault = (categorySlug: string) => {
    const defaultCategory = categories.find(c => c.slug === categorySlug);
    if (defaultCategory) {
      updateCategoryImage(categorySlug, defaultCategory.image);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        <span>Loading category images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Category Image Editor</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {saveMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{saveMessage}</div>
      )}
      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{saveError}</div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">📸 How to Update Category Images</h4>
        <div className="text-sm text-amber-700 space-y-1">
          <p><strong>1.</strong> Click "Upload New Image" for any category</p>
          <p><strong>2.</strong> Upload your image (it will be automatically compressed)</p>
          <p><strong>3.</strong> Click "Save All Changes" when done</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">{category.name}</h4>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
              <div className="relative">
                <img
                  src={displayImages[category.slug] || category.image}
                  alt={`${category.name} category`}
                  className="w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/FB_IMG_1640827671355.jpg';
                  }}
                />
                <button
                  onClick={() => {
                    const newWindow = window.open();
                    if (newWindow) {
                      newWindow.document.write(`
                        <html>
                          <head><title>${category.name} Image</title></head>
                          <body style="margin:0; background:#000; display:flex; align-items:center; justify-content:center; min-height:100vh;">
                            <img src="${displayImages[category.slug] || category.image}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                          </body>
                        </html>
                      `);
                    }
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  title="View full size"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                value={categoryImageIds[category.slug] || ''}
                onChange={(e) => updateCategoryImage(category.slug, e.target.value)}
                placeholder="Enter image URL or upload a new image"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(category.slug);
                  setShowImageUpload(true);
                }}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Upload size={14} />
                <span>Upload New Image</span>
              </button>

              <button
                onClick={() => resetToDefault(category.slug)}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <RefreshCw size={14} />
                <span>Reset to Default</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <strong>Category:</strong> {category.slug}<br/>
                <strong>Description:</strong> {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Image for {categories.find(c => c.slug === selectedCategory)?.name}
                </h3>
                <button
                  onClick={() => {
                    setShowImageUpload(false);
                    setSelectedCategory('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <ImageUpload
                onImagesUploaded={handleImageUpload}
                maxImages={1}
                productName={categories.find(c => c.slug === selectedCategory)?.name || 'category'}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Category Images</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use high-quality images that represent the category well</li>
          <li>• Images will be automatically resized to fit the category cards</li>
          <li>• You can paste image URLs directly or upload new images</li>
          <li>• Click "Save All Changes" to make edits live on the site</li>
          <li>• Use "Reset to Default" to restore original images</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryImageEditor;
