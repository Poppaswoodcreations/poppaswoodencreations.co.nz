import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
      },
      mangle: true,
      format: {
        comments: false, // Remove all comments
      },
    },
    target: 'es2020',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Generate source maps for production debugging (optional - disable for smaller builds)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
  // Server settings for dev (optional, but helpful)
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
});
