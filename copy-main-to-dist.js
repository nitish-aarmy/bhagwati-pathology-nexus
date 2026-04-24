// Copy main.cjs to dist after Vite build
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'main.cjs');
const dest = path.join(__dirname, 'dist', 'main.cjs');

fs.copyFileSync(src, dest);
console.log('main.cjs copied to dist/');
