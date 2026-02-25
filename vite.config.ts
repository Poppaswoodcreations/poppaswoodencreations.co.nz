import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split CSS per chunk for better caching
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor code
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Supabase in separate chunk
          supabase: ['@supabase/supabase-js']
        },
        // Aggressive asset caching with content hashes
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      }
    },
    // Increase chunk size warning limit slightly
    chunkSizeWarningLimit: 600,
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
})
