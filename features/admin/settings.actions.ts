"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/features/admin/guard";

// Saves the homepage hero photo. An empty value removes the setting so the
// homepage falls back to its built-in default image.
export async function updateHeroImage(formData: FormData) {
  await requireAdmin();

  const value = String(formData.get("hero_image") ?? "").trim();

  if (value && !/^(https?:\/\/|\/)/i.test(value)) {
    throw new Error("URL gambar harus diawali https:// atau /");
  }

  if (value) {
    await prisma.siteSetting.upsert({
      where: { key: "hero_image" },
      update: { value },
      create: { key: "hero_image", value },
    });
  } else {
    await prisma.siteSetting.deleteMany({ where: { key: "hero_image" } });
  }

  revalidatePath("/admin/hero");
  revalidatePath("/");
}
