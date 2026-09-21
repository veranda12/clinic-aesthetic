import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/features/admin/DeleteButton";
import { deleteFaq } from "@/features/admin/faqs.actions";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ group: "asc" }, { order: "asc" }],
    include: { treatment: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display-md mt-3">FAQ</h1>
        </div>
        <Link href="/admin/faqs/new" className="btn-primary">
          + FAQ
        </Link>
      </div>

      <div className="mt-10 border-t border-line">
        {faqs.map((f) => (
          <div key={f.id} className="flex flex-wrap items-center gap-4 py-4 border-b border-line">
            <div className="flex-1 min-w-[220px]">
              <p className="font-display text-lg">{f.question}</p>
              <p className="text-sm text-taupe">
                {f.group}
                {f.treatment ? ` · ${f.treatment.name}` : ""}
              </p>
            </div>
            <span className={`text-[0.72rem] tracking-widest uppercase ${f.published ? "text-success" : "text-taupe"}`}>
              {f.published ? "Published" : "Draft"}
            </span>
            <Link href={`/admin/faqs/${f.id}/edit`} className="text-[0.8rem] tracking-wide link-underline">
              Edit
            </Link>
            <DeleteButton action={deleteFaq.bind(null, f.id)} />
          </div>
        ))}
        {faqs.length === 0 && <p className="prose-body py-8">Belum ada FAQ.</p>}
      </div>
    </div>
  );
}
