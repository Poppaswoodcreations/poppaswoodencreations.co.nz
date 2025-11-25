// Download your complete website as ONE ZIP file
// NO zip files inside - just your website files
// Run this in browser console (F12 → Console → Paste → Enter)

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);

script.onload = async () => {
  console.log('🚀 Creating your website ZIP...');
  
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
    // ROOT FILES
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
    await addFile('.env.example');

    // SRC FILES
    await addFile('src/main.tsx');
    await addFile('src/App.tsx');
    await addFile('src/index.css');
    await addFile('src/vite-env.d.ts');
    await addFile('src/types/index.ts');
    await addFile('src/lib/supabase.ts');
    await addFile('src/data/products.ts');
    await addFile('src/hooks/useProducts.ts');

    // UTILS
    await addFile('src/utils/csvImporter.ts');
    await addFile('src/utils/textCleaner.ts');
    await addFile('src/utils/productStorage.ts');
    await addFile('src/utils/imageUtils.ts');
    await addFile('src/utils/orderNotifications.ts');

    // COMPONENTS
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
    await addFile('src/components/Cart/Cart.tsx');
    await addFile('src/components/Reviews/ReviewsSection.tsx');

    // ADMIN COMPONENTS
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

    // PUBLIC FILES
    await addFile('public/robots.txt');
    await addFile('public/sitemap.xml');
    await addFile('public/BingSiteAuth.xml');

    // DATABASE MIGRATIONS
    await addFile('supabase/migrations/20250713215509_lucky_mode.sql');
    await addFile('supabase/migrations/20250909000252_bitter_dew.sql');
    await addFile('supabase/migrations/20250909000500_weathered_pond.sql');
    await addFile('supabase/migrations/20250909000746_quick_voice.sql');
    await addFile('supabase/migrations/20250909001016_snowy_unit.sql');
    await addFile('supabase/migrations/20250909235435_twilight_pebble.sql');

    // CREATE ZIP
    console.log('📦 Creating ZIP file...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // DOWNLOAD ZIP
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poppas-wooden-creations-website.zip`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`✅ WEBSITE DOWNLOADED!

ZIP File: poppas-wooden-creations-website.zip
Files: ${fileCount} website files
NO zip files inside - just your website!

Check your Downloads folder!`);

  } catch (error) {
    console.error('❌ Error:', error);
    alert('Download failed. Try again.');
  }
};