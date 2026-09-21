import Link from "next/link";
import { mainNav, secondaryNav, site } from "@/lib/site";
import { getPrimaryLocation } from "@/lib/queries";

export async function Footer() {
  const location = await getPrimaryLocation();

  return (
    <footer className="bg-ink text-ivory">
      <div className="shell pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Brand + tagline */}
          <div className="lg:col-span-5">
            <p className="font-display text-[2.6rem] leading-none tracking-[0.16em]">
              {site.wordmarkTop}
            </p>
            <p className="font-sans text-[0.6rem] tracking-[0.42em] uppercase mt-2 opacity-70">
              {site.wordmarkBottom}
            </p>
            <p className="font-display italic text-2xl mt-8 max-w-sm opacity-90">
              {site.tagline}
            </p>
          </div>

          {/* Explore */}
          <div className="lg:col-span-3 lg:col-start-7">
            <p className="eyebrow text-taupe-light mb-6">Explore</p>
            <ul className="space-y-3">
              {[...mainNav, ...secondaryNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-[0.95rem] opacity-85 hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div className="lg:col-span-3">
            <p className="eyebrow text-taupe-light mb-6">Visit</p>
            {location ? (
              <address className="not-italic text-[0.95rem] leading-relaxed opacity-85 space-y-4">
                <p>
                  {location.address}
                  <br />
                  {location.city}
                </p>
                {location.phone && (
                  <p>
                    <a
                      href={`tel:${location.phone.replace(/\s/g, "")}`}
                      className="link-underline"
                    >
                      {location.phone}
                    </a>
                  </p>
                )}
                <div className="flex gap-5 pt-1">
                  {location.whatsapp && (
                    <a
                      href={`https://wa.me/${location.whatsapp.replace(/\D/g, "")}`}
                      className="link-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  )}
                  {location.instagram && (
                    <a
                      href={`https://instagram.com/${location.instagram.replace("@", "")}`}
                      className="link-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </address>
            ) : (
              <p className="text-[0.95rem] opacity-70">{site.city}</p>
            )}
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-ivory/15 flex flex-col sm:flex-row justify-between gap-4 text-[0.78rem] text-ivory/55">
          <p>
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <p className="tracking-[0.06em]">
            Company profile demo · dirancang untuk klinik aesthetic
          </p>
        </div>
      </div>
    </footer>
  );
}
