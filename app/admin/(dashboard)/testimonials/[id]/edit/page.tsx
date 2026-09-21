import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { TestimonialForm } from "@/features/admin/TestimonialForm";
import { updateTestimonial } from "@/features/admin/testimonials.actions";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: { id: string };
}) {
  const [testimonial, treatments] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id: params.id } }),
    prisma.treatment.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!testimonial) notFound();

  return (
    <TestimonialForm
      action={updateTestimonial.bind(null, testimonial.id)}
      treatments={treatments}
      heading="Edit testimonial"
      defaults={testimonial}
    />
  );
}
