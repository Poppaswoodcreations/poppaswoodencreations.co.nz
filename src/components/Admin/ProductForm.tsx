import React, { useState } from 'react';
import { X, Save, Upload, Plus, Copy, Trash2, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types';
import { categories } from '../../data/products';
import { cleanSEODescription, cleanSEOTitle, cleanSEOKeywords, stripHTML } from '../../utils/textCleaner';
import ImageManager from './ImageManager';
import ImageUpload from '../ImageUpload';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

// Compress image to reduce file size
const compressImage = (file: File, maxWidth: number = 600, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      console.log(`🗜️ Compressed image: ${(file.size/1024).toFixed(1)}KB → ${(compressedDataUrl.length/1024).toFixed(1)}KB`);
      resolve(compressedDataUrl);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const [uploadedImages, setUploadedImages] = useState<{id: string, file: File, dataUrl: string}[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stockQuantity: product?.stockQuantity || 5,
    weight: product?.weight || 0.5,
    category: product?.category || categories[0].slug,
    images: (() => {
      if (product?.images) {
        if (Array.isArray(product.images)) {
          return product.images.length > 0 ? product.images : [''];
        } else if (typeof product.images === 'string' && product.images.trim()) {
          return [product.images];
        }
      }
      return [''];
    })(),
    inStock: product?.inStock ?? true,
    featured: product?.featured || false,
    seoTitle: product?.seoTitle || '',
    seoDescription: product?.seoDescription || '',
    seoKeywords: product?.seoKeywords || ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      // Compress image before creating data URL
      compressImage(file, 600, 0.7).then(compressedDataUrl => {
        const newImage = {
          id: `upload-${Date.now()}-${Math.random()}`,
          file,
          dataUrl: compressedDataUrl
        };
        setUploadedImages(prev => [...prev, newImage]);
      }).catch(error => {
        console.error('Error compressing image:', error);
        // Fallback to original file
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          const newImage = {
            id: `upload-${Date.now()}-${Math.random()}`,
            file,
            dataUrl
          };
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
    });
    
    // Reset the input
    e.target.value = '';
  };

  const addUploadedImageToProduct = (dataUrl: string) => {
    const currentImages = formData.images.filter(img => img.trim() !== '');
    setFormData({
      ...formData,
      images: [...currentImages, dataUrl]
    });
    
    // Also save to image storage for future use
    try {
      const existingImages = JSON.parse(localStorage.getItem('poppa-images') || '[]');
      const newStoredImage = {
        id: `product-upload-${Date.now()}`,
        dataUrl: dataUrl,
        name: `Product Image - ${formData.name || 'Unnamed'}`,
        category: formData.category || 'uploaded',
        size: Math.round(dataUrl.length * 0.75), // Approximate size
        uploadDate: new Date().toISOString(),
        usedInProducts: []
      };
      
      const updatedImages = [...existingImages, newStoredImage];
      localStorage.setItem('poppa-images', JSON.stringify(updatedImages));
      console.log(`💾 ProductForm: Auto-saved uploaded image to storage`);
    } catch (error) {
      console.error('Error auto-saving product image:', error);
    }
  };

  const removeUploadedImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };


  const handleSubmit = (e: React.FormEvent) => {
    console.log('🚀 FORM SUBMIT: handleSubmit called!');
    e.preventDefault();
    e.stopPropagation();

    // Validate
    if (!formData.name.trim()) {
      alert('❌ Product name is required!');
      return;
    }
    if (formData.price <= 0) {
      alert('❌ Price must be greater than $0!');
      return;
    }

    // Clean up images array - remove empty strings
    const cleanedImages = formData.images.filter(img => img && img.trim() !== '');
    if (cleanedImages.length === 0) {
      cleanedImages.push('/FB_IMG_1640827671355.jpg');
    }

    const productToSave = {
      ...formData,
      images: cleanedImages,
      price: Number(formData.price),
      weight: Number(formData.weight),
      stockQuantity: Number(formData.stockQuantity)
    };

    console.log('💾 Saving product:', productToSave.name);
    
    // Call save function
    try {
      onSave(productToSave);
      console.log('✅ Product save completed');
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('❌ Save failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const copyDataUrl = (dataUrl: string) => {
    try {
      navigator.clipboard.writeText(dataUrl);
      alert('Data URL copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = dataUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Data URL copied to clipboard!');
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔘 Save button clicked');
    
    // Trigger form submission
    const form = e.currentTarget.closest('form');
    if (form) {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
    }
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages.length > 0 ? newImages : ['']
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (NZD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  required
                  value={formData.stockQuantity || ''}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value) || 0;
                    setFormData({ 
                      ...formData, 
                      stockQuantity: qty,
                      inStock: qty > 0
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of items in stock (0 = out of stock)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0.5 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for shipping calculations
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images *
              </label>
              
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm">
                  <strong>💡 Tip:</strong> For best results, use external image URLs (like from your website or cloud storage) 
                  instead of uploading large files. This prevents storage issues and loads faster.
                </p>
              </div>
              
              {/* Image Upload Section */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Upload Product Images</h4>
                <ImageUpload
                  onImagesUploaded={(imageUrls) => {
                    const currentImages = formData.images.filter(img => img.trim() !== '');
                    setFormData({
                      ...formData,
                      images: [...currentImages, ...imageUrls]
                    });
                  }}
                  maxImages={5}
                  productName={formData.name || 'product'}
                />
              </div>

              {/* Current Product Images */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-2">
                  Current product images (data URLs, file paths, or external URLs):
                </p>
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2 p-2 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    placeholder="Image URL, data URL, or file path"
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xs"
                  />
                  {image && (
                    <div className="w-20 h-16 border border-gray-300 rounded overflow-hidden bg-gray-50 flex-shrink-0">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ display: 'block', visibility: 'visible' }}
                        onClick={() => {
                          // Open image in new tab for full preview
                          const newWindow = window.open();
                          if (newWindow) {
                            newWindow.document.write(`
                              <html>
                                <head><title>Image Preview</title></head>
                                <body style="margin:0; background:#000; display:flex; align-items:center; justify-content:center; min-height:100vh;">
                                  <img src="${image}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                                </body>
                              </html>
                            `);
                          }
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/FB_IMG_1640827671355.jpg';
                        }}
                        onLoad={() => console.log('✅ Preview loaded:', image.substring(0, 50))}
                      />
                    </div>
                  )}
                  {image && (
                    <button
                      type="button"
                      onClick={() => copyDataUrl(image)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
                      title="Copy image URL"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setShowImageBrowser(true);
                    }}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    title="Replace with image from storage"
                  >
                    <ImageIcon size={12} />
                    <span>Replace</span>
                  </button>
                  {!image && (
                    <div className="w-20 h-16 border border-gray-300 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={20} className="text-gray-400" />
                    </div>
                  )}
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors text-sm"
              >
                <Plus size={16} />
                <span>Add Another Image</span>
              </button>
              </div>
            </div>

            {/* Image Storage Browser Modal */}
            {showImageBrowser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Select Image from Storage</h3>
                      <button
                        onClick={() => {
                          setShowImageBrowser(false);
                          setSelectedImageIndex(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="max-h-[60vh] overflow-y-auto">
                      <ImageManager 
                        onImageSelect={(image) => {
                          if (selectedImageIndex !== null) {
                            // Replace specific image
                            updateImage(selectedImageIndex, image.dataUrl);
                          } else {
                            // Add new image
                            addUploadedImageToProduct(image.dataUrl);
                          }
                          setShowImageBrowser(false);
                          setSelectedImageIndex(null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Preview Section */}
            {formData.images.some(img => img.trim() !== '') && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Image Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {formData.images
                    .filter(img => img.trim() !== '')
                    .map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ display: 'block', visibility: 'visible' }}
                            onClick={() => {
                              // Open image in new tab for full preview
                              const newWindow = window.open();
                              if (newWindow) {
                                newWindow.document.write(`
                                  <html>
                                    <head><title>Product Image ${index + 1}</title></head>
                                    <body style="margin:0; background:#000; display:flex; align-items:center; justify-content:center; min-height:100vh;">
                                      <img src="${image}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                                    </body>
                                  </html>
                                `);
                              }
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/FB_IMG_1640827671355.jpg';
                            }}
                            onLoad={() => console.log('✅ Preview loaded for image', index + 1)}
                          />
                        </div>
                        <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                        <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded text-center">
                          {image.startsWith('data:') ? 'Uploaded' : 
                           image.startsWith('http') ? 'External' : 'Local'}
                        </div>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click any image to view full size. The first image will be the main product image.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                  In Stock
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Product
                </label>
              </div>
            </div>

            {/* SEO Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <div className="text-xs text-gray-500 mb-1">
                    {formData.seoTitle.length}/60 characters (recommended)
                  </div>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => {
                      const cleaned = cleanSEOTitle(e.target.value, 100); // Allow more during editing
                      setFormData({ ...formData, seoTitle: cleaned });
                    }}
                    placeholder="Leave empty to auto-generate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    maxLength={100}
                  />
                  {formData.seoTitle.length > 60 && (
                    <div className="text-xs text-amber-600 mt-1">
                      Title is longer than recommended 60 characters
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <div className="text-xs text-gray-500 mb-1">
                    {formData.seoDescription.length}/160 characters (recommended)
                  </div>
                  <textarea
                    rows={3}
                    value={formData.seoDescription}
                    onChange={(e) => {
                      const cleaned = cleanSEODescription(e.target.value, 300); // Allow more during editing
                      setFormData({ ...formData, seoDescription: cleaned });
                    }}
                    placeholder="Leave empty to auto-generate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    maxLength={300}
                  />
                  {formData.seoDescription.length > 160 && (
                    <div className="text-xs text-amber-600 mt-1">
                      Description is longer than recommended 160 characters
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={(e) => {
                      const cleaned = cleanSEOKeywords(e.target.value);
                      setFormData({ ...formData, seoKeywords: cleaned });
                    }}
                    placeholder="Comma-separated keywords"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Separate keywords with commas. Maximum 10 keywords recommended.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSaveClick}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{product ? 'Update Product' : 'Create Product'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
