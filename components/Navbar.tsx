"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { mainNav, site } from "@/lib/site";
import { Wordmark } from "./Wordmark";

export function Navbar({ overlay }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const overlayActive = overlay ?? pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const transparent = overlayActive && !scrolled && !open;
  const tone = transparent ? "ivory" : "ink";

  const mobileMenu = (
    <div
      className={[
        "lg:hidden fixed inset-0 z-[60] bg-ivory flex flex-col transition-opacity duration-300 ease-editorial",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Overlay's own top bar (covers the page bar underneath) */}
      <div className="shell flex items-center justify-between h-[74px] shrink-0 border-b border-line">
        <Wordmark tone="ink" />
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
          className="flex items-center justify-center w-9 h-9"
        >
          <span className="relative block w-6 h-6" aria-hidden>
            <span className="absolute top-1/2 left-0 w-6 h-px bg-ink -translate-y-1/2 rotate-45" />
            <span className="absolute top-1/2 left-0 w-6 h-px bg-ink -translate-y-1/2 -rotate-45" />
          </span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="shell flex-1 overflow-y-auto py-6">
        <nav className="flex flex-col">
          {mainNav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              className="group flex items-baseline justify-between border-b border-line py-4"
            >
              <span className="font-display text-[1.7rem] leading-none">
                {item.label}
              </span>
              <span className="eyebrow text-taupe-light">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-8 pb-4">
          <Link
            href="/contact#book"
            tabIndex={open ? 0 : -1}
            className="btn-primary w-full"
          >
            Book Consultation
          </Link>
          <p className="mt-6 text-sm text-taupe">
            {site.city} · {site.tagline}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        transparent
          ? "bg-transparent"
          : "bg-paper/92 backdrop-blur-[6px] border-b border-line",
      ].join(" ")}
    >
      <div className="shell flex items-center justify-between h-[74px]">
        <Wordmark tone={tone} />

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "link-underline text-[0.8rem] tracking-[0.06em] transition-opacity whitespace-nowrap",
                  tone === "ivory" ? "text-ivory" : "text-ink",
                  active ? "opacity-100" : "opacity-75 hover:opacity-100",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contact#book"
            className={
              transparent
                ? "btn border border-ivory text-ivory hover:bg-ivory hover:text-ink"
                : "btn-primary"
            }
          >
            Book Consultation
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex flex-col justify-center gap-[6px] w-9 h-9"
        >
          <span
            className={[
              "block h-px w-7 transition-all duration-300",
              tone === "ivory" ? "bg-ivory" : "bg-ink",
              open ? "translate-y-[3.5px] rotate-45" : "",
            ].join(" ")}
          />
          <span
            className={[
              "block h-px w-7 transition-all duration-300",
              tone === "ivory" ? "bg-ivory" : "bg-ink",
              open ? "-translate-y-[3.5px] -rotate-45" : "",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Mobile menu rendered via portal so it's never affected by
          header's backdrop-blur / any future transform on an ancestor. */}
      {mounted && createPortal(mobileMenu, document.body)}
    </header>
  );
}