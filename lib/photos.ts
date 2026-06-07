import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Scan public/images/<category>/ and return every image file as a Photo,
 * sorted alphabetically by filename. To control display order, prefix
 * filenames (e.g. "01-..., 02-..., 03-...").
 *
 * Runs on the server (build-time for production, per-request in dev so
 * newly dropped files appear without restarting the dev server).
 */
export function loadPhotos(category: string): Photo[] {
  const dir = path.join(process.cwd(), "public", "images", category);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => IMAGE_RE.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files.map((file) => {
    const buf = fs.readFileSync(path.join(dir, file));
    const dims = imageSize(buf);
    let width = dims.width ?? 1600;
    let height = dims.height ?? 1067;
    // EXIF orientations 5-8 are rotated 90/270 degrees, so the displayed
    // width/height are swapped from the stored width/height. Browsers
    // handle the actual rotation; we just need to report the right ratio.
    if (dims.orientation && dims.orientation >= 5 && dims.orientation <= 8) {
      [width, height] = [height, width];
    }

    const alt = file
      .replace(/\.[^.]+$/, "")
      .replace(/^\d+[-_]?/, "")
      .replace(/[-_]+/g, " ")
      .trim() || file;

    return {
      src: `/images/${category}/${file}`,
      alt,
      width,
      height,
    };
  });
}
