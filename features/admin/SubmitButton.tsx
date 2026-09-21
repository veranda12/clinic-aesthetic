"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children = "Simpan",
  className = "btn-primary",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Menyimpan…" : children}
    </button>
  );
}
