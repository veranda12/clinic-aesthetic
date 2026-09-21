import Link from "next/link";
import { SubmitButton } from "./SubmitButton";
import { ImageField } from "./ImageField";

interface Option {
  id: string;
  name: string;
}

interface ArticleDefaults {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string | null;
  readMinutes?: number;
  categoryId?: string | null;
  authorId?: string | null;
  published?: boolean;
}

export function ArticleForm({
  action,
  categories,
  authors,
  defaults = {},
  heading,
}: {
  action: (formData: FormData) => void | Promise<void>;
  categories: Option[];
  authors: Option[];
  defaults?: ArticleDefaults;
  heading: string;
}) {
  return (
    <form action={action} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Journal</p>
          <h1 className="display-md mt-3">{heading}</h1>
        </div>
        <Link href="/admin/articles" className="text-sm text-taupe hover:text-ink">
          ← Kembali
        </Link>
      </div>

      <div>
        <label htmlFor="title" className="field-label">Judul</label>
        <input id="title" name="title" required defaultValue={defaults.title} className="field-input" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="slug" className="field-label">Slug</label>
          <input id="slug" name="slug" required defaultValue={defaults.slug} className="field-input" />
        </div>
        <div>
          <label htmlFor="readMinutes" className="field-label">Menit baca</label>
          <input id="readMinutes" name="readMinutes" type="number" defaultValue={defaults.readMinutes ?? 4} className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="field-label">Ringkasan</label>
        <textarea id="excerpt" name="excerpt" required rows={2} defaultValue={defaults.excerpt} className="field-input" />
      </div>

      <div>
        <label htmlFor="body" className="field-label">Isi artikel</label>
        <textarea id="body" name="body" required rows={12} defaultValue={defaults.body} className="field-input" />
        <p className="text-xs text-taupe mt-1">Pisahkan paragraf dengan baris kosong.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="categoryId" className="field-label">Kategori</label>
          <select id="categoryId" name="categoryId" defaultValue={defaults.categoryId ?? ""} className="field-input appearance-none">
            <option value="">— Tanpa kategori —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="authorId" className="field-label">Penulis (dokter)</label>
          <select id="authorId" name="authorId" defaultValue={defaults.authorId ?? ""} className="field-input appearance-none">
            <option value="">— Tanpa penulis —</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <ImageField label="Gambar sampul" defaultValue={defaults.imageUrl} required />
        <div>
          <label htmlFor="imageAlt" className="field-label">Alt text gambar</label>
          <input id="imageAlt" name="imageAlt" defaultValue={defaults.imageAlt ?? ""} className="field-input" />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm border-t border-line pt-6">
        <input type="checkbox" name="published" defaultChecked={defaults.published} className="w-4 h-4 accent-olive" />
        Publikasikan artikel
      </label>

      <div className="flex gap-4 pt-2">
        <SubmitButton>Simpan artikel</SubmitButton>
        <Link href="/admin/articles" className="btn-ghost">Batal</Link>
      </div>
    </form>
  );
}
