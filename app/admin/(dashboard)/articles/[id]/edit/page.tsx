import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArticleForm } from "@/features/admin/ArticleForm";
import { updateArticle } from "@/features/admin/articles.actions";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const [article, categories, authors] = await Promise.all([
    prisma.article.findUnique({ where: { id: params.id } }),
    prisma.articleCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.doctor.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!article) notFound();

  return (
    <ArticleForm
      action={updateArticle.bind(null, article.id)}
      categories={categories}
      authors={authors}
      heading="Edit artikel"
      defaults={article}
    />
  );
}
