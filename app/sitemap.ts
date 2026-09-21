import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getTreatmentSlugs, getArticleSlugs } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  const staticRoutes = [
    "",
    "/treatments",
    "/facilities",
    "/doctors",
    "/certificates",
    "/reviews",
    "/about",
    "/journal",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [treatments, articles] = await Promise.all([
      getTreatmentSlugs(),
      getArticleSlugs(),
    ]);
    dynamicRoutes = [
      ...treatments.map((t) => ({
        url: `${base}/treatments/${t.slug}`,
        lastModified: t.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...articles.map((a) => ({
        url: `${base}/journal/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // Database may be unavailable at build time — static routes still emitted.
  }

  return [...staticRoutes, ...dynamicRoutes];
}
