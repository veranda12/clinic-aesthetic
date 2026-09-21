import Link from "next/link";
import { SubmitButton } from "./SubmitButton";
import { ImageField } from "./ImageField";
import { GalleryField } from "./GalleryField";

interface FacilityDefaults {
  name?: string;
  category?: string | null;
  description?: string | null;
  imageUrl?: string;
  imageAlt?: string | null;
  gallery?: string[];
  order?: number;
  published?: boolean;
}

const CATEGORIES = [
  "Ruang Tunggu",
  "Ruang Konsultasi",
  "Ruang Perawatan",
  "Ruang Laser & Advanced",
  "Resepsionis",
  "Area Produk",
];

export function FacilityForm({
  action,
  defaults = {},
  heading,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: FacilityDefaults;
  heading: string;
}) {
  return (
    <form action={action} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Facility</p>
          <h1 className="display-md mt-3">{heading}</h1>
        </div>
        <Link href="/admin/facilities" className="text-sm text-taupe hover:text-ink">
          ← Kembali
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="field-label">Nama fasilitas</label>
          <input id="name" name="name" required defaultValue={defaults.name} className="field-input" placeholder="Ruang Perawatan" />
        </div>
        <div>
          <label htmlFor="category" className="field-label">Kategori (opsional)</label>
          <input
            id="category"
            name="category"
            list="facility-categories"
            defaultValue={defaults.category ?? ""}
            className="field-input"
            placeholder="Ruang Perawatan"
          />
          <datalist id="facility-categories">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="field-label">Deskripsi (opsional)</label>
        <textarea id="description" name="description" rows={3} defaultValue={defaults.description ?? ""} className="field-input" />
      </div>

      <div className="space-y-6">
        <ImageField label="Gambar utama fasilitas" defaultValue={defaults.imageUrl} required />
        <div>
          <label htmlFor="imageAlt" className="field-label">Alt text gambar</label>
          <input id="imageAlt" name="imageAlt" defaultValue={defaults.imageAlt ?? ""} className="field-input" />
        </div>
        <GalleryField label="Galeri fasilitas (opsional)" defaultValue={defaults.gallery ?? []} />
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
        <SubmitButton>Simpan fasilitas</SubmitButton>
        <Link href="/admin/facilities" className="btn-ghost">Batal</Link>
      </div>
    </form>
  );
}
