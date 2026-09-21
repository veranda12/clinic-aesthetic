"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/features/admin/guard";
import { imageSrc } from "@/lib/validators";

const schema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  excerpt: z.string().min(1, "Ringkasan wajib diisi"),
  body: z.string().min(1, "Isi wajib diisi"),
  imageUrl: imageSrc("Gambar sampul wajib diunggah atau diisi URL-nya"),
  imageAlt: z.string().optional(),
});

async function extract(formData: FormData, currentPublishedAt?: Date | null) {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    imageUrl: formData.get("imageUrl"),
    imageAlt: formData.get("imageAlt") || undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Input tidak valid");
  }

  const published = formData.get("published") === "on";
  const readRaw = String(formData.get("readMinutes") ?? "4").replace(/\D/g, "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const authorId = String(formData.get("authorId") ?? "");

  return {
    ...parsed.data,
    imageAlt: parsed.data.imageAlt ?? null,
    readMinutes: readRaw ? parseInt(readRaw, 10) : 4,
    categoryId: categoryId || null,
    authorId: authorId || null,
    published,
    // Stamp publish date the first time it goes live; keep it thereafter.
    publishedAt: published ? currentPublishedAt ?? new Date() : null,
  };
}

export async function createArticle(formData: FormData) {
  await requireAdmin();
  const data = await extract(formData);
  await prisma.article.create({ data });
  revalidatePath("/admin/articles");
  revalidatePath("/journal");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();
  const existing = await prisma.article.findUnique({ where: { id } });
  const data = await extract(formData, existing?.publishedAt ?? null);
  await prisma.article.update({ where: { id }, data });
  revalidatePath("/admin/articles");
  revalidatePath("/journal");
  revalidatePath(`/journal/${data.slug}`);
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/journal");
}

export async function toggleArticlePublished(id: string, next: boolean) {
  await requireAdmin();
  const existing = await prisma.article.findUnique({ where: { id } });
  await prisma.article.update({
    where: { id },
    data: {
      published: next,
      publishedAt: next ? existing?.publishedAt ?? new Date() : null,
    },
  });
  revalidatePath("/admin/articles");
  revalidatePath("/journal");
}
