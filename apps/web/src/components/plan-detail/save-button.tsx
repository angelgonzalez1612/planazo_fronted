"use client";

import { useFavorites, useSignupPrompt } from "@/components/providers/app-providers";

export function SaveButton({ planId }: { planId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { triggerAuthPrompt } = useSignupPrompt();
  const saved = isFavorite(planId);

  return (
    <button
      type="button"
      onClick={() => triggerAuthPrompt("guardar", () => toggleFavorite(planId))}
      className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-[14px] border px-4 py-3 text-sm font-semibold ${
        saved ? "border-brand bg-accent text-brand-deep" : "border-border bg-secondary text-ink"
      }`}
    >
      {saved ? "♥ Guardado en mis planes" : "♡ Guardar en mis planes"}
    </button>
  );
}
