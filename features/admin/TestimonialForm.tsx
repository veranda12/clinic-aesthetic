import Link from "next/link";
import { SubmitButton } from "./SubmitButton";

interface Option {
  id: string;
  name: string;
}

interface TestimonialDefaults {
  author?: string;
  context?: string | null;
  quote?: string;
  rating?: number;
  order?: number;
  published?: boolean;
  treatmentId?: string | null;
}

export function TestimonialForm({
  action,
  treatments,
  defaults = {},
  heading,
}: {
  action: (formData: FormData) => void | Promise<void>;
  treatments: Option[];
  defaults?: TestimonialDefaults;
  heading: string;
}) {
  return (
    <form action={action} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Testimonial</p>
          <h1 className="display-md mt-3">{heading}</h1>
        </div>
        <Link href="/admin/testimonials" className="text-sm text-taupe hover:text-ink">
          ← Kembali
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="author" className="field-label">Nama</label>
          <input id="author" name="author" required defaultValue={defaults.author} className="field-input" placeholder="Dinda A." />
        </div>
        <div>
          <label htmlFor="context" className="field-label">Konteks</label>
          <input id="context" name="context" defaultValue={defaults.context ?? ""} className="field-input" placeholder="Acne Treatment · 6 sesi" />
        </div>
      </div>

      <div>
        <label htmlFor="quote" className="field-label">Kutipan</label>
        <textarea id="quote" name="quote" required rows={4} defaultValue={defaults.quote} className="field-input" />
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="rating" className="field-label">Rating (1–5)</label>
          <input id="rating" name="rating" type="number" min={1} max={5} defaultValue={defaults.rating ?? 5} className="field-input" />
        </div>
        <div>
          <label htmlFor="order" className="field-label">Urutan</label>
          <input id="order" name="order" type="number" defaultValue={defaults.order ?? 0} className="field-input" />
        </div>
        <div>
          <label htmlFor="treatmentId" className="field-label">Terkait treatment</label>
          <select id="treatmentId" name="treatmentId" defaultValue={defaults.treatmentId ?? ""} className="field-input appearance-none">
            <option value="">— Tidak terkait —</option>
            {treatments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm border-t border-line pt-6">
        <input type="checkbox" name="published" defaultChecked={defaults.published ?? true} className="w-4 h-4 accent-olive" />
        Dipublikasikan
      </label>

      <div className="flex gap-4 pt-2">
        <SubmitButton>Simpan testimonial</SubmitButton>
        <Link href="/admin/testimonials" className="btn-ghost">Batal</Link>
      </div>
    </form>
  );
}
