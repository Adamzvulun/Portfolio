#!/usr/bin/env node
/**
 * Batch-resize originals from raw-photos/<category>/ into
 * public/images/<category>/. Skips files whose output is already up-to-date.
 *
 *   npm run resize
 *
 * Tweak MAX_EDGE / QUALITY below if you want different output sizes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_ROOT = path.join(ROOT, "raw-photos");
const DST_ROOT = path.join(ROOT, "public", "images");

const CATEGORIES = ["home", "architecture", "portraits", "wildlife"];
const MAX_EDGE = 2400; // px on the long edge
const QUALITY = 82; // JPEG quality 0-100; 82 is the sweet spot
const INPUT_RE = /\.(jpe?g|png|tiff?|webp|heic|heif|avif)$/i;

function bytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

async function processFile(srcPath, dstPath) {
  const srcStat = fs.statSync(srcPath);
  if (fs.existsSync(dstPath)) {
    const dstStat = fs.statSync(dstPath);
    if (dstStat.mtimeMs >= srcStat.mtimeMs) {
      return { skipped: true, src: srcStat.size, dst: dstStat.size };
    }
  }

  await sharp(srcPath)
    .rotate() // honor EXIF orientation
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(dstPath);

  const dstSize = fs.statSync(dstPath).size;
  return { skipped: false, src: srcStat.size, dst: dstSize };
}

async function run() {
  if (!fs.existsSync(SRC_ROOT)) {
    console.log(`Creating ${path.relative(ROOT, SRC_ROOT)}/ and per-category folders.`);
    fs.mkdirSync(SRC_ROOT, { recursive: true });
    for (const c of CATEGORIES) fs.mkdirSync(path.join(SRC_ROOT, c), { recursive: true });
    console.log(
      `Done. Drop your original photos into raw-photos/<category>/ and run \`npm run resize\` again.`,
    );
    return;
  }

  let total = 0;
  let processed = 0;
  let skipped = 0;
  let srcBytes = 0;
  let dstBytes = 0;

  for (const cat of CATEGORIES) {
    const srcDir = path.join(SRC_ROOT, cat);
    const dstDir = path.join(DST_ROOT, cat);
    if (!fs.existsSync(srcDir)) continue;
    fs.mkdirSync(dstDir, { recursive: true });

    const files = fs.readdirSync(srcDir).filter((f) => INPUT_RE.test(f));
    if (files.length === 0) continue;

    console.log(`\n[${cat}] ${files.length} file(s)`);
    for (const file of files) {
      total++;
      const srcPath = path.join(srcDir, file);
      // Always output as .jpg regardless of input extension (uniform, smaller)
      const baseName = file.replace(/\.[^.]+$/, "");
      const dstPath = path.join(dstDir, `${baseName}.jpg`);

      try {
        const r = await processFile(srcPath, dstPath);
        srcBytes += r.src;
        dstBytes += r.dst;
        if (r.skipped) {
          skipped++;
          console.log(`  ⤳ skip  ${file}  (already up to date)`);
        } else {
          processed++;
          console.log(`  ✓ ${file}  ${bytes(r.src)} → ${bytes(r.dst)}`);
        }
      } catch (err) {
        console.error(`  ✗ ${file}  — ${err.message}`);
      }
    }
  }

  console.log(
    `\nDone. ${processed} processed, ${skipped} skipped, ${total - processed - skipped} failed.`,
  );
  if (srcBytes > 0) {
    console.log(`Total: ${bytes(srcBytes)} → ${bytes(dstBytes)}  (${((1 - dstBytes / srcBytes) * 100).toFixed(0)}% smaller)`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
