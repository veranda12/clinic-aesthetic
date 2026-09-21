import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Accordion } from "@/components/Accordion";
import { GalleryGrid } from "@/components/GalleryGrid";
import { StructuredData } from "@/components/StructuredData";
import { formatPrice, toParagraphs, pad2 } from "@/lib/utils";
import { site } from "@/lib/site";
import type { ProcessStep } from "@/types/content";
import {
  getTreatmentBySlug,
  getRelatedTreatments,
  getTreatmentSlugs,
} from "@/lib/queries";

export async function generateStaticParams() {
  const slugs = await getTreatmentSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tr = await getTreatmentBySlug(params.slug);
  if (!tr) return { title: "Treatment tidak ditemukan" };
  return {
    title: tr.name,
    description: tr.summary,
    alternates: { canonical: `/treatments/${tr.slug}` },
    openGraph: {
      title: `${tr.name} — ${site.name}`,
      description: tr.summary,
      images: [tr.imageUrl],
    },
  };
}

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="py-4 border-b border-line">
      <dt className="eyebrow text-taupe-light">{label}</dt>
      <dd className="mt-2 text-ink">{value}</dd>
    </div>
  );
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const treatment = await getTreatmentBySlug(params.slug);
  if (!treatment) notFound();

  const related = await getRelatedTreatments(
    treatment.categoryId,
    treatment.id,
    3
  );
  const steps = (treatment.process as unknown as ProcessStep[] | null) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: treatment.name,
    description: treatment.summary,
    url: `${site.url}/treatments/${treatment.slug}`,
    image: treatment.imageUrl,
    howPerformed: treatment.howItWorks ?? undefined,
  };

  return (
    <>
      <StructuredData data={jsonLd} />

      {/* Hero */}
      <section className="shell pt-[128px] md:pt-[160px]">
        <Reveal className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
          <div className="md:col-span-6">
            <Link
              href="/treatments"
              className="link-underline text-sm tracking-[0.1em] uppercase text-taupe"
            >
              ← {treatment.category.name}
            </Link>
            <h1 className="display-lg mt-6">{treatment.name}</h1>
            <p className="lead mt-6 max-w-xl">{treatment.summary}</p>
            {treatment.concerns.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {treatment.concerns.map((c) => (
                  <span
                    key={c}
                    className="text-[0.72rem] tracking-wide text-ink-soft border border-line px-3 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-6">
            <div className="img-frame aspect-[4/3]">
              <Image
                src={treatment.imageUrl}
                alt={treatment.imageAlt ?? treatment.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover media-cinematic"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Body + detail sidebar */}
      <section className="shell py-20 md:py-28 grid md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-7 space-y-14">
          <Reveal>
            <h2 className="display-md">Tentang perawatan</h2>
            <div className="prose-body mt-5 max-w-prose2">
              {toParagraphs(treatment.description).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          {treatment.howItWorks && (
            <Reveal>
              <h2 className="display-md">Bagaimana cara kerjanya</h2>
              <div className="prose-body mt-5 max-w-prose2">
                {toParagraphs(treatment.howItWorks).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          )}

          {treatment.whoFor && (
            <Reveal>
              <h2 className="display-md">Untuk siapa</h2>
              <div className="prose-body mt-5 max-w-prose2">
                {toParagraphs(treatment.whoFor).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          )}

          {treatment.expected && (
            <Reveal>
              <h2 className="display-md">Hasil yang diharapkan</h2>
              <div className="prose-body mt-5 max-w-prose2">
                {toParagraphs(treatment.expected).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {/* Sticky detail card */}
        <aside className="md:col-span-4 md:col-start-9">
          <Reveal className="md:sticky md:top-28 bg-paper p-8 border-t-2 border-ink">
            <p className="eyebrow text-taupe-light">Ringkasan</p>
            <dl className="mt-4">
              <Detail label="Durasi" value={treatment.duration} />
              <Detail label="Frekuensi" value={treatment.frequency} />
              <Detail
                label="Mulai dari"
                value={treatment.priceFrom ? formatPrice(treatment.priceFrom) : null}
              />
              <Detail label="Kategori" value={treatment.category.name} />
            </dl>
            <Link href="/contact#book" className="btn-primary w-full mt-8">
              Book Consultation
            </Link>
            <p className="text-xs text-taupe mt-4 leading-relaxed">
              Harga dapat berbeda sesuai kondisi kulit dan rekomendasi dokter
              setelah konsultasi.
            </p>
          </Reveal>
        </aside>
      </section>

      {/* Process */}
      {steps.length > 0 && (
        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Proses</p>
              <h2 className="display-md mt-5">Alur perawatan</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 80}>
                  <p className="font-display text-4xl text-taupe-light">
                    {pad2(i + 1)}
                  </p>
                  <h3 className="font-display text-xl mt-4">{step.title}</h3>
                  <p className="prose-body mt-3 text-[0.92rem]">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {treatment.gallery.length > 0 && (
        <section className="shell py-20 md:py-28">
          <Reveal>
            <p className="eyebrow">Galeri</p>
            <h2 className="display-md mt-5 mb-10">Sekilas prosesnya</h2>
          </Reveal>
          <Reveal>
            <GalleryGrid
              images={treatment.gallery.map((url) => ({
                url,
                alt: `${treatment.name} — AURELIA`,
              }))}
            />
          </Reveal>
        </section>
      )}

      {/* Aftercare */}
      {treatment.aftercare && (
        <section className="shell py-20 md:py-28">
          <Reveal className="grid md:grid-cols-12 gap-8">
            <h2 className="display-md md:col-span-4">Aftercare</h2>
            <div className="prose-body md:col-span-7 md:col-start-6 max-w-prose2">
              {toParagraphs(treatment.aftercare).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* FAQ */}
      {treatment.faqs.length > 0 && (
        <section className="shell py-20 md:py-28">
          <Reveal>
            <p className="eyebrow">Pertanyaan Umum</p>
            <h2 className="display-md mt-5 mb-10">
              Hal yang sering ditanyakan
            </h2>
          </Reveal>
          <Accordion items={treatment.faqs} />
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Perawatan lain</p>
              <h2 className="display-md mt-5">Dalam kategori {treatment.category.name}</h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-8 mt-14">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 90}>
                  <Link href={`/treatments/${r.slug}`} className="group block">
                    <div className="img-frame aspect-[4/3]">
                      <Image
                        src={r.imageUrl}
                        alt={r.imageAlt ?? r.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover media-treatment"
                      />
                    </div>
                    <h3 className="font-display text-2xl mt-5 transition-transform duration-[600ms] ease-editorial group-hover:translate-x-2">
                      <span className="reveal-underline">{r.name}</span>
                    </h3>
                    <p className="prose-body mt-2 text-[0.92rem]">{r.summary}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
