import Gallery from "@/components/Gallery";
import { getFeatured } from "@/lib/galleries";

export default function Home() {
  const photos = getFeatured();
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16">
      <Gallery photos={photos} />
    </div>
  );
}
