import Gallery from "@/components/Gallery";
import { featured } from "@/lib/galleries";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12 text-center">
        <h1 className="font-serif text-5xl sm:text-6xl tracking-tight text-neutral-900">
          Adam Zvulun
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
          Selected Work
        </p>
      </section>
      <Gallery photos={featured} />
    </div>
  );
}
