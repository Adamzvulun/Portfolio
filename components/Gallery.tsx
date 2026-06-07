"use client";

import NextImage from "next/image";
import { useState } from "react";
import { RowsPhotoAlbum, type RenderImageContext, type RenderImageProps } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { Photo } from "@/lib/galleries";

type Props = {
  photos: Photo[];
};

function renderNextImage(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext,
) {
  return (
    <div style={{ width: "100%", position: "relative", aspectRatio: `${width} / ${height}` }}>
      <NextImage
        fill
        src={photo.src}
        alt={alt}
        title={title}
        sizes={sizes}
        placeholder="empty"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

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
      <RowsPhotoAlbum
        photos={photos}
        targetRowHeight={420}
        rowConstraints={{ singleRowMaxHeight: 600 }}
        spacing={12}
        onClick={({ index: i }) => setIndex(i)}
        render={{ image: renderNextImage }}
        sizes={{
          size: "1280px",
          sizes: [{ viewport: "(max-width: 1280px)", size: "100vw" }],
        }}
      />

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index >= 0 ? index : 0}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt, width: p.width, height: p.height }))}
      />
    </>
  );
}
