import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePrerender } from 'vite-plugin-prerender'
import Renderer from '@prerenderer/renderer-puppeteer'

const ROUTES_TO_PRERENDER = [
  // Pages
  '/',
  '/products',
  '/about',
  '/contact',
  '/blog',
  '/wooden-toys-nz',
  '/wooden-kitchenware',
  '/wooden-pens',
  '/wooden-crosses',
  '/wooden-planes-helicopters',
  '/reviews',
  '/custom-order',
  '/wooden-baby-toys',
  '/wooden-cars',
  '/wooden-trains',
  '/wooden-trucks',
  '/wooden-tractors-boats',
  '/shipping',
  '/returns',
  // Products
  '/products/2-by-4-car-steering-wheel',
  '/products/2-by-4-pine-car',
  '/products/2-by-4-pine-car-with-roof',
  '/products/2-by-4-pine-tow-truck',
  '/products/2-by-4-pine-ute',
  '/products/2-by-4-set-5',
  '/products/baby-rattle',
  '/products/bi-plane',
  '/products/big-spatula-flat',
  '/products/big-spatula-flat-2',
  '/products/block-train',
  '/products/car-carrier',
  '/products/car-carrier-and-4-cars',
  '/products/car-hauler',
  '/products/dragster',
  '/products/dump-truck',
  '/products/egg-cup',
  '/products/fishing-boat',
  '/products/floor-noise-maker',
  '/products/french-rolling-pin',
  '/products/gt-coupe',
  '/products/hammer-set',
  '/products/happy-go-luck-train',
  '/products/helicopter-rimu',
  '/products/hot-pot-stand',
  '/products/kauri-truck-trailer-loader',
  '/products/key-holder',
  '/products/logging-truck',
  '/products/mini-van',
  '/products/noise-maker',
  '/products/pine-bat-car',
  '/products/pine-boat',
  '/products/pine-helicopter',
  '/products/pine-kiwi',
  '/products/pine-plane',
  '/products/police-boat',
  '/products/product-pen-kauri-chrome-black',
  '/products/product-pen-kauri-gold-stylus',
  '/products/product-pen-rewa-rewa-antique-bronze',
  '/products/product-pen-rewa-rewa-chrome-black',
  '/products/product-pen-rewa-rewa-gold-stylus',
  '/products/product-pen-rimu-antique-bronze',
  '/products/product-pen-rimu-chrome-black',
  '/products/product-pen-rimu-gold-stylus',
  '/products/product-pen-totara-antique-bronze',
  '/products/product-pen-totara-chrome-black',
  '/products/product-pen-totara-gold-stylus',
  '/products/rimu-wooden-cross',
  '/products/roadster',
  '/products/rolling-pin-2',
  '/products/rubbish-truck',
  '/products/salad-forks',
  '/products/small-pine-bus',
  '/products/small-pine-car',
  '/products/small-pine-helicopter',
  '/products/small-pine-truck',
  '/products/small-pine-ute',
  '/products/small-spatula-curve',
  '/products/small-spatula-flat-1',
  '/products/speedster',
  '/products/sportster',
  '/products/t-rex',
  '/products/teething-ring',
  '/products/toaster-tongs',
  '/products/tour-bus',
  '/products/tour-bus-wooden-car',
  '/products/tractor-exquisite',
  '/products/trolley-and-blocks',
  '/products/truckster',
  '/products/two-window-coupe',
  '/products/wooden-kauri-car-6',
  '/products/wooden-tea-spoon',
]

export default defineConfig({
  plugins: [
    react(),
    VitePrerender({
      staticDir: 'dist',
      routes: ROUTES_TO_PRERENDER,
      renderer: new Renderer({
        headless: true,
        renderAfterTime: 5000,
        maxConcurrentRoutes: 4,
      }),
      postProcess(renderedRoute) {
        renderedRoute.html = renderedRoute.html
          .replace(/src="\/assets\//g, 'src="/assets/')
          .replace(/href="\/assets\//g, 'href="/assets/');
        return renderedRoute;
      },
    }),
  ],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js']
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      }
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
})
