import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { getGallery } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Automotive — Adam Zvulun",
  description: "Cars, motion, and machined light.",
};

export default function Page() {
  const gallery = getGallery("automotive");
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16">
      <Gallery photos={gallery.photos} />
    </div>
  );
}
