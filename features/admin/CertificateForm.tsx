import Link from "next/link";
import { SubmitButton } from "./SubmitButton";
import { ImageField } from "./ImageField";

interface CertificateDefaults {
  title?: string;
  issuer?: string;
  category?: string;
  year?: string | null;
  description?: string | null;
  imageUrl?: string;
  imageAlt?: string | null;
  order?: number;
  published?: boolean;
}

// Suggested buckets — free text, so admins can add their own.
const CATEGORIES = [
  "Perizinan & Legalitas",
  "Akreditasi",
  "Sertifikasi Medis",
  "Keanggotaan Profesi",
  "Penghargaan",
];

export function CertificateForm({
  action,
  defaults = {},
  heading,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: CertificateDefaults;
  heading: string;
}) {
  return (
    <form action={action} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Certificate</p>
          <h1 className="display-md mt-3">{heading}</h1>
        </div>
        <Link href="/admin/certificates" className="text-sm text-taupe hover:text-ink">
          ← Kembali
        </Link>
      </div>

      <div>
        <label htmlFor="title" className="field-label">Judul sertifikat</label>
        <input id="title" name="title" required defaultValue={defaults.title} className="field-input" placeholder="Izin Operasional Klinik" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="issuer" className="field-label">Penerbit</label>
          <input id="issuer" name="issuer" required defaultValue={defaults.issuer} className="field-input" placeholder="Dinas Kesehatan DKI Jakarta" />
        </div>
        <div>
          <label htmlFor="year" className="field-label">Tahun</label>
          <input id="year" name="year" defaultValue={defaults.year ?? ""} className="field-input" placeholder="2024" />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="field-label">Kategori</label>
        <input
          id="category"
          name="category"
          required
          list="certificate-categories"
          defaultValue={defaults.category ?? ""}
          className="field-input"
          placeholder="Perizinan & Legalitas"
        />
        <datalist id="certificate-categories">
          {CATEGORIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <p className="text-xs text-taupe mt-1">
          Sertifikat dikelompokkan berdasarkan kategori di halaman publik.
        </p>
      </div>

      <div>
        <label htmlFor="description" className="field-label">Deskripsi (opsional)</label>
        <textarea id="description" name="description" rows={3} defaultValue={defaults.description ?? ""} className="field-input" />
      </div>

      <div className="space-y-6">
        <ImageField label="Gambar sertifikat" defaultValue={defaults.imageUrl} required />
        <div>
          <label htmlFor="imageAlt" className="field-label">Alt text gambar</label>
          <input id="imageAlt" name="imageAlt" defaultValue={defaults.imageAlt ?? ""} className="field-input" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 border-t border-line pt-6 items-end">
        <div>
          <label htmlFor="order" className="field-label">Urutan</label>
          <input id="order" name="order" type="number" defaultValue={defaults.order ?? 0} className="field-input" />
        </div>
        <label className="flex items-center gap-3 text-sm pb-3">
          <input type="checkbox" name="published" defaultChecked={defaults.published ?? true} className="w-4 h-4 accent-olive" />
          Dipublikasikan
        </label>
      </div>

      <div className="flex gap-4 pt-2">
        <SubmitButton>Simpan sertifikat</SubmitButton>
        <Link href="/admin/certificates" className="btn-ghost">Batal</Link>
      </div>
    </form>
  );
}
