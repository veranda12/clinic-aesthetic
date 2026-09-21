import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { TreatmentForm } from "@/features/admin/TreatmentForm";
import { updateTreatment } from "@/features/admin/treatments.actions";

export const dynamic = "force-dynamic";

export default async function EditTreatmentPage({
  params,
}: {
  params: { id: string };
}) {
  const [treatment, categories] = await Promise.all([
    prisma.treatment.findUnique({ where: { id: params.id } }),
    prisma.treatmentCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!treatment) notFound();

  return (
    <TreatmentForm
      action={updateTreatment.bind(null, treatment.id)}
      categories={categories}
      heading="Edit treatment"
      defaults={treatment}
    />
  );
}
