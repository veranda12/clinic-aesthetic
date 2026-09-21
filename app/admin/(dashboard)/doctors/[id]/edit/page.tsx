import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DoctorForm } from "@/features/admin/DoctorForm";
import { updateDoctor } from "@/features/admin/doctors.actions";

export const dynamic = "force-dynamic";

export default async function EditDoctorPage({
  params,
}: {
  params: { id: string };
}) {
  const doctor = await prisma.doctor.findUnique({ where: { id: params.id } });
  if (!doctor) notFound();

  return (
    <DoctorForm
      action={updateDoctor.bind(null, doctor.id)}
      heading="Edit dokter"
      defaults={doctor}
    />
  );
}
