import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import pngToIco from 'png-to-ico';

const logoSvg = path.resolve('src/assets/logo.svg');
const publicDir = path.resolve('public');

async function generateFavicons() {
  try {
    const sizes = [16, 32, 192, 512];
    
    // Generate PNGs
    for (const size of sizes) {
      await sharp(logoSvg)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
      
      console.log(`Generated favicon-${size}x${size}.png`);
    }
    
    // Also generate apple-touch-icon
    await sharp(logoSvg)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, `apple-touch-icon.png`));
      
    console.log(`Generated apple-touch-icon.png`);
    
    // Generate site.webmanifest
    const manifest = {
      name: "Crystal RO Care",
      short_name: "Crystal",
      icons: [
        { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" }
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone"
    };
    
    fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
    console.log(`Generated site.webmanifest`);
    
    // Generate favicon.ico using png-to-ico
    const buf = await pngToIco([
      path.join(publicDir, 'favicon-16x16.png'),
      path.join(publicDir, 'favicon-32x32.png')
    ]);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buf);
    console.log(`Generated favicon.ico`);
    
    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();
