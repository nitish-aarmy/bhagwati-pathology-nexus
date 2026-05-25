const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'dist', 'main.cjs');
const dest = path.join(__dirname, 'dist', 'index.js');

if (!fs.existsSync(src)) {
  console.error('❌ dist/main.cjs not found');
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('✅ dist/main.cjs copied to dist/index.js');
