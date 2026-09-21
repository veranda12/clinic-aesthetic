import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { TreatmentRow } from "@/components/TreatmentRow";
import { Reveal } from "@/components/Reveal";
import { getTreatmentCategoriesWithTreatments } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "Perawatan kulit di AURELIA — skin health, advanced treatment, dan age management. Dirancang berdasarkan kondisi dan kebutuhan kulit Anda.",
  alternates: { canonical: "/treatments" },
};

export default async function TreatmentsPage() {
  const categories = await getTreatmentCategoriesWithTreatments();

  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Perawatan yang dirancang untuk kulit Anda."
        intro="Setiap kulit memiliki cerita yang berbeda. Perawatan kami dikelompokkan berdasarkan tujuannya — mulai dari membangun kesehatan kulit dasar hingga age management yang natural."
      />

      {/* Category quick nav */}
      <div className="shell pb-6">
        <Reveal className="flex flex-wrap gap-x-8 gap-y-3 border-t border-b border-line py-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`#${c.slug}`}
              className="link-underline text-sm tracking-[0.1em] uppercase text-ink-soft"
            >
              {c.name}
            </Link>
          ))}
        </Reveal>
      </div>

      {categories.map((cat) => (
        <section
          key={cat.id}
          id={cat.slug}
          className="shell scroll-mt-28 py-16 md:py-24"
        >
          <Reveal className="grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <h2 className="display-md">{cat.name}</h2>
              {cat.description && (
                <p className="prose-body mt-4 max-w-xl">{cat.description}</p>
              )}
            </div>
            {cat.tagline && (
              <p className="md:col-span-4 md:text-right eyebrow text-taupe-light">
                {cat.tagline}
              </p>
            )}
          </Reveal>

          <div className="mt-6">
            {cat.treatments.map((tr, i) => (
              <TreatmentRow key={tr.id} treatment={tr} index={i} />
            ))}
          </div>
        </section>
      ))}

      <section className="shell pb-28">
        <Reveal className="bg-ink text-ivory p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="display-md text-ivory">
              Belum yakin perawatan mana yang tepat?
            </h2>
            <p className="lead mt-4 text-ivory/80 max-w-xl">
              Konsultasi membantu dokter menyarankan perawatan yang sesuai
              dengan kondisi kulit Anda.
            </p>
          </div>
          <Link
            href="/contact#book"
            className="btn bg-ivory text-ink hover:bg-cream whitespace-nowrap"
          >
            Book Consultation
          </Link>
        </Reveal>
      </section>
    </>
  );
}
