import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { DeleteButton } from "@/features/admin/DeleteButton";
import {
  deleteTreatment,
  toggleTreatmentPublished,
} from "@/features/admin/treatments.actions";

export const dynamic = "force-dynamic";

export default async function AdminTreatmentsPage() {
  const treatments = await prisma.treatment.findMany({
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display-md mt-3">Treatments</h1>
        </div>
        <Link href="/admin/treatments/new" className="btn-primary">
          + Treatment
        </Link>
      </div>

      <div className="mt-10 border-t border-line">
        {treatments.map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-center gap-4 py-4 border-b border-line"
          >
            <div className="flex-1 min-w-[200px]">
              <p className="font-display text-xl">{t.name}</p>
              <p className="text-sm text-taupe">
                {t.category.name}
                {t.priceFrom ? ` · Mulai ${formatPrice(t.priceFrom)}` : ""}
                {t.featured ? " · Featured" : ""}
              </p>
            </div>

            <form action={toggleTreatmentPublished.bind(null, t.id, !t.published)}>
              <button
                type="submit"
                className={`text-[0.72rem] tracking-widest uppercase px-3 py-1 border ${
                  t.published
                    ? "border-success text-success"
                    : "border-taupe text-taupe"
                }`}
              >
                {t.published ? "Published" : "Draft"}
              </button>
            </form>

            <Link
              href={`/admin/treatments/${t.id}/edit`}
              className="text-[0.8rem] tracking-wide link-underline"
            >
              Edit
            </Link>
            <DeleteButton action={deleteTreatment.bind(null, t.id)} />
          </div>
        ))}

        {treatments.length === 0 && (
          <p className="prose-body py-8">Belum ada treatment.</p>
        )}
      </div>
    </div>
  );
}
