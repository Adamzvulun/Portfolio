"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
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
        sizes="(max-width: 768px) 50vw, 640px"
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
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            {left.map((photo, i) => (
              <Tile key={photo.src} photo={photo} lightboxIndex={i * 2} onOpen={setIndex} />
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:gap-6">
            {right.map((photo, i) => (
              <Tile key={photo.src} photo={photo} lightboxIndex={i * 2 + 1} onOpen={setIndex} />
            ))}
          </div>
        </div>
      ) : (
        <div className="columns-2 gap-4 sm:gap-6 [column-fill:_balance]">
          {photos.map((photo, i) => (
            <Tile
              key={photo.src}
              photo={photo}
              lightboxIndex={i}
              onOpen={setIndex}
              extraClassName="mb-4 sm:mb-6 break-inside-avoid"
            />
          ))}
        </div>
      )}

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index >= 0 ? index : 0}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt, width: p.width, height: p.height }))}
      />
    </>
  );
}
