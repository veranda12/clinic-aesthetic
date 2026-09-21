"use client";

// A tiny confirm-guarded delete form. The action is bound to the record id by
// the caller.
export function DeleteButton({
  action,
  label = "Hapus",
  confirmText = "Hapus item ini? Tindakan ini tidak dapat dibatalkan.",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="text-[0.8rem] tracking-wide text-danger hover:underline"
      >
        {label}
      </button>
    </form>
  );
}
