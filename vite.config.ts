import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Inline CSS to reduce render blocking
    cssCodeSplit: false,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor code
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Supabase in separate chunk
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      }
    }
  },
  // Enable compression
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
})
