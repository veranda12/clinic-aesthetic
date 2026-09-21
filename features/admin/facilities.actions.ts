"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/features/admin/guard";
import { imageSrc } from "@/lib/validators";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: imageSrc("Gambar utama wajib diunggah atau diisi URL-nya"),
  imageAlt: z.string().optional(),
});

function extract(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    category: formData.get("category") || undefined,
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl"),
    imageAlt: formData.get("imageAlt") || undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Input tidak valid");
  }
  const orderRaw = String(formData.get("order") ?? "0").replace(/\D/g, "");
  return {
    name: parsed.data.name,
    category: parsed.data.category ?? null,
    description: parsed.data.description ?? null,
    imageUrl: parsed.data.imageUrl,
    imageAlt: parsed.data.imageAlt ?? null,
    gallery: formData
      .getAll("gallery")
      .map((v) => String(v).trim())
      .filter(Boolean),
    order: orderRaw ? parseInt(orderRaw, 10) : 0,
    published: formData.get("published") === "on",
  };
}

export async function createFacility(formData: FormData) {
  await requireAdmin();
  await prisma.facility.create({ data: extract(formData) });
  revalidatePath("/admin/facilities");
  revalidatePath("/facilities");
  redirect("/admin/facilities");
}

export async function updateFacility(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.facility.update({ where: { id }, data: extract(formData) });
  revalidatePath("/admin/facilities");
  revalidatePath("/facilities");
  redirect("/admin/facilities");
}

export async function deleteFacility(id: string) {
  await requireAdmin();
  await prisma.facility.delete({ where: { id } });
  revalidatePath("/admin/facilities");
  revalidatePath("/facilities");
}

export async function toggleFacilityPublished(id: string, next: boolean) {
  await requireAdmin();
  await prisma.facility.update({ where: { id }, data: { published: next } });
  revalidatePath("/admin/facilities");
  revalidatePath("/facilities");
}
