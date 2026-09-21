"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminNav, site } from "@/lib/site";

export function AdminSidebar({
  userName,
  logout,
}: {
  userName: string;
  logout: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="lg:h-screen lg:sticky lg:top-0 bg-ink text-ivory flex flex-col">
      <div className="flex items-center justify-between px-6 py-6 border-b border-ivory/10">
        <Link href="/admin" className="leading-none">
          <span className="font-display text-xl tracking-[0.16em]">
            {site.wordmarkTop}
          </span>
          <span className="block text-[0.52rem] tracking-[0.4em] uppercase mt-1 opacity-60">
            Admin
          </span>
        </Link>
        <button
          type="button"
          className="lg:hidden text-sm tracking-widest uppercase"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <nav
        className={`${
          open ? "block" : "hidden"
        } lg:block flex-1 px-3 py-5 space-y-1`}
      >
        {adminNav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-[0.9rem] tracking-wide rounded-xs transition-colors ${
                active
                  ? "bg-ivory/10 text-ivory"
                  : "text-ivory/60 hover:text-ivory hover:bg-ivory/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        className={`${
          open ? "block" : "hidden"
        } lg:block px-6 py-6 border-t border-ivory/10`}
      >
        <p className="text-[0.8rem] text-ivory/60">Masuk sebagai</p>
        <p className="text-sm mt-1">{userName}</p>
        <div className="mt-4 flex flex-col gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-[0.8rem] tracking-wide text-ivory/60 hover:text-ivory"
          >
            ↗ Lihat website
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-[0.8rem] tracking-wide text-ivory/60 hover:text-ivory"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
