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

export async function getGallery(slug: GallerySlug): Promise<Gallery> {
  return { ...meta[slug], photos: await loadPhotos(slug) };
}

export async function getFeatured(): Promise<Photo[]> {
  return loadPhotos("home");
}
