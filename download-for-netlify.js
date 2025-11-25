const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(__dirname, 'poppas-wooden-creations.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log('Archive created: ' + archive.pointer() + ' total bytes');
  console.log('Download complete! Extract and run: npm install && npm run build');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Add all necessary files and folders
const filesToInclude = [
  'src/**/*',
  'public/**/*',
  'index.html',
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'tailwind.config.js',
  'postcss.config.js',
  'eslint.config.js',
  '.env.example',
  'netlify.toml'
];

// Exclude unnecessary files
const excludePatterns = [
  'node_modules/**',
  'dist/**',
  '.git/**',
  '*.log',
  'download-*.js',
  '*.md',
  'docs/**',
  '.bolt/**',
  'admin.html',
  'complete-website.html',
  '404.html',
  'paypal-success.html',
  'check-dist-files.js'
];

// Add files
archive.glob('**/*', {
  cwd: __dirname,
  ignore: excludePatterns,
  dot: true
});

archive.finalize();
