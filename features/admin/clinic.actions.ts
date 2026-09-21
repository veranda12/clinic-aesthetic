"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/features/admin/guard";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  city: z.string().min(1, "Kota wajib diisi"),
});

// Opening hours: one per line, "Hari :: Jam".
function parseHours(raw: string): { day: string; hours: string }[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [day, ...rest] = line.split("::");
      return { day: day.trim(), hours: rest.join("::").trim() };
    });
}

export async function updateClinic(id: string | null, formData: FormData) {
  await requireAdmin();

  const parsed = schema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Input tidak valid");
  }

  const data = {
    ...parsed.data,
    phone: (formData.get("phone") as string) || null,
    whatsapp: (formData.get("whatsapp") as string) || null,
    email: (formData.get("email") as string) || null,
    instagram: (formData.get("instagram") as string) || null,
    mapEmbedUrl: (formData.get("mapEmbedUrl") as string) || null,
    hours: parseHours(String(formData.get("hours") ?? "")),
    isPrimary: true,
  };

  if (id) {
    await prisma.clinicLocation.update({ where: { id }, data });
  } else {
    await prisma.clinicLocation.create({ data });
  }

  revalidatePath("/admin/clinic");
  revalidatePath("/contact");
  revalidatePath("/");
}
