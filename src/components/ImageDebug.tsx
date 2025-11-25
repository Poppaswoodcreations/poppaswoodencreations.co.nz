import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';

const ImageDebug: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [defaultImageStatus, setDefaultImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<{[key: string]: 'loading' | 'success' | 'error'}>({});

  useEffect(() => {
    // Load products from storage
    try {
      const stored = localStorage.getItem('poppas-products');
      if (stored) {
        const parsedProducts = JSON.parse(stored);
        setProducts(parsedProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }

    // Test default image
    testDefaultImage();
  }, []);

  const testDefaultImage = () => {
    setDefaultImageStatus('loading');
    const img = new Image();
    img.onload = () => setDefaultImageStatus('success');
    img.onerror = () => setDefaultImageStatus('error');
    img.src = 'https://i.ibb.co/FkkjBShk/image.jpg';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
    
    // Test each uploaded file
    files.forEach(file => {
      const reader = new FileReader();
      setUploadResults(prev => ({ ...prev, [file.name]: 'loading' }));
      
      reader.onload = () => {
        setUploadResults(prev => ({ ...prev, [file.name]: 'success' }));
      };
      
      reader.onerror = () => {
        setUploadResults(prev => ({ ...prev, [file.name]: 'error' }));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const StatusIcon = ({ status }: { status: 'loading' | 'success' | 'error' }) => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="animate-spin text-blue-500" size={16} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'error':
        return <XCircle className="text-red-500" size={16} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🖼️ Image Debug Tool</h1>
        
        {/* Default Image Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ImageIcon className="mr-2" size={20} />
            Default Image Test
          </h2>
          
          <div className="flex items-center space-x-4 mb-4">
            <StatusIcon status={defaultImageStatus} />
            <span className="text-sm">
              {defaultImageStatus === 'loading' && 'Testing default image...'}
              {defaultImageStatus === 'success' && '✅ Default image loads successfully'}
              {defaultImageStatus === 'error' && '❌ Default image failed to load'}
            </span>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Testing: https://i.ibb.co/FkkjBShk/image.jpg</p>
            <img
              src="https://i.ibb.co/FkkjBShk/image.jpg"
              alt="Default test"
              className="w-32 h-24 object-cover rounded border"
              onLoad={() => setDefaultImageStatus('success')}
              onError={() => setDefaultImageStatus('error')}
            />
          </div>
          
          <button
            onClick={testDefaultImage}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retest Default Image
          </button>
        </div>

        {/* Product Images Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images Test</h2>
          
          <div className="mb-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800 font-medium">Found {products.length} products in storage</p>
              <p className="text-blue-700 text-sm">
                <strong>Sample image URLs:</strong>
              </p>
              {products.slice(0, 3).map((product, index) => (
                <div key={index} className="text-xs text-blue-600 mt-1 font-mono">
                  <strong>{product.name}:</strong> {product.images?.[0]?.substring(0, 80)}...
                </div>
              ))}
              <p className="text-blue-700 text-sm">
                Products with images: {products.filter(p => p.images && p.images.length > 0 && p.images[0] && p.images[0].trim() !== '').length}
              </p>
              <p className="text-blue-700 text-sm">
                Products with data URLs: {products.filter(p => p.images && p.images[0] && p.images[0].startsWith('data:')).length}
              </p>
            </div>
          </div>
          
          {products.length === 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">❌ No products found in localStorage!</p>
              <p className="text-red-600 text-sm mt-2">
                But you have 51 products loaded in the app. This means they're coming from the default data, not localStorage.
              </p>
              <p className="text-red-600 text-sm mt-2">
                This might be why your images aren't showing. Try going to the Admin Dashboard and adding some products.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 5).map((product, index) => {
                const imageUrl = product.images && product.images[0] ? product.images[0] : null;
                
                return (
                  <div key={product.id || index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Category:</strong> {product.category}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Image type:</strong> {imageUrl ? (
                        imageUrl.startsWith('data:') ? 'Data URL (uploaded)' :
                        imageUrl.startsWith('http') ? 'External URL' :
                        imageUrl.startsWith('/') ? 'Local file' : 'Unknown'
                      ) : 'NO IMAGE'}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Images array length:</strong> {product.images ? product.images.length : 0}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>First image URL:</strong> {imageUrl || 'NO IMAGE'}
                    </p>
                    
                    {imageUrl ? (
                      <div className="flex items-start space-x-4">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-24 h-18 object-cover rounded border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.border = '2px solid red';
                            target.alt = 'FAILED TO LOAD';
                          }}
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.border = '2px solid green';
                          }}
                        />
                        <div className="text-xs text-gray-500">
                          <p><strong>URL type:</strong> {
                            imageUrl.startsWith('data:') ? 'Data URL' :
                            imageUrl.startsWith('http') ? 'External URL' :
                            imageUrl.startsWith('/') ? 'Local file' : 'Unknown'
                          }</p>
                          <p><strong>URL length:</strong> {imageUrl.length} characters</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <p className="text-red-800 text-sm">❌ No image URL found for this product</p>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {products.length > 5 && (
                <p className="text-sm text-gray-500">... and {products.length - 5} more products</p>
              )}
            </div>
          )}
        </div>

        {/* Upload Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Own Images</h2>
          
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Testing {uploadedFiles.length} uploaded files:</h3>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <StatusIcon status={uploadResults[file.name] || 'loading'} />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Size: {(file.size / 1024).toFixed(1)}KB | Type: {file.type}
                  </p>
                  {uploadResults[file.name] === 'success' && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="mt-2 w-32 h-24 object-cover rounded border border-green-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Solutions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Solutions
          </h2>
          
          <div className="space-y-3 text-amber-800">
            <p><strong>If default image fails:</strong> The image file might be missing from your public folder</p>
            <p><strong>If product images fail:</strong> Check that image URLs are correct and files exist</p>
            <p><strong>If no products found:</strong> Go to Admin Dashboard and add some products with images</p>
            <p><strong>For new images:</strong> Use the Admin Dashboard → Products → Upload Images feature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDebug;