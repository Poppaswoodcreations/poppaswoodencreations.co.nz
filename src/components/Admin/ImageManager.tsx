import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Eye, Trash2, Edit, Download, Upload, RefreshCw, AlertTriangle, Package } from 'lucide-react';

interface StoredImage {
  id: string;
  dataUrl: string;
  name: string;
  category: string;
  size: number;
  uploadDate: string;
  usedInProducts: string[];
}

interface ImageManagerProps {
  onImageSelect?: (image: StoredImage) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ onImageSelect }) => {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'wooden-trains', label: 'Wooden Trains' },
    { value: 'wooden-baby-toys', label: 'Baby Toys' },
    { value: 'wooden-tractors-boats', label: 'Tractors & Boats' },
    { value: 'wooden-kitchenware', label: 'Kitchenware' },
    { value: 'wooden-planes-helicopters', label: 'Planes & Helicopters' },
    { value: 'wooden-trucks', label: 'Trucks' },
    { value: 'wooden-cars', label: 'Cars' },
    { value: 'wooden-other-toys', label: 'Other Toys' }
  ];

  // Load images from localStorage on mount
  useEffect(() => {
    loadImagesFromStorage();
  }, []);

  const loadImagesFromStorage = () => {
    setLoading(true);
    try {
      // Try multiple storage keys to find images
      const storageKeys = [
        'poppa-images',
        'poppa-image-storage',
        'wooden-toy-images',
        'uploaded-images',
        'image-storage',
        'poppas-images'
      ];

      let foundImages: StoredImage[] = [];

      // Check each storage key
      storageKeys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              foundImages = [...foundImages, ...parsed];
            }
          }
        } catch (error) {
          console.warn(`Error loading from ${key}:`, error);
        }
      });

      // Also check for images embedded in products
      try {
        const productsData = localStorage.getItem('poppas-products');
        if (productsData) {
          const products = JSON.parse(productsData);
          if (Array.isArray(products)) {
            products.forEach((product: any) => {
              if (product.images && Array.isArray(product.images)) {
                product.images.forEach((imageUrl: string, index: number) => {
                  if (imageUrl.startsWith('data:image/')) {
                    foundImages.push({
                      id: `product-${product.id}-${index}`,
                      dataUrl: imageUrl,
                      name: `${product.name} - Image ${index + 1}`,
                      category: product.category || 'wooden-other-toys',
                      size: Math.round(imageUrl.length * 0.75), // Approximate size
                      uploadDate: product.createdAt || new Date().toISOString(),
                      usedInProducts: [product.id]
                    });
                  }
                });
              }
            });
          }
        }
      } catch (error) {
        console.warn('Error extracting images from products:', error);
      }

      // Remove duplicates based on dataUrl
      const uniqueImages = foundImages.filter((image, index, self) => 
        index === self.findIndex(img => img.dataUrl === image.dataUrl)
      );

      console.log(`📸 Found ${uniqueImages.length} images in storage`);
      setImages(uniqueImages);

      // If no images found, create some sample images
      if (uniqueImages.length === 0) {
        createSampleImages();
      }

    } catch (error) {
      console.error('Error loading images:', error);
      createSampleImages();
    } finally {
      setLoading(false);
    }
  };

  const createSampleImages = () => {
    // Create sample images using the default image
    const sampleImages: StoredImage[] = [
      {
        id: 'sample-1',
        dataUrl: '/FB_IMG_1640827671355.jpg',
        name: 'Default Wooden Toy Image',
        category: 'wooden-other-toys',
        size: 50000,
        uploadDate: new Date().toISOString(),
        usedInProducts: []
      }
    ];

    setImages(sampleImages);
    saveImagesToStorage(sampleImages);
  };

  const saveImagesToStorage = (imagesToSave: StoredImage[]) => {
    try {
      localStorage.setItem('poppa-images', JSON.stringify(imagesToSave));
      console.log(`💾 Saved ${imagesToSave.length} images to storage`);
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    console.log(`📸 ImageManager: Processing ${imageFiles.length} new images`);
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newImage: StoredImage = {
          id: `upload-${Date.now()}-${Math.random()}`,
          dataUrl,
          name: file.name,
          category: selectedCategory || 'uploaded',
          size: file.size,
          uploadDate: new Date().toISOString(),
          usedInProducts: []
        };

        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        saveImagesToStorage(updatedImages);
        console.log(`💾 ImageManager: Saved image ${file.name} to storage`);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    e.target.value = '';
  };

  const handleDeleteImage = (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      saveImagesToStorage(updatedImages);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedImages.length} selected images?`)) {
      const updatedImages = images.filter(img => !selectedImages.includes(img.id));
      setImages(updatedImages);
      saveImagesToStorage(updatedImages);
      setSelectedImages([]);
    }
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadBackup = () => {
    try {
      const dataStr = JSON.stringify(images, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      alert(`Downloaded backup of ${images.length} images!`);
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Backup failed: ' + error);
    }
  };

  const restoreFromBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const restoredImages = JSON.parse(event.target?.result as string);
          if (Array.isArray(restoredImages)) {
            setImages(restoredImages);
            saveImagesToStorage(restoredImages);
            alert(`Restored ${restoredImages.length} images!`);
          } else {
            alert('Invalid backup file format.');
          }
        } catch (error) {
          alert('Error reading backup file.');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        <span>Loading images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recovery Section */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <AlertTriangle className="text-red-600" size={20} />
          <h3 className="font-semibold text-red-800">Image Recovery Tools</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadImagesFromStorage}
            className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <RefreshCw size={14} />
            <span>Reload Images</span>
          </button>
          <button
            onClick={downloadBackup}
            className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
          >
            <Download size={14} />
            <span>Download Backup</span>
          </button>
          <label className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors cursor-pointer flex items-center space-x-1">
            <Upload size={14} />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={restoreFromBackup}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-red-700 mt-2">
          Found {images.length} images. If images are missing, try "Reload Images" or restore from backup.
        </p>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}
            >
              <List size={16} />
            </button>
          </div>

          <label className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 transition-colors cursor-pointer flex items-center space-x-2 text-sm">
            <Upload size={14} />
            <span>Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-amber-800">
              {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
              <button
                onClick={() => setSelectedImages([])}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedImages.includes(image.id)
                  ? 'border-amber-500 ring-2 ring-amber-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleImageSelect(image.id)}
            >
              <div className="aspect-square">
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/FB_IMG_1640827671355.jpg';
                  }}
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  {onImageSelect && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageSelect(image);
                      }}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
                    >
                      <Package size={14} />
                      <span>Use This Image</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open image in new tab
                      const newWindow = window.open();
                      if (newWindow) {
                        newWindow.document.write(`
                          <html>
                            <head><title>${image.name}</title></head>
                            <body style="margin:0; background:#000; display:flex; align-items:center; justify-content:center; min-height:100vh;">
                              <img src="${image.dataUrl}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                            </body>
                          </html>
                        `);
                      }
                    }}
                    className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedImages.includes(image.id) && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <p className="text-white text-xs truncate">{image.name}</p>
                <p className="text-gray-300 text-xs">{formatFileSize(image.size)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Used In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredImages.map((image) => (
                <tr key={image.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => handleImageSelect(image.id)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={image.dataUrl}
                        alt={image.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/FB_IMG_1640827671355.jpg';
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{image.name}</div>
                        <div className="text-sm text-gray-500">{new Date(image.uploadDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {categories.find(c => c.value === image.category)?.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFileSize(image.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {image.usedInProducts.length} product{image.usedInProducts.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {onImageSelect && (
                        <button
                          onClick={() => onImageSelect(image)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
                        >
                          <Package size={12} />
                          <span>Use This Image</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const newWindow = window.open();
                          if (newWindow) {
                            newWindow.document.write(`
                              <html>
                                <head><title>${image.name}</title></head>
                                <body style="margin:0; background:#000; display:flex; align-items:center; justify-content:center; min-height:100vh;">
                                  <img src="${image.dataUrl}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                                </body>
                              </html>
                            `);
                          }
                        }}
                        className="text-amber-600 hover:text-amber-900 p-1 rounded transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Package size={48} className="mx-auto mb-4" />
            <p>No images found</p>
            <p className="text-sm">Upload some images or try reloading</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;