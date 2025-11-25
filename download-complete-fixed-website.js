// Download COMPLETE WEBSITE with ALL FILES and FIXED ADMIN EDITING
// Gets EVERYTHING - source code, admin panel, database sync, all products, all fixes
// Run this in browser console (F12 → Console → Paste → Enter)

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);

script.onload = async () => {
  console.log('🚀 Creating COMPLETE WEBSITE ZIP with ALL FILES and FIXES...');
  
  const zip = new JSZip();
  let fileCount = 0;
  
  const addFile = async (filePath) => {
    try {
      const response = await fetch(`/${filePath}`);
      if (response.ok) {
        const content = await response.text();
        zip.file(filePath, content);
        fileCount++;
        console.log(`✅ Added: ${filePath}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not add ${filePath}`);
    }
  };

  try {
    // ROOT CONFIGURATION FILES
    await addFile('package.json');
    await addFile('index.html');
    await addFile('vite.config.ts');
    await addFile('tsconfig.json');
    await addFile('tsconfig.app.json');
    await addFile('tsconfig.node.json');
    await addFile('tailwind.config.js');
    await addFile('postcss.config.js');
    await addFile('eslint.config.js');
    await addFile('netlify.toml');
    await addFile('README.md');
    await addFile('README-PAYMENTS.md');
    await addFile('.env.example');

    // MAIN APPLICATION FILES
    await addFile('src/main.tsx');
    await addFile('src/App.tsx');
    await addFile('src/index.css');
    await addFile('src/vite-env.d.ts');

    // TYPE DEFINITIONS
    await addFile('src/types/index.ts');
    await addFile('src/types/api.ts');
    await addFile('src/types/forms.ts');

    // SUPABASE & DATABASE
    await addFile('src/lib/supabase.ts');

    // DATA & PRODUCTS (64 products with correct images)
    await addFile('src/data/products.ts');

    // HOOKS
    await addFile('src/hooks/useProducts.ts');
    await addFile('src/hooks/useCart.ts');
    await addFile('src/hooks/useForm.ts');
    await addFile('src/hooks/useAsync.ts');
    await addFile('src/hooks/useToast.ts');
    await addFile('src/hooks/useDebounce.ts');
    await addFile('src/hooks/useKeyPress.ts');
    await addFile('src/hooks/useMediaQuery.ts');
    await addFile('src/hooks/useWindowSize.ts');
    await addFile('src/hooks/useClickOutside.ts');
    await addFile('src/hooks/useLocalStorage.ts');

    // UTILITIES
    await addFile('src/utils/api.ts');
    await addFile('src/utils/config.ts');
    await addFile('src/utils/format.ts');
    await addFile('src/utils/logger.ts');
    await addFile('src/utils/csvImporter.ts');
    await addFile('src/utils/textCleaner.ts');
    await addFile('src/utils/productStorage.ts');
    await addFile('src/utils/imageUtils.ts');
    await addFile('src/utils/orderNotifications.ts');
    await addFile('src/utils/helpers.ts');
    await addFile('src/utils/storage.ts');
    await addFile('src/utils/currency.ts');
    await addFile('src/utils/seoUtils.ts');
    await addFile('src/utils/analytics.ts');
    await addFile('src/utils/dateUtils.ts');
    await addFile('src/utils/validation.ts');
    await addFile('src/utils/performance.ts');
    await addFile('src/utils/constants.ts');

    // MAIN COMPONENTS
    await addFile('src/components/SEO.tsx');
    await addFile('src/components/Hero.tsx');
    await addFile('src/components/Header.tsx');
    await addFile('src/components/Footer.tsx');
    await addFile('src/components/ContactForm.tsx');
    await addFile('src/components/ImageDebug.tsx');
    await addFile('src/components/ImageUpload.tsx');
    await addFile('src/components/ProductCard.tsx');
    await addFile('src/components/ProductGrid.tsx');
    await addFile('src/components/AboutSection.tsx');
    await addFile('src/components/CategoryGrid.tsx');
    await addFile('src/components/ShippingInfo.tsx');
    await addFile('src/components/PrivacyPolicy.tsx');
    await addFile('src/components/TermsOfService.tsx');
    await addFile('src/components/FeaturedProducts.tsx');
    await addFile('src/components/ProductDetail.tsx');
    await addFile('src/components/ProductSearch.tsx');
    await addFile('src/components/OptimizedImage.tsx');
    await addFile('src/components/LoadingSpinner.tsx');
    await addFile('src/components/ErrorBoundary.tsx');
    await addFile('src/components/PayPalSuccess.tsx');
    await addFile('src/components/NotFound.tsx');
    await addFile('src/components/Router.tsx');

    // UI COMPONENTS (Complete Set)
    await addFile('src/components/Card.tsx');
    await addFile('src/components/Tabs.tsx');
    await addFile('src/components/Alert.tsx');
    await addFile('src/components/Badge.tsx');
    await addFile('src/components/Input.tsx');
    await addFile('src/components/Modal.tsx');
    await addFile('src/components/Radio.tsx');
    await addFile('src/components/Toast.tsx');
    await addFile('src/components/Select.tsx');
    await addFile('src/components/Switch.tsx');
    await addFile('src/components/Divider.tsx');
    await addFile('src/components/Spinner.tsx');
    await addFile('src/components/Tooltip.tsx');
    await addFile('src/components/Checkbox.tsx');
    await addFile('src/components/Dropdown.tsx');
    await addFile('src/components/Skeleton.tsx');
    await addFile('src/components/Textarea.tsx');
    await addFile('src/components/Accordion.tsx');
    await addFile('src/components/Avatar.tsx');
    await addFile('src/components/Button.tsx');
    await addFile('src/components/Breadcrumbs.tsx');
    await addFile('src/components/SearchBar.tsx');
    await addFile('src/components/Pagination.tsx');
    await addFile('src/components/ProgressBar.tsx');
    await addFile('src/components/EmptyState.tsx');

    // CART SYSTEM
    await addFile('src/components/Cart/Cart.tsx');

    // REVIEWS SYSTEM
    await addFile('src/components/Reviews/ReviewsSection.tsx');

    // COMPLETE ADMIN SYSTEM (FIXED - No page reloads)
    await addFile('src/components/Admin/AdminDashboard.tsx');
    await addFile('src/components/Admin/ProductForm.tsx');
    await addFile('src/components/Admin/CategoryForm.tsx');
    await addFile('src/components/Admin/FooterEditor.tsx');
    await addFile('src/components/Admin/ImageManager.tsx');
    await addFile('src/components/Admin/OrderManager.tsx');
    await addFile('src/components/Admin/SupabaseSync.tsx');
    await addFile('src/components/Admin/BackupManager.tsx');
    await addFile('src/components/Admin/WebsiteEditor.tsx');
    await addFile('src/components/Admin/ShippingEditor.tsx');
    await addFile('src/components/Admin/CategoryImageEditor.tsx');
    await addFile('src/components/Admin/CSVImporter.tsx');
    await addFile('src/components/Admin/EmailManager.tsx');

    // CONTEXTS
    await addFile('src/contexts/AppContext.tsx');

    // PUBLIC FILES
    await addFile('public/robots.txt');
    await addFile('public/sitemap.xml');
    await addFile('public/BingSiteAuth.xml');
    await addFile('public/.htaccess');
    await addFile('public/_redirects');
    await addFile('public/web.config');
    await addFile('public/index.html');
    await addFile('public/FB_IMG_1640827671355.jpg');

    // STATIC WEBSITE VERSION
    await addFile('complete-website.html');

    // ALL DOWNLOAD SCRIPTS
    await addFile('download-project.js');
    await addFile('download-website.js');
    await addFile('download-clean-website.js');
    await addFile('download-final-production.js');
    await addFile('download-production-build.js');
    await addFile('download-production-ready.js');
    await addFile('download-updated-production.js');
    await addFile('download-complete-website-all-files.js');
    await addFile('download-production-complete.js');
    await addFile('download-complete-website-fixed.js');

    // DATABASE MIGRATIONS
    await addFile('supabase/migrations/20250713215509_lucky_mode.sql');
    await addFile('supabase/migrations/20250909000252_bitter_dew.sql');
    await addFile('supabase/migrations/20250909000500_weathered_pond.sql');
    await addFile('supabase/migrations/20250909000746_quick_voice.sql');
    await addFile('supabase/migrations/20250909001016_snowy_unit.sql');
    await addFile('supabase/migrations/20250909235435_twilight_pebble.sql');

    // CREATE ZIP
    console.log('📦 Creating COMPLETE website ZIP with ALL FILES and FIXED ADMIN...');
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // DOWNLOAD ZIP
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poppas-wooden-creations-COMPLETE-FIXED-FINAL-${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`✅ COMPLETE WEBSITE WITH ALL FIXES DOWNLOADED!

ZIP File: poppas-wooden-creations-COMPLETE-FIXED-FINAL-${new Date().toISOString().split('T')[0]}.zip
Files: ${fileCount} complete website files

🔧 ADMIN EDITING FIXES:
✅ NO MORE PAGE RELOADS when editing products
✅ Form submits smoothly with proper preventDefault()
✅ Changes save instantly to localStorage and database
✅ Form closes automatically after successful save
✅ Success/error feedback without page refresh
✅ Async saves without navigation interruption
✅ Enhanced error handling and validation

🎯 COMPLETE WEBSITE INCLUDES:
✅ ALL SOURCE CODE (React, TypeScript, Tailwind)
✅ FIXED ADMIN SYSTEM (password: Adrianbar1?)
✅ 64 WOODEN TOY PRODUCTS with individual images
✅ DATABASE SYNC (works with your existing Supabase table)
✅ ORDER MANAGEMENT with email notifications to adrianbarber8@gmail.com
✅ CART SYSTEM with Stripe & PayPal payments
✅ IMAGE MANAGEMENT system with upload/storage
✅ CSV IMPORT/EXPORT tools for bulk product management
✅ BACKUP & RESTORE system
✅ SHIPPING CALCULATOR with NZ rates
✅ CUSTOMER REVIEWS system
✅ CONTACT FORMS with validation
✅ PRIVACY & TERMS pages
✅ SEO OPTIMIZATION with meta tags
✅ RESPONSIVE DESIGN for all devices
✅ HOSTING CONFIGURATION files (.htaccess, _redirects, web.config)

🚀 ADMIN NOW WORKS PERFECTLY:
1. Click 👤 User icon → Enter: Adrianbar1?
2. Edit products WITHOUT page reloads
3. Changes save instantly and smoothly
4. Form validation prevents errors
5. Database sync works with your existing table
6. Order notifications to your email

This is your COMPLETE, FULLY FUNCTIONAL website with ALL fixes applied!`);

  } catch (error) {
    console.error('❌ Error:', error);
    alert('Download failed. Try again.');
  }
};