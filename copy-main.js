const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'main.cjs');
const destination = path.join(__dirname, 'dist', 'main.cjs');

if (!fs.existsSync(source)) {
  console.error('❌ main.cjs not found in root');
  process.exit(1);
}

fs.copyFileSync(source, destination);
console.log('✅ main.cjs copied to dist/');
