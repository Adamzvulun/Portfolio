import { loadPhotos, type Photo } from "./photos";

export type { Photo };

export type GallerySlug = "architecture" | "portraits" | "wildlife";

export type Gallery = {
  slug: GallerySlug;
  title: string;
  description: string;
  photos: Photo[];
};

const meta: Record<GallerySlug, Omit<Gallery, "photos">> = {
  architecture: {
    slug: "architecture",
    title: "Architecture",
    description: "Lines, structure, and built space.",
  },
  portraits: {
    slug: "portraits",
    title: "Portraits",
    description: "People and presence.",
  },
  wildlife: {
    slug: "wildlife",
    title: "Wildlife",
    description: "The natural world, observed quietly.",
  },
};

export function getGallery(slug: GallerySlug): Gallery {
  return { ...meta[slug], photos: loadPhotos(slug) };
}

export function getFeatured(): Photo[] {
  return loadPhotos("home");
}
