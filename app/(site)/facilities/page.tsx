import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { FacilityGrid } from "@/components/FacilityGrid";
import { getPublishedFacilities } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Fasilitas AURELIA Skin & Aesthetic — ruang perawatan, ruang tunggu, dan area klinik yang dirancang untuk kenyamanan dan ketenangan Anda.",
  alternates: { canonical: "/facilities" },
};

export default async function FacilitiesPage() {
  const facilities = await getPublishedFacilities();

  return (
    <>
      <PageHero
        eyebrow="Facilities"
        title="Ruang yang dirancang untuk menenangkan."
        intro="Kenyamanan adalah bagian dari perawatan. Setiap sudut AURELIA — dari ruang tunggu hingga ruang tindakan — dirancang agar Anda merasa tenang sejak melangkah masuk."
      />

      <section className="shell pb-28">
        {facilities.length === 0 ? (
          <p className="prose-body border-t border-line pt-10">
            Belum ada fasilitas yang dipublikasikan.
          </p>
        ) : (
          <FacilityGrid
            facilities={facilities.map((f) => ({
              id: f.id,
              name: f.name,
              category: f.category,
              description: f.description,
              imageUrl: f.imageUrl,
              imageAlt: f.imageAlt,
              gallery: f.gallery,
            }))}
          />
        )}
      </section>

      {/* CTA */}
      <section className="shell pb-28">
        <Reveal className="border-t border-line pt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h2 className="display-md max-w-xl">Rasakan sendiri suasananya.</h2>
          <Link href="/contact#book" className="btn-primary whitespace-nowrap">
            Book Consultation
          </Link>
        </Reveal>
      </section>
    </>
  );
}
