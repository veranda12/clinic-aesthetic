import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    treatments,
    treatmentsPublished,
    doctors,
    articles,
    articlesPublished,
    testimonials,
    faqs,
    certificates,
    facilities,
    reviews,
    reviewsPending,
  ] = await Promise.all([
    prisma.treatment.count(),
    prisma.treatment.count({ where: { published: true } }),
    prisma.doctor.count(),
    prisma.article.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.testimonial.count(),
    prisma.faq.count(),
    prisma.certificate.count(),
    prisma.facility.count(),
    prisma.review.count(),
    prisma.review.count({ where: { approved: false } }),
  ]);
  return {
    treatments,
    treatmentsPublished,
    doctors,
    articles,
    articlesPublished,
    testimonials,
    faqs,
    certificates,
    facilities,
    reviews,
    reviewsPending,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "Treatments",
      value: stats.treatments,
      sub: `${stats.treatmentsPublished} dipublikasikan`,
      href: "/admin/treatments",
    },
    {
      label: "Doctors",
      value: stats.doctors,
      sub: "profil dokter",
      href: "/admin/doctors",
    },
    {
      label: "Facilities",
      value: stats.facilities,
      sub: "foto fasilitas",
      href: "/admin/facilities",
    },
    {
      label: "Reviews",
      value: stats.reviews,
      sub:
        stats.reviewsPending > 0
          ? `${stats.reviewsPending} menunggu peninjauan`
          : "ulasan pasien",
      href: "/admin/reviews",
    },
    {
      label: "Articles",
      value: stats.articles,
      sub: `${stats.articlesPublished} dipublikasikan`,
      href: "/admin/articles",
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      sub: "kutipan pasien",
      href: "/admin/testimonials",
    },
    {
      label: "Certificates",
      value: stats.certificates,
      sub: "kredensial klinik",
      href: "/admin/certificates",
    },
    {
      label: "FAQ",
      value: stats.faqs,
      sub: "pertanyaan",
      href: "/admin/faqs",
    },
  ];

  return (
    <div>
      <p className="eyebrow">Dashboard</p>
      <h1 className="display-md mt-3">Selamat datang kembali.</h1>
      <p className="prose-body mt-3 max-w-lg">
        Kelola seluruh konten publik AURELIA dari sini. Perubahan langsung
        tercermin di website.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group bg-paper border border-line p-6 hover:border-ink transition-colors"
          >
            <p className="eyebrow text-taupe-light">{c.label}</p>
            <p className="font-display text-5xl mt-3">{c.value}</p>
            <p className="text-sm text-taupe mt-2">{c.sub}</p>
            <span className="link-underline inline-block mt-4 text-[0.8rem] tracking-widest uppercase">
              Kelola →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-ink text-ivory p-8">
        <p className="eyebrow text-taupe-light">Aksi cepat</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/treatments/new" className="btn bg-ivory text-ink hover:bg-cream">
            + Treatment
          </Link>
          <Link href="/admin/articles/new" className="btn border border-ivory/60 text-ivory hover:bg-ivory hover:text-ink">
            + Artikel
          </Link>
          <Link href="/admin/doctors/new" className="btn border border-ivory/60 text-ivory hover:bg-ivory hover:text-ink">
            + Dokter
          </Link>
        </div>
      </div>
    </div>
  );
}
