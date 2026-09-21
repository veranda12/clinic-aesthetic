"use client";

import { useState } from "react";
import { toParagraphs } from "@/lib/utils";

interface Item {
  id: string;
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="border-t border-line">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl md:text-2xl">
                {item.question}
              </span>
              <span
                className={`shrink-0 w-6 h-6 relative transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                <span className="absolute top-1/2 left-0 w-6 h-px bg-ink -translate-y-1/2" />
                <span className="absolute left-1/2 top-0 h-6 w-px bg-ink -translate-x-1/2" />
              </span>
            </button>
            <div
              className={`grid transition-all duration-400 ease-editorial ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="prose-body pb-7 max-w-2xl">
                  {toParagraphs(item.answer).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
