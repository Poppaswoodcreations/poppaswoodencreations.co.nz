import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

// Admin client using service role key (bypasses RLS)
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  isSupabaseConnected: boolean;
  isAdminConnected: boolean;
  loadProducts: () => Promise<void>;
  saveProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const isAdminConnected = !!supabaseAdmin;

  const mapRow = (row: any): Product => ({
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: parseFloat(row.price) || 0,
    category: row.category || '',
    images: row.images || [],
    inStock: row.in_stock ?? true,
    featured: row.featured ?? false,
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    stockQuantity: row.stock_quantity || 0,
    weight: row.weight || 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      const mapped: Product[] = (data || []).map(mapRow);
      setProducts(mapped);
      setIsSupabaseConnected(true);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products');
      setIsSupabaseConnected(false);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const client = supabaseAdmin || supabase;
    const id = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const { error } = await client.from('products').insert({
      id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      in_stock: product.inStock,
      featured: product.featured,
      seo_title: product.seoTitle || '',
      seo_description: product.seoDescription || '',
      stock_quantity: product.stockQuantity || 0,
      weight: product.weight || 0,
    });

    if (error) throw error;
    await loadProducts();
  }, [loadProducts]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const client = supabaseAdmin || supabase;

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
    if (updates.seoTitle !== undefined) dbUpdates.seo_title = updates.seoTitle;
    if (updates.seoDescription !== undefined) dbUpdates.seo_description = updates.seoDescription;
    if (updates.stockQuantity !== undefined) dbUpdates.stock_quantity = updates.stockQuantity;
    if (updates.weight !== undefined) dbUpdates.weight = updates.weight;

    const { error } = await client.from('products').update(dbUpdates).eq('id', id);
    if (error) throw error;
    await loadProducts();
  }, [loadProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    const client = supabaseAdmin || supabase;
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) throw error;
    await loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    isSupabaseConnected,
    isAdminConnected,
    loadProducts,
    saveProduct,
    updateProduct,
    deleteProduct,
  };
}
