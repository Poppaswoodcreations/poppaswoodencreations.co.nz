import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

interface UseProductsOptions {
  limit?: number; // Optional limit for initial load
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  isSupabaseConnected: boolean;
  isAdminConnected: boolean;
  loadProducts: () => Promise<void>;
  loadAllProducts: () => Promise<void>;
  saveProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

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
  lengthMm: row.length_mm ?? null,
  widthMm: row.width_mm ?? null,
  heightMm: row.height_mm ?? null,
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString(),
});

// Lightweight read path — plain fetch against the Supabase REST API.
// No supabase-js import, so this never adds to your main bundle.
async function fetchProductsRest(limit?: number): Promise<any[]> {
  let url = `${supabaseUrl}/rest/v1/products?select=*&order=created_at.desc`;
  if (limit) url += `&limit=${limit}`;

  const res = await fetch(url, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load products (${res.status})`);
  }

  return res.json();
}

// Heavy write path — supabase-js is only fetched here, on demand,
// the moment an admin actually saves/updates/deletes something.
// This keeps it out of the bundle every normal visitor downloads.
async function getWriteClient() {
  const { createClient } = await import('@supabase/supabase-js');
  // Prefer service role (bypasses RLS) if available, otherwise fall back to anon key.
  const key = supabaseServiceKey || supabaseAnonKey;
  return createClient(supabaseUrl, key);
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { limit } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const isAdminConnected = !!supabaseServiceKey;

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchProductsRest(limit);

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
  }, [limit]);

  // Always loads all products regardless of limit (used by admin, category pages)
  const loadAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchProductsRest();

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
    const client = await getWriteClient();
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
      length_mm: product.lengthMm ?? null,
      width_mm: product.widthMm ?? null,
      height_mm: product.heightMm ?? null,
    });

    if (error) throw error;
    await loadAllProducts();
  }, [loadAllProducts]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const client = await getWriteClient();

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
    if (updates.lengthMm !== undefined) dbUpdates.length_mm = updates.lengthMm;
    if (updates.widthMm !== undefined) dbUpdates.width_mm = updates.widthMm;
    if (updates.heightMm !== undefined) dbUpdates.height_mm = updates.heightMm;

    const { error } = await client.from('products').update(dbUpdates).eq('id', id);
    if (error) throw error;
    await loadAllProducts();
  }, [loadAllProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    const client = await getWriteClient();
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) throw error;
    await loadAllProducts();
  }, [loadAllProducts]);

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
    loadAllProducts,
    saveProduct,
    updateProduct,
    deleteProduct,
  };
}
