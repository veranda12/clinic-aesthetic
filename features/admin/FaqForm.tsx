import Link from "next/link";
import { SubmitButton } from "./SubmitButton";

interface Option {
  id: string;
  name: string;
}

interface FaqDefaults {
  question?: string;
  answer?: string;
  group?: string;
  order?: number;
  published?: boolean;
  treatmentId?: string | null;
}

export function FaqForm({
  action,
  treatments,
  defaults = {},
  heading,
}: {
  action: (formData: FormData) => void | Promise<void>;
  treatments: Option[];
  defaults?: FaqDefaults;
  heading: string;
}) {
  return (
    <form action={action} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">FAQ</p>
          <h1 className="display-md mt-3">{heading}</h1>
        </div>
        <Link href="/admin/faqs" className="text-sm text-taupe hover:text-ink">
          ← Kembali
        </Link>
      </div>

      <div>
        <label htmlFor="question" className="field-label">Pertanyaan</label>
        <input id="question" name="question" required defaultValue={defaults.question} className="field-input" />
      </div>

      <div>
        <label htmlFor="answer" className="field-label">Jawaban</label>
        <textarea id="answer" name="answer" required rows={5} defaultValue={defaults.answer} className="field-input" />
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="group" className="field-label">Grup</label>
          <select id="group" name="group" defaultValue={defaults.group ?? "general"} className="field-input appearance-none">
            <option value="general">general</option>
            <option value="treatment">treatment</option>
          </select>
        </div>
        <div>
          <label htmlFor="order" className="field-label">Urutan</label>
          <input id="order" name="order" type="number" defaultValue={defaults.order ?? 0} className="field-input" />
        </div>
        <div>
          <label htmlFor="treatmentId" className="field-label">Terkait treatment</label>
          <select id="treatmentId" name="treatmentId" defaultValue={defaults.treatmentId ?? ""} className="field-input appearance-none">
            <option value="">— Umum (tanpa treatment) —</option>
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
        <SubmitButton>Simpan FAQ</SubmitButton>
        <Link href="/admin/faqs" className="btn-ghost">Batal</Link>
      </div>
    </form>
  );
}
