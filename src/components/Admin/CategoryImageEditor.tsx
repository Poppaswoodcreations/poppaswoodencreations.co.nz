import React, { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon, RefreshCw, Eye } from 'lucide-react';
import { categories } from '../../data/products';
import ImageUpload from '../ImageUpload';

interface CategoryImageEditorProps {
  onSave: (categoryImages: { [key: string]: string }) => void;
}

const CategoryImageEditor: React.FC<CategoryImageEditorProps> = ({ onSave }) => {
  const [categoryImageIds, setCategoryImageIds] = useState<{ [key: string]: string }>({});
  const [displayImages, setDisplayImages] = useState<{ [key: string]: string }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Helper function to get image URL from ID or return URL directly
  const getImageUrl = (imageIdOrUrl: string): string => {
    if (!imageIdOrUrl) return '';
    
    // If it's already a URL (starts with http or data:), return as is
    if (imageIdOrUrl.startsWith('http') || imageIdOrUrl.startsWith('data:') || imageIdOrUrl.startsWith('/')) {
      return imageIdOrUrl;
    }
    
    // Otherwise, try to find it in stored images
    try {
      const storedImages = JSON.parse(localStorage.getItem('poppa-images') || '[]');
      const foundImage = storedImages.find((img: any) => img.id === imageIdOrUrl);
      return foundImage ? foundImage.dataUrl : imageIdOrUrl;
    } catch (error) {
      console.error('Error retrieving image:', error);
      return imageIdOrUrl;
    }
  };

  // Load saved category image IDs on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('poppas-category-images');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDisplayImages(parsed);
        setCategoryImageIds(parsed);
        
        console.log('📸 Loaded custom category images:', Object.keys(parsed));
      } else {
        // Initialize with default image URLs
        const defaultDisplay: { [key: string]: string } = {};
        categories.forEach(cat => {
          defaultDisplay[cat.slug] = cat.image;
        });
        setCategoryImageIds(defaultDisplay);
        setDisplayImages(defaultDisplay);
      }
    } catch (error) {
      console.error('Error loading category images:', error);
      // Reset to defaults if loading fails
      const defaultDisplay: { [key: string]: string } = {};
      categories.forEach(cat => {
        defaultDisplay[cat.slug] = cat.image;
      });
      setCategoryImageIds(defaultDisplay);
      setDisplayImages(defaultDisplay);
    }
  }, []);

  const handleSave = () => {
    try {
      // Save category images with compression and error handling
      const compressedData = JSON.stringify(categoryImageIds);
      
      // Check if data is too large
      if (compressedData.length > 5000000) { // 5MB limit
        throw new Error('Category images are too large. Please use smaller images or external URLs.');
      }
      
      // Clear any existing category image data first
      localStorage.removeItem('poppas-category-images');
      localStorage.removeItem('poppas-category-image-ids');
      
      // Save the new data
      localStorage.setItem('poppas-category-images', JSON.stringify(displayImages));
      
      // Verify the save worked
      const verification = localStorage.getItem('poppas-category-images');
      if (!verification) {
        throw new Error('Failed to save category images to storage');
      }
      
      onSave(displayImages);
      alert('Category images saved successfully! Refresh the page to see changes.');
      console.log('💾 Saved category images successfully');
    } catch (error) {
      console.error('Error saving category images:', error);
      
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        alert('Storage full! Please use smaller images or external image URLs instead of uploading large files.');
      } else {
        alert(`Failed to save category images: ${error.message}`);
      }
    }
  };

  const updateCategoryImage = (categorySlug: string, imageUrl: string) => {
    const newImageIds = {
      ...categoryImageIds,
      [categorySlug]: imageUrl
    };
    const newDisplayImages = {
      ...displayImages,
      [categorySlug]: getImageUrl(imageUrl)
    };
    
    setCategoryImageIds(newImageIds);
    setDisplayImages(newDisplayImages);
    
    // Auto-save immediately with error handling
    try {
      localStorage.setItem('poppas-category-images', JSON.stringify(newDisplayImages));
      console.log(`💾 Auto-saved category image for ${categorySlug}`);
    } catch (error) {
      console.warn(`⚠️ Auto-save failed for ${categorySlug}:`, error);
      // Don't show error to user for auto-save, they can manually save
    }
  };

  const updateCategoryImageOld = (categorySlug: string, imageUrl: string) => {
    setCategoryImageIds(prev => ({
      ...prev,
      [categorySlug]: imageUrl
    }));
    setDisplayImages(prev => ({
      ...prev,
      [categorySlug]: getImageUrl(imageUrl)
    }));
  };

  const handleImageUpload = (images: { id: string; url: string }[]) => {
    if (images.length > 0 && selectedCategory) {
      // Store the image ID for efficient storage
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Category Image Editor</h3>
        <button
          onClick={handleSave}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save All Changes</span>
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">📸 How to Update Category Images</h4>
        <div className="text-sm text-amber-700 space-y-1">
          <p><strong>1.</strong> Click "Upload New Image" for any category</p>
          <p><strong>2.</strong> Upload your image (it will be automatically compressed)</p>
          <p><strong>3.</strong> Click "Save All Changes" when done</p>
          <p><strong>4.</strong> Refresh the page to see your new category images!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">{category.name}</h4>
            
            {/* Current Image Preview */}
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

            {/* Image URL Input */}
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

            {/* Action Buttons */}
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

            {/* Category Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                <strong>Category:</strong> {category.slug}<br/>
                <strong>Products:</strong> {category.productCount}<br/>
                <strong>Description:</strong> {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Image Upload Modal */}
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

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Category Images</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use high-quality images that represent the category well</li>
          <li>• Images will be automatically resized to fit the category cards</li>
          <li>• You can paste image URLs directly or upload new images</li>
          <li>• Changes take effect immediately after saving</li>
          <li>• Use "Reset to Default" to restore original images</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryImageEditor;