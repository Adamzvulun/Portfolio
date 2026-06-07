import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { getGallery } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Wildlife — Adam Zvulun",
  description: "The natural world, observed quietly.",
};

export default async function Page() {
  const gallery = await getGallery("wildlife");
  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 pb-16">
      <Gallery photos={gallery.photos} layout="balance" />
    </div>
  );
}
