/**
 * Product storage utilities for managing products in localStorage
 */

import { Product } from '../types';
import { products as deploymentProducts } from '../data/products';

const STORAGE_KEY = 'poppas-products';

/**
 * Save products to localStorage with error handling
 */
export const saveProductsToStorage = (products: Product[]): void => {
  try {
    console.log('💾 Saving', products.length, 'products to storage');
    
    // Clear old storage first
    localStorage.removeItem('products');
    localStorage.removeItem('wooden-toy-products');
    
    const dataToSave = JSON.stringify(products);
    
    localStorage.setItem(STORAGE_KEY, dataToSave);
    
    console.log(`✅ Saved ${products.length} products successfully`);
  } catch (error) {
    console.error('❌ Failed to save products:', error);
  }
};

/**
 * Load products from localStorage
 */
export const loadProductsFromStorage = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const products = JSON.parse(stored);
      
      // Check for FB_IMG references and clean them
      if (JSON.stringify(products).includes('FB_IMG_1640827671355.jpg')) {
        console.log('🧹 Found FB_IMG references, cleaning...');
        const cleanedProducts = products.map((product: Product) => ({
          ...product,
          images: Array.isArray(product.images) 
            ? product.images.map(img => 
                img === '/FB_IMG_1640827671355.jpg' ? 'https://i.ibb.co/dw3x0Kmm/image.jpg' : img
              )
            : [product.images || 'https://i.ibb.co/dw3x0Kmm/image.jpg']
        }));
        
        // Save cleaned products back
        saveProductsToStorage(cleanedProducts);
        return cleanedProducts;
      }
      
      // Ensure all loaded products have images as arrays
      const normalizedProducts = products.map((product: Product) => ({
        ...product,
        images: (() => {
          if (Array.isArray(product.images)) {
            return product.images.length > 0 ? product.images : ['https://i.ibb.co/dw3x0Kmm/image.jpg'];
          } else if (typeof product.images === 'string' && product.images.trim()) {
            return [product.images];
          } else {
            return ['https://i.ibb.co/dw3x0Kmm/image.jpg'];
          }
        })()
      }));
      
      console.log(`📦 Loaded ${products.length} products from localStorage`);
      return normalizedProducts;
    }
  } catch (error) {
    console.error('❌ Failed to load products from localStorage:', error);
  }
  
  return [];
};

/**
 * Get deployment products - these are embedded in the code for deployment
 */
const getDeploymentProducts = (): Product[] => {
  console.log('🚀 DEPLOYMENT: Using embedded products with new cars:', deploymentProducts.length);
  console.log('🚗 First 5 products:', deploymentProducts.slice(0, 5).map(p => p.name));
  
  // Ensure all deployment products have proper image arrays
  const normalizedDeploymentProducts = deploymentProducts.map(product => ({
    ...product,
    images: Array.isArray(product.images) ? product.images : [product.images || 'https://i.ibb.co/FkkjBShk/image.jpg']
  }));
  
  return normalizedDeploymentProducts;
};

/**
 * Auto-restore products with fallback chain
 */
export const autoRestoreProducts = async (): Promise<Product[]> => {
  console.log('🔄 Starting product auto-restore...');
  
  // Try localStorage first
  console.log('📦 Checking localStorage for saved products...');
  const storedProducts = loadProductsFromStorage();
  if (storedProducts.length > 0) {
    console.log(`✅ Found ${storedProducts.length} products in localStorage`);
    return storedProducts;
  }
  
  // Fallback to deployment products
  console.log('📦 No localStorage products, using deployment products');
  const deploymentProducts = getDeploymentProducts();
  if (deploymentProducts.length > 0) {
    console.log(`✅ Using ${deploymentProducts.length} deployment products`);
    // Save to localStorage for future use
    saveProductsToStorage(deploymentProducts);
    return deploymentProducts;
  }
  
  console.log('❌ No products found anywhere');
  return [];
};

/**
 * Clear all product storage
 */
export const clearProductStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('products');
    localStorage.removeItem('wooden-toy-products');
    console.log('🧹 Cleared all product storage');
  } catch (error) {
    console.error('❌ Failed to clear product storage:', error);
  }
};

/**
 * Export products for backup
 */
export const exportProductsBackup = (products: Product[]): void => {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '2.0',
      productCount: products.length,
      products: products,
      metadata: {
        source: 'Poppa\'s Wooden Creations Admin Panel',
        format: 'JSON Backup'
      }
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log(`📤 Exported backup of ${products.length} products`);
  } catch (error) {
    console.error('❌ Failed to export products backup:', error);
  }
};

/**
 * Permanent storage class for managing products
 */
export class PermanentProductStorage {
  private static readonly STORAGE_KEY = 'poppas-products';
  
  static save(products: Product[]): boolean {
    try {
      saveProductsToStorage(products);
      return true;
    } catch (error) {
      console.error('PermanentProductStorage save failed:', error);
      return false;
    }
  }
  
  static load(): Product[] {
    return loadProductsFromStorage();
  }
  
  static clear(): boolean {
    try {
      clearProductStorage();
      return true;
    } catch (error) {
      console.error('PermanentProductStorage clear failed:', error);
      return false;
    }
  }
  
  static export(products: Product[]): void {
    exportProductsBackup(products);
  }
}