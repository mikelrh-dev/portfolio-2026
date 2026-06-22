// One-shot conversion: PNG sequence -> WebP (q80) at 1280px max width.
// Output goes to public/firstAnim/webp/ — does NOT touch the originals.
//
// Usage:  node scripts/convert-frames.mjs
//
// Safe to delete the script after the conversion is done.

import sharp from 'sharp';
import { readdir, mkdir, stat, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const SRC_DIR = resolve('public/firstAnim');
const OUT_DIR = resolve('public/firstAnim/webp');
const MAX_WIDTH = 1280;
const QUALITY = 80;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SRC_DIR))
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .sort();

  console.log(`Found ${files.length} PNG frames in ${SRC_DIR}`);
  console.log(`Converting to WebP q${QUALITY}, max width ${MAX_WIDTH}px -> ${OUT_DIR}`);

  let totalIn = 0;
  let totalOut = 0;
  const t0 = Date.now();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inPath = join(SRC_DIR, file);
    const outPath = join(OUT_DIR, file.replace(/\.png$/i, '.webp'));

    const inStat = await stat(inPath);
    totalIn += inStat.size;

    await sharp(inPath)
      .rotate() // honor EXIF orientation if any
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 4, smartSubsample: true })
      .toFile(outPath);

    const outStat = await stat(outPath);
    totalOut += outStat.size;

    if ((i + 1) % 20 === 0 || i === files.length - 1) {
      const pct = (((i + 1) / files.length) * 100).toFixed(1);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      const speed = (i + 1) / (Number(elapsed) || 1);
      console.log(
        `  [${pct}%] ${i + 1}/${files.length}  ` +
          `${(inStat.size / 1024).toFixed(0)}KB -> ${(outStat.size / 1024).toFixed(0)}KB  ` +
          `(${speed.toFixed(1)} frames/s)`,
      );
    }
  }

  const inMB = (totalIn / 1024 / 1024).toFixed(2);
  const outMB = (totalOut / 1024 / 1024).toFixed(2);
  const ratio = ((1 - totalOut / totalIn) * 100).toFixed(1);
  console.log('');
  console.log('--- DONE ---');
  console.log(`Input  : ${inMB} MB`);
  console.log(`Output : ${outMB} MB`);
  console.log(`Saved  : ${ratio}%`);
  console.log(`Time   : ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
