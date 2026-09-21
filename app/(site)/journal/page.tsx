import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ArticleCard } from "@/components/ArticleCard";
import { Reveal } from "@/components/Reveal";
import { getPublishedArticles } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Catatan tentang kulit dari tim dokter AURELIA — skincare, treatment, dan age management. Ditulis untuk membantu Anda memahami kulit dengan lebih baik.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const articles = await getPublishedArticles();
  const [feature, ...rest] = articles;

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Catatan tentang kulit."
        intro="Artikel yang ditulis oleh tim dokter kami — untuk membantu Anda memahami kulit dengan lebih tenang, tanpa mitos dan janji berlebihan."
      />

      <div className="shell pb-28">
        {feature && (
          <Reveal className="border-t border-line pt-12 mb-20">
            <ArticleCard article={feature} size="feature" />
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-16 border-t border-line pt-16">
            {rest.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 90}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        )}

        {articles.length === 0 && (
          <p className="prose-body border-t border-line pt-12">
            Belum ada artikel yang dipublikasikan.
          </p>
        )}
      </div>
    </>
  );
}
