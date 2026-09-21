import Link from "next/link";
import { SubmitButton } from "./SubmitButton";
import { ImageField } from "./ImageField";
import { GalleryField } from "./GalleryField";
import type { ProcessStep } from "@/types/content";

interface Category {
  id: string;
  name: string;
}

interface TreatmentDefaults {
  name?: string;
  slug?: string;
  categoryId?: string;
  summary?: string;
  description?: string;
  howItWorks?: string | null;
  whoFor?: string | null;
  expected?: string | null;
  aftercare?: string | null;
  concerns?: string[];
  process?: unknown;
  duration?: string | null;
  frequency?: string | null;
  priceFrom?: number | null;
  imageUrl?: string;
  imageAlt?: string | null;
  gallery?: string[];
  featured?: boolean;
  published?: boolean;
  order?: number;
}

export function TreatmentForm({
  action,
  categories,
  defaults = {},
  heading,
}: {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  defaults?: TreatmentDefaults;
  heading: string;
}) {
  const steps = (defaults.process as ProcessStep[] | undefined) ?? [];
  const processText = steps
    .map((s) => `${s.title} :: ${s.description}`)
    .join("\n");

  return (
    <form action={action} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Treatment</p>
          <h1 className="display-md mt-3">{heading}</h1>
        </div>
        <Link href="/admin/treatments" className="text-sm text-taupe hover:text-ink">
          ← Kembali
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="field-label">Nama</label>
          <input id="name" name="name" required defaultValue={defaults.name} className="field-input" />
        </div>
        <div>
          <label htmlFor="slug" className="field-label">Slug</label>
          <input id="slug" name="slug" required defaultValue={defaults.slug} className="field-input" placeholder="acne-treatment" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="categoryId" className="field-label">Kategori</label>
          <select id="categoryId" name="categoryId" required defaultValue={defaults.categoryId ?? ""} className="field-input appearance-none">
            <option value="" disabled>Pilih kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="order" className="field-label">Urutan</label>
          <input id="order" name="order" type="number" defaultValue={defaults.order ?? 0} className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="field-label">Ringkasan (1 kalimat)</label>
        <input id="summary" name="summary" required defaultValue={defaults.summary} className="field-input" />
      </div>

      <div>
        <label htmlFor="description" className="field-label">Deskripsi</label>
        <textarea id="description" name="description" required rows={5} defaultValue={defaults.description} className="field-input" />
        <p className="text-xs text-taupe mt-1">Pisahkan paragraf dengan baris kosong.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="howItWorks" className="field-label">Bagaimana cara kerjanya</label>
          <textarea id="howItWorks" name="howItWorks" rows={3} defaultValue={defaults.howItWorks ?? ""} className="field-input" />
        </div>
        <div>
          <label htmlFor="whoFor" className="field-label">Untuk siapa</label>
          <textarea id="whoFor" name="whoFor" rows={3} defaultValue={defaults.whoFor ?? ""} className="field-input" />
        </div>
        <div>
          <label htmlFor="expected" className="field-label">Hasil yang diharapkan</label>
          <textarea id="expected" name="expected" rows={3} defaultValue={defaults.expected ?? ""} className="field-input" />
        </div>
        <div>
          <label htmlFor="aftercare" className="field-label">Aftercare</label>
          <textarea id="aftercare" name="aftercare" rows={3} defaultValue={defaults.aftercare ?? ""} className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="concerns" className="field-label">Concerns (pisahkan dengan koma)</label>
        <input id="concerns" name="concerns" defaultValue={defaults.concerns?.join(", ")} className="field-input" placeholder="Jerawat aktif, Komedo, Pori besar" />
      </div>

      <div>
        <label htmlFor="process" className="field-label">Proses (satu langkah per baris)</label>
        <textarea id="process" name="process" rows={4} defaultValue={processText} className="field-input font-sans text-sm" placeholder="Konsultasi :: Dokter menilai kondisi kulit" />
        <p className="text-xs text-taupe mt-1">Format: <code>Judul :: Deskripsi</code></p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="duration" className="field-label">Durasi</label>
          <input id="duration" name="duration" defaultValue={defaults.duration ?? ""} className="field-input" placeholder="45–60 menit" />
        </div>
        <div>
          <label htmlFor="frequency" className="field-label">Frekuensi</label>
          <input id="frequency" name="frequency" defaultValue={defaults.frequency ?? ""} className="field-input" placeholder="Setiap 2–4 minggu" />
        </div>
        <div>
          <label htmlFor="priceFrom" className="field-label">Harga mulai (Rp)</label>
          <input id="priceFrom" name="priceFrom" defaultValue={defaults.priceFrom ?? ""} className="field-input" placeholder="450000" />
        </div>
      </div>

      <div className="space-y-6">
        <ImageField label="Gambar utama treatment" defaultValue={defaults.imageUrl} required />
        <div>
          <label htmlFor="imageAlt" className="field-label">Alt text gambar</label>
          <input id="imageAlt" name="imageAlt" defaultValue={defaults.imageAlt ?? ""} className="field-input" />
        </div>
        <GalleryField label="Galeri treatment (opsional)" defaultValue={defaults.gallery ?? []} />
      </div>

      <div className="flex flex-wrap gap-8 border-t border-line pt-6">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="featured" defaultChecked={defaults.featured} className="w-4 h-4 accent-olive" />
          Tampilkan sebagai signature (featured)
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="published" defaultChecked={defaults.published ?? true} className="w-4 h-4 accent-olive" />
          Dipublikasikan
        </label>
      </div>

      <div className="flex gap-4 pt-2">
        <SubmitButton>Simpan treatment</SubmitButton>
        <Link href="/admin/treatments" className="btn-ghost">Batal</Link>
      </div>
    </form>
  );
}
