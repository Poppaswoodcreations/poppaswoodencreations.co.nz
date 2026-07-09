import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hfirnolwhesjkxshidxo.supabase.co'
const _k = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmaXJub2x3aGVzamt4c2hpZHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5OTgxODUsImV4cCI6MjA3MzU3NDE4NX0',
  'lEXxv7eEgUyuaVADraYq-OEQF7GRf-4WjC7hD_bVb2c'
]
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || _k.join('.')

// Public client for reading data (uses anon key). This is the only
// Supabase client that should ever exist in the browser bundle — the
// service role key must never be read or embedded here. Admin writes
// go through the /api/admin-products serverless function instead,
// which holds the service key server-side only and is never exposed
// to visitors.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
})

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
