"use client";

import { useState } from "react";
import Image from "next/image";
import { LightboxModal, type LightboxImage } from "./LightboxModal";

// Thumbnail grid that opens a shared lightbox. Used for treatment galleries.
export function GalleryGrid({ images }: { images: LightboxImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {images.map((img, i) => (
          <button
            key={`${img.url}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className="img-frame aspect-[4/3] group"
            aria-label={`Buka foto ${i + 1}`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover media-gallery"
            />
          </button>
        ))}
      </div>

      <LightboxModal
        images={images}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </>
  );
}
