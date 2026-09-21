import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/features/admin/DeleteButton";
import {
  deleteFacility,
  toggleFacilityPublished,
} from "@/features/admin/facilities.actions";

export const dynamic = "force-dynamic";

export default async function AdminFacilitiesPage() {
  const facilities = await prisma.facility.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="display-md mt-3">Facilities</h1>
        </div>
        <Link href="/admin/facilities/new" className="btn-primary">
          + Facility
        </Link>
      </div>

      <div className="mt-10 border-t border-line">
        {facilities.map((f) => (
          <div key={f.id} className="flex items-center gap-4 py-4 border-b border-line">
            <div className="relative w-14 h-12 img-frame shrink-0">
              <Image src={f.imageUrl} alt={f.name} fill sizes="56px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg truncate">{f.name}</p>
              {f.category && <p className="text-sm text-taupe truncate">{f.category}</p>}
            </div>

            <form action={toggleFacilityPublished.bind(null, f.id, !f.published)}>
              <button
                type="submit"
                className={`text-[0.72rem] tracking-widest uppercase px-3 py-1 border ${
                  f.published ? "border-success text-success" : "border-taupe text-taupe"
                }`}
              >
                {f.published ? "Published" : "Draft"}
              </button>
            </form>

            <Link href={`/admin/facilities/${f.id}/edit`} className="text-[0.8rem] tracking-wide link-underline">
              Edit
            </Link>
            <DeleteButton action={deleteFacility.bind(null, f.id)} />
          </div>
        ))}
        {facilities.length === 0 && <p className="prose-body py-8">Belum ada fasilitas.</p>}
      </div>
    </div>
  );
}
