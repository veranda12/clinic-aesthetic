"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "../actions";
import { site } from "@/lib/site";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "Memproses…" : "Masuk"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, {});

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-ivory">
      <div className="hidden lg:flex flex-col justify-between bg-ink text-ivory p-14">
        <div>
          <p className="font-display text-3xl tracking-[0.18em]">
            {site.wordmarkTop}
          </p>
          <p className="text-[0.6rem] tracking-[0.42em] uppercase mt-2 opacity-70">
            {site.wordmarkBottom}
          </p>
        </div>
        <p className="font-display italic text-3xl leading-snug max-w-sm opacity-90">
          {site.tagline}
        </p>
        <p className="text-sm text-ivory/50">Content Management · Admin</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <p className="eyebrow">Admin</p>
          <h1 className="display-md mt-4">Masuk ke dashboard</h1>
          <p className="prose-body mt-3 text-sm">
            Kelola konten AURELIA Skin &amp; Aesthetic.
          </p>

          <form action={formAction} className="mt-10 space-y-5">
            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="field-input"
                placeholder="admin@aurelia.id"
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="field-input"
                placeholder="••••••••"
              />
            </div>

            {state.error && (
              <p className="text-sm text-danger" role="alert">
                {state.error}
              </p>
            )}

            <SubmitButton />
          </form>
        </div>
      </div>
    </main>
  );
}
