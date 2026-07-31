const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\OM\\.gemini\\antigravity\\brain\\4279e555-9c1c-441f-911a-2296ff793782\\media__1785494100819.png';
const destDir = path.join(__dirname, 'public');
const destPath = path.join(destDir, 'logo.png');

if (fs.existsSync(srcPath)) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(srcPath, destPath);
  console.log('Logo copied successfully to public/logo.png');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = nextConfig;
