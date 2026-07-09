import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// This is the client-side admin password gate (same one used to unlock
// the /admin dashboard). It is NOT a secret — it's checked again
// server-side in /api/admin-products before any write happens there.
const ADMIN_PASSWORD = 'poppas2024';

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

// Lightweight read path — plain fetch against the Supabase REST API,
// using only the anon key. No supabase-js import, so this never adds
// to your main bundle, and nothing here can write to the database.
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

// All writes go through this one serverless endpoint. The service role
// key lives only in the Cloudflare Function's environment — it is never
// sent to, or bundled into, the browser.
async function callAdminProducts(body: Record<string, any>) {
  const res = await fetch('/api/admin-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: ADMIN_PASSWORD, ...body }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { limit } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  // Admin writes are always available now — the gate is the server-side
  // password check in /api/admin-products, not a key held in the browser.
  const isAdminConnected = true;

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
    await callAdminProducts({ action: 'save', product });
    await loadAllProducts();
  }, [loadAllProducts]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    await callAdminProducts({ action: 'update', id, updates });
    await loadAllProducts();
  }, [loadAllProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    await callAdminProducts({ action: 'delete', id });
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
