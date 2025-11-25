// Download your COMPLETE WEBSITE as ONE CLEAN ZIP file
// NO @@ diff markers - CLEAN files ready for hosting
// Run this in browser console (F12 → Console → Paste → Enter)

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);

script.onload = async () => {
  console.log('🚀 Creating your CLEAN website ZIP for hosting...');
  
  const zip = new JSZip();
  let fileCount = 0;
  
  const addFile = async (filePath, content = null) => {
    try {
      let fileContent;
      
      if (content) {
        // Use provided content
        fileContent = content;
      } else {
        // Fetch from server
        const response = await fetch(`/${filePath}`);
        if (response.ok) {
          fileContent = await response.text();
        } else {
          console.warn(`⚠️ Could not fetch ${filePath}`);
          return;
        }
      }
      
      // Clean any @@ diff markers that might exist
      if (typeof fileContent === 'string') {
        fileContent = fileContent.replace(/@@.*@@\n?/g, '');
      }
      
      zip.file(filePath, fileContent);
      fileCount++;
      console.log(`✅ Added: ${filePath}`);
    } catch (error) {
      console.warn(`⚠️ Could not add ${filePath}:`, error);
    }
  };

  try {
    // ROOT FILES
    await addFile('package.json');
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

    // CLEAN INDEX.HTML - No React, just pure HTML
    const cleanIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Poppa's Wooden Creations - Premium Handcrafted Wooden Toys Made in New Zealand</title>
    <meta name="description" content="Discover premium handcrafted wooden toys made in New Zealand. Safe, durable, and educational toys for children of all ages. Free shipping on orders over $1000.">
    <meta name="keywords" content="wooden toys, handcrafted toys, New Zealand toys, educational toys, safe toys, children toys">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Poppa's Wooden Creations - Premium Handcrafted Wooden Toys">
    <meta property="og:description" content="Discover premium handcrafted wooden toys made in New Zealand. Safe, durable, and educational toys for children of all ages.">
    <meta property="og:image" content="https://poppaswoodencreations.co.nz/images/image copy copy copy copy copy copy.png">
    <meta property="og:url" content="https://poppaswoodencreations.co.nz/">
    <meta property="og:type" content="website">
    
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f9fafb;
        }
        .loading { 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
        }
        .spinner { 
            width: 40px; 
            height: 40px; 
            border: 4px solid #f3f4f6; 
            border-top: 4px solid #d97706; 
            border-radius: 50%; 
            animation: spin 1s linear infinite; 
        }
        @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
    </style>
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Poppa's Wooden Creations",
      "description": "Premium handcrafted wooden toys made in New Zealand",
      "url": "https://poppaswoodencreations.co.nz",
      "logo": "https://poppaswoodencreations.co.nz/images/image copy copy copy copy copy copy.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+64-21-022-8166",
        "contactType": "customer service",
        "email": "poppas.wooden.creations@gmail.com"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "102 Kiripaka Rd",
        "addressLocality": "Whangarei",
        "addressRegion": "Northland",
        "postalCode": "0110",
        "addressCountry": "NZ"
      },
      "foundingDate": "2015",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150"
      }
    }
    </script>
</head>
<body>
    <div id="root">
        <div class="loading">
            <div class="spinner"></div>
        </div>
    </div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

    await addFile('index.html', cleanIndexHtml);

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
    console.log('📦 Creating clean ZIP file...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // DOWNLOAD ZIP
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poppas-wooden-creations-clean-${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`✅ CLEAN WEBSITE DOWNLOADED!

ZIP File: poppas-wooden-creations-clean-${new Date().toISOString().split('T')[0]}.zip
Files: ${fileCount} clean website files
NO @@ diff markers anywhere!
NO zip files inside - just your website!

Ready to upload to your hosting program!`);

  } catch (error) {
    console.error('❌ Error:', error);
    alert('Download failed. Try again.');
  }
};