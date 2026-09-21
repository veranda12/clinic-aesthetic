import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { formatPrice, pad2 } from "@/lib/utils";

interface TreatmentRowData {
  slug: string;
  name: string;
  summary: string;
  concerns: string[];
  duration: string | null;
  priceFrom: number | null;
  imageUrl: string;
  imageAlt: string | null;
}

// Editorial alternating row — image and text swap sides by index parity.
export function TreatmentRow({
  treatment,
  index,
}: {
  treatment: TreatmentRowData;
  index: number;
}) {
  const flip = index % 2 === 1;

  return (
    <Reveal className="group grid gap-8 md:gap-14 md:grid-cols-2 items-center py-14 md:py-20 border-t border-line">
      <Link
        href={`/treatments/${treatment.slug}`}
        className={`img-frame aspect-[4/5] md:aspect-[5/6] ${
          flip ? "md:order-2" : ""
        }`}
      >
        <Image
          src={treatment.imageUrl}
          alt={treatment.imageAlt ?? treatment.name}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover media-treatment"
        />
      </Link>

      <div className={flip ? "md:order-1 md:pr-10" : "md:pl-10"}>
        <span className="font-display text-3xl text-taupe-light">
          {pad2(index + 1)}
        </span>
        <h3 className="display-md mt-4 transition-transform duration-[600ms] ease-editorial group-hover:translate-x-2">
          {treatment.name}
        </h3>
        <p className="prose-body mt-5 max-w-md">{treatment.summary}</p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-7 text-sm text-taupe">
          {treatment.duration && <span>{treatment.duration}</span>}
          {treatment.priceFrom && (
            <span>Mulai {formatPrice(treatment.priceFrom)}</span>
          )}
        </div>

        {treatment.concerns.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {treatment.concerns.slice(0, 4).map((c) => (
              <span
                key={c}
                className="text-[0.72rem] tracking-wide text-ink-soft border border-line px-3 py-1"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/treatments/${treatment.slug}`}
          className="inline-flex items-center gap-2 mt-8 text-sm tracking-[0.12em] uppercase"
        >
          <span className="reveal-underline">Lihat perawatan</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-[600ms] ease-editorial group-hover:translate-x-2.5"
          >
            →
          </span>
        </Link>
      </div>
    </Reveal>
  );
}
