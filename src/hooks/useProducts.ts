import { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { Product } from '../types';
import { autoRestoreProducts, saveProductsToStorage, loadProductsFromStorage } from '../utils/productStorage';
import { products as staticProducts } from '../data/products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from Supabase or fallback to localStorage
  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    console.log('🔄 useProducts: Loading products from storage...');

    try {
      // If admin is connected, try to load from Supabase first
      if (supabaseAdmin) {
        console.log('🔐 Admin connected, loading from Supabase...');
        try {
          const { data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('❌ Supabase load error:', error);
            throw error;
          }

          if (data && data.length > 0) {
            console.log(`✅ Loaded ${data.length} products from Supabase`);
            // Convert database format to Product format
            const convertedProducts: Product[] = data.map(dbProduct => {
              // Parse images if it's a string
              let parsedImages = dbProduct.images;
              if (typeof dbProduct.images === 'string') {
                try {
                  parsedImages = JSON.parse(dbProduct.images);
                } catch (e) {
                  parsedImages = [dbProduct.images];
                }
              }

              return {
                id: dbProduct.id,
                name: dbProduct.name,
                description: dbProduct.description,
                price: dbProduct.price,
                category: dbProduct.category,
                images: Array.isArray(parsedImages) ? parsedImages : [parsedImages],
                inStock: dbProduct.in_stock,
                featured: dbProduct.featured,
                weight: dbProduct.weight || 0.5,
                stockQuantity: dbProduct.stock_quantity || 5,
                seoTitle: dbProduct.seo_title || '',
                seoDescription: dbProduct.seo_description || '',
                seoKeywords: dbProduct.seo_keywords || '',
                createdAt: dbProduct.created_at,
                updatedAt: dbProduct.updated_at
              };
            });
            setProducts(convertedProducts);
            // Also save to localStorage as backup
            saveProductsToStorage(convertedProducts);
            setLoading(false);
            console.log('✅ useProducts: Product loading from Supabase completed');
            return;
          } else {
            console.log('📦 No products in Supabase, falling back to localStorage...');
          }
        } catch (supabaseError) {
          console.error('❌ Supabase error, falling back to localStorage:', supabaseError);
        }
      }

      // Fallback to localStorage (saved products)
      console.log('📦 Checking localStorage for saved products...');
      const savedProducts = loadProductsFromStorage();

      if (savedProducts.length > 0) {
        console.log(`✅ Found ${savedProducts.length} saved products in localStorage`);
        setProducts(savedProducts);
      } else {
        console.log('📦 No saved products, using static products as fallback...');
        setProducts(staticProducts);
        // Save static products to localStorage for future edits
        saveProductsToStorage(staticProducts);
      }

    } catch (error) {
      console.error('❌ Error loading products:', error);
      // Fallback to static products if everything fails
      setProducts(staticProducts);
      setError('Failed to load products');
    } finally {
      setLoading(false);
      console.log('✅ useProducts: Product loading completed');
    }
  };

  // Save product to Supabase using admin client
  const saveProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('💾 Saving product with admin client:', product.name);
      
      if (supabaseAdmin) {
        console.log('🔐 Admin client available, proceeding with save...');
        
        // Convert Product format to database format
        const dbProduct = {
          id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          category: product.category,
          images: Array.isArray(product.images) ? product.images : [product.images || ''],
          in_stock: product.inStock,
          featured: product.featured,
          weight: Number(product.weight || 0.5),
          stock_quantity: Number(product.stockQuantity || 5),
          seo_title: product.seoTitle || null,
          seo_description: product.seoDescription || null,
          seo_keywords: product.seoKeywords || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('📝 Database insert payload:', dbProduct);
        
        const { data, error } = await supabaseAdmin
          .from('products')
          .insert([dbProduct])
          .select()
          .single();

        if (error) {
          console.error('❌ Database insert error details:', error);
          throw new Error(`Database save failed: ${error.message}`);
        }

        console.log('✅ Product saved to Supabase successfully:', data);
        await loadProducts(); // Reload all products
        return data;
      } else {
        console.error('❌ Admin client not available');
        throw new Error('Supabase admin client not connected');
      }
    } catch (error) {
      console.error('❌ DETAILED SAVE ERROR:', error);
      throw error;
    }
  };

  // Update product in Supabase using admin client
  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      if (supabaseAdmin) {
        console.log('🔐 Using admin client to update product:', productId);
        
        // Convert Product format to database format
        const dbUpdates: any = {};
        
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.price !== undefined) dbUpdates.price = Number(updates.price);
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.images !== undefined) {
          // Ensure images is an array
          dbUpdates.images = Array.isArray(updates.images) ? updates.images : [updates.images || ''];
        }
        if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
        if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
        if (updates.weight !== undefined) dbUpdates.weight = Number(updates.weight);
        if (updates.stockQuantity !== undefined) dbUpdates.stock_quantity = Number(updates.stockQuantity);
        if (updates.seoTitle !== undefined) dbUpdates.seo_title = updates.seoTitle;
        if (updates.seoDescription !== undefined) dbUpdates.seo_description = updates.seoDescription;
        if (updates.seoKeywords !== undefined) dbUpdates.seo_keywords = updates.seoKeywords;
        
        // Always update the timestamp
        dbUpdates.updated_at = new Date().toISOString();
        
        console.log('📝 Database update payload:', dbUpdates);
        
        const { data, error } = await supabaseAdmin
          .from('products')
          .update(dbUpdates)
          .eq('id', productId)
          .select()
          .single();

        if (error) {
          console.error('❌ Database update error details:', error);
          throw new Error(`Database update failed: ${error.message}`);
        }

        console.log('✅ Product updated in Supabase with admin client:', data);
        await loadProducts(); // Reload all products
        return data;
      } else {
        throw new Error('Supabase admin client not connected');
      }
    } catch (error) {
      console.error('❌ Error updating product:', error);
      throw error;
    }
  };

  // Delete product from Supabase using admin client
  const deleteProduct = async (productId: string) => {
    try {
      if (supabaseAdmin) {
        console.log('🔐 Using admin client to delete product:', productId);
        const { error } = await supabaseAdmin
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;

        console.log('✅ Product deleted from Supabase with admin client');
        await loadProducts(); // Reload all products
      } else {
        throw new Error('Supabase admin client not connected');
      }
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      throw error;
    }
  };

  // Bulk import products to Supabase using admin client
  const bulkImportProducts = async (newProducts: Product[]) => {
    try {
      if (supabaseAdmin) {
        console.log('🔐 Using admin client to bulk import products:', newProducts.length);
        const supabaseProducts = newProducts.map(product => ({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          images: product.images,
          in_stock: product.inStock,
          featured: product.featured,
          weight: product.weight,
          stock_quantity: product.stockQuantity || 5,
          seo_title: product.seoTitle,
          seo_description: product.seoDescription,
          seo_keywords: product.seoKeywords
        }));

        const { data, error } = await supabaseAdmin
          .from('products')
          .insert(supabaseProducts)
          .select();

        if (error) throw error;

        console.log(`✅ Bulk imported ${data.length} products to Supabase with admin client`);
        await loadProducts(); // Reload all products
        return data;
      } else {
        throw new Error('Supabase admin client not connected');
      }
    } catch (error) {
      console.error('❌ Error bulk importing products:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Add a function to force reload products
  const forceReload = () => {
    console.log('🔄 useProducts: Force reloading products...');
    loadProducts();
  };
  return {
    products,
    loading,
    error,
    loadProducts,
    forceReload,
    saveProduct,
    updateProduct,
    deleteProduct,
    bulkImportProducts,
    isSupabaseConnected: !!supabase,
    isAdminConnected: !!supabaseAdmin
  };
};