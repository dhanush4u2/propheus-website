/**
 * Batch-optimize parallax hero images.
 * 
 * Problem: Original JPEGs are 1.3–8 MB each (73 MB total for 20 images).
 *          They display at max ~195px CSS width (≈585px at 3× retina).
 *          The browser must decode all that pixel data when they become visible
 *          during the canvas shrink clip-path animation → GPU stutter.
 * 
 * Solution: Resize to max 600px wide, convert to WebP quality 82.
 *           This brings the total from ~73 MB down to ~1–2 MB.
 *           Originals are backed up to public/assets/examples/originals/.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXAMPLES_DIR = path.join(__dirname, '..', 'public', 'assets', 'examples');
const ORIGINALS_DIR = path.join(EXAMPLES_DIR, 'originals');

// The 20 parallax images used in HeroExperience
const PARALLAX_IMAGES = [
    'Store .jpg',
    'telecom tower .jpg',
    'satellite imagery .jpg',
    'property.jpg',
    'mines .jpg',
    'streets.jpg',
    'village.jpg',
    'aerial view .jpg',
    'forest .jpg',
    'Road crossing.jpg',
    'Properties.jpg',
    'aerial imagery.jpg',
    'boardroom .jpg',
    'Train .jpg',
    'manufacturing.jpg',
    'transactions.jpg',
    'nasa-_SFJhRPzJHs-unsplash.jpg',
    'Delivery .jpg',
    'road .jpg',
    'warehouse .jpg',
];

// Max width at 3× retina for the largest display size (195px CSS → 585px)
const MAX_WIDTH = 600;
const WEBP_QUALITY = 82;

async function optimize() {
    // Create originals backup folder
    if (!fs.existsSync(ORIGINALS_DIR)) {
        fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
    }

    let totalOriginal = 0;
    let totalOptimized = 0;

    for (const filename of PARALLAX_IMAGES) {
        const srcPath = path.join(EXAMPLES_DIR, filename);
        if (!fs.existsSync(srcPath)) {
            console.warn(`⚠ Missing: ${filename}`);
            continue;
        }

        const originalSize = fs.statSync(srcPath).size;
        totalOriginal += originalSize;

        // Backup original
        const backupPath = path.join(ORIGINALS_DIR, filename);
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(srcPath, backupPath);
        }

        // Generate optimized WebP version (same filename but .webp)
        const baseName = path.parse(filename).name;
        const webpFilename = baseName + '.webp';
        const webpPath = path.join(EXAMPLES_DIR, webpFilename);

        await sharp(srcPath)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY })
            .toFile(webpPath);

        const newSize = fs.statSync(webpPath).size;
        totalOptimized += newSize;

        const saved = ((1 - newSize / originalSize) * 100).toFixed(1);
        console.log(`✓ ${filename} → ${webpFilename}  (${(originalSize / 1024).toFixed(0)} KB → ${(newSize / 1024).toFixed(0)} KB, -${saved}%)`);
    }

    console.log(`\n━━━ TOTAL ━━━`);
    console.log(`Original: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
    console.log(`Optimized: ${(totalOptimized / 1024 / 1024).toFixed(1)} MB`);
    console.log(`Savings: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
}

optimize().catch(console.error);
