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

  return (
    <>
      <div className="columns-2 gap-4 sm:gap-6 [column-fill:_balance]">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setIndex(i)}
            className="group block w-full mb-4 sm:mb-6 break-inside-avoid cursor-zoom-in overflow-hidden bg-neutral-100"
            aria-label={`Open ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 768px) 50vw, 576px"
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>
        ))}
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
