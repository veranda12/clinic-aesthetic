import { DoctorForm } from "@/features/admin/DoctorForm";
import { createDoctor } from "@/features/admin/doctors.actions";

export const dynamic = "force-dynamic";

export default function NewDoctorPage() {
  return <DoctorForm action={createDoctor} heading="Dokter baru" />;
}
