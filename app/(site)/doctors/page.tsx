import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { toParagraphs } from "@/lib/utils";
import { getPublishedDoctors } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Doctors",
  description:
    "Tim dokter AURELIA Skin & Aesthetic — berpengalaman, tenang, dan berbasis bukti. Setiap perawatan dilakukan atau diawasi langsung oleh dokter.",
  alternates: { canonical: "/doctors" },
};

export default async function DoctorsPage() {
  const doctors = await getPublishedDoctors();

  return (
    <>
      <PageHero
        eyebrow="Our Doctors"
        title="Dirawat oleh dokter yang benar-benar mendengarkan."
        intro="Kami percaya perawatan terbaik dimulai dari percakapan. Setiap dokter di AURELIA mendekati kulit Anda dengan tenang, sabar, dan berbasis bukti."
      />

      <div className="shell pb-28 space-y-20 md:space-y-32">
        {doctors.map((doc, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal
              key={doc.id}
              className="group grid md:grid-cols-12 gap-8 md:gap-14 items-start border-t border-line pt-14 md:pt-20"
            >
              <div
                className={`md:col-span-5 ${
                  flip ? "md:order-2 md:col-start-8" : ""
                }`}
              >
                <div className="img-frame aspect-[4/5]">
                  <Image
                    src={doc.imageUrl}
                    alt={doc.imageAlt ?? doc.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover media-doctor"
                  />
                </div>
              </div>

              <div
                className={`md:col-span-6 ${
                  flip ? "md:order-1 md:col-start-1 md:row-start-1" : "md:col-start-7"
                }`}
              >
                <p className="eyebrow text-taupe-light">0{i + 1}</p>
                <h2 className="display-md mt-4 transition-transform duration-[700ms] ease-editorial group-hover:translate-x-2">
                  <span className="reveal-underline">{doc.name}</span>
                </h2>
                <p className="text-olive-deep mt-2 tracking-wide">{doc.title}</p>

                <div className="prose-body mt-6 max-w-prose2">
                  {toParagraphs(doc.bio).map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <dl className="mt-8 space-y-4">
                  {doc.specialization && (
                    <div className="border-t border-line pt-4">
                      <dt className="eyebrow text-taupe-light">Spesialisasi</dt>
                      <dd className="mt-2 text-ink">{doc.specialization}</dd>
                    </div>
                  )}
                  {doc.education && (
                    <div className="border-t border-line pt-4">
                      <dt className="eyebrow text-taupe-light">Pendidikan</dt>
                      <dd className="mt-2 text-ink">{doc.education}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </Reveal>
          );
        })}
      </div>

      <section className="shell pb-28">
        <Reveal className="border-t border-line pt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h2 className="display-md max-w-xl">
            Konsultasikan kondisi kulit Anda dengan dokter kami.
          </h2>
          <Link href="/contact#book" className="btn-primary whitespace-nowrap">
            Book Consultation
          </Link>
        </Reveal>
      </section>
    </>
  );
}
