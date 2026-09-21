import { CertificateForm } from "@/features/admin/CertificateForm";
import { createCertificate } from "@/features/admin/certificates.actions";

export const dynamic = "force-dynamic";

export default function NewCertificatePage() {
  return <CertificateForm action={createCertificate} heading="Sertifikat baru" />;
}
