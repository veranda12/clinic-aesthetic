import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Stars } from "@/components/Stars";
import { DeleteButton } from "@/features/admin/DeleteButton";
import { setReviewApproved, deleteReview } from "@/features/admin/reviews.actions";

export const dynamic = "force-dynamic";

function ReviewRow({
  review,
}: {
  review: {
    id: string;
    author: string;
    treatment: string | null;
    rating: number;
    body: string;
    approved: boolean;
    createdAt: Date;
  };
}) {
  return (
    <div className="py-5 border-b border-line">
      <div className="flex flex-wrap items-center gap-3">
        <Stars rating={review.rating} size={15} />
        <span className="font-display text-lg">{review.author}</span>
        {review.treatment && (
          <span className="text-sm text-taupe">· {review.treatment}</span>
        )}
        <span className="text-sm text-taupe-light">
          · {formatDate(review.createdAt)}
        </span>
      </div>
      <p className="prose-body text-[0.95rem] mt-2 max-w-2xl">“{review.body}”</p>
      <div className="flex items-center gap-5 mt-3">
        <form
          action={setReviewApproved.bind(null, review.id, !review.approved)}
        >
          <button
            type="submit"
            className={`text-[0.72rem] tracking-widest uppercase px-3 py-1 border ${
              review.approved
                ? "border-taupe text-taupe"
                : "border-success text-success"
            }`}
          >
            {review.approved ? "Sembunyikan" : "Setujui"}
          </button>
        </form>
        <DeleteButton action={deleteReview.bind(null, review.id)} />
      </div>
    </div>
  );
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div>
      <p className="eyebrow">Content</p>
      <h1 className="display-md mt-3">Reviews</h1>
      <p className="prose-body mt-3 max-w-lg">
        Ulasan dari pengunjung ditinjau di sini sebelum tampil di halaman
        publik.
      </p>

      <section className="mt-10">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl">Menunggu peninjauan</h2>
          <span className="text-sm text-taupe">{pending.length}</span>
        </div>
        <div className="mt-4 border-t border-line">
          {pending.map((r) => (
            <ReviewRow key={r.id} review={r} />
          ))}
          {pending.length === 0 && (
            <p className="prose-body py-6 text-sm">Tidak ada ulasan baru.</p>
          )}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl">Ditampilkan</h2>
          <span className="text-sm text-taupe">{approved.length}</span>
        </div>
        <div className="mt-4 border-t border-line">
          {approved.map((r) => (
            <ReviewRow key={r.id} review={r} />
          ))}
          {approved.length === 0 && (
            <p className="prose-body py-6 text-sm">
              Belum ada ulasan yang ditampilkan.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
