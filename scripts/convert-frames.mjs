/**
 * Converts 199 PNG frames from asset/SequenceAbout to webp
 * in public/assets/sequences/about/
 *
 * Usage: node scripts/convert-frames.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SRC_DIR = join(root, 'asset', 'SequenceAbout');
const OUT_DIR = join(root, 'public', 'assets', 'sequences', 'about');
const FRAME_COUNT = 199;
const PAD = 3;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (let i = 1; i <= FRAME_COUNT; i++) {
    const padded = String(i).padStart(PAD, '0');
    const src = join(SRC_DIR, `ezgif-frame-${padded}.png`);
    const dest = join(OUT_DIR, `frame-${padded}.webp`);

    try {
      await sharp(src)
        .webp({ quality: 80 })
        .resize({ width: 1920, withoutEnlargement: true })
        .toFile(dest);
      console.log(`[${i}/${FRAME_COUNT}] ${dest}`);
    } catch (err) {
      console.error(`[${i}/${FRAME_COUNT}] FAILED: ${src} — ${err.message}`);
    }
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
