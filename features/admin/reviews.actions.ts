"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/features/admin/guard";

export async function setReviewApproved(id: string, approved: boolean) {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { approved } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}
