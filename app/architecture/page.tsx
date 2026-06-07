import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { getGallery } from "@/lib/galleries";

const gallery = getGallery("architecture");

export const metadata: Metadata = {
  title: `${gallery.title} — Adam Zvulun`,
  description: gallery.description,
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider">{gallery.title}</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-neutral-500">
          {gallery.description}
        </p>
      </header>
      <Gallery photos={gallery.photos} />
    </div>
  );
}
