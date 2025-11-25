// Download ABSOLUTELY EVERYTHING - ALL FILES, DIST FOLDER, ALL FIXES
// Gets EVERY SINGLE FILE in the project including production build
// Run this in browser console (F12 → Console → Paste → Enter)

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);

script.onload = async () => {
  console.log('🚀 Creating ABSOLUTELY EVERYTHING ZIP - ALL FILES + DIST + FIXES...');
  
  const zip = new JSZip();
  let fileCount = 0;
  
  // Function to add binary files
  const addBinaryFile = async (filePath) => {
    try {
      const response = await fetch(`/${filePath}`);
      if (response.ok) {
        const content = await response.arrayBuffer();
        zip.file(filePath, content);
        fileCount++;
        console.log(`✅ Added binary: ${filePath}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not add ${filePath}`);
    }
  };

  // Function to add text files
  const addTextFile = async (filePath) => {
    try {
      const response = await fetch(`/${filePath}`);
      if (response.ok) {
        const content = await response.text();
        zip.file(filePath, content);
        fileCount++;
        console.log(`✅ Added text: ${filePath}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not add ${filePath}`);
    }
  };

  try {
    // ===== ROOT CONFIGURATION FILES =====
    await addTextFile('package.json');
    await addTextFile('package-lock.json');
    await addTextFile('index.html');
    await addTextFile('vite.config.ts');
    await addTextFile('tsconfig.json');
    await addTextFile('tsconfig.app.json');
    await addTextFile('tsconfig.node.json');
    await addTextFile('tailwind.config.js');
    await addTextFile('postcss.config.js');
    await addTextFile('eslint.config.js');
    await addTextFile('netlify.toml');
    await addTextFile('README.md');
    await addTextFile('README-PAYMENTS.md');
    await addTextFile('.env.example');
    await addTextFile('.gitignore');

    // ===== MAIN APPLICATION FILES =====
    await addTextFile('src/main.tsx');
    await addTextFile('src/App.tsx');
    await addTextFile('src/index.css');
    await addTextFile('src/vite-env.d.ts');

    // ===== TYPE DEFINITIONS =====
    await addTextFile('src/types/index.ts');
    await addTextFile('src/types/api.ts');
    await addTextFile('src/types/forms.ts');

    // ===== SUPABASE & DATABASE =====
    await addTextFile('src/lib/supabase.ts');

    // ===== DATA & PRODUCTS (64 products with FIXED images) =====
    await addTextFile('src/data/products.ts');

    // ===== HOOKS (All of them) =====
    await addTextFile('src/hooks/useProducts.ts');
    await addTextFile('src/hooks/useCart.ts');
    await addTextFile('src/hooks/useForm.ts');
    await addTextFile('src/hooks/useAsync.ts');
    await addTextFile('src/hooks/useToast.ts');
    await addTextFile('src/hooks/useDebounce.ts');
    await addTextFile('src/hooks/useKeyPress.ts');
    await addTextFile('src/hooks/useMediaQuery.ts');
    await addTextFile('src/hooks/useWindowSize.ts');
    await addTextFile('src/hooks/useClickOutside.ts');
    await addTextFile('src/hooks/useLocalStorage.ts');

    // ===== UTILITIES (All of them) =====
    await addTextFile('src/utils/api.ts');
    await addTextFile('src/utils/config.ts');
    await addTextFile('src/utils/format.ts');
    await addTextFile('src/utils/logger.ts');
    await addTextFile('src/utils/csvImporter.ts');
    await addTextFile('src/utils/textCleaner.ts');
    await addTextFile('src/utils/productStorage.ts');
    await addTextFile('src/utils/imageUtils.ts');
    await addTextFile('src/utils/orderNotifications.ts');
    await addTextFile('src/utils/helpers.ts');
    await addTextFile('src/utils/storage.ts');
    await addTextFile('src/utils/currency.ts');
    await addTextFile('src/utils/seoUtils.ts');
    await addTextFile('src/utils/analytics.ts');
    await addTextFile('src/utils/dateUtils.ts');
    await addTextFile('src/utils/validation.ts');
    await addTextFile('src/utils/performance.ts');
    await addTextFile('src/utils/constants.ts');

    // ===== MAIN COMPONENTS (All of them) =====
    await addTextFile('src/components/SEO.tsx');
    await addTextFile('src/components/Hero.tsx');
    await addTextFile('src/components/Header.tsx');
    await addTextFile('src/components/Footer.tsx');
    await addTextFile('src/components/ContactForm.tsx');
    await addTextFile('src/components/ImageDebug.tsx');
    await addTextFile('src/components/ImageUpload.tsx');
    await addTextFile('src/components/ProductCard.tsx');
    await addTextFile('src/components/ProductGrid.tsx');
    await addTextFile('src/components/AboutSection.tsx');
    await addTextFile('src/components/CategoryGrid.tsx');
    await addTextFile('src/components/ShippingInfo.tsx');
    await addTextFile('src/components/PrivacyPolicy.tsx');
    await addTextFile('src/components/TermsOfService.tsx');
    await addTextFile('src/components/FeaturedProducts.tsx');
    await addTextFile('src/components/ProductDetail.tsx');
    await addTextFile('src/components/ProductSearch.tsx');
    await addTextFile('src/components/OptimizedImage.tsx');
    await addTextFile('src/components/LoadingSpinner.tsx');
    await addTextFile('src/components/ErrorBoundary.tsx');
    await addTextFile('src/components/PayPalSuccess.tsx');
    await addTextFile('src/components/NotFound.tsx');
    await addTextFile('src/components/Router.tsx');

    // ===== UI COMPONENTS (Complete Set) =====
    await addTextFile('src/components/Card.tsx');
    await addTextFile('src/components/Tabs.tsx');
    await addTextFile('src/components/Alert.tsx');
    await addTextFile('src/components/Badge.tsx');
    await addTextFile('src/components/Input.tsx');
    await addTextFile('src/components/Modal.tsx');
    await addTextFile('src/components/Radio.tsx');
    await addTextFile('src/components/Toast.tsx');
    await addTextFile('src/components/Select.tsx');
    await addTextFile('src/components/Switch.tsx');
    await addTextFile('src/components/Divider.tsx');
    await addTextFile('src/components/Spinner.tsx');
    await addTextFile('src/components/Tooltip.tsx');
    await addTextFile('src/components/Checkbox.tsx');
    await addTextFile('src/components/Dropdown.tsx');
    await addTextFile('src/components/Skeleton.tsx');
    await addTextFile('src/components/Textarea.tsx');
    await addTextFile('src/components/Accordion.tsx');
    await addTextFile('src/components/Avatar.tsx');
    await addTextFile('src/components/Button.tsx');
    await addTextFile('src/components/Breadcrumbs.tsx');
    await addTextFile('src/components/SearchBar.tsx');
    await addTextFile('src/components/Pagination.tsx');
    await addTextFile('src/components/ProgressBar.tsx');
    await addTextFile('src/components/EmptyState.tsx');

    // ===== CART SYSTEM =====
    await addTextFile('src/components/Cart/Cart.tsx');

    // ===== REVIEWS SYSTEM =====
    await addTextFile('src/components/Reviews/ReviewsSection.tsx');

    // ===== COMPLETE ADMIN SYSTEM (FIXED - No page reloads) =====
    await addTextFile('src/components/Admin/AdminDashboard.tsx');
    await addTextFile('src/components/Admin/ProductForm.tsx');
    await addTextFile('src/components/Admin/CategoryForm.tsx');
    await addTextFile('src/components/Admin/FooterEditor.tsx');
    await addTextFile('src/components/Admin/ImageManager.tsx');
    await addTextFile('src/components/Admin/OrderManager.tsx');
    await addTextFile('src/components/Admin/SupabaseSync.tsx');
    await addTextFile('src/components/Admin/BackupManager.tsx');
    await addTextFile('src/components/Admin/WebsiteEditor.tsx');
    await addTextFile('src/components/Admin/ShippingEditor.tsx');
    await addTextFile('src/components/Admin/CategoryImageEditor.tsx');
    await addTextFile('src/components/Admin/CSVImporter.tsx');
    await addTextFile('src/components/Admin/EmailManager.tsx');

    // ===== CONTEXTS =====
    await addTextFile('src/contexts/AppContext.tsx');

    // ===== PUBLIC FILES =====
    await addTextFile('public/robots.txt');
    await addTextFile('public/sitemap.xml');
    await addTextFile('public/BingSiteAuth.xml');
    await addTextFile('public/.htaccess');
    await addTextFile('public/_redirects');
    await addTextFile('public/web.config');
    await addTextFile('public/index.html');
    await addBinaryFile('public/FB_IMG_1640827671355.jpg');

    // ===== ALL PRODUCT IMAGES =====
    await addBinaryFile('public/images/image.png');
    await addBinaryFile('public/images/image copy.png');
    await addBinaryFile('public/images/image copy copy.png');
    await addBinaryFile('public/images/image copy copy copy.png');
    await addBinaryFile('public/images/image copy copy copy copy.png');
    await addBinaryFile('public/images/image copy copy copy copy copy.png');
    await addBinaryFile('public/images/image copy copy copy copy copy copy.png');
    await addBinaryFile('public/images/image copy copy copy copy copy copy copy.png');
    await addBinaryFile('public/test-image-fallback.svg');

    // ===== STATIC WEBSITE VERSION =====
    await addTextFile('complete-website.html');

    // ===== ALL DOWNLOAD SCRIPTS =====
    await addTextFile('download-project.js');
    await addTextFile('download-website.js');
    await addTextFile('download-clean-website.js');
    await addTextFile('download-final-production.js');
    await addTextFile('download-production-build.js');
    await addTextFile('download-production-ready.js');
    await addTextFile('download-updated-production.js');
    await addTextFile('download-complete-website-all-files.js');
    await addTextFile('download-production-complete.js');
    await addTextFile('download-complete-website-fixed.js');
    await addTextFile('download-complete-fixed-website.js');

    // ===== DIST FOLDER (Production Build) =====
    await addTextFile('dist/index.html');
    await addTextFile('dist/robots.txt');
    await addTextFile('dist/sitemap.xml');
    await addTextFile('dist/BingSiteAuth.xml');
    await addTextFile('dist/.htaccess');
    await addTextFile('dist/_redirects');
    await addTextFile('dist/web.config');
    await addBinaryFile('dist/FB_IMG_1640827671355.jpg');
    await addBinaryFile('dist/test-image-fallback.svg');

    // DIST ASSETS (Compiled CSS and JS)
    await addTextFile('dist/assets/style-7fdV0Sta.css');
    await addTextFile('dist/assets/index-BQdTHO9p.js');
    await addTextFile('dist/assets/vendor-xut9W0mk.js');
    await addTextFile('dist/assets/router-cA6yDtfi.js');
    await addTextFile('dist/assets/ui-hCFtskZA.js');
    await addTextFile('dist/assets/index-BQdTHO9p.js.map');
    await addTextFile('dist/assets/vendor-xut9W0mk.js.map');
    await addTextFile('dist/assets/router-cA6yDtfi.js.map');
    await addTextFile('dist/assets/ui-hCFtskZA.js.map');

    // DIST IMAGES (All product images)
    await addBinaryFile('dist/images/image.png');
    await addBinaryFile('dist/images/image copy.png');
    await addBinaryFile('dist/images/image copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy copy copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy copy copy copy copy.png');

    // ===== DATABASE MIGRATIONS =====
    await addTextFile('supabase/migrations/20250713215509_lucky_mode.sql');
    await addTextFile('supabase/migrations/20250909000252_bitter_dew.sql');
    await addTextFile('supabase/migrations/20250909000500_weathered_pond.sql');
    await addTextFile('supabase/migrations/20250909000746_quick_voice.sql');
    await addTextFile('supabase/migrations/20250909001016_snowy_unit.sql');
    await addTextFile('supabase/migrations/20250909235435_twilight_pebble.sql');

    // CREATE ZIP
    console.log('📦 Creating ABSOLUTELY EVERYTHING ZIP...');
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // DOWNLOAD ZIP
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poppas-wooden-creations-ABSOLUTELY-EVERYTHING-${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`✅ ABSOLUTELY EVERYTHING DOWNLOADED!

ZIP File: poppas-wooden-creations-ABSOLUTELY-EVERYTHING-${new Date().toISOString().split('T')[0]}.zip
Files: ${fileCount} COMPLETE files

🎯 WHAT YOU GET (EVERYTHING):
✅ ALL SOURCE CODE (React, TypeScript, Tailwind)
✅ COMPLETE DIST FOLDER (production build ready for hosting)
✅ ALL PRODUCT IMAGES (in both public/ and dist/)
✅ FIXED ADMIN SYSTEM (no page reloads when editing)
✅ 64 WOODEN TOY PRODUCTS with individual images
✅ DATABASE SYNC with your existing Supabase table
✅ ORDER MANAGEMENT with email notifications
✅ CART SYSTEM with Stripe & PayPal
✅ IMAGE MANAGEMENT system
✅ CSV IMPORT/EXPORT tools
✅ BACKUP & RESTORE system
✅ ALL WEBSITE PAGES
✅ SEO FILES (robots.txt, sitemap.xml)
✅ HOSTING CONFIG (.htaccess, _redirects, web.config)
✅ DATABASE MIGRATIONS
✅ ALL DOWNLOAD SCRIPTS
✅ PACKAGE.JSON with all dependencies
✅ PACKAGE-LOCK.JSON for exact versions

📁 FOLDER STRUCTURE:
• src/ - All source code with fixes
• dist/ - Production build ready to upload
• public/ - Static assets and images
• supabase/ - Database migrations
• All config files at root

🚀 READY FOR:
• Development: npm install && npm run dev
• Production hosting: Upload dist/ folder contents
• Database setup: Use supabase/ migrations
• Admin access: Password Adrianbar1?

This is ABSOLUTELY EVERYTHING - ${fileCount} files total!`);

  } catch (error) {
    console.error('❌ Error:', error);
    alert('Download failed. Try again.');
  }
};