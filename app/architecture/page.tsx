import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { getGallery } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Architecture — Adam Zvulun",
  description: "Lines, structure, and built space.",
};

export default async function Page() {
  const gallery = await getGallery("architecture");
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16">
      <Gallery photos={gallery.photos} layout="balance" />
    </div>
  );
}
