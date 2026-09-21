import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/features/admin/DeleteButton";
import {
  deleteArticle,
  toggleArticlePublished,
} from "@/features/admin/articles.actions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true, author: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display-md mt-3">Journal</h1>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          + Artikel
        </Link>
      </div>

      <div className="mt-10 border-t border-line">
        {articles.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-4 py-4 border-b border-line">
            <div className="flex-1 min-w-[200px]">
              <p className="font-display text-xl">{a.title}</p>
              <p className="text-sm text-taupe">
                {a.category?.name ?? "Tanpa kategori"}
                {a.author ? ` · ${a.author.name}` : ""}
                {a.publishedAt ? ` · ${formatDate(a.publishedAt)}` : ""}
              </p>
            </div>

            <form action={toggleArticlePublished.bind(null, a.id, !a.published)}>
              <button
                type="submit"
                className={`text-[0.72rem] tracking-widest uppercase px-3 py-1 border ${
                  a.published ? "border-success text-success" : "border-taupe text-taupe"
                }`}
              >
                {a.published ? "Published" : "Draft"}
              </button>
            </form>

            <Link href={`/admin/articles/${a.id}/edit`} className="text-[0.8rem] tracking-wide link-underline">
              Edit
            </Link>
            <DeleteButton action={deleteArticle.bind(null, a.id)} />
          </div>
        ))}
        {articles.length === 0 && <p className="prose-body py-8">Belum ada artikel.</p>}
      </div>
    </div>
  );
}
