import { prisma } from "@/lib/db";
import { FaqForm } from "@/features/admin/FaqForm";
import { createFaq } from "@/features/admin/faqs.actions";

export const dynamic = "force-dynamic";

export default async function NewFaqPage() {
  const treatments = await prisma.treatment.findMany({ orderBy: { name: "asc" } });
  return <FaqForm action={createFaq} treatments={treatments} heading="FAQ baru" />;
}
