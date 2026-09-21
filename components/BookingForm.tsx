"use client";

import { useState } from "react";

interface BookingFormProps {
  whatsapp: string | null;
  treatments: { slug: string; name: string }[];
}

// Composes a pre-filled WhatsApp message — the booking flow most Jakarta
// clinics actually use, instead of a fake form that stores nothing.
export function BookingForm({ whatsapp, treatments }: BookingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [treatment, setTreatment] = useState("");
  const [note, setNote] = useState("");

  const number = (whatsapp ?? "").replace(/\D/g, "");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Halo AURELIA, saya ingin membuat janji konsultasi.",
      "",
      `Nama: ${name || "-"}`,
      `No. telepon: ${phone || "-"}`,
      `Perawatan yang diminati: ${treatment || "Konsultasi umum"}`,
      note ? `Catatan: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const url = `https://wa.me/${number}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="field-label">
            Nama
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="phone" className="field-label">
            No. Telepon
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="field-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="treatment" className="field-label">
          Perawatan yang diminati
        </label>
        <select
          id="treatment"
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          className="field-input appearance-none"
        >
          <option value="">Konsultasi umum</option>
          {treatments.map((t) => (
            <option key={t.slug} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="note" className="field-label">
          Catatan (opsional)
        </label>
        <textarea
          id="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ceritakan singkat kondisi kulit atau pertanyaan Anda"
          className="field-input resize-none"
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Kirim via WhatsApp
      </button>
      <p className="text-xs text-taupe leading-relaxed">
        Formulir ini akan membuka WhatsApp dengan pesan yang sudah terisi. Tim
        kami akan membalas untuk mengonfirmasi jadwal Anda.
      </p>
    </form>
  );
}
