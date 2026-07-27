"use client";

import { useEffect, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function SignupModal({
  open,
  onClose,
  subscriberCount,
  title = "No te quedes fuera del plan",
  subtitle,
  successTitle = "📩 Revisa tu correo",
  successSubtitle = "Te enviamos una liga para confirmar tu suscripción.",
  onSubmitEmail,
}: {
  open: boolean;
  onClose: () => void;
  subscriberCount: number;
  title?: string;
  subtitle?: string;
  successTitle?: string;
  successSubtitle?: string;
  onSubmitEmail?: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // This instance never unmounts (it just renders null while closed), so its
  // state has to be reset by hand each time it's reopened for a new reason.
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setEmail("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Únete a Planazo"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-3xl bg-card p-7 text-center shadow-[0_30px_70px_-30px_rgba(25,21,18,0.45)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-lg text-ink-soft hover:bg-secondary"
        >
          ✕
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep">
          ✦ Únete gratis
        </span>

        {submitted ? (
          <>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight">{successTitle}</h2>
            <p className="mt-2 text-[15px] text-ink-soft">{successSubtitle}</p>
          </>
        ) : (
          <>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight">{title}</h2>
            <p className="mt-2 text-[15px] text-ink-soft">
              {subtitle ?? (
                <>
                  Un correo los jueves con lo que vale la pena en CDMX. Ya somos{" "}
                  {subscriberCount.toLocaleString("es-MX")} personas planeando mejor.
                </>
              )}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!EMAIL_PATTERN.test(email.trim())) {
                  setError("Escribe un correo válido.");
                  return;
                }
                setError("");
                setSubmitted(true);
                onSubmitEmail?.();
              }}
              className="mt-5 flex flex-col gap-2.5"
              noValidate
            >
              <div className="text-left">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="tu@correo.com"
                  aria-invalid={Boolean(error)}
                  className={`w-full rounded-[14px] border bg-background px-4 py-3.5 text-[15px] text-ink outline-none focus:border-brand ${
                    error ? "border-destructive" : "border-border"
                  }`}
                />
                {error && <p className="mt-1.5 text-[13px] font-semibold text-destructive">{error}</p>}
              </div>
              <button
                type="submit"
                className="rounded-[14px] bg-brand px-4 py-3.5 text-[15px] font-bold text-white"
              >
                Continuar
              </button>
            </form>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 text-[13px] font-semibold text-ink-soft hover:text-brand"
            >
              No, gracias
            </button>
          </>
        )}
      </div>
    </div>
  );
}
