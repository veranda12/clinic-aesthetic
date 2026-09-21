import { FacilityForm } from "@/features/admin/FacilityForm";
import { createFacility } from "@/features/admin/facilities.actions";

export const dynamic = "force-dynamic";

export default function NewFacilityPage() {
  return <FacilityForm action={createFacility} heading="Fasilitas baru" />;
}
