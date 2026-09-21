import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { pad2 } from "@/lib/utils";
import { getCertificatesByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Perizinan, akreditasi, dan sertifikasi AURELIA Skin & Aesthetic — bukti bahwa setiap perawatan dijalankan secara legal, aman, dan sesuai standar.",
  alternates: { canonical: "/certificates" },
};

export default async function CertificatesPage() {
  const groups = await getCertificatesByCategory();

  return (
    <>
      <PageHero
        eyebrow="Credentials"
        title="Kepercayaan yang bisa diverifikasi."
        intro="Setiap perawatan di AURELIA berdiri di atas legalitas dan kompetensi yang jelas. Berikut perizinan, akreditasi, dan sertifikasi yang menjadi dasar layanan kami."
      />

      {groups.length === 0 && (
        <div className="shell pb-28">
          <p className="prose-body border-t border-line pt-12">
            Belum ada sertifikat yang dipublikasikan.
          </p>
        </div>
      )}

      {groups.map((group, gi) => (
        <section key={group.category} className="shell py-14 md:py-20">
          <Reveal className="flex items-baseline gap-5 border-t border-line pt-8">
            <span className="font-display text-2xl text-taupe-light">
              {pad2(gi + 1)}
            </span>
            <h2 className="display-md">{group.category}</h2>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-12">
            {group.items.map((cert, i) => (
              <Reveal key={cert.id} delay={(i % 3) * 90} as="figure" className="group">
                {/* Matted frame — paper mount + hairline, echoing a framed document. */}
                <div className="bg-paper border border-line p-3 md:p-4 transition-colors duration-[600ms] ease-editorial group-hover:border-taupe-light">
                  <div className="img-frame aspect-[3/4]">
                    <Image
                      src={cert.imageUrl}
                      alt={cert.imageAlt ?? cert.title}
                      fill
                      sizes="(max-width: 1024px) 45vw, 30vw"
                      className="object-cover media-gallery"
                    />
                  </div>
                </div>
                <figcaption className="mt-5">
                  <h3 className="font-display text-xl leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-taupe mt-2">
                    {cert.issuer}
                    {cert.year ? ` · ${cert.year}` : ""}
                  </p>
                  {cert.description && (
                    <p className="prose-body text-[0.92rem] mt-3 hidden md:block">
                      {cert.description}
                    </p>
                  )}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      {/* Trust note + CTA */}
      <section className="shell pb-28 pt-6">
        <Reveal className="bg-ink text-ivory p-10 md:p-16 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <h2 className="display-md text-ivory max-w-xl">
              Punya pertanyaan soal keamanan atau legalitas perawatan?
            </h2>
            <p className="lead mt-4 text-ivory/80 max-w-xl">
              Kami senang menjelaskan secara terbuka — mulai dari standar tindakan
              hingga kualifikasi dokter yang menangani Anda.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              href="/contact#book"
              className="btn bg-ivory text-ink hover:bg-cream whitespace-nowrap"
            >
              Book Consultation
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
