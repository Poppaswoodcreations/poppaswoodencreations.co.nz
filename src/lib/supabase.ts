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
    autoRefreshToken: false,
    persistSession: false
  },
  realtime: {
    params: {
      eventsPerSecond: 0
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'poppaswoodencreations'
    }
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
  },
  realtime: {
    params: {
      eventsPerSecond: 0
    }
  }
}) : null

if (!supabase || !supabaseAdmin) {
  console.warn('Supabase not configured, using local storage mode')
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
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          content: string
          featured_image: string
          image_alt: string
          category: string
          author: string
          published_at: string
          read_time: string
          meta_description: string
          tags: string[]
          faqs: Array<{
            question: string
            answer: string
          }> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt: string
          content: string
          featured_image: string
          image_alt: string
          category: string
          author: string
          published_at: string
          read_time: string
          meta_description: string
          tags?: string[]
          faqs?: Array<{
            question: string
            answer: string
          }> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string
          content?: string
          featured_image?: string
          image_alt?: string
          category?: string
          author?: string
          published_at?: string
          read_time?: string
          meta_description?: string
          tags?: string[]
          faqs?: Array<{
            question: string
            answer: string
          }> | null
          updated_at?: string
        }
      }
    }
  }
}
