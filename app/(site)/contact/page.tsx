import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Accordion } from "@/components/Accordion";
import { BookingForm } from "@/components/BookingForm";
import { StructuredData } from "@/components/StructuredData";
import { site } from "@/lib/site";
import { mapsEmbedUrl } from "@/lib/utils";
import type { OpeningHour } from "@/types/content";
import {
  getPrimaryLocation,
  getGeneralFaqs,
  getAllPublishedTreatments,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: `Hubungi AURELIA Skin & Aesthetic di ${site.city}. Buat janji konsultasi melalui WhatsApp atau telepon.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [location, faqs, treatments] = await Promise.all([
    getPrimaryLocation(),
    getGeneralFaqs(),
    getAllPublishedTreatments(),
  ]);

  const hours = (location?.hours as unknown as OpeningHour[] | null) ?? [];

  const jsonLd = location
    ? {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        name: site.fullName,
        address: {
          "@type": "PostalAddress",
          streetAddress: location.address,
          addressLocality: location.city,
          addressCountry: "ID",
        },
        telephone: location.phone ?? undefined,
        email: location.email ?? undefined,
        url: `${site.url}/contact`,
      }
    : null;

  // Only trust a custom embed if it's a keyless `output=embed` URL. Fabricated
  // or expired `pb` tokens on /maps/embed get rejected by Google, so anything
  // else falls back to a generated embed from the clinic address.
  const customEmbed =
    location?.mapEmbedUrl && location.mapEmbedUrl.includes("output=embed")
      ? location.mapEmbedUrl.trim()
      : null;
  const mapSrc = location
    ? customEmbed ?? mapsEmbedUrl(`${location.address}, ${location.city}`)
    : null;

  return (
    <>
      {jsonLd && <StructuredData data={jsonLd} />}

      <PageHero
        eyebrow="Contact"
        title="Mari mulai dari sebuah percakapan."
        intro="Buat janji konsultasi, atau tanyakan hal apa pun tentang perawatan kami. Kami akan dengan senang hati membantu."
      />

      <section id="book" className="shell pb-24 scroll-mt-28 grid md:grid-cols-12 gap-12 md:gap-16">
        {/* Booking form */}
        <div className="md:col-span-7">
          <Reveal>
            <p className="eyebrow">Book Consultation</p>
            <h2 className="display-md mt-4 mb-10">Buat janji konsultasi</h2>
            <BookingForm
              whatsapp={location?.whatsapp ?? null}
              treatments={treatments.map((t) => ({ slug: t.slug, name: t.name }))}
            />
          </Reveal>
        </div>

        {/* Clinic info */}
        <aside className="md:col-span-4 md:col-start-9">
          <Reveal className="space-y-8">
            {location && (
              <>
                <div>
                  <p className="eyebrow text-taupe-light">Kunjungi</p>
                  <address className="not-italic prose-body mt-3">
                    {location.address}
                    <br />
                    {location.city}
                  </address>
                </div>

                <div className="border-t border-line pt-6">
                  <p className="eyebrow text-taupe-light">Hubungi</p>
                  <ul className="mt-3 space-y-2 prose-body">
                    {location.phone && (
                      <li>
                        <a
                          href={`tel:${location.phone.replace(/\s/g, "")}`}
                          className="link-underline"
                        >
                          {location.phone}
                        </a>
                      </li>
                    )}
                    {location.whatsapp && (
                      <li>
                        <a
                          href={`https://wa.me/${location.whatsapp.replace(/\D/g, "")}`}
                          className="link-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp · {location.whatsapp}
                        </a>
                      </li>
                    )}
                    {location.email && (
                      <li>
                        <a
                          href={`mailto:${location.email}`}
                          className="link-underline"
                        >
                          {location.email}
                        </a>
                      </li>
                    )}
                    {location.instagram && (
                      <li>
                        <a
                          href={`https://instagram.com/${location.instagram.replace("@", "")}`}
                          className="link-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {location.instagram}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>

                {hours.length > 0 && (
                  <div className="border-t border-line pt-6">
                    <p className="eyebrow text-taupe-light">Jam Operasional</p>
                    <ul className="mt-3 space-y-2">
                      {hours.map((h) => (
                        <li
                          key={h.day}
                          className="flex justify-between text-[0.95rem] text-ink-soft"
                        >
                          <span>{h.day}</span>
                          <span className="text-ink">{h.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </Reveal>
        </aside>
      </section>

      {/* Map */}
      {mapSrc && (
        <section className="shell pb-24">
          <Reveal className="img-frame aspect-[16/9] md:aspect-[21/9] bg-cream">
            <iframe
              title={`Peta ${location?.name ?? site.fullName}`}
              src={mapSrc}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </section>
      )}

      {/* General FAQ */}
      {faqs.length > 0 && (
        <section className="shell pb-28">
          <Reveal>
            <p className="eyebrow">Pertanyaan Umum</p>
            <h2 className="display-md mt-5 mb-10 max-w-xl">
              Hal yang sering ditanyakan
            </h2>
          </Reveal>
          <Accordion items={faqs} />
        </section>
      )}
    </>
  );
}
