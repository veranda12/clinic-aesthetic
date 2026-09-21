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
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  summary: z.string().min(1, "Ringkasan wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  howItWorks: z.string().optional(),
  whoFor: z.string().optional(),
  expected: z.string().optional(),
  aftercare: z.string().optional(),
  duration: z.string().optional(),
  frequency: z.string().optional(),
  imageUrl: imageSrc("Gambar utama wajib diunggah atau diisi URL-nya"),
  imageAlt: z.string().optional(),
});

function parseConcerns(raw: string): string[] {
  return raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

// Process steps: one per line, "Judul :: Deskripsi".
function parseProcess(raw: string): { title: string; description: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("::");
      return {
        title: title.trim(),
        description: rest.join("::").trim(),
      };
    });
}

function extract(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    howItWorks: formData.get("howItWorks") || undefined,
    whoFor: formData.get("whoFor") || undefined,
    expected: formData.get("expected") || undefined,
    aftercare: formData.get("aftercare") || undefined,
    duration: formData.get("duration") || undefined,
    frequency: formData.get("frequency") || undefined,
    imageUrl: formData.get("imageUrl"),
    imageAlt: formData.get("imageAlt") || undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Input tidak valid");
  }
  const priceRaw = String(formData.get("priceFrom") ?? "").replace(/\D/g, "");
  const orderRaw = String(formData.get("order") ?? "0").replace(/\D/g, "");

  return {
    ...parsed.data,
    concerns: parseConcerns(String(formData.get("concerns") ?? "")),
    gallery: formData
      .getAll("gallery")
      .map((v) => String(v).trim())
      .filter(Boolean),
    process: parseProcess(String(formData.get("process") ?? "")),
    priceFrom: priceRaw ? parseInt(priceRaw, 10) : null,
    order: orderRaw ? parseInt(orderRaw, 10) : 0,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
}

export async function createTreatment(formData: FormData) {
  await requireAdmin();
  const data = extract(formData);
  await prisma.treatment.create({ data });
  revalidatePath("/admin/treatments");
  revalidatePath("/treatments");
  redirect("/admin/treatments");
}

export async function updateTreatment(id: string, formData: FormData) {
  await requireAdmin();
  const data = extract(formData);
  await prisma.treatment.update({ where: { id }, data });
  revalidatePath("/admin/treatments");
  revalidatePath("/treatments");
  revalidatePath(`/treatments/${data.slug}`);
  redirect("/admin/treatments");
}

export async function deleteTreatment(id: string) {
  await requireAdmin();
  await prisma.treatment.delete({ where: { id } });
  revalidatePath("/admin/treatments");
  revalidatePath("/treatments");
}

export async function toggleTreatmentPublished(id: string, next: boolean) {
  await requireAdmin();
  await prisma.treatment.update({ where: { id }, data: { published: next } });
  revalidatePath("/admin/treatments");
  revalidatePath("/treatments");
}
