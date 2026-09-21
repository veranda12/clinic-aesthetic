import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/features/admin/DeleteButton";
import { deleteDoctor } from "@/features/admin/doctors.actions";

export const dynamic = "force-dynamic";

export default async function AdminDoctorsPage() {
  const doctors = await prisma.doctor.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display-md mt-3">Doctors</h1>
        </div>
        <Link href="/admin/doctors/new" className="btn-primary">
          + Doctor
        </Link>
      </div>

      <div className="mt-10 border-t border-line">
        {doctors.map((d) => (
          <div
            key={d.id}
            className="flex items-center gap-4 py-4 border-b border-line"
          >
            <div className="relative w-12 h-12 img-frame shrink-0">
              <Image src={d.imageUrl} alt={d.name} fill sizes="48px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-xl">{d.name}</p>
              <p className="text-sm text-taupe truncate">{d.title}</p>
            </div>
            <span
              className={`text-[0.72rem] tracking-widest uppercase ${
                d.published ? "text-success" : "text-taupe"
              }`}
            >
              {d.published ? "Published" : "Draft"}
            </span>
            <Link href={`/admin/doctors/${d.id}/edit`} className="text-[0.8rem] tracking-wide link-underline">
              Edit
            </Link>
            <DeleteButton action={deleteDoctor.bind(null, d.id)} />
          </div>
        ))}
        {doctors.length === 0 && <p className="prose-body py-8">Belum ada dokter.</p>}
      </div>
    </div>
  );
}
