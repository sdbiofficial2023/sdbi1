/**
 * Convert all PNG/JPG/JPEG images in public/ to WebP format
 * and update all source code references accordingly.
 *
 * Usage: node scripts/convert-to-webp.mjs
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

// Extensions to convert
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Source code directories to update references in
const SOURCE_DIRS = [
  path.join(ROOT, 'app'),
  path.join(ROOT, 'components'),
  path.join(ROOT, 'src'),
  path.join(ROOT, 'pages'),
];

const SOURCE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css', '.html', '.json', '.md'];

/**
 * Recursively find all files matching given extensions in a directory
 */
async function findFiles(dir, extensions) {
  const results = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules, .next, .git
      if (['node_modules', '.next', '.git', '.agents'].includes(entry.name)) continue;
      results.push(...(await findFiles(fullPath, extensions)));
    } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Convert a single image to WebP
 */
async function convertToWebp(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const outputPath = inputPath.replace(/\.(png|jpe?g)$/i, '.webp');

  // Quality settings
  const options = {};
  if (ext === '.png') {
    // For PNG (often logos with transparency), use lossless or near-lossless
    options.lossless = false;
    options.quality = 80;
    options.effort = 4;
  } else {
    // For JPG/JPEG, use lossy with good quality
    options.quality = 80;
  }

  try {
    const inputBuffer = await fs.readFile(inputPath);
    const outputBuffer = await sharp(inputBuffer).webp(options).toBuffer();

    const inputSize = (await fs.stat(inputPath)).size;
    const savedPercent = ((1 - outputBuffer.length / inputSize) * 100).toFixed(1);

    await fs.writeFile(outputPath, outputBuffer);

    return {
      input: inputPath,
      output: outputPath,
      inputSize,
      outputSize: outputBuffer.length,
      savedPercent: parseFloat(savedPercent),
      success: true,
    };
  } catch (err) {
    return {
      input: inputPath,
      output: outputPath,
      error: err.message,
      success: false,
    };
  }
}

/**
 * Update file references in source code
 */
async function updateReferences(sourceFiles, convertedMap) {
  let totalUpdated = 0;

  for (const filePath of sourceFiles) {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    for (const [oldRef, newRef] of convertedMap) {
      if (content.includes(oldRef)) {
        content = content.replaceAll(oldRef, newRef);
        modified = true;
      }
    }

    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      totalUpdated++;
      console.log(`  📝 Updated references in: ${path.relative(ROOT, filePath)}`);
    }
  }

  return totalUpdated;
}

async function main() {
  console.log('🖼️  WebP Conversion Tool');
  console.log('========================\n');

  // 1. Find all images to convert
  const images = await findFiles(PUBLIC_DIR, IMAGE_EXTENSIONS);
  console.log(`Found ${images.length} images to convert\n`);

  if (images.length === 0) {
    console.log('No images to convert. Exiting.');
    return;
  }

  // 2. Convert all images
  console.log('Converting images to WebP...\n');
  const results = [];
  let totalInputSize = 0;
  let totalOutputSize = 0;

  for (const imagePath of images) {
    const result = await convertToWebp(imagePath);
    results.push(result);

    if (result.success) {
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;
      const relPath = path.relative(PUBLIC_DIR, imagePath);
      console.log(
        `  ✅ ${relPath} → .webp (${(result.inputSize / 1024).toFixed(0)}KB → ${(result.outputSize / 1024).toFixed(0)}KB, saved ${result.savedPercent}%)`
      );
    } else {
      console.log(`  ❌ ${path.relative(PUBLIC_DIR, imagePath)}: ${result.error}`);
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  console.log(`\n📊 Conversion Summary:`);
  console.log(`  Converted: ${successCount}/${images.length}`);
  console.log(`  Failed: ${failCount}`);
  console.log(
    `  Total size: ${(totalInputSize / 1024 / 1024).toFixed(1)}MB → ${(totalOutputSize / 1024 / 1024).toFixed(1)}MB`
  );
  console.log(
    `  Saved: ${((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)}% (${((totalInputSize - totalOutputSize) / 1024 / 1024).toFixed(1)}MB)`
  );

  // 3. Build reference map (public path references like /logos-trustedby/file.png → /logos-trustedby/file.webp)
  const convertedMap = new Map();
  for (const result of results) {
    if (!result.success) continue;
    // Get the public-relative path (e.g., /logos-trustedby/file.png)
    const oldPublicPath = '/' + path.relative(PUBLIC_DIR, result.input).replace(/\\/g, '/');
    const newPublicPath = oldPublicPath.replace(/\.(png|jpe?g)$/i, '.webp');
    convertedMap.set(oldPublicPath, newPublicPath);
  }

  // 4. Find all source files and update references
  console.log('\n📝 Updating source code references...\n');
  const allSourceFiles = [];
  for (const dir of SOURCE_DIRS) {
    allSourceFiles.push(...(await findFiles(dir, SOURCE_EXTENSIONS)));
  }

  // Also check root-level config files
  const rootFiles = ['next.config.ts', 'next.config.js', 'next.config.mjs'];
  for (const f of rootFiles) {
    const fullPath = path.join(ROOT, f);
    try {
      await fs.access(fullPath);
      allSourceFiles.push(fullPath);
    } catch {
      // file doesn't exist
    }
  }

  const updatedFiles = await updateReferences(allSourceFiles, convertedMap);
  console.log(`\n  Updated ${updatedFiles} source files`);

  // 5. Delete original files
  console.log('\n🗑️  Removing original files...\n');
  let deletedCount = 0;
  for (const result of results) {
    if (!result.success) continue;
    try {
      await fs.unlink(result.input);
      deletedCount++;
    } catch (err) {
      console.log(`  ⚠️  Could not delete ${path.relative(PUBLIC_DIR, result.input)}: ${err.message}`);
    }
  }
  console.log(`  Deleted ${deletedCount} original files`);

  console.log('\n✨ Done! All images converted to WebP and references updated.');
}

main().catch(console.error);
