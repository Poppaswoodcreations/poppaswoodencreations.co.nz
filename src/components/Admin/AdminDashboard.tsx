import React, { useState, useEffect } from 'react';
import { X, Package, Settings, Upload, Download, Database, Truck, CreditCard as Edit3, Globe, Image, FileText, BarChart3, Plus, CreditCard as Edit, Trash2, Save, Eye } from 'lucide-react';
import { Product } from '../../types';
import { saveProductsToStorage } from '../../utils/productStorage';
import ProductForm from './ProductForm';
import CSVImporter from './CSVImporter';
import BackupManager from './BackupManager';
import ImageManager from './ImageManager';
import CategoryImageEditor from './CategoryImageEditor';
import CategoryManager from './CategoryManager';
import SupabaseSync from './SupabaseSync';
import EmailManager from './EmailManager';
import OrderManager from './OrderManager';
import FooterEditor from './FooterEditor';
import { useProducts } from '../../hooks/useProducts';

interface AdminDashboardProps {
  products: Product[];
  onProductsUpdate: (products: Product[]) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onProductsUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [heroData, setHeroData] = useState({
    title: "Premium Wooden Toys Made with Love",
    subtitle: "Discover our collection of beautiful, safe, and sustainable wooden toys handcrafted in New Zealand. Each piece is made from premium timber including Kauri, Rimu, and Macrocarpa, designed to inspire creativity and last for generations.",
    ctaText: "Shop Baby Toys",
    backgroundImage: "https://i.ibb.co/FkkjBShk/image.jpg"
  });
  
  // Check if Supabase is connected
  const { isSupabaseConnected, isAdminConnected, saveProduct, updateProduct, deleteProduct } = useProducts();

  const tabs = [
    { id: 'products', label: '📦 Product Manager', icon: Package },
    { id: 'orders', label: '📋 Orders', icon: BarChart3 },
    { id: 'hero-editor', label: '🎨 Edit Hero', icon: Edit3 },
    { id: 'footer-editor', label: '📄 Edit Footer', icon: Settings },
    { id: 'add-category', label: '➕ Add Category', icon: Plus },
    { id: 'database', label: '🗄️ Database Sync', icon: Database },
    { id: 'email', label: '📧 Email Manager', icon: Settings },
    { id: 'inventory', label: '📊 Inventory Manager', icon: BarChart3 },
    { id: 'import', label: '📥 CSV Import', icon: Upload },
    { id: 'backup', label: '💾 Backup & Database', icon: Database },
    { id: 'images', label: '🖼️ Upload Images', icon: Upload },
    { id: 'category-images', label: '🖼️ Category Images', icon: Image }
  ];

  // Load saved hero data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('poppas-hero-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHeroData({ ...heroData, ...parsed });
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
    }
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        if (isAdminConnected) {
          await deleteProduct(productId);
          console.log('✅ Product deleted from database');
        } else {
          // Fallback to local delete
          const updatedProducts = products.filter(p => p.id !== productId);
          onProductsUpdate(updatedProducts);
          saveProductsToStorage(updatedProducts);
          console.log('✅ Product deleted locally');
        }
        // Reload page to show changes
        window.location.reload();
      } catch (error) {
        console.error('❌ Delete failed:', error);
        // Fallback to local delete
        const updatedProducts = products.filter(p => p.id !== productId);
        onProductsUpdate(updatedProducts);
        saveProductsToStorage(updatedProducts);
        window.location.reload();
      }
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('💾 ADMIN: Saving product:', productData.name);

    try {
      if (editingProduct) {
        console.log('✏️ ADMIN: Updating existing product:', editingProduct.id);
        if (isAdminConnected) {
          await updateProduct(editingProduct.id, productData);
          console.log('✅ ADMIN: Database update successful');
        } else {
          // Fallback to local update
          const updatedProducts = products.map(p =>
            p.id === editingProduct.id
              ? {
                  ...productData,
                  id: editingProduct.id,
                  createdAt: editingProduct.createdAt,
                  updatedAt: new Date().toISOString()
                }
              : p
          );
          onProductsUpdate(updatedProducts);
          saveProductsToStorage(updatedProducts);
          console.log('✅ ADMIN: Local storage update successful');
        }
      } else {
        console.log('➕ ADMIN: Creating new product');
        if (isAdminConnected) {
          await saveProduct(productData);
          console.log('✅ ADMIN: Database create successful');
        } else {
          // Fallback to local save
          const newProduct: Product = {
            ...productData,
            id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          const updatedProducts = [...products, newProduct];
          onProductsUpdate(updatedProducts);
          saveProductsToStorage(updatedProducts);
          console.log('✅ ADMIN: Local storage create successful');
        }
      }

      console.log('✅ ADMIN: Product save completed successfully');
      setShowProductForm(false);
      setEditingProduct(null);

      // Show success message
      alert(`✅ Product "${productData.name}" saved successfully! The page will reload to show your changes.`);
      
      // Reload page to show the new product
      window.location.reload();

    } catch (error) {
      console.error('❌ ADMIN: Save failed:', error);
      alert(`❌ Save failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again or check the browser console for details.`);
    }
  };

  const handleStockToggle = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      if (isAdminConnected) {
        await updateProduct(productId, { inStock: !product.inStock });
      } else {
        const updatedProducts = products.map(p =>
          p.id === productId ? { ...p, inStock: !p.inStock } : p
        );
        onProductsUpdate(updatedProducts);
        saveProductsToStorage(updatedProducts);
      }
      window.location.reload();
    } catch (error) {
      console.error('❌ Stock toggle failed:', error);
      alert('Failed to update stock status');
    }
  };

  const handleBulkStockUpdate = async (inStock: boolean) => {
    try {
      if (isAdminConnected) {
        // Update each product in the database
        for (const product of products) {
          await updateProduct(product.id, {
            inStock,
            stockQuantity: inStock ? (product.stockQuantity || 5) : 0
          });
        }
      } else {
        const updatedProducts = products.map(product => ({
          ...product,
          inStock,
          stockQuantity: inStock ? (product.stockQuantity || 5) : 0
        }));
        onProductsUpdate(updatedProducts);
        saveProductsToStorage(updatedProducts);
      }
      alert(`✅ All products marked as ${inStock ? 'in stock' : 'out of stock'}!`);
      window.location.reload();
    } catch (error) {
      console.error('❌ Bulk update failed:', error);
      alert('Failed to update stock status');
    }
  };

  const handleUpdateStockQuantity = async (productId: string, quantity: number) => {
    try {
      if (isAdminConnected) {
        await updateProduct(productId, {
          stockQuantity: quantity,
          inStock: quantity > 0
        });
      } else {
        const updatedProducts = products.map(product =>
          product.id === productId
            ? {
                ...product,
                stockQuantity: quantity,
                inStock: quantity > 0
              }
            : product
        );
        onProductsUpdate(updatedProducts);
        saveProductsToStorage(updatedProducts);
      }
      window.location.reload();
    } catch (error) {
      console.error('❌ Stock quantity update failed:', error);
      alert('Failed to update stock quantity');
    }
  };

  const handleSaveHero = () => {
    try {
      localStorage.setItem('poppas-hero-settings', JSON.stringify(heroData));
      console.log('💾 Hero settings saved:', heroData);
      alert('Hero section updated successfully! Refresh the page to see changes.');
    } catch (error) {
      console.error('❌ Failed to save hero settings:', error);
      alert('Failed to save hero settings. Please try again.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-3">🎉 Admin Access Granted!</h3>
              <div className="text-green-700 space-y-2">
                <p><strong>✅ Password:</strong> Adrianbar1? accepted</p>
                <p><strong>✅ Products:</strong> {products.length} loaded</p>
                <p><strong>✅ Database:</strong> {isAdminConnected ? 'Admin connected - permanent saves!' : 'Local storage mode'}</p>
                <p><strong>✅ Orders:</strong> Email notifications to adrianbarber8@gmail.com</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Product Management</h3>
                <p className="text-sm text-gray-600">📦 {products.length} products • Click Edit to modify any product</p>
              </div>
              <button
                onClick={handleAddProduct}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 font-medium"
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={product.images?.[0] || '/FB_IMG_1640827671355.jpg'}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/FB_IMG_1640827671355.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {product.category.replace(/-/g, ' ')}
                      </p>
                      <p className="text-lg font-bold text-amber-600">
                        ${product.price.toFixed(2)} NZD
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.featured && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                      <Edit size={14} />
                      <span>Edit Product</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'hero-editor':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">🎨 Hero Section Editor</h3>
              <button
                onClick={handleSaveHero}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={heroData.ctaText}
                    onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
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
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Hero Section Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep the title short and impactful</li>
                <li>• Use the subtitle to explain your value proposition</li>
                <li>• Upload hero images through the Image Manager</li>
                <li>• Changes take effect immediately after saving</li>
              </ul>
            </div>
          </div>
        );

      case 'footer-editor':
        return (
          <FooterEditor
            onSave={(footerData) => {
              console.log('💾 Saving footer data:', footerData);
              alert('Footer settings saved successfully! Refresh the page to see changes.');
            }}
          />
        );

      case 'add-category':
        return (
          <CategoryManager
            onSave={(categories) => {
              console.log('💾 Saving categories:', categories);
              alert('Categories saved successfully! Refresh the page to see changes.');
            }}
          />
        );

      case 'category-images':
        return (
          <CategoryImageEditor
            onSave={(categoryImages) => {
              console.log('💾 Saving category images:', categoryImages);
              alert('Category images saved successfully! Refresh the page to see changes.');
            }}
          />
        );

      case 'orders':
        return <OrderManager />;

      case 'database':
        return (
          <SupabaseSync
            products={products}
            onProductsUpdate={onProductsUpdate}
          />
        );

      case 'email':
        return <EmailManager />;

      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">📊 Inventory Manager</h3>
                <p className="text-sm text-gray-600">
                  📦 {products.filter(p => p.inStock).length} in stock, {products.filter(p => !p.inStock).length} out of stock
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleBulkStockUpdate(true)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  All In Stock
                </button>
                <button
                  onClick={() => handleBulkStockUpdate(false)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  All Out of Stock
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.images?.[0] || '/FB_IMG_1640827671355.jpg'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/FB_IMG_1640827671355.jpg';
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category.replace(/-/g, ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price.toFixed(2)} NZD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="999"
                          value={product.stockQuantity || 0}
                          onChange={(e) => handleUpdateStockQuantity(product.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStockToggle(product.id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.inStock
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'import':
        return (
          <CSVImporter
            onImport={(importedProducts) => {
              // Add imported products to existing ones
              const combinedProducts = [...products, ...importedProducts];
              onProductsUpdate(combinedProducts);
              saveProductsToStorage(combinedProducts);
              alert(`✅ Added ${importedProducts.length} products from CSV!`);
            }}
            onClearAll={() => {
              onProductsUpdate([]);
              saveProductsToStorage([]);
              alert('⚠️ All products cleared!');
            }}
          />
        );

      case 'backup':
        return (
          <BackupManager
            products={products}
            onProductsUpdate={onProductsUpdate}
          />
        );

      case 'images':
        return <ImageManager />;

      default:
        return <div>Select a tab to get started</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">🔐 Admin Dashboard</h2>
            {isAdminConnected && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Supabase Connected!</span>
              </div>
            )}
            {!isAdminConnected && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>⚠️ Local Storage Mode</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;