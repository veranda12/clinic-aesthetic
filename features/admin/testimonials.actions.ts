"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/features/admin/guard";

const schema = z.object({
  author: z.string().min(1, "Nama wajib diisi"),
  context: z.string().optional(),
  quote: z.string().min(1, "Kutipan wajib diisi"),
});

function extract(formData: FormData) {
  const parsed = schema.safeParse({
    author: formData.get("author"),
    context: formData.get("context") || undefined,
    quote: formData.get("quote"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Input tidak valid");
  }
  const rating = parseInt(String(formData.get("rating") ?? "5"), 10) || 5;
  const orderRaw = String(formData.get("order") ?? "0").replace(/\D/g, "");
  const treatmentId = String(formData.get("treatmentId") ?? "");
  return {
    author: parsed.data.author,
    context: parsed.data.context ?? null,
    quote: parsed.data.quote,
    rating: Math.min(5, Math.max(1, rating)),
    order: orderRaw ? parseInt(orderRaw, 10) : 0,
    published: formData.get("published") === "on",
    treatmentId: treatmentId || null,
  };
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.create({ data: extract(formData) });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.update({ where: { id }, data: extract(formData) });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
