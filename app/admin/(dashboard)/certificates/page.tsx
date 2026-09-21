import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/features/admin/DeleteButton";
import {
  deleteCertificate,
  toggleCertificatePublished,
} from "@/features/admin/certificates.actions";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display-md mt-3">Certificates</h1>
        </div>
        <Link href="/admin/certificates/new" className="btn-primary">
          + Certificate
        </Link>
      </div>

      <div className="mt-10 border-t border-line">
        {certificates.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-4 py-4 border-b border-line"
          >
            <div className="relative w-10 h-12 img-frame shrink-0">
              <Image src={c.imageUrl} alt={c.title} fill sizes="40px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg truncate">{c.title}</p>
              <p className="text-sm text-taupe truncate">
                {c.category}
                {c.year ? ` · ${c.year}` : ""} · {c.issuer}
              </p>
            </div>

            <form action={toggleCertificatePublished.bind(null, c.id, !c.published)}>
              <button
                type="submit"
                className={`text-[0.72rem] tracking-widest uppercase px-3 py-1 border ${
                  c.published
                    ? "border-success text-success"
                    : "border-taupe text-taupe"
                }`}
              >
                {c.published ? "Published" : "Draft"}
              </button>
            </form>

            <Link
              href={`/admin/certificates/${c.id}/edit`}
              className="text-[0.8rem] tracking-wide link-underline"
            >
              Edit
            </Link>
            <DeleteButton action={deleteCertificate.bind(null, c.id)} />
          </div>
        ))}
        {certificates.length === 0 && (
          <p className="prose-body py-8">Belum ada sertifikat.</p>
        )}
      </div>
    </div>
  );
}
