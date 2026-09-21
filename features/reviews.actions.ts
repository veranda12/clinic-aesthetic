"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  author: z.string().min(2, "Nama minimal 2 karakter").max(80),
  rating: z.coerce.number().int().min(1, "Pilih rating").max(5),
  treatment: z.string().max(120).optional(),
  body: z.string().min(10, "Ulasan minimal 10 karakter").max(1200),
});

export interface ReviewFormState {
  success?: boolean;
  error?: string;
}

// Public submission. Reviews are held for moderation before appearing.
export async function submitReview(
  _prev: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const parsed = schema.safeParse({
    author: formData.get("author"),
    rating: formData.get("rating"),
    treatment: formData.get("treatment") || undefined,
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Input tidak valid" };
  }

  await prisma.review.create({
    data: {
      author: parsed.data.author,
      rating: parsed.data.rating,
      treatment: parsed.data.treatment ?? null,
      body: parsed.data.body,
      approved: false,
    },
  });

  return { success: true };
}
