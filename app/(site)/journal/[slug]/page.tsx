import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ArticleCard } from "@/components/ArticleCard";
import { StructuredData } from "@/components/StructuredData";
import { formatDate, toParagraphs } from "@/lib/utils";
import { site } from "@/lib/site";
import {
  getArticleBySlug,
  getRelatedArticles,
  getArticleSlugs,
} from "@/lib/queries";

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Artikel tidak ditemukan" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
      publishedTime: article.publishedAt?.toISOString(),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.categoryId, article.id, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    datePublished: article.publishedAt?.toISOString(),
    author: article.author
      ? { "@type": "Person", name: article.author.name }
      : { "@type": "Organization", name: site.fullName },
    publisher: { "@type": "Organization", name: site.fullName },
  };

  return (
    <>
      <StructuredData data={jsonLd} />

      <article>
        {/* Header */}
        <header className="shell pt-[128px] md:pt-[160px] text-center max-w-3xl mx-auto">
          <Reveal>
            <div className="flex items-center justify-center gap-3 text-eyebrow text-taupe">
              {article.category && <span>{article.category.name}</span>}
              <span className="w-6 h-px bg-line" />
              <span>{article.readMinutes} min baca</span>
            </div>
            <h1 className="display-lg mt-6">{article.title}</h1>
            <p className="lead mt-6">{article.excerpt}</p>
            <div className="mt-8 text-sm text-taupe">
              {article.author && <span>{article.author.name}</span>}
              {article.publishedAt && (
                <span> · {formatDate(article.publishedAt)}</span>
              )}
            </div>
          </Reveal>
        </header>

        {/* Cover */}
        <div className="shell mt-14">
          <Reveal className="img-frame aspect-[16/9]">
            <Image
              src={article.imageUrl}
              alt={article.imageAlt ?? article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover media-cinematic"
            />
          </Reveal>
        </div>

        {/* Body */}
        <div className="shell py-20 md:py-28">
          <div className="max-w-prose2 mx-auto prose-body text-[1.08rem]">
            {toParagraphs(article.body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {article.author && (
            <div className="max-w-prose2 mx-auto mt-16 pt-8 border-t border-line">
              <p className="eyebrow text-taupe-light">Ditulis oleh</p>
              <p className="font-display text-2xl mt-3">{article.author.name}</p>
              <p className="text-sm text-taupe mt-1">{article.author.title}</p>
            </div>
          )}
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Baca juga</p>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-10 md:gap-8 mt-10">
              {related.map((a, i) => (
                <Reveal key={a.id} delay={i * 90}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="shell py-20 text-center">
        <Link href="/journal" className="link-underline text-sm tracking-[0.12em] uppercase">
          ← Kembali ke Journal
        </Link>
      </section>
    </>
  );
}
