"use client";

import { useRef, useState } from "react";

// Image picker used across every admin form. It keeps a hidden input named
// `imageUrl` (or a custom `name`) so the existing server actions receive the
// value unchanged — whether it came from an upload or a pasted URL.
export function ImageField({
  name = "imageUrl",
  label = "Gambar",
  defaultValue = "",
  required = false,
}: {
  name?: string;
  label?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengunggah");
      setValue(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>

      {/* Value submitted with the form (upload path or pasted URL). */}
      <input type="hidden" name={name} value={value} />

      <div className="border border-line bg-paper p-3">
        {value ? (
          <div className="flex items-start gap-4">
            <div className="relative w-24 h-28 shrink-0 overflow-hidden bg-cream border border-line">
              {/* Plain img so any URL/host previews without next/image config. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Pratinjau"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-taupe break-all">{value}</p>
              <div className="flex flex-wrap gap-4 mt-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-[0.8rem] tracking-wide link-underline"
                >
                  {uploading ? "Mengunggah…" : "Ganti gambar"}
                </button>
                <button
                  type="button"
                  onClick={() => setValue("")}
                  className="text-[0.8rem] tracking-wide text-danger hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-8 border border-dashed border-taupe-light text-center text-sm text-taupe hover:border-ink hover:text-ink transition-colors"
          >
            {uploading ? "Mengunggah…" : "↑  Unggah gambar dari perangkat"}
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-taupe">JPG, PNG, WebP, atau AVIF · maks 6 MB.</p>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="text-xs text-taupe link-underline"
        >
          {showUrl ? "Sembunyikan URL" : "Atau tempel URL"}
        </button>
      </div>

      {showUrl && (
        <input
          type="text"
          inputMode="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://… atau /media/…"
          className="field-input mt-2"
        />
      )}

      {error && (
        <p className="text-sm text-danger mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
