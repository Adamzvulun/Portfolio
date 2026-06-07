import Gallery from "@/components/Gallery";
import { getFeatured } from "@/lib/galleries";

export default function Home() {
  const photos = getFeatured();
  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      <Gallery photos={photos} />
    </div>
  );
}
