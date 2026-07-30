"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchSuggestion } from "@/lib/data";
import { useCity } from "@/components/providers/app-providers";

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function HeroSearch({
  suggestions,
  examples,
}: {
  suggestions: SearchSuggestion[];
  examples: string[];
}) {
  const router = useRouter();
  const { setCity } = useCity();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [exampleSlot, setExampleSlot] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleSlot((i) => (i + 1) % examples.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [examples.length]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return suggestions
      .filter(
        (s) => normalize(s.label).includes(q) || normalize(s.sub).includes(q),
      )
      .slice(0, 5);
  }, [query, suggestions]);

  const categorySuggestions = useMemo(
    () => suggestions.filter((s) => s.type === "Categoría").slice(0, 8),
    [suggestions],
  );

  function pick(suggestion: SearchSuggestion) {
    setQuery(suggestion.label);
    setOpen(false);
    if (suggestion.city) {
      setCity(suggestion.city);
      return;
    }
    if (suggestion.href) router.push(suggestion.href);
  }

  return (
    <div>
      <div ref={boxRef} className="relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            const trimmed = query.trim();
            if (trimmed)
              router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
            else
              document
                .getElementById("destacados")
                ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-border bg-card p-2.5 shadow-[0_18px_40px_-20px_rgba(25,21,18,0.22)]"
        >
          <span className="pl-2.5 text-[19px]">🔍</span>
          <input
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              setOpen(value.trim().length > 0);
            }}
            onFocus={() => query.trim() && setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder="¿Qué quieres hacer?"
            className="min-w-[200px] flex-1 border-none bg-transparent p-3 text-[17px] font-medium text-ink outline-none"
          />
          <button
            type="submit"
            className="rounded-[14px] bg-ink px-6 py-3.5 text-[15px] font-bold text-white"
          >
            Buscar
          </button>
        </form>

        {open && (
          <div className="absolute top-[calc(100%+8px)] right-0 left-0 z-30 max-h-[360px] overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-[0_24px_50px_-24px_rgba(25,21,18,0.35)]">
            {matches.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-ink-soft">
                  Sin resultados para &ldquo;{query}&rdquo;. Prueba una
                  categoría:
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {categorySuggestions.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => pick(s)}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[12.5px] font-semibold text-ink hover:border-peach hover:text-brand-deep"
                    >
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              matches.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(s)}
                  className="flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left hover:bg-accent"
                >
                  <span className="grid size-8 flex-none place-items-center rounded-[9px] bg-secondary text-[15px]">
                    {s.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14.5px] font-semibold">
                      {s.label}
                    </span>
                    <span className="mt-px block text-[12.5px] text-ink-soft">
                      {s.sub}
                    </span>
                  </span>
                  <span className="ml-auto flex-none rounded-full bg-accent px-2 py-1 text-[10.5px] font-bold tracking-wide text-brand-deep uppercase">
                    {s.type}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span className="p-0.5 text-[13px] font-medium text-ink-soft">
          Prueba:
        </span>
        {[0, 1, 2, 3].map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() =>
              setQuery(examples[(exampleSlot + slot) % examples.length])
            }
            className="rounded-full border border-dashed border-[#E0D9D2] bg-card px-3.5 py-1.5 text-[13px] font-medium text-ink-soft transition-[opacity,transform] duration-300"
          >
            {examples[(exampleSlot + slot) % examples.length]}
          </button>
        ))}
      </div>
    </div>
  );
}
