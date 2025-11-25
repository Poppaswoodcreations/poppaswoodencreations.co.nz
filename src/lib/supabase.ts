import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// Public client for reading data (uses anon key)
export const supabase = (
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey.length > 20
) ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
}) : null

// Admin client for write operations (uses service role key)
export const supabaseAdmin = (
  supabaseUrl && 
  supabaseServiceKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseUrl.includes('.supabase.co') &&
  supabaseServiceKey.length > 20
) ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null

// Log connection status for debugging
if (supabaseUrl && supabaseAnonKey && supabaseServiceKey) {
  console.log('🔗 Supabase config found, checking validity...')
  console.log('🔗 URL:', supabaseUrl)
  console.log('🔗 Anon key length:', supabaseAnonKey.length)
  console.log('🔗 Service key length:', supabaseServiceKey.length)
  console.log('🔗 URL valid format:', supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co'))
  console.log('🔗 Keys valid length:', supabaseAnonKey.length > 20 && supabaseServiceKey.length > 20)
  if (supabase && supabaseAdmin) {
    console.log('✅ Both Supabase clients created successfully')
    console.log('📖 Public client: Read operations')
    console.log('🔐 Admin client: Write operations with service role')
  } else {
    console.log('⚠️ Supabase config invalid, using local storage mode')
  }
} else {
  console.log('📦 No Supabase config, using local storage mode')
  console.log('🔍 Missing variables:')
  console.log('  - VITE_SUPABASE_URL:', !!supabaseUrl)
  console.log('  - VITE_SUPABASE_ANON_KEY:', !!supabaseAnonKey)
  console.log('  - VITE_SUPABASE_SERVICE_KEY:', !!supabaseServiceKey)
}

// Upload image to Supabase Storage using admin client
export const uploadImageToSupabase = async (file: File, folder: string = 'products'): Promise<string> => {
  // If Supabase admin is not configured, use local data URL instead
  if (!supabaseAdmin) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(filePath, file)
    if (error) {
      throw error
    }
    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(filePath)
    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Upload multiple images using admin client
export const uploadMultipleImages = async (files: File[], folder: string = 'products'): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImageToSupabase(file, folder))
  return Promise.all(uploadPromises)
}

// Delete image from Supabase Storage using admin client
export const deleteImageFromSupabase = async (imageUrl: string): Promise<void> => {
  if (!supabaseAdmin) return;
  
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/storage/v1/object/public/product-images/')
    if (urlParts.length < 2) return
    
    const filePath = urlParts[1]
    
    const { error } = await supabaseAdmin.storage
      .from('product-images')
      .remove([filePath])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          images: string[]
          in_stock: boolean
          featured: boolean
          weight: number | null
          stock_quantity: number | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category: string
          images: string[]
          in_stock?: boolean
          featured?: boolean
          weight?: number | null
          stock_quantity?: number | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          images?: string[]
          in_stock?: boolean
          featured?: boolean
          weight?: number | null
          stock_quantity?: number | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          image: string
          product_count: number
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          image: string
          product_count?: number
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          image?: string
          product_count?: number
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          updated_at?: string
        }
      }
    }
  }
}