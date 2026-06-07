"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { Photo } from "@/lib/galleries";

type Props = {
  photos: Photo[];
};

export default function Gallery({ photos }: Props) {
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

  const renderTile = (photo: Photo, lightboxIndex: number) => (
    <button
      key={photo.src}
      type="button"
      onClick={() => setIndex(lightboxIndex)}
      className="group block w-full cursor-zoom-in overflow-hidden bg-neutral-100"
      aria-label={`Open ${photo.alt}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 768px) 50vw, 640px"
        className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </button>
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          {left.map((photo, i) => renderTile(photo, i * 2))}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6">
          {right.map((photo, i) => renderTile(photo, i * 2 + 1))}
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index >= 0 ? index : 0}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt, width: p.width, height: p.height }))}
      />
    </>
  );
}
