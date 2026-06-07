import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { getGallery } from "@/lib/galleries";

const gallery = getGallery("automotive");

export const metadata: Metadata = {
  title: `${gallery.title} — Adam Zvulun`,
  description: gallery.description,
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-12">
      <Gallery photos={gallery.photos} />
    </div>
  );
}
