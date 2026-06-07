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

const placeholder = (category: string, n: number, w = 1600, h = 1067): Photo => ({
  src: `/images/${category}/placeholder-${n}.svg`,
  alt: `${category} photo ${n}`,
  width: w,
  height: h,
});

export const galleries: Gallery[] = [
  {
    slug: "automotive",
    title: "Automotive",
    description: "Cars, motion, and machined light.",
    photos: [1, 2, 3, 4, 5, 6].map((n) => placeholder("automotive", n)),
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "Lines, structure, and built space.",
    photos: [1, 2, 3, 4, 5, 6].map((n) => placeholder("architecture", n)),
  },
  {
    slug: "portraits",
    title: "Portraits",
    description: "People and presence.",
    photos: [1, 2, 3, 4, 5, 6].map((n) => placeholder("portraits", n, 1067, 1600)),
  },
  {
    slug: "wildlife",
    title: "Wildlife",
    description: "The natural world, observed quietly.",
    photos: [1, 2, 3, 4, 5, 6].map((n) => placeholder("wildlife", n)),
  },
];

export const featured: Photo[] = [
  { src: "/images/home/featured-1.svg", alt: "Featured photograph 1", width: 1600, height: 1067 },
  { src: "/images/home/featured-2.svg", alt: "Featured photograph 2", width: 1067, height: 1600 },
  { src: "/images/home/featured-3.svg", alt: "Featured photograph 3", width: 1600, height: 1067 },
  { src: "/images/home/featured-4.svg", alt: "Featured photograph 4", width: 1600, height: 1067 },
  { src: "/images/home/featured-5.svg", alt: "Featured photograph 5", width: 1067, height: 1600 },
  { src: "/images/home/featured-6.svg", alt: "Featured photograph 6", width: 1600, height: 1067 },
];

export function getGallery(slug: Gallery["slug"]) {
  const g = galleries.find((g) => g.slug === slug);
  if (!g) throw new Error(`Gallery not found: ${slug}`);
  return g;
}
