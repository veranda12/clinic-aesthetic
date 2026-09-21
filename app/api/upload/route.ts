import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getSession } from "@/lib/auth";
import {
  getSupabaseAdmin,
  isSupabaseStorageEnabled,
  STORAGE_BUCKET,
} from "@/lib/supabase";

export const runtime = "nodejs";

// Accepted image types → file extension.
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_BYTES = 6 * 1024 * 1024; // 6 MB

// Handles admin image uploads.
//  - Supabase Storage when configured (required on Vercel — read-only FS).
//  - Otherwise writes to /public/uploads and serves via /media/[name] (dev).
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Berkas tidak ditemukan" }, { status: 400 });
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Format tidak didukung. Gunakan JPG, PNG, WebP, atau AVIF." },
      { status: 415 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Ukuran berkas maksimal 6 MB." },
      { status: 413 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

  // --- Supabase Storage (production / Vercel) ---
  if (isSupabaseStorageEnabled()) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Konfigurasi Supabase tidak lengkap." },
        { status: 500 }
      );
    }
    const objectPath = `uploads/${filename}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, bytes, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });
    if (error) {
      return NextResponse.json(
        { error: `Gagal mengunggah ke Storage: ${error.message}` },
        { status: 502 }
      );
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
    return NextResponse.json({ url: publicUrl });
  }

  // --- Local filesystem (development) ---
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return NextResponse.json({ url: `/media/${filename}` });
}
