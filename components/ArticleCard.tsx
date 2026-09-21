import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface ArticleCardData {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string | null;
  readMinutes: number;
  publishedAt: Date | null;
  category: { name: string } | null;
}

// Magazine-style entry — no boxed card, just image + hairline + type.
export function ArticleCard({
  article,
  size = "default",
}: {
  article: ArticleCardData;
  size?: "default" | "feature";
}) {
  const feature = size === "feature";
  return (
    <article className="group">
      <Link href={`/journal/${article.slug}`} className="block">
        <div
          className={`img-frame ${
            feature ? "aspect-[16/10]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={article.imageUrl}
            alt={article.imageAlt ?? article.title}
            fill
            sizes={feature ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover media-journal"
          />
        </div>
        <div className="mt-6 flex items-center gap-3 text-eyebrow text-taupe">
          {article.category && <span>{article.category.name}</span>}
          <span className="w-6 h-px bg-line" />
          <span>{article.readMinutes} min baca</span>
          <span
            aria-hidden
            className="ml-auto text-base leading-none text-ink translate-x-0 opacity-50 transition-all duration-[600ms] ease-editorial group-hover:translate-x-2.5 group-hover:opacity-100"
          >
            →
          </span>
        </div>
        <h3
          className={`font-display mt-3 leading-tight ${
            feature ? "text-3xl md:text-4xl" : "text-2xl"
          }`}
        >
          <span className="reveal-underline">{article.title}</span>
        </h3>
        <p className="prose-body mt-3 text-[0.95rem] line-clamp-2 max-w-xl">
          {article.excerpt}
        </p>
        {article.publishedAt && (
          <p className="mt-4 text-sm text-taupe">
            {formatDate(article.publishedAt)}
          </p>
        )}
      </Link>
    </article>
  );
}
