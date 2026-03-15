import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hfirnolwhesjkxshidxo.supabase.co'
const _k = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmaXJub2x3aGVzamt4c2hpZHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5OTgxODUsImV4cCI6MjA3MzU3NDE4NX0',
  'lEXxv7eEgUyuaVADraYq-OEQF7GRf-4WjC7hD_bVb2c'
]
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || _k.join('.')
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
export const isAdminAvailable = !!supabaseServiceKey;
