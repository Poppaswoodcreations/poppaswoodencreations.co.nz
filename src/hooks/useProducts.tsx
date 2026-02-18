import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Map Supabase rows to Product type
      const mapped: Product[] = (data || []).map((row: any) => ({
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
      }));

      setProducts(mapped);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, error, loadProducts };
}
