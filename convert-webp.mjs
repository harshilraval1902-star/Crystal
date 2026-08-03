import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

async function convertToWebp() {
  try {
    const files = fs.readdirSync(publicDir);
    for (const file of files) {
      if (file.endsWith('.png') && (file === 'hero-bg.png' || file === 'hero-dark-bg.png')) {
        const inputPath = path.join(publicDir, file);
        const outputPath = path.join(publicDir, file.replace('.png', '.webp'));
        
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        console.log(`Converted ${file} to WebP`);
      }
    }
  } catch (error) {
    console.error('Error converting images:', error);
  }
}

convertToWebp();
