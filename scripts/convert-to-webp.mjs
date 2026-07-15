import sharp from 'sharp';
import { readdir, unlink, stat } from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');
const EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const QUALITY = 80; // WebP quality (0-100)

async function getAllImages(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await getAllImages(fullPath));
    } else if (EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

async function convertToWebp(filePath) {
  const ext = path.extname(filePath);
  const webpPath = filePath.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
  
  try {
    const originalStats = await stat(filePath);
    const originalSizeKB = (originalStats.size / 1024).toFixed(1);
    
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);
    
    const newStats = await stat(webpPath);
    const newSizeKB = (newStats.size / 1024).toFixed(1);
    const savings = ((1 - newStats.size / originalStats.size) * 100).toFixed(1);
    
    // Delete original file after successful conversion
    await unlink(filePath);
    
    const relativePath = path.relative(PUBLIC_DIR, filePath);
    console.log(`✅ ${relativePath} → .webp | ${originalSizeKB}KB → ${newSizeKB}KB (${savings}% smaller)`);
    
    return {
      original: filePath,
      webp: webpPath,
      originalSize: originalStats.size,
      newSize: newStats.size,
    };
  } catch (err) {
    console.error(`❌ Failed: ${filePath} - ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🔍 Scanning for PNG, JPG, JPEG files in public/...\n');
  
  const images = await getAllImages(PUBLIC_DIR);
  
  // Skip files that are already .webp
  const toConvert = images.filter(f => !f.endsWith('.webp'));
  
  console.log(`📦 Found ${toConvert.length} images to convert\n`);
  
  let totalOriginal = 0;
  let totalNew = 0;
  let converted = 0;
  
  for (const img of toConvert) {
    const result = await convertToWebp(img);
    if (result) {
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      converted++;
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✨ Done! Converted ${converted}/${toConvert.length} images`);
  console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB → ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Saved: ${((totalOriginal - totalNew) / 1024 / 1024).toFixed(2)} MB (${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%)`);
}

main().catch(console.error);
