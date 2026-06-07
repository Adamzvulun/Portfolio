import Gallery from "@/components/Gallery";
import { featured } from "@/lib/galleries";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-12">
      <Gallery photos={featured} />
    </div>
  );
}
