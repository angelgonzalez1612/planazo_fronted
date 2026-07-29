"use client";

import { useState } from "react";

export function NewsletterCta({
  subscriberCount,
}: {
  subscriberCount: number;
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="relative flex flex-wrap items-center gap-8 overflow-hidden rounded-2xl bg-brand-deep p-7 text-white sm:p-12">
      <div className="min-w-[280px] flex-1">
        <h2 className="text-wrap-balance font-heading text-[clamp(26px,3.6vw,42px)] leading-[1.05] font-extrabold tracking-tight">
          Recibe los mejores planes cada semana
        </h2>
        <p className="mt-3.5 max-w-[40ch] text-[17px] leading-relaxed text-[#FFF2E8]">
          Un correo los jueves con lo que vale la pena en CDMX. Sin relleno, sin
          spam.
        </p>
      </div>
      <div className="min-w-[280px] flex-1">
        {submitted ? (
          <p className="rounded-xl bg-white p-6 font-heading text-ink">
            <span className="block text-xl font-bold">¡Listo! 🎉</span>
            <span className="mt-2 block font-sans text-[15px] font-normal text-ink-soft">
              Te escribimos el próximo jueves con los mejores planes.
            </span>
          </p>
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="flex flex-wrap items-center gap-2.5 rounded-xl bg-white p-2.5"
            >
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                className="min-w-0 flex-1 border-none bg-transparent p-3.5 text-base text-ink outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-ink px-5.5 py-3.5 text-[15px] font-bold text-white"
              >
                Suscribirme
              </button>
            </form>
            <p className="mt-3 text-[13px] text-[#FFF2E8]">
              Ya somos {subscriberCount.toLocaleString("es-MX")} personas
              planeando mejor.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
