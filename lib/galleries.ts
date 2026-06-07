export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Gallery = {
  slug: "automotive" | "architecture" | "portraits" | "wildlife";
  title: string;
  description: string;
  photos: Photo[];
};

/**
 * HOW TO ADD A PHOTO
 * ------------------
 * 1. Drop the image file into public/images/<category>/  (e.g. public/images/portraits/dana.jpg)
 * 2. Add an entry to the matching photos array below. Example:
 *
 *      {
 *        src: "/images/portraits/dana.jpg",
 *        alt: "Dana at golden hour",
 *        width: 1600,   // real width of the photo in pixels (or any pair with the correct aspect ratio)
 *        height: 1067,  // real height of the photo in pixels
 *      }
 *
 *    `src` always starts with `/images/...` (the `public/` part is stripped automatically).
 *    `width` and `height` only need to match the photo's aspect ratio so the grid lays out correctly.
 *
 * The home page reads from `featured` (so put your best 6–9 there).
 */

export const galleries: Gallery[] = [
  {
    slug: "automotive",
    title: "Automotive",
    description: "Cars, motion, and machined light.",
    photos: [],
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "Lines, structure, and built space.",
    photos: [],
  },
  {
    slug: "portraits",
    title: "Portraits",
    description: "People and presence.",
    photos: [],
  },
  {
    slug: "wildlife",
    title: "Wildlife",
    description: "The natural world, observed quietly.",
    photos: [],
  },
];

export const featured: Photo[] = [];

export function getGallery(slug: Gallery["slug"]) {
  const g = galleries.find((g) => g.slug === slug);
  if (!g) throw new Error(`Gallery not found: ${slug}`);
  return g;
}
