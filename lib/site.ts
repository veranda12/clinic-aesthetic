import type { NavItem } from "@/types/content";

// Tolerates an empty value or a missing protocol (e.g. "foo.vercel.app"), and
// falls back to Vercel's auto-provided host, so `new URL(site.url)` never throws.
function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export const site = {
  name: "AURELIA",
  fullName: "AURELIA Skin & Aesthetic",
  wordmarkTop: "AURELIA",
  wordmarkBottom: "SKIN & AESTHETIC",
  tagline: "Skin confidence, thoughtfully created.",
  description:
    "Aesthetic clinic di Jakarta Selatan yang merancang perawatan kulit berdasarkan kondisi dan kebutuhan kulit Anda — dari skin health hingga rejuvenation.",
  url: resolveSiteUrl(),
  city: "Jakarta Selatan",
} as const;

export const mainNav: NavItem[] = [
  { label: "Treatments", href: "/treatments" },
  { label: "Facilities", href: "/facilities" },
  { label: "Doctors", href: "/doctors" },
  { label: "Certificates", href: "/certificates" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

// Secondary links surfaced in the footer (kept out of the top nav for clarity).
export const secondaryNav: NavItem[] = [
  { label: "Reviews", href: "/reviews" },
];

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Treatments", href: "/admin/treatments" },
  { label: "Doctors", href: "/admin/doctors" },
  { label: "Facilities", href: "/admin/facilities" },
  { label: "Journal", href: "/admin/articles" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "FAQ", href: "/admin/faqs" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Hero", href: "/admin/hero" },
  { label: "Clinic Info", href: "/admin/clinic" },
];
