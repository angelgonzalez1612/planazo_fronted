"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchSuggestion } from "@/lib/data";
import { useCity } from "@/components/providers/app-providers";

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function NavSearchOverlay({ suggestions, className }: { suggestions: SearchSuggestion[]; className?: string }) {
  const router = useRouter();
  const { setCity } = useCity();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const focusTimeout = setTimeout(() => inputRef.current?.focus(), 10);
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return suggestions.filter((s) => normalize(s.label).includes(q) || normalize(s.sub).includes(q)).slice(0, 8);
  }, [query, suggestions]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function pick(s: SearchSuggestion) {
    close();
    if (s.city) {
      setCity(s.city);
      return;
    }
    if (s.href) router.push(s.href);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    close();
    if (trimmed) router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar en Planazo"
        title="Buscar"
        className={
          className ??
          "grid size-10 flex-none place-items-center rounded-full border border-border bg-card text-[17px] transition-colors hover:border-brand hover:text-brand"
        }
      >
        🔍
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Buscar en Planazo"
          onClick={close}
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/45 px-4 pt-[9vh] backdrop-blur-sm motion-safe:[animation:pz-fade-in_.18s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] overflow-hidden rounded-3xl border border-border bg-card shadow-[0_30px_70px_-30px_rgba(25,21,18,0.45)] motion-safe:[animation:pz-modal-in_.22s_cubic-bezier(.16,1,.3,1)]"
          >
            <form onSubmit={submit} className="flex items-center gap-2 border-b border-border p-3">
              <span className="pl-1.5 text-[19px]">🔍</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué quieres hacer?"
                className="min-w-0 flex-1 border-none bg-transparent p-2.5 text-[16px] font-medium text-ink outline-none placeholder:text-ink-soft"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar búsqueda"
                className="grid size-8 flex-none place-items-center rounded-full text-ink-soft transition-colors hover:bg-secondary"
              >
                ✕
              </button>
            </form>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {query.trim().length === 0 ? (
                <p className="p-5 text-center text-sm text-ink-soft">Busca lugares, eventos, guías o etiquetas…</p>
              ) : matches.length === 0 ? (
                <p className="p-5 text-center text-sm text-ink-soft">Sin resultados para &ldquo;{query}&rdquo;</p>
              ) : (
                matches.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pick(s)}
                    className="flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left transition-colors hover:bg-accent"
                  >
                    <span className="grid size-8 flex-none place-items-center rounded-[9px] bg-secondary text-[15px]">{s.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-semibold">{s.label}</span>
                      <span className="mt-px block truncate text-[12.5px] text-ink-soft">{s.sub}</span>
                    </span>
                    <span className="flex-none rounded-full bg-accent px-2 py-1 text-[10.5px] font-bold tracking-wide text-brand-deep uppercase">
                      {s.type}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
