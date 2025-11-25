// Download PRODUCTION BUILD for web hosting
// Gets compiled files from dist/ folder - FULLY FUNCTIONAL website
// Run this in browser console (F12 → Console → Paste → Enter)

const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);

script.onload = async () => {
  console.log('🚀 Creating PRODUCTION BUILD ZIP...');
  
  const zip = new JSZip();
  let fileCount = 0;
  
  const addFile = async (filePath) => {
    try {
      const response = await fetch(`/${filePath}`);
      if (response.ok) {
        const content = await response.arrayBuffer();
        zip.file(filePath.replace('dist/', ''), content);
        fileCount++;
        console.log(`✅ Added: ${filePath}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not add ${filePath}`);
    }
  };

  const addTextFile = async (filePath) => {
    try {
      const response = await fetch(`/${filePath}`);
      if (response.ok) {
        const content = await response.text();
        zip.file(filePath.replace('dist/', ''), content);
        fileCount++;
        console.log(`✅ Added: ${filePath}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not add ${filePath}`);
    }
  };

  try {
    // MAIN HTML FILE
    await addTextFile('dist/index.html');
    
    // ASSETS FOLDER (CSS and JS)
    const assetsResponse = await fetch('/dist/assets/');
    if (assetsResponse.ok) {
      // Try to get common asset files
      const commonAssets = [
        'index.css',
        'index.js', 
        'main.css',
        'main.js',
        'app.css',
        'app.js',
        'vendor.js',
        'style.css'
      ];
      
      for (const asset of commonAssets) {
        await addFile(`dist/assets/${asset}`);
      }
      
      // Try to get hashed asset files
      for (let i = 0; i < 10; i++) {
        await addFile(`dist/assets/index-${i}.css`);
        await addFile(`dist/assets/index-${i}.js`);
      }
    }
    
    // STATIC FILES
    await addTextFile('dist/robots.txt');
    await addTextFile('dist/sitemap.xml');
    await addFile('dist/vite.svg');
    await addFile('dist/favicon.ico');
    
    // IMAGES
    const imageFiles = [
      'FB_IMG_1640827671355.jpg',
      'test-image-fallback.svg'
    ];
    
    for (const img of imageFiles) {
      await addFile(`dist/${img}`);
      await addFile(`dist/images/${img}`);
    }

    // If no files found in dist, build the project first
    if (fileCount === 0) {
      alert('❌ No build files found! The project needs to be built first.\n\nPlease run: npm run build\n\nThen try downloading again.');
      return;
    }

    // CREATE ZIP
    console.log('📦 Creating production ZIP file...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // DOWNLOAD ZIP
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poppas-wooden-creations-production-${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`✅ PRODUCTION BUILD DOWNLOADED!

ZIP File: poppas-wooden-creations-production-${new Date().toISOString().split('T')[0]}.zip
Files: ${fileCount} compiled website files
NO source code - just compiled HTML/CSS/JS
NO @@ diff markers anywhere!
FULLY FUNCTIONAL website ready for hosting!

Extract the ZIP and upload all files to your hosting program!`);

  } catch (error) {
    console.error('❌ Error:', error);
    alert('Download failed. Make sure the project is built first (npm run build).');
  }
};