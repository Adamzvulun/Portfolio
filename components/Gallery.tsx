"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import type { Photo } from "@/lib/galleries";

type Props = {
  photos: Photo[];
  /**
   * "paired" — odd index → left column, even → right. Each row is a
   * deterministic pair. Use when you want exact side-by-side ordering.
   * "balance" — CSS columns, browser balances column heights. Pre-existing
   * behavior, better when you don't care about which photo lands next to which.
   */
  layout?: "paired" | "balance";
};

// First-viewport tiles (by global photo index, which matches DOM order in
// every layout): fetched eagerly at high priority so the first photos start
// downloading immediately instead of waiting for lazy-loading. They still
// fade in like every other tile — the eager hint only changes *when the
// bytes are requested*, not the appearance. 4 covers the top two rows of the
// desktop two-column grid and the first screen on phones. The mobile and
// desktop copies of a tile share identical src/sizes, so the browser
// coalesces them into one request even though both are eager.
const EAGER_COUNT = 4;

function Tile({
  photo,
  lightboxIndex,
  onOpen,
  extraClassName = "",
}: {
  photo: Photo;
  lightboxIndex: number;
  onOpen: (i: number) => void;
  extraClassName?: string;
}) {
  // lightboxIndex is the photo's position in the full list in every layout.
  const eager = lightboxIndex < EAGER_COUNT;
  // Every tile fades in on load — including the eager ones — for a uniform
  // look across the gallery.
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(lightboxIndex)}
      style={{ backgroundColor: photo.bgColor }}
      className={`group block w-full cursor-zoom-in overflow-hidden ${extraClassName}`}
      aria-label={`Open ${photo.alt}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 640px) 100vw, 640px"
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
        onLoad={() => setLoaded(true)}
        className={`block w-full h-auto transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.02] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}

export default function Gallery({ photos, layout = "paired" }: Props) {
  const [index, setIndex] = useState<number>(-1);

  if (photos.length === 0) {
    return (
      <p className="text-center text-sm uppercase tracking-[0.25em] text-neutral-400 py-16">
        No photos yet
      </p>
    );
  }

  const left = photos.filter((_, i) => i % 2 === 0);
  const right = photos.filter((_, i) => i % 2 === 1);

  return (
    <>
      {layout === "paired" ? (
        <>
          {/* Phones: single linear column in source order — each photo gets
              the full width and reads at proper scale. */}
          <div className="flex flex-col gap-3 sm:hidden">
            {photos.map((photo, i) => (
              <Tile key={photo.src} photo={photo} lightboxIndex={i} onOpen={setIndex} />
            ))}
          </div>
          {/* Tablet+: paired two columns (odd → left, even → right). */}
          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-6">
            <div className="flex flex-col gap-6">
              {left.map((photo, i) => (
                <Tile key={photo.src} photo={photo} lightboxIndex={i * 2} onOpen={setIndex} />
              ))}
            </div>
            <div className="flex flex-col gap-6">
              {right.map((photo, i) => (
                <Tile key={photo.src} photo={photo} lightboxIndex={i * 2 + 1} onOpen={setIndex} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="columns-1 sm:columns-2 gap-4 sm:gap-6 [column-fill:_balance]">
          {photos.map((photo, i) => (
            <Tile
              key={photo.src}
              photo={photo}
              lightboxIndex={i}
              onOpen={setIndex}
              extraClassName="mb-3 sm:mb-6 break-inside-avoid"
            />
          ))}
        </div>
      )}

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index >= 0 ? index : 0}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt, width: p.width, height: p.height }))}
        plugins={[Zoom, Counter, Fullscreen]}
        counter={{ container: { style: { top: 0, bottom: "unset" } } }}
        zoom={{ maxZoomPixelRatio: 3, doubleTapDelay: 250 }}
      />
    </>
  );
}
