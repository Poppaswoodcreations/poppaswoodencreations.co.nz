import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

// Create a zip file with all necessary project files
const output = createWriteStream('poppas-wooden-creations.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

archive.pipe(output);

// Add all project files and folders
archive.directory('src/', 'src');
archive.directory('images/', 'images');
archive.file('index.html', { name: 'index.html' });
archive.file('404.html', { name: '404.html' });
archive.file('admin.html', { name: 'admin.html' });
archive.file('paypal-success.html', { name: 'paypal-success.html' });
archive.file('package.json', { name: 'package.json' });
archive.file('package-lock.json', { name: 'package-lock.json' });
archive.file('vite.config.ts', { name: 'vite.config.ts' });
archive.file('tsconfig.json', { name: 'tsconfig.json' });
archive.file('tsconfig.app.json', { name: 'tsconfig.app.json' });
archive.file('tsconfig.node.json', { name: 'tsconfig.node.json' });
archive.file('tailwind.config.js', { name: 'tailwind.config.js' });
archive.file('postcss.config.js', { name: 'postcss.config.js' });
archive.file('eslint.config.js', { name: 'eslint.config.js' });
archive.file('netlify.toml', { name: 'netlify.toml' });
archive.file('.env.example', { name: '.env.example' });
archive.file('.gitignore', { name: '.gitignore' });
archive.file('README.md', { name: 'README.md' });

output.on('close', () => {
  console.log(`Created poppas-wooden-creations.zip (${archive.pointer()} bytes)`);
});

archive.finalize();
