"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/features/admin/guard";

const schema = z.object({
  question: z.string().min(1, "Pertanyaan wajib diisi"),
  answer: z.string().min(1, "Jawaban wajib diisi"),
  group: z.string().optional(),
});

function extract(formData: FormData) {
  const parsed = schema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    group: formData.get("group") || undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Input tidak valid");
  }
  const orderRaw = String(formData.get("order") ?? "0").replace(/\D/g, "");
  const treatmentId = String(formData.get("treatmentId") ?? "");
  return {
    question: parsed.data.question,
    answer: parsed.data.answer,
    group: parsed.data.group || "general",
    order: orderRaw ? parseInt(orderRaw, 10) : 0,
    published: formData.get("published") === "on",
    treatmentId: treatmentId || null,
  };
}

export async function createFaq(formData: FormData) {
  await requireAdmin();
  await prisma.faq.create({ data: extract(formData) });
  revalidatePath("/admin/faqs");
  revalidatePath("/contact");
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.faq.update({ where: { id }, data: extract(formData) });
  revalidatePath("/admin/faqs");
  revalidatePath("/contact");
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faqs");
  revalidatePath("/contact");
}
