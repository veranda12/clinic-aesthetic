"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { LightboxModal, type LightboxImage } from "./LightboxModal";

export interface FacilityItem {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  imageUrl: string;
  imageAlt: string | null;
  gallery: string[];
}

export function FacilityGrid({ facilities }: { facilities: FacilityItem[] }) {
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  function open(f: FacilityItem) {
    const imgs: LightboxImage[] = [
      { url: f.imageUrl, alt: f.imageAlt ?? f.name },
      ...f.gallery.map((url) => ({ url, alt: f.name })),
    ];
    setImages(imgs);
    setIndex(0);
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-6 md:gap-10 border-t border-line pt-12">
        {facilities.map((f, i) => {
          const wide = i % 5 === 0;
          const extra = f.gallery.length;
          return (
            <Reveal
              key={f.id}
              as="figure"
              delay={(i % 2) * 90}
              className={wide ? "sm:col-span-2" : ""}
            >
              <button
                type="button"
                onClick={() => open(f)}
                aria-label={`Lihat foto ${f.name}`}
                className={`group img-frame w-full ${
                  wide ? "aspect-[16/9]" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={f.imageUrl}
                  alt={f.imageAlt ?? f.name}
                  fill
                  sizes={wide ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
                  className="object-cover media-gallery"
                />
                <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/[0.08] transition-colors duration-[700ms] ease-editorial" />
                <span className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[0.68rem] tracking-widest uppercase bg-ivory/90 text-ink px-2.5 py-1">
                  {extra > 0 ? `${extra + 1} foto` : "Lihat"}
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </span>
              </button>
              <figcaption className="mt-5">
                {f.category && (
                  <p className="eyebrow text-taupe-light">{f.category}</p>
                )}
                <h2 className="font-display text-2xl mt-1.5">{f.name}</h2>
              </figcaption>
              {f.description && (
                <p className="prose-body text-[0.95rem] mt-3 max-w-xl">
                  {f.description}
                </p>
              )}
            </Reveal>
          );
        })}
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
