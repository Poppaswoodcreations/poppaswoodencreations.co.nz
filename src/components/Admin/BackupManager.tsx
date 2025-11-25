import React, { useState } from 'react';
import { Download, Upload, Database, AlertCircle, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { saveProductsToStorage } from '../../utils/productStorage';

interface BackupManagerProps {
  products: Product[];
  onProductsUpdate: (products: Product[]) => void;
}

const BackupManager: React.FC<BackupManagerProps> = ({ products, onProductsUpdate }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [importing, setImporting] = useState(false);

  const handleDownloadBackup = () => {
    try {
      // Create deployment-ready code with your actual products
      const deploymentCode = `// DEPLOYMENT CODE - Replace the getDeploymentProducts function in src/utils/productStorage.ts

const getDeploymentProducts = (): Product[] => {
  // Your ${products.length} products embedded for deployment
  const deploymentProducts: Product[] = ${JSON.stringify(products, null, 2)};
  
  console.log('🚀 DEPLOYMENT: Using embedded products:', deploymentProducts.length);
  return deploymentProducts;
};`;
      
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        productCount: products.length,
        products: products,
        deploymentCode: deploymentCode,
        instructions: {
          step1: "Copy the deploymentCode from this backup file",
          step2: "Replace the getDeploymentProducts function in src/utils/productStorage.ts with the code above",
          step3: "Deploy your website - everyone will see your products!",
          note: `This embeds your ${products.length} products directly into the website code for deployment`,
          important: "The backup file on your phone only works for YOU. To make products visible to all website visitors, you must embed them in the code and deploy."
        }
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `poppas-deployment-ready-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      setStatus('success');
      setMessage(`✅ Downloaded DEPLOYMENT-READY backup with ${products.length} products! This backup includes the exact code needed to embed your products into the website. IMPORTANT: The backup file on your phone only works for YOU - to make products visible to all visitors, you must deploy the website with the embedded code.`);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to create backup file');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📁 Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);

    setImporting(true);
    setStatus('loading');
    setMessage('Importing products from backup...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawContent = event.target?.result as string;
        console.log('📁 File content length:', rawContent.length);
        console.log('📁 First 200 chars:', rawContent.substring(0, 200));
        
        const backupData = JSON.parse(rawContent);
        console.log('📁 Parsed JSON successfully');
        
        // Handle different backup formats
        let products: Product[] = [];

        if (Array.isArray(backupData)) {
          console.log('📦 Format: Direct array');
          products = backupData;
        } else if (backupData.products && Array.isArray(backupData.products)) {
          console.log('📦 Format: Object with products array');
          products = backupData.products;
        } else if (backupData.data && Array.isArray(backupData.data)) {
          console.log('📦 Format: Object with data array');
          products = backupData.data;
        } else if (backupData.items && Array.isArray(backupData.items)) {
          console.log('📦 Format: Object with items array');
          products = backupData.items;
        } else {
          throw new Error('No valid product array found in backup file');
        }

        console.log(`📦 Found ${products.length} potential products`);

        // Validate and clean products
        const validProducts = products
          .filter(product => {
            const isValid = product && 
              (product.name || product.title) && 
              (product.price !== undefined || product.cost !== undefined);
            if (!isValid) {
              console.warn('📦 Skipping invalid product:', product);
            }
            return isValid;
          })
          .map(product => ({
            ...product,
            name: product.name || product.title || 'Unnamed Product',
            price: product.price || product.cost || 0,
            description: product.description || product.desc || 'No description available',
            category: product.category || 'wooden-other-toys',
            id: product.id || `product-${Date.now()}-${Math.random()}`,
            createdAt: product.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            images: Array.isArray(product.images) ? product.images : ['/FB_IMG_1640827671355.jpg'],
            inStock: product.inStock !== undefined ? product.inStock : true,
            featured: product.featured !== undefined ? product.featured : false,
            weight: product.weight || 0.5
          }));

        console.log(`📦 Successfully processed ${validProducts.length} valid products`);
        
        if (validProducts.length === 0) {
          throw new Error('No valid products found in backup file');
        }
        
        // Save to browser storage immediately
        saveProductsToStorage(validProducts);
        
        // Update the app state
        onProductsUpdate(validProducts);
        
        setStatus('success');
        setMessage(`✅ Successfully imported ${validProducts.length} products and saved to browser storage!`);
        
      } catch (error) {
        console.error('📁 Import error details:', error);
        setStatus('error');
        setMessage(`Failed to import backup file: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the file format.`);
      } finally {
        setImporting(false);
      }
    };
    
    reader.onerror = () => {
      setStatus('error');
      setMessage('Failed to read the file. Please try again.');
      setImporting(false);
    };
    
    reader.readAsText(file);
    
    // Reset the input
    e.target.value = '';
  };

  const handleSaveToBrowserStorage = () => {
    try {
      saveProductsToStorage(products);
      setStatus('success');
      setMessage(`✅ Successfully saved ${products.length} products to browser storage!`);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to save to browser storage - storage may be full');
    }
  };

  const handleLoadFromBrowserStorage = () => {
    try {
      const stored = localStorage.getItem('poppas-products');
      if (stored) {
        const loadedProducts = JSON.parse(stored);
        onProductsUpdate(loadedProducts);
        setStatus('success');
        setMessage(`✅ Successfully loaded ${loadedProducts.length} products from browser storage!`);
      } else {
        setStatus('error');
        setMessage('No products found in browser storage');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to load from browser storage');
    }
  };

  const handleClearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all local storage? This will remove any products stored in your browser.')) {
      try {
        localStorage.removeItem('poppas-products');
        localStorage.removeItem('products');
        // Clear other possible storage keys
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('product') || key.includes('poppa')) {
            localStorage.removeItem(key);
          }
        });
        
        setStatus('success');
        setMessage('Local storage cleared successfully!');
      } catch (error) {
        setStatus('error');
        setMessage('Failed to clear local storage');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {status !== 'idle' && (
        <div className={`p-4 rounded-lg flex items-start space-x-3 ${
          status === 'success' ? 'bg-green-50 border border-green-200' :
          status === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          {status === 'success' && <CheckCircle className="text-green-500 mt-0.5" size={20} />}
          {status === 'error' && <AlertCircle className="text-red-500 mt-0.5" size={20} />}
          {status === 'loading' && <RefreshCw className="text-blue-500 mt-0.5 animate-spin" size={20} />}
          <div className={`text-sm ${
            status === 'success' ? 'text-green-800' :
            status === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            <p className="font-medium">{status === 'loading' ? 'Processing...' : status === 'success' ? 'Success!' : 'Error'}</p>
            <p>{message}</p>
          </div>
        </div>
      )}

      {/* Browser Storage Operations */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="mr-2 text-green-600" size={20} />
          Browser Storage (Local)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button
            onClick={handleSaveToBrowserStorage}
            disabled={status === 'loading'}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
          >
            <Database size={16} />
            <span>Save to Browser Storage</span>
          </button>
          
          <button
            onClick={handleLoadFromBrowserStorage}
            disabled={status === 'loading'}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
          >
            <RefreshCw size={16} />
            <span>Load from Browser Storage</span>
          </button>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-800 text-sm">
            <strong>Browser storage saves your products locally!</strong> Your products are stored in your browser and will persist between sessions.
            Make sure to download backups regularly to avoid data loss.
          </p>
        </div>
      </div>

      {/* Backup Operations */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Download className="mr-2 text-amber-600" size={20} />
          Backup & Restore
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button
            onClick={handleDownloadBackup}
            className="bg-amber-600 text-white px-4 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Download size={16} />
            <span>Download Backup</span>
          </button>
          
          <label className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center space-x-2">
            <Upload size={16} />
            <span>{importing ? 'Importing...' : 'Import Backup'}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
            />
          </label>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-amber-800 text-sm">
            <strong>Import your backup file here!</strong> Your products will be restored immediately and saved in your browser.<br/>
            <strong>Supported formats:</strong> Arrays of products, or objects containing products/data/items arrays.
          </p>
        </div>
      </div>

      {/* Local Storage Management */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Trash2 className="mr-2 text-red-600" size={20} />
          Local Storage Management
        </h3>
        
        <div className="mb-4">
          <button
            onClick={handleClearLocalStorage}
            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Clear Local Storage</span>
          </button>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-800 text-sm">
            <strong>Warning:</strong> This will clear all products stored in your browser. Make sure you've downloaded a backup first!
          </p>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Products in memory: {products.length}</p>
          <p>• Storage: Browser localStorage</p>
          <p>• Last action: {message || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;