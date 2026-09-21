import "server-only";
import { prisma } from "@/lib/db";

// --- Treatments -----------------------------------------------------------

export async function getTreatmentCategoriesWithTreatments() {
  return prisma.treatmentCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      treatments: {
        where: { published: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getFeaturedTreatments(limit = 4) {
  return prisma.treatment.findMany({
    where: { published: true, featured: true },
    orderBy: { order: "asc" },
    take: limit,
    include: { category: true },
  });
}

export async function getAllPublishedTreatments() {
  return prisma.treatment.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { category: true },
  });
}

export async function getTreatmentBySlug(slug: string) {
  return prisma.treatment.findFirst({
    where: { slug, published: true },
    include: {
      category: true,
      faqs: {
        where: { published: true },
        orderBy: { order: "asc" },
      },
      testimonials: {
        where: { published: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getRelatedTreatments(
  categoryId: string,
  excludeId: string,
  limit = 3
) {
  return prisma.treatment.findMany({
    where: { categoryId, published: true, NOT: { id: excludeId } },
    orderBy: { order: "asc" },
    take: limit,
    include: { category: true },
  });
}

export async function getTreatmentSlugs() {
  return prisma.treatment.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
}

// --- Doctors --------------------------------------------------------------

export async function getPublishedDoctors() {
  return prisma.doctor.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

// --- Journal --------------------------------------------------------------

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, published: true },
    include: { category: true, author: true },
  });
}

export async function getRelatedArticles(
  categoryId: string | null,
  excludeId: string,
  limit = 2
) {
  return prisma.article.findMany({
    where: {
      published: true,
      NOT: { id: excludeId },
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function getArticleSlugs() {
  return prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
}

// --- Clinic / shared ------------------------------------------------------

export async function getPrimaryLocation() {
  return (
    (await prisma.clinicLocation.findFirst({
      where: { isPrimary: true },
    })) ?? prisma.clinicLocation.findFirst({ orderBy: { order: "asc" } })
  );
}

export async function getLocations() {
  return prisma.clinicLocation.findMany({ orderBy: { order: "asc" } });
}

export async function getTestimonials(limit?: number) {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: limit,
  });
}

export async function getGeneralFaqs() {
  return prisma.faq.findMany({
    where: { published: true, treatmentId: null },
    orderBy: { order: "asc" },
  });
}

export async function getSiteSettings() {
  const rows = await prisma.siteSetting.findMany();
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

// --- Certificates ---------------------------------------------------------

export async function getPublishedCertificates() {
  return prisma.certificate.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

// --- Facilities -----------------------------------------------------------

export async function getPublishedFacilities() {
  return prisma.facility.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

// --- Reviews --------------------------------------------------------------

export async function getApprovedReviews() {
  return prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReviewStats() {
  const result = await prisma.review.aggregate({
    where: { approved: true },
    _avg: { rating: true },
    _count: true,
  });
  return {
    average: result._avg.rating ?? 0,
    count: result._count,
  };
}

// Group published certificates by their category, preserving order.
export async function getCertificatesByCategory() {
  const certificates = await getPublishedCertificates();
  const groups: { category: string; items: typeof certificates }[] = [];
  for (const cert of certificates) {
    let group = groups.find((g) => g.category === cert.category);
    if (!group) {
      group = { category: cert.category, items: [] };
      groups.push(group);
    }
    group.items.push(cert);
  }
  return groups;
}
