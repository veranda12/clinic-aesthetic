import { getSupabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

// Creates the public Storage bucket used for image uploads. Idempotent.
// Run once after configuring Supabase env vars: `npm run setup:storage`.
async function main() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error(
      "✗ Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan " +
        "SUPABASE_SERVICE_ROLE_KEY di .env terlebih dahulu."
    );
    process.exit(1);
  }

  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();
  if (listError) {
    console.error("✗ Gagal membaca buckets:", listError.message);
    process.exit(1);
  }

  if (buckets?.some((b) => b.name === STORAGE_BUCKET)) {
    console.log(`✓ Bucket "${STORAGE_BUCKET}" sudah ada.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
    public: true,
    fileSizeLimit: "6MB",
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ],
  });

  if (error) {
    console.error("✗ Gagal membuat bucket:", error.message);
    process.exit(1);
  }
  console.log(`✓ Bucket publik "${STORAGE_BUCKET}" berhasil dibuat.`);
}

main();
