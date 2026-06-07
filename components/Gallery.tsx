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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-[3/2] overflow-hidden bg-neutral-100 cursor-zoom-in"
            aria-label={`Open ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
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
