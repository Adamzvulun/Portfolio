import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { getGallery } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Portraits — Adam Zvulun",
  description: "People and presence.",
};

export default function Page() {
  const gallery = getGallery("portraits");
  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      <Gallery photos={gallery.photos} />
    </div>
  );
}
