import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // ENHANCED: Better chunk splitting to reduce unused JavaScript
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
          // ADDED: Split UI libraries to reduce main bundle
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
        },
        // Better file naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Improve build performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        // ADDED: More aggressive compression
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
    // Target modern browsers for smaller bundle
    target: 'es2015',
    // Source maps disabled for smaller build
    sourcemap: false,
    // ADDED: Chunk size warnings
    chunkSizeWarningLimit: 500,
    // ADDED: CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // ADDED: Exclude heavy dependencies from optimization
    exclude: ['@supabase/supabase-js'],
  },
  // ADDED: Server configuration for development
  server: {
    port: 5173,
    strictPort: true,
  },
  // ADDED: Preview configuration
  preview: {
    port: 4173,
    strictPort: true,
  },
});
