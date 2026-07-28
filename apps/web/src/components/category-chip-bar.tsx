"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Category, CategoryId } from "@/data/types";
import { categoryHref } from "@/lib/data";

// One accent per category so 13 items stay scannable without icons.
// Distinct hues, similar chroma/lightness so the row reads as one family, not a rainbow.
const CATEGORY_COLOR: Record<CategoryId, string> = {
  eventos: "#EF5B6B",
  comer: "#F0A23C",
  cafes: "#A97452",
  bares: "#9B59D0",
  cultura: "#2E9C99",
  "aire-libre": "#4CAF6E",
  tecnologia: "#3E8FD6",
  gaming: "#6C6CE0",
  viajes: "#33B6C9",
  "cine-tv": "#D8548D",
  geek: "#6B7280",
  mascotas: "#D98CA0",
  musica: "#A85CC4",
};

export function CategoryChipBar({ categories }: { categories: Category[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updateScrollState() {
      if (!track) return;
      setAtStart(track.scrollLeft <= 1);
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
    }

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(track);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [categories]);

  function scrollByStep(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: direction * 260, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={categoryHref(category.id)}
            className="group flex flex-none snap-start items-center gap-2.5 rounded-full border border-border bg-card py-2.5 pr-4.5 pl-3.5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#E0DBD4] hover:shadow-[0_10px_22px_-14px_rgba(25,21,18,0.28)]"
          >
            <span
              className="size-2.5 flex-none rounded-full transition-transform duration-200 group-hover:scale-125"
              style={{ backgroundColor: CATEGORY_COLOR[category.id] }}
            />
            <span className="text-[14px] font-bold tracking-tight text-ink whitespace-nowrap">{category.label}</span>
          </Link>
        ))}
      </div>

      {!atStart && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-14 bg-gradient-to-r from-background to-transparent md:block" />
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            aria-label="Ver categorías anteriores"
            className="absolute top-1/2 left-1 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-base text-ink shadow-[0_10px_24px_-14px_rgba(25,21,18,0.35)] hover:border-peach hover:text-brand-deep md:grid"
          >
            ‹
          </button>
        </>
      )}
      {!atEnd && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-14 bg-gradient-to-l from-background to-transparent md:block" />
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            aria-label="Ver más categorías"
            className="absolute top-1/2 right-1 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-base text-ink shadow-[0_10px_24px_-14px_rgba(25,21,18,0.35)] hover:border-peach hover:text-brand-deep md:grid"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
