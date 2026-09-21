import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/features/admin/DeleteButton";
import { deleteTestimonial } from "@/features/admin/testimonials.actions";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display-md mt-3">Testimonials</h1>
        </div>
        <Link href="/admin/testimonials/new" className="btn-primary">
          + Testimonial
        </Link>
      </div>

      <div className="mt-10 border-t border-line">
        {testimonials.map((t) => (
          <div key={t.id} className="flex flex-wrap items-start gap-4 py-4 border-b border-line">
            <div className="flex-1 min-w-[220px]">
              <p className="font-display text-lg">{t.author}</p>
              {t.context && <p className="text-sm text-taupe">{t.context}</p>}
              <p className="prose-body text-sm mt-2 line-clamp-2 max-w-xl">“{t.quote}”</p>
            </div>
            <span className={`text-[0.72rem] tracking-widest uppercase ${t.published ? "text-success" : "text-taupe"}`}>
              {t.published ? "Published" : "Draft"}
            </span>
            <Link href={`/admin/testimonials/${t.id}/edit`} className="text-[0.8rem] tracking-wide link-underline">
              Edit
            </Link>
            <DeleteButton action={deleteTestimonial.bind(null, t.id)} />
          </div>
        ))}
        {testimonials.length === 0 && <p className="prose-body py-8">Belum ada testimonial.</p>}
      </div>
    </div>
  );
}
