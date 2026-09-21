"use client";

import { useRef, useState } from "react";

// Multi-image picker. Emits one hidden <input name="gallery"> per image, so the
// server action reads the ordered list with formData.getAll("gallery").
export function GalleryField({
  name = "gallery",
  label = "Galeri foto",
  defaultValue = [],
}: {
  name?: string;
  label?: string;
  defaultValue?: string[];
}) {
  const [items, setItems] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Gagal mengunggah");
    return data.url as string;
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await uploadOne(file));
      setItems((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addUrl() {
    const v = url.trim();
    if (!v) return;
    setItems((prev) => [...prev, v]);
    setUrl("");
  }

  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      <span className="field-label">{label}</span>

      {/* Ordered hidden inputs — this is what the form submits. */}
      {items.map((src, i) => (
        <input key={`${src}-${i}`} type="hidden" name={name} value={src} />
      ))}

      <div className="border border-line bg-paper p-3">
        {items.length > 0 && (
          <ul className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
            {items.map((src, i) => (
              <li key={`${src}-${i}`} className="relative group">
                <div className="relative aspect-square overflow-hidden bg-cream border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="absolute top-1 left-1 text-[0.6rem] tracking-widest bg-ink/80 text-ivory px-1.5 py-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-1 bottom-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Geser ke kiri"
                      className="w-6 h-6 bg-ivory/90 text-ink text-xs disabled:opacity-30"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === items.length - 1}
                      aria-label="Geser ke kanan"
                      className="w-6 h-6 bg-ivory/90 text-ink text-xs disabled:opacity-30"
                    >
                      ›
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Hapus foto"
                    className="w-6 h-6 bg-danger text-ivory text-xs"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full py-5 border border-dashed border-taupe-light text-center text-sm text-taupe hover:border-ink hover:text-ink transition-colors"
        >
          {uploading ? "Mengunggah…" : "↑  Unggah beberapa foto sekaligus"}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="atau tempel URL lalu Enter"
          className="field-input flex-1"
        />
        <button type="button" onClick={addUrl} className="btn-ghost shrink-0">
          Tambah URL
        </button>
      </div>

      <p className="text-xs text-taupe mt-2">
        {items.length} foto · pilih beberapa berkas sekaligus. Urutan foto dapat
        diatur dengan tombol ‹ ›.
      </p>

      {error && (
        <p className="text-sm text-danger mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
