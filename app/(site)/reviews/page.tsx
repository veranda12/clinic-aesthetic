import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Stars } from "@/components/Stars";
import { ReviewForm } from "@/components/ReviewForm";
import { formatDate } from "@/lib/utils";
import {
  getApprovedReviews,
  getReviewStats,
  getAllPublishedTreatments,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Ulasan dan rating dari pasien AURELIA Skin & Aesthetic. Bagikan pengalaman perawatan kulit Anda.",
  alternates: { canonical: "/reviews" },
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [reviews, stats, treatments] = await Promise.all([
    getApprovedReviews(),
    getReviewStats(),
    getAllPublishedTreatments(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="Pengalaman, dari mereka yang merasakannya."
        intro="Kepercayaan dibangun dari cerita nyata. Berikut ulasan pasien AURELIA — dan Anda pun dapat membagikan pengalaman Anda sendiri."
      />

      {/* Summary */}
      {stats.count > 0 && (
        <section className="shell pb-16">
          <Reveal className="border-t border-b border-line py-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-6xl leading-none">
                {stats.average.toFixed(1)}
              </span>
              <span className="text-taupe text-sm">/ 5</span>
            </div>
            <div>
              <Stars rating={stats.average} size={22} />
              <p className="text-sm text-taupe mt-2">
                Berdasarkan {stats.count} ulasan pasien
              </p>
            </div>
          </Reveal>
        </section>
      )}

      {/* Review list */}
      <section className="shell pb-20">
        {reviews.length === 0 ? (
          <p className="prose-body border-t border-line pt-10">
            Belum ada ulasan. Jadilah yang pertama membagikan pengalaman Anda.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
            {reviews.map((r, i) => (
              <Reveal
                key={r.id}
                delay={(i % 2) * 90}
                as="figure"
                className="border-t border-line pt-8"
              >
                <Stars rating={r.rating} size={16} />
                <blockquote className="font-display text-[1.4rem] leading-snug mt-5">
                  “{r.body}”
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="text-ink">{r.author}</span>
                  {r.treatment && (
                    <span className="text-taupe"> · {r.treatment}</span>
                  )}
                  <span className="text-taupe-light">
                    {" "}
                    · {formatDate(r.createdAt)}
                  </span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Submit form */}
      <section className="bg-paper py-20 md:py-28">
        <div className="shell grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow">Tulis Ulasan</p>
              <h2 className="display-md mt-4">
                Bagikan pengalaman Anda.
              </h2>
              <p className="prose-body mt-5">
                Cerita Anda membantu orang lain merasa lebih tenang sebelum
                memulai perawatan.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal>
              <ReviewForm treatments={treatments.map((t) => t.name)} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
