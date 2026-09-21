"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/features/admin/guard";
import { imageSrc } from "@/lib/validators";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  title: z.string().min(1, "Titel wajib diisi"),
  education: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().min(1, "Bio wajib diisi"),
  imageUrl: imageSrc("Foto wajib diunggah atau diisi URL-nya"),
  imageAlt: z.string().optional(),
});

function extract(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    title: formData.get("title"),
    education: formData.get("education") || undefined,
    specialization: formData.get("specialization") || undefined,
    bio: formData.get("bio"),
    imageUrl: formData.get("imageUrl"),
    imageAlt: formData.get("imageAlt") || undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Input tidak valid");
  }
  const orderRaw = String(formData.get("order") ?? "0").replace(/\D/g, "");
  return {
    ...parsed.data,
    order: orderRaw ? parseInt(orderRaw, 10) : 0,
    published: formData.get("published") === "on",
  };
}

export async function createDoctor(formData: FormData) {
  await requireAdmin();
  await prisma.doctor.create({ data: extract(formData) });
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
  redirect("/admin/doctors");
}

export async function updateDoctor(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.doctor.update({ where: { id }, data: extract(formData) });
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
  redirect("/admin/doctors");
}

export async function deleteDoctor(id: string) {
  await requireAdmin();
  await prisma.doctor.delete({ where: { id } });
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
}
