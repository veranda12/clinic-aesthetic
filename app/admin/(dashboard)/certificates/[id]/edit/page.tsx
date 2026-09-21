import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CertificateForm } from "@/features/admin/CertificateForm";
import { updateCertificate } from "@/features/admin/certificates.actions";

export const dynamic = "force-dynamic";

export default async function EditCertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const certificate = await prisma.certificate.findUnique({
    where: { id: params.id },
  });
  if (!certificate) notFound();

  return (
    <CertificateForm
      action={updateCertificate.bind(null, certificate.id)}
      heading="Edit sertifikat"
      defaults={certificate}
    />
  );
}
