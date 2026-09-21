"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/features/admin/guard";
import { imageSrc } from "@/lib/validators";

const schema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  issuer: z.string().min(1, "Penerbit wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  year: z.string().optional(),
  description: z.string().optional(),
  imageUrl: imageSrc("Gambar sertifikat wajib diunggah atau diisi URL-nya"),
  imageAlt: z.string().optional(),
});

function extract(formData: FormData) {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    issuer: formData.get("issuer"),
    category: formData.get("category"),
    year: formData.get("year") || undefined,
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl"),
    imageAlt: formData.get("imageAlt") || undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Input tidak valid");
  }
  const orderRaw = String(formData.get("order") ?? "0").replace(/\D/g, "");
  return {
    title: parsed.data.title,
    issuer: parsed.data.issuer,
    category: parsed.data.category,
    year: parsed.data.year ?? null,
    description: parsed.data.description ?? null,
    imageUrl: parsed.data.imageUrl,
    imageAlt: parsed.data.imageAlt ?? null,
    order: orderRaw ? parseInt(orderRaw, 10) : 0,
    published: formData.get("published") === "on",
  };
}

export async function createCertificate(formData: FormData) {
  await requireAdmin();
  await prisma.certificate.create({ data: extract(formData) });
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  redirect("/admin/certificates");
}

export async function updateCertificate(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.certificate.update({ where: { id }, data: extract(formData) });
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  redirect("/admin/certificates");
}

export async function deleteCertificate(id: string) {
  await requireAdmin();
  await prisma.certificate.delete({ where: { id } });
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
}

export async function toggleCertificatePublished(id: string, next: boolean) {
  await requireAdmin();
  await prisma.certificate.update({ where: { id }, data: { published: next } });
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
}
