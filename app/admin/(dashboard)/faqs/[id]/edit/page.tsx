import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FaqForm } from "@/features/admin/FaqForm";
import { updateFaq } from "@/features/admin/faqs.actions";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({
  params,
}: {
  params: { id: string };
}) {
  const [faq, treatments] = await Promise.all([
    prisma.faq.findUnique({ where: { id: params.id } }),
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!faq) notFound();

  return (
    <FaqForm
      action={updateFaq.bind(null, faq.id)}
      treatments={treatments}
      heading="Edit FAQ"
      defaults={faq}
    />
  );
}
