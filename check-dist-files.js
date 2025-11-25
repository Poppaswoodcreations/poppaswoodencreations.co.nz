// Check what DIST files actually exist
// Run this in browser console to see what's available
// This will tell us exactly what dist files we can download

console.log('🔍 CHECKING DIST FOLDER CONTENTS...');

const checkFile = async (filePath) => {
  try {
    const response = await fetch(`/${filePath}`);
    if (response.ok) {
      const size = response.headers.get('content-length');
      console.log(`✅ EXISTS: ${filePath} (${size ? (parseInt(size)/1024).toFixed(1) + 'KB' : 'unknown size'})`);
      return true;
    } else {
      console.log(`❌ NOT FOUND: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${filePath} - ${error.message}`);
    return false;
  }
};

const checkDistFolder = async () => {
  console.log('🔍 Checking for DIST folder and files...');
  
  const distFiles = [
    'dist/index.html',
    'dist/robots.txt',
    'dist/sitemap.xml',
    'dist/assets/index.css',
    'dist/assets/index.js',
    'dist/assets/style.css',
    'dist/assets/vendor.js',
    'dist/assets/main.css',
    'dist/assets/main.js',
    'dist/FB_IMG_1640827671355.jpg',
    'dist/images/image.png',
    'dist/images/image copy.png'
  ];
  
  let foundFiles = 0;
  let totalSize = 0;
  
  for (const file of distFiles) {
    const exists = await checkFile(file);
    if (exists) foundFiles++;
  }
  
  console.log(`📊 DIST FOLDER STATUS: ${foundFiles}/${distFiles.length} files found`);
  
  if (foundFiles === 0) {
    console.log('❌ NO DIST FOLDER FOUND!');
    console.log('🔧 You need to build the project first:');
    console.log('   1. Run: npm run build');
    console.log('   2. Wait for build to complete');
    console.log('   3. Then download again');
    
    alert(`❌ NO DIST FOLDER FOUND!

The dist folder doesn't exist yet. You need to build the project first:

1. Run: npm run build
2. Wait for build to complete  
3. Then run the download script again

The dist folder contains the compiled website ready for hosting.`);
  } else {
    console.log(`✅ DIST FOLDER EXISTS with ${foundFiles} files!`);
    alert(`✅ DIST FOLDER EXISTS!

Found ${foundFiles} dist files.
You can now download the complete website including the dist folder.`);
  }
};

checkDistFolder();