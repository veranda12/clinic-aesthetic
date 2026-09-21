import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { SectionIntro } from "@/components/SectionIntro";
import { ArticleCard } from "@/components/ArticleCard";
import { StructuredData } from "@/components/StructuredData";
import { site } from "@/lib/site";
import { formatPrice, pad2 } from "@/lib/utils";
import {
  getSiteSettings,
  getFeaturedTreatments,
  getTreatmentCategoriesWithTreatments,
  getPublishedDoctors,
  getTestimonials,
  getPublishedArticles,
  getPrimaryLocation,
} from "@/lib/queries";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [settings, featured, categories, doctors, testimonials, articles, location] =
    await Promise.all([
      getSiteSettings(),
      getFeaturedTreatments(4),
      getTreatmentCategoriesWithTreatments(),
      getPublishedDoctors(),
      getTestimonials(1),
      getPublishedArticles(),
      getPrimaryLocation(),
    ]);

  const heroImage =
    settings.hero_image ??
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=2000";
  const heroHeading = settings.hero_heading ?? site.tagline;
  const heroSub = settings.hero_subcopy ?? site.description;
  const quote = testimonials[0];
  const latest = articles.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: site.fullName,
    description: site.description,
    url: site.url,
    image: heroImage,
    address: location
      ? {
          "@type": "PostalAddress",
          streetAddress: location.address,
          addressLocality: location.city,
          addressCountry: "ID",
        }
      : undefined,
    telephone: location?.phone ?? undefined,
    medicalSpecialty: "Dermatology",
  };

  return (
    <>
      <StructuredData data={jsonLd} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-end">
        <Image
          src={heroImage}
          alt="Perawatan kulit di AURELIA Skin & Aesthetic"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center media-cinematic"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />

        <div className="shell relative pb-16 md:pb-24 pt-40 w-full">
          <div className="max-w-3xl text-ivory">
            <p className="eyebrow text-ivory/80">
              Aesthetic Clinic · {site.city}
            </p>
            <h1 className="display-xl mt-7 text-ivory">
              Skin confidence,
              <br />
              <span className="italic font-normal">thoughtfully</span> created.
            </h1>
            <p className="lead mt-8 text-ivory/85 max-w-xl">{heroSub}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/treatments"
                className="btn bg-ivory text-ink hover:bg-cream"
              >
                Explore Treatments
              </Link>
              <Link
                href="/contact#book"
                className="btn border border-ivory/70 text-ivory hover:bg-ivory hover:text-ink"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Statement / approach ─────────────────────────────── */}
      <section className="shell py-24 md:py-36">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <Reveal>
              <p className="eyebrow">Pendekatan Kami</p>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal>
              <p className="font-display text-[clamp(1.7rem,3.4vw,2.9rem)] leading-[1.25] text-ink">
                Perawatan kulit yang dirancang berdasarkan kondisi dan kebutuhan
                kulit Anda — bukan tren, bukan janji instan. Kami memulai dari{" "}
                <span className="italic text-olive-deep">mendengarkan</span>,
                lalu membangun fondasi kulit yang sehat untuk jangka panjang.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <Link
                href="/about"
                className="link-underline inline-block mt-10 text-sm tracking-[0.12em] uppercase"
              >
                Tentang AURELIA
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Signature treatments ─────────────────────────────── */}
      <section className="bg-paper py-24 md:py-32">
        <div className="shell">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <SectionIntro
              eyebrow="Signature Treatments"
              title="Perawatan pilihan, dirancang dengan presisi."
            />
            <Reveal>
              <Link
                href="/treatments"
                className="link-underline text-sm tracking-[0.12em] uppercase whitespace-nowrap"
              >
                Semua perawatan
              </Link>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-16 mt-16">
            {featured.map((tr, i) => (
              <Reveal
                key={tr.id}
                className={i % 2 === 1 ? "sm:mt-24" : ""}
              >
                <Link
                  href={`/treatments/${tr.slug}`}
                  className="group block"
                >
                  <div className="img-frame aspect-[4/5]">
                    <Image
                      src={tr.imageUrl}
                      alt={tr.imageAlt ?? tr.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 45vw"
                      className="object-cover media-featured"
                    />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl transition-transform duration-[600ms] ease-editorial group-hover:translate-x-1">
                      <span className="reveal-underline">{tr.name}</span>
                    </h3>
                    <span className="text-sm text-taupe whitespace-nowrap">
                      {tr.priceFrom ? `Mulai ${formatPrice(tr.priceFrom)}` : ""}
                    </span>
                  </div>
                  <p className="prose-body mt-3 text-[0.95rem] max-w-sm">
                    {tr.summary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore by focus (categories) ────────────────────── */}
      <section className="shell py-24 md:py-32">
        <SectionIntro
          eyebrow="Explore by Focus"
          title="Tiga fokus perawatan."
          lead="Setiap perawatan dikelompokkan berdasarkan tujuannya — dari kesehatan kulit dasar hingga age management."
        />
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16">
          {categories.map((cat, i) => {
            const cover = cat.treatments[0]?.imageUrl;
            return (
              <Reveal key={cat.id} delay={i * 90}>
                <Link
                  href={`/treatments#${cat.slug}`}
                  className="group block relative img-frame aspect-[3/4]"
                >
                  {cover && (
                    <Image
                      src={cover}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover media-featured"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent transition-opacity duration-[700ms] ease-editorial group-hover:from-ink/85" />
                  <div className="absolute inset-0 p-7 flex flex-col justify-end text-ivory transition-transform duration-[700ms] ease-editorial group-hover:-translate-y-1">
                    <p className="eyebrow text-ivory/70">{pad2(i + 1)}</p>
                    <h3 className="font-display text-3xl mt-2">
                      <span className="reveal-underline">{cat.name}</span>
                    </h3>
                    <p className="text-sm text-ivory/80 mt-2">{cat.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Doctors teaser ───────────────────────────────────── */}
      {doctors.length > 0 && (
        <section className="bg-ink text-ivory py-24 md:py-32">
          <div className="shell grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <div className="img-frame aspect-[4/5]">
                <Image
                  src={doctors[0].imageUrl}
                  alt={doctors[0].imageAlt ?? doctors[0].name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal>
                <p className="eyebrow text-taupe-light">The Team</p>
                <h2 className="display-lg mt-6 text-ivory">
                  Dirawat oleh dokter yang benar-benar mendengarkan.
                </h2>
                <p className="lead mt-7 text-ivory/80">
                  Setiap perawatan di AURELIA dilakukan atau diawasi langsung
                  oleh dokter berpengalaman, dengan pendekatan yang tenang dan
                  berbasis bukti.
                </p>
                <div className="mt-8">
                  <p className="font-display text-2xl">{doctors[0].name}</p>
                  <p className="text-sm text-ivory/70 mt-1">
                    {doctors[0].title}
                  </p>
                </div>
                <Link
                  href="/doctors"
                  className="btn border border-ivory/70 text-ivory hover:bg-ivory hover:text-ink mt-9"
                >
                  Kenali dokter kami
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonial ──────────────────────────────────────── */}
      {quote && (
        <section className="shell py-28 md:py-40">
          <Reveal className="max-w-4xl mx-auto text-center">
            <p className="eyebrow">Kata Mereka</p>
            <blockquote className="font-display italic text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.28] mt-8">
              “{quote.quote}”
            </blockquote>
            <p className="mt-8 text-sm tracking-[0.1em] text-taupe">
              {quote.author}
              {quote.context ? ` · ${quote.context}` : ""}
            </p>
            <Link
              href="/reviews"
              className="link-underline inline-block mt-8 text-sm tracking-[0.12em] uppercase"
            >
              Baca & tulis ulasan
            </Link>
          </Reveal>
        </section>
      )}

      {/* ── Journal teaser ───────────────────────────────────── */}
      {latest.length > 0 && (
        <section className="bg-paper py-24 md:py-32">
          <div className="shell">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <SectionIntro
                eyebrow="Journal"
                title="Catatan tentang kulit."
              />
              <Reveal>
                <Link
                  href="/journal"
                  className="link-underline text-sm tracking-[0.12em] uppercase whitespace-nowrap"
                >
                  Semua artikel
                </Link>
              </Reveal>
            </div>
            <div className="grid md:grid-cols-3 gap-10 md:gap-8 mt-16">
              {latest.map((a, i) => (
                <Reveal key={a.id} delay={i * 90}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section className="shell py-24 md:py-32">
        <Reveal className="border-t border-line pt-16 md:pt-24 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <h2 className="display-lg max-w-2xl">
              Mulai dari percakapan tentang kulit Anda.
            </h2>
            <p className="lead mt-6 max-w-xl">
              Konsultasi membantu kami memahami kondisi kulit Anda sebelum
              menyarankan perawatan apa pun.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link href="/contact#book" className="btn-primary">
              Book Consultation
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
