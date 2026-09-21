import { prisma } from "@/lib/db";
import { TreatmentForm } from "@/features/admin/TreatmentForm";
import { createTreatment } from "@/features/admin/treatments.actions";

export const dynamic = "force-dynamic";

export default async function NewTreatmentPage() {
  const categories = await prisma.treatmentCategory.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <TreatmentForm
      action={createTreatment}
      categories={categories}
      heading="Treatment baru"
    />
  );
}
