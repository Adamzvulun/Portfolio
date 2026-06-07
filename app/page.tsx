import Gallery from "@/components/Gallery";
import { getFeatured } from "@/lib/galleries";

export default async function Home() {
  const photos = await getFeatured();
  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 pb-16">
      <Gallery photos={photos} />
    </div>
  );
}
