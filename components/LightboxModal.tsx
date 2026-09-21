"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export interface LightboxImage {
  url: string;
  alt: string;
}

// Fullscreen image viewer. Rendered by GalleryGrid / FacilityGrid; controlled
// via `index` (null = closed). Keyboard: Esc closes, arrows navigate.
export function LightboxModal({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index! + 1) % images.length);
      if (e.key === "ArrowLeft")
        onNavigate((index! - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, images.length, onClose, onNavigate]);

  if (!mounted || !open) return null;

  const current = images[index!];
  const many = images.length > 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] bg-ink/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Galeri foto"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 h-[74px] shrink-0 text-ivory/80">
        <span className="text-sm tracking-widest">
          {String(index! + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup galeri"
          className="w-9 h-9 flex items-center justify-center hover:text-ivory"
        >
          <span className="relative block w-6 h-6" aria-hidden>
            <span className="absolute top-1/2 left-0 w-6 h-px bg-current -translate-y-1/2 rotate-45" />
            <span className="absolute top-1/2 left-0 w-6 h-px bg-current -translate-y-1/2 -rotate-45" />
          </span>
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex-1 min-h-0" onClick={onClose}>
        <div
          className="absolute inset-0 m-auto"
          style={{ padding: "clamp(1rem, 4vw, 4rem)" }}
        >
          <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              key={current.url}
              src={current.url}
              alt={current.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((index! - 1 + images.length) % images.length);
              }}
              aria-label="Sebelumnya"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-ivory/70 hover:text-ivory text-2xl"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((index! + 1) % images.length);
              }}
              aria-label="Berikutnya"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-ivory/70 hover:text-ivory text-2xl"
            >
              ›
            </button>
          </>
        )}
      </div>

      {current.alt && (
        <p className="text-center text-ivory/60 text-sm px-6 pb-6 pt-2 shrink-0">
          {current.alt}
        </p>
      )}
    </div>,
    document.body
  );
}
