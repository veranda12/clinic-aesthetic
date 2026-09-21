import Link from "next/link";
import { SubmitButton } from "./SubmitButton";
import { ImageField } from "./ImageField";

interface DoctorDefaults {
  name?: string;
  slug?: string;
  title?: string;
  education?: string | null;
  specialization?: string | null;
  bio?: string;
  imageUrl?: string;
  imageAlt?: string | null;
  order?: number;
  published?: boolean;
}

export function DoctorForm({
  action,
  defaults = {},
  heading,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: DoctorDefaults;
  heading: string;
}) {
  return (
    <form action={action} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Doctor</p>
          <h1 className="display-md mt-3">{heading}</h1>
        </div>
        <Link href="/admin/doctors" className="text-sm text-taupe hover:text-ink">
          ← Kembali
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="field-label">Nama</label>
          <input id="name" name="name" required defaultValue={defaults.name} className="field-input" placeholder="dr. Nama Lengkap" />
        </div>
        <div>
          <label htmlFor="slug" className="field-label">Slug</label>
          <input id="slug" name="slug" required defaultValue={defaults.slug} className="field-input" placeholder="dr-nama-lengkap" />
        </div>
      </div>

      <div>
        <label htmlFor="title" className="field-label">Titel / Jabatan</label>
        <input id="title" name="title" required defaultValue={defaults.title} className="field-input" placeholder="Aesthetic & Dermatology Physician" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="specialization" className="field-label">Spesialisasi</label>
          <input id="specialization" name="specialization" defaultValue={defaults.specialization ?? ""} className="field-input" />
        </div>
        <div>
          <label htmlFor="education" className="field-label">Pendidikan</label>
          <input id="education" name="education" defaultValue={defaults.education ?? ""} className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="field-label">Biografi</label>
        <textarea id="bio" name="bio" required rows={5} defaultValue={defaults.bio} className="field-input" />
        <p className="text-xs text-taupe mt-1">Pisahkan paragraf dengan baris kosong.</p>
      </div>

      <div className="space-y-6">
        <ImageField label="Foto dokter" defaultValue={defaults.imageUrl} required />
        <div>
          <label htmlFor="imageAlt" className="field-label">Alt text foto</label>
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
        <SubmitButton>Simpan dokter</SubmitButton>
        <Link href="/admin/doctors" className="btn-ghost">Batal</Link>
      </div>
    </form>
  );
}
