"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitReview, type ReviewFormState } from "@/features/reviews.actions";

function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div
      className="flex items-center gap-1.5"
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} bintang`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          className="p-1 -m-1 transition-transform hover:scale-110"
        >
          <svg
            width={30}
            height={30}
            viewBox="0 0 24 24"
            fill={n <= active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.2}
            className={n <= active ? "text-clay" : "text-taupe-light"}
          >
            <path d="M12 2.2l2.9 6.03 6.6.77-4.9 4.5 1.32 6.5L12 17.9 6.08 20.5l1.32-6.5-4.9-4.5 6.6-.77z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Mengirim…" : "Kirim ulasan"}
    </button>
  );
}

export function ReviewForm({ treatments }: { treatments: string[] }) {
  const [state, formAction] = useFormState<ReviewFormState, FormData>(
    submitReview,
    {}
  );
  const [rating, setRating] = useState(0);

  if (state.success) {
    return (
      <div className="border border-line bg-paper p-8 text-center">
        <p className="font-display text-2xl">Terima kasih atas ulasan Anda.</p>
        <p className="prose-body mt-3 text-[0.95rem] max-w-sm mx-auto">
          Ulasan Anda kami terima dan akan ditampilkan setelah ditinjau oleh
          tim kami.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="rating" value={rating} />

      <div>
        <span className="field-label">Rating Anda</span>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="author" className="field-label">Nama</label>
          <input
            id="author"
            name="author"
            required
            className="field-input"
            placeholder="Nama Anda"
          />
        </div>
        <div>
          <label htmlFor="treatment" className="field-label">
            Perawatan (opsional)
          </label>
          <select
            id="treatment"
            name="treatment"
            className="field-input appearance-none"
            defaultValue=""
          >
            <option value="">— Pilih perawatan —</option>
            {treatments.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="body" className="field-label">Ulasan Anda</label>
        <textarea
          id="body"
          name="body"
          required
          rows={4}
          className="field-input resize-none"
          placeholder="Bagikan pengalaman Anda selama perawatan di AURELIA…"
        />
      </div>

      {state.error && (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton />
        <p className="text-xs text-taupe max-w-xs">
          Ulasan ditinjau sebelum ditampilkan.
        </p>
      </div>
    </form>
  );
}
