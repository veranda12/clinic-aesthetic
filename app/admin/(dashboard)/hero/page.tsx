import { prisma } from "@/lib/db";
import { ImageField } from "@/features/admin/ImageField";
import { SubmitButton } from "@/features/admin/SubmitButton";
import { updateHeroImage } from "@/features/admin/settings.actions";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "hero_image" },
  });

  return (
    <div>
      <p className="eyebrow">Content</p>
      <h1 className="display-md mt-3 mb-10">Foto Hero</h1>

      <form action={updateHeroImage} className="space-y-8 max-w-2xl">
        <ImageField
          name="hero_image"
          label="Foto hero halaman utama"
          defaultValue={setting?.value ?? ""}
        />
        <p className="text-xs text-taupe leading-relaxed">
          Gunakan foto lanskap beresolusi tinggi (disarankan minimal 2000 px
          lebar). Kosongkan lalu simpan untuk kembali ke foto bawaan.
        </p>

        <SubmitButton>Simpan foto hero</SubmitButton>
      </form>
    </div>
  );
}
