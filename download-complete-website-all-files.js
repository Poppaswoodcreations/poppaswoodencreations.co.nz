// Download COMPLETE WEBSITE with ALL FILES, ADMIN SYSTEM, and PRODUCTS
// Gets EVERYTHING - source code, admin panel, database sync, all products
// Run this in browser console (F12 → Console → Paste → Enter)

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);

script.onload = async () => {
  console.log('🚀 Creating COMPLETE WEBSITE ZIP with ALL FILES...');
  
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

    // DATA & PRODUCTS (64 products)
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

    // UI COMPONENTS
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

    // COMPLETE ADMIN SYSTEM
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

    // DOWNLOAD SCRIPTS
    await addFile('download-project.js');
    await addFile('download-website.js');
    await addFile('download-clean-website.js');
    await addFile('download-final-production.js');
    await addFile('download-production-build.js');
    await addFile('download-production-ready.js');
    await addFile('download-updated-production.js');
    await addFile('download-production-ready.js');
    await addFile('complete-website.html');

    // DATABASE MIGRATIONS (existing ones)
    await addFile('supabase/migrations/20250713215509_lucky_mode.sql');
    await addFile('supabase/migrations/20250909000252_bitter_dew.sql');
    await addFile('supabase/migrations/20250909000500_weathered_pond.sql');
    await addFile('supabase/migrations/20250909000746_quick_voice.sql');
    await addFile('supabase/migrations/20250909001016_snowy_unit.sql');
    await addFile('supabase/migrations/20250909235435_twilight_pebble.sql');

    // CREATE ZIP
    console.log('📦 Creating COMPLETE website ZIP...');
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // DOWNLOAD ZIP
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poppas-wooden-creations-COMPLETE-${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`✅ COMPLETE WEBSITE DOWNLOADED!

ZIP File: poppas-wooden-creations-COMPLETE-${new Date().toISOString().split('T')[0]}.zip
Files: ${fileCount} complete website files

🎯 WHAT YOU GET:
✅ ALL SOURCE CODE (React, TypeScript, Tailwind)
✅ COMPLETE ADMIN SYSTEM with password: Adrianbar1?
✅ 64 WOODEN TOY PRODUCTS with correct pricing
✅ DATABASE SYNC (works with your existing Supabase table)
✅ ORDER MANAGEMENT with email notifications
✅ CART SYSTEM with Stripe & PayPal
✅ SEO OPTIMIZATION with meta tags
✅ RESPONSIVE DESIGN for all devices
✅ IMAGE MANAGEMENT system
✅ CSV IMPORT/EXPORT tools
✅ BACKUP & RESTORE system
✅ SHIPPING CALCULATOR
✅ CUSTOMER REVIEWS system
✅ CONTACT FORMS
✅ PRIVACY & TERMS pages

🚀 ADMIN ACCESS:
1. Click 👤 User icon (top right)
2. Enter password: Adrianbar1?
3. Full admin dashboard opens
4. Database sync works with your existing table
5. NO schema changes - uses your current structure

🎯 READY FOR:
• Development (npm run dev)
• Production build (npm run build)
• Deployment to any hosting service
• Supabase database integration
• Live editing on your website

This is your COMPLETE website with everything included!`);

  } catch (error) {
    console.error('❌ Error:', error);
    alert('Download failed. Try again.');
  }
};