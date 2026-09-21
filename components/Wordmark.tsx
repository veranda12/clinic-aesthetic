import Link from "next/link";
import { site } from "@/lib/site";

export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "ivory";
}) {
  const color = tone === "ivory" ? "text-ivory" : "text-ink";
  return (
    <Link
      href="/"
      aria-label={`${site.fullName} — beranda`}
      className={`group inline-flex flex-col leading-none ${color} ${className ?? ""}`}
    >
      <span className="font-display text-[1.55rem] tracking-[0.18em] font-medium">
        {site.wordmarkTop}
      </span>
      <span className="font-sans text-[0.58rem] tracking-[0.42em] uppercase mt-1 opacity-70">
        {site.wordmarkBottom}
      </span>
    </Link>
  );
}
