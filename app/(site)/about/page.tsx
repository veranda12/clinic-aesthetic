import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tentang AURELIA Skin & Aesthetic — aesthetic clinic di Jakarta Selatan dengan pendekatan medis yang tenang, berbasis bukti, dan berfokus pada kesehatan kulit jangka panjang.",
  alternates: { canonical: "/about" },
};

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

const values = [
  {
    title: "Mendengarkan lebih dulu",
    body: "Setiap perawatan dimulai dari memahami kondisi, kebutuhan, dan kekhawatiran Anda — bukan dari menjual tindakan.",
  },
  {
    title: "Berbasis bukti",
    body: "Kami mengedepankan pendekatan medis yang aman dan teruji, bukan tren sesaat atau janji instan.",
  },
  {
    title: "Hasil yang natural",
    body: "Tujuan kami adalah kulit yang sehat dan terlihat seperti diri Anda — hanya versi yang lebih segar.",
  },
  {
    title: "Transparan",
    body: "Kami menjelaskan alasan di balik setiap rekomendasi, termasuk hasil yang realistis dan yang tidak.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Klinik yang dibangun di atas kepercayaan, bukan janji."
        intro={`AURELIA Skin & Aesthetic adalah aesthetic clinic di ${site.city} yang merawat kulit dengan pendekatan medis yang tenang dan personal.`}
      />

      {/* Story with large image */}
      <section className="shell pb-24">
        <Reveal className="img-frame aspect-[16/9] md:aspect-[21/9]">
          <Image
            src={img("1512290923902-8a9f81dc236c", 2000)}
            alt="Interior AURELIA Skin & Aesthetic"
            fill
            sizes="100vw"
            className="object-cover media-cinematic"
          />
        </Reveal>
      </section>

      <section className="shell pb-24 md:pb-32 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <Reveal>
            <p className="eyebrow">Cerita Kami</p>
          </Reveal>
        </div>
        <div className="md:col-span-8">
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.35]">
              AURELIA lahir dari sebuah keresahan sederhana: terlalu banyak orang
              yang merawat kulitnya dengan cara yang justru merusaknya.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="prose-body mt-8 max-w-prose2">
              <p>
                Kami melihat pasien datang dengan kulit yang lelah — bukan karena
                kurang perawatan, melainkan karena terlalu banyak perawatan yang
                keliru. Produk yang bertumpuk, tindakan yang berlebihan, dan janji
                hasil instan yang tidak realistis.
              </p>
              <p>
                Maka kami membangun klinik yang berbeda. Tempat di mana dokter
                punya waktu untuk mendengarkan, di mana rekomendasi diberikan
                dengan jujur, dan di mana kesehatan kulit dianggap lebih penting
                daripada hasil sesaat.
              </p>
              <p>
                Nama <em>Aurelia</em> berarti cahaya keemasan — kilau sehat yang
                muncul ketika kulit dirawat dengan tepat dan penuh kesabaran.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Philosophy — dark band */}
      <section className="bg-ink text-ivory py-24 md:py-36">
        <div className="shell text-center max-w-4xl mx-auto">
          <Reveal>
            <p className="eyebrow text-taupe-light">Filosofi</p>
            <p className="font-display italic text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.3] mt-8">
              “Kami percaya perawatan kulit terbaik dimulai dari mendengarkan,
              bukan menjual.”
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="shell py-24 md:py-32">
        <Reveal>
          <p className="eyebrow">Nilai Kami</p>
          <h2 className="display-lg mt-5 max-w-2xl">
            Empat hal yang memandu setiap keputusan.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 mt-16">
          {values.map((v, i) => (
            <Reveal
              key={v.title}
              delay={i * 80}
              className="border-t border-line pt-6"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-display text-3xl text-taupe-light">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-2xl">{v.title}</h3>
                  <p className="prose-body mt-3">{v.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Interior gallery */}
      <section className="shell pb-28">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[
            "1598528738936-c50861cc75a9",
            "1631217868264-e5b90bb7e133",
            "1608248543803-ba4f8c70ae0b",
          ].map((id, i) => (
            <Reveal
              key={id}
              delay={i * 80}
              className={`group img-frame aspect-[3/4] ${
                i === 2 ? "col-span-2 md:col-span-1 aspect-[4/3] md:aspect-[3/4]" : ""
              }`}
            >
              <Image
                src={img(id)}
                alt="Interior klinik AURELIA"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover media-gallery"
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pb-28">
        <Reveal className="border-t border-line pt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h2 className="display-md max-w-xl">
            Kami akan senang mengenal kulit Anda.
          </h2>
          <Link href="/contact#book" className="btn-primary whitespace-nowrap">
            Book Consultation
          </Link>
        </Reveal>
      </section>
    </>
  );
}
