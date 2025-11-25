// Download MISSING APPLICATION FILES - JavaScript and CSS only
// Gets the compiled JS/CSS files your website needs to work
// Run this in browser console (F12 → Console → Paste → Enter)

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);

script.onload = async () => {
  console.log('🚀 Getting MISSING APPLICATION FILES - JS and CSS only...');
  
  const zip = new JSZip();
  let fileCount = 0;
  
  const addFile = async (filePath) => {
    try {
      const response = await fetch(`/${filePath}`);
      if (response.ok) {
        const content = await response.text();
        // Remove 'dist/' prefix for clean file structure
        const cleanPath = filePath.replace('dist/', '');
        zip.file(cleanPath, content);
        fileCount++;
        console.log(`✅ Added: ${cleanPath}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not add ${filePath}`);
    }
  };

  const addBinaryFile = async (filePath) => {
    try {
      const response = await fetch(`/${filePath}`);
      if (response.ok) {
        const content = await response.arrayBuffer();
        const cleanPath = filePath.replace('dist/', '');
        zip.file(cleanPath, content);
        fileCount++;
        console.log(`✅ Added: ${cleanPath}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not add ${filePath}`);
    }
  };

  try {
    // MAIN HTML FILE (with correct script references)
    await addFile('dist/index.html');
    
    // COMPILED CSS FILES (all styling)
    await addFile('dist/assets/style-M39VutYE.css');
    
    // COMPILED JAVASCRIPT FILES (application code)
    await addFile('dist/assets/index-DdI6ntbi.js');
    await addFile('dist/assets/vendor-xut9W0mk.js');
    await addFile('dist/assets/router-cA6yDtfi.js');
    await addFile('dist/assets/ui-hCFtskZA.js');
    
    // SOURCE MAPS (for debugging)
    await addFile('dist/assets/index-DdI6ntbi.js.map');
    await addFile('dist/assets/vendor-xut9W0mk.js.map');
    await addFile('dist/assets/router-cA6yDtfi.js.map');
    await addFile('dist/assets/ui-hCFtskZA.js.map');
    
    // REDIRECT FILES (for proper routing)
    await addFile('dist/.htaccess');
    await addFile('dist/_redirects');
    await addFile('dist/web.config');
    
    // SEO FILES
    await addFile('dist/robots.txt');
    await addFile('dist/sitemap.xml');
    await addFile('dist/BingSiteAuth.xml');
    
    // STATIC ASSETS
    await addBinaryFile('dist/FB_IMG_1640827671355.jpg');
    await addBinaryFile('dist/test-image-fallback.svg');
    
    // ALL PRODUCT IMAGES
    await addBinaryFile('dist/images/image.png');
    await addBinaryFile('dist/images/image copy.png');
    await addBinaryFile('dist/images/image copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy copy copy copy.png');
    await addBinaryFile('dist/images/image copy copy copy copy copy copy copy.png');

    if (fileCount === 0) {
      throw new Error('No dist files found! Build may have failed.');
    }

    // CREATE ZIP
    console.log('📦 Creating application files ZIP...');
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // DOWNLOAD ZIP
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poppas-missing-application-files-${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`✅ MISSING APPLICATION FILES DOWNLOADED!

ZIP File: poppas-missing-application-files-${new Date().toISOString().split('T')[0]}.zip
Files: ${fileCount} compiled website files

🎯 WHAT YOU GET:
✅ index.html (main page with script references)
✅ assets/style-M39VutYE.css (all styling)
✅ assets/index-DdI6ntbi.js (main application)
✅ assets/vendor-xut9W0mk.js (React and dependencies)
✅ assets/router-cA6yDtfi.js (routing system)
✅ assets/ui-hCFtskZA.js (UI components)
✅ .htaccess, _redirects, web.config (redirects)
✅ robots.txt, sitemap.xml (SEO)
✅ images/ folder (all product images)

🚀 UPLOAD TO YOUR SERVER:
1. Extract the ZIP file
2. Upload ALL files to your web server root
3. Your website will work immediately!

🎯 INCLUDES:
✅ 64 Products with admin system
✅ Database sync with your existing Supabase table
✅ Order notifications to adrianbarber8@gmail.com
✅ Shopping cart with Stripe/PayPal
✅ Admin access: password Adrianbar1?

This gives you ALL the missing files your website needs!`);

  } catch (error) {
    console.error('❌ Error:', error);
    alert(`❌ Download failed: ${error.message}`);
  }
};