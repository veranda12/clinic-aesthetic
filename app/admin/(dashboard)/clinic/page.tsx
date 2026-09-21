import { prisma } from "@/lib/db";
import { SubmitButton } from "@/features/admin/SubmitButton";
import { updateClinic } from "@/features/admin/clinic.actions";
import type { OpeningHour } from "@/types/content";

export const dynamic = "force-dynamic";

export default async function AdminClinicPage() {
  const location =
    (await prisma.clinicLocation.findFirst({ where: { isPrimary: true } })) ??
    (await prisma.clinicLocation.findFirst({ orderBy: { order: "asc" } }));

  const hours = (location?.hours as unknown as OpeningHour[] | null) ?? [];
  const hoursText = hours.map((h) => `${h.day} :: ${h.hours}`).join("\n");

  return (
    <div>
      <p className="eyebrow">Content</p>
      <h1 className="display-md mt-3 mb-10">Informasi Klinik</h1>

      <form
        action={updateClinic.bind(null, location?.id ?? null)}
        className="space-y-8 max-w-2xl"
      >
        <div>
          <label htmlFor="name" className="field-label">Nama lokasi</label>
          <input id="name" name="name" required defaultValue={location?.name} className="field-input" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="address" className="field-label">Alamat</label>
            <input id="address" name="address" required defaultValue={location?.address} className="field-input" />
          </div>
          <div>
            <label htmlFor="city" className="field-label">Kota / kode pos</label>
            <input id="city" name="city" required defaultValue={location?.city} className="field-input" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="field-label">Telepon</label>
            <input id="phone" name="phone" defaultValue={location?.phone ?? ""} className="field-input" />
          </div>
          <div>
            <label htmlFor="whatsapp" className="field-label">WhatsApp</label>
            <input id="whatsapp" name="whatsapp" defaultValue={location?.whatsapp ?? ""} className="field-input" placeholder="+62 812 …" />
          </div>
          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input id="email" name="email" defaultValue={location?.email ?? ""} className="field-input" />
          </div>
          <div>
            <label htmlFor="instagram" className="field-label">Instagram</label>
            <input id="instagram" name="instagram" defaultValue={location?.instagram ?? ""} className="field-input" placeholder="@aurelia.skin" />
          </div>
        </div>

        <div>
          <label htmlFor="hours" className="field-label">Jam operasional (satu baris per hari)</label>
          <textarea id="hours" name="hours" rows={5} defaultValue={hoursText} className="field-input font-sans text-sm" placeholder="Senin – Jumat :: 10.00 – 20.00" />
          <p className="text-xs text-taupe mt-1">Format: <code>Hari :: Jam</code></p>
        </div>

        <div>
          <label htmlFor="mapEmbedUrl" className="field-label">Google Maps embed URL (opsional)</label>
          <textarea id="mapEmbedUrl" name="mapEmbedUrl" rows={3} defaultValue={location?.mapEmbedUrl ?? ""} className="field-input font-sans text-sm" placeholder="Kosongkan untuk peta otomatis dari alamat" />
          <p className="text-xs text-taupe mt-1 leading-relaxed">
            Biarkan kosong → peta otomatis dibuat dari alamat. Untuk peta khusus,
            tempel URL yang mengandung <code>output=embed</code>, mis.{" "}
            <code>https://maps.google.com/maps?q=ALAMAT&output=embed</code>.
            Hindari URL <code>/maps/embed?pb=…</code> karena token-nya sering
            ditolak Google.
          </p>
        </div>

        <SubmitButton>Simpan informasi</SubmitButton>
      </form>
    </div>
  );
}
