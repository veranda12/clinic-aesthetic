import { prisma } from "@/lib/db";
import { ArticleForm } from "@/features/admin/ArticleForm";
import { createArticle } from "@/features/admin/articles.actions";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    prisma.articleCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.doctor.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <ArticleForm
      action={createArticle}
      categories={categories}
      authors={authors}
      heading="Artikel baru"
    />
  );
}
