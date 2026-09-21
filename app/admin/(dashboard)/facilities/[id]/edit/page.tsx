import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FacilityForm } from "@/features/admin/FacilityForm";
import { updateFacility } from "@/features/admin/facilities.actions";

export const dynamic = "force-dynamic";

export default async function EditFacilityPage({
  params,
}: {
  params: { id: string };
}) {
  const facility = await prisma.facility.findUnique({ where: { id: params.id } });
  if (!facility) notFound();

  return (
    <FacilityForm
      action={updateFacility.bind(null, facility.id)}
      heading="Edit fasilitas"
      defaults={facility}
    />
  );
}
