import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ivory px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow">404</p>
        <h1 className="display-lg mt-6">Halaman tidak ditemukan.</h1>
        <p className="lead mt-5">
          Sepertinya halaman yang Anda cari sudah dipindahkan atau tidak ada.
        </p>
        <Link href="/" className="btn-primary mt-9">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
