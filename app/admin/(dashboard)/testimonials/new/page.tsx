import { prisma } from "@/lib/db";
import { TestimonialForm } from "@/features/admin/TestimonialForm";
import { createTestimonial } from "@/features/admin/testimonials.actions";

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  const treatments = await prisma.treatment.findMany({ orderBy: { name: "asc" } });
  return (
    <TestimonialForm
      action={createTestimonial}
      treatments={treatments}
      heading="Testimonial baru"
    />
  );
}
