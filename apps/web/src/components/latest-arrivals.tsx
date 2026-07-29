"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryId, Place } from "@/data/types";
import { resolvePhoto } from "@/lib/data";

function ArrivalCard({
  place,
  category,
  className = "",
}: {
  place: Place;
  category?: { icon: string; label: string };
  className?: string;
}) {
  const cover = resolvePhoto(place.cover);
  return (
    <Link href={`/lugares/${place.slug}`} className={`group ${className}`}>
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={cover.url}
          alt={cover.alt}
          fill
          sizes="(min-width:1024px) 25vw, 220px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
        />
        <span className="absolute top-2.5 left-2.5 rounded-full bg-brand-deep px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-white shadow-[0_4px_10px_-2px_rgba(255,90,0,0.5)]">
          ✨ Nuevo
        </span>
      </div>
      <div className="mt-2.5">
        <h3 className="truncate text-[14.5px] font-bold tracking-tight group-hover:text-brand">
          {place.name}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[12.5px] text-ink-soft">
          {category?.icon} {place.zone}
        </p>
      </div>
    </Link>
  );
}

export function LatestArrivals({
  places,
  categoryIcon,
}: {
  places: Place[];
  categoryIcon: Map<CategoryId, { icon: string; label: string }>;
}) {
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
  }, [places]);

  function scrollByCard(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: direction * 250, behavior: "smooth" });
  }

  if (places.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14 md:px-10 lg:py-16">
      <div className="mb-6.5">
        <h2 className="font-heading text-[clamp(24px,3vw,34px)] font-bold tracking-tight">
          Nuevo en el radar
        </h2>
        <p className="mt-2 text-[16px] text-ink-soft">
          Lo último que se sumó al directorio — todavía sin muchas reseñas.
        </p>
      </div>

      {/* Mobile/tablet: horizontal scroll row — the grid below doesn't fit comfortably under lg. */}
      <div className="relative lg:hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {places.map((place) => (
            <ArrivalCard
              key={place.id}
              place={place}
              category={categoryIcon.get(place.category)}
              className="w-[200px] flex-none snap-start sm:w-[220px]"
            />
          ))}
        </div>

        {!atStart && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-background to-transparent md:block" />
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Anterior"
              className="absolute top-1/2 left-1 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-lg text-ink shadow-[0_10px_24px_-14px_rgba(25,21,18,0.35)] hover:border-peach hover:text-brand-deep md:grid"
            >
              ‹
            </button>
          </>
        )}
        {!atEnd && (
          <>
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-background to-transparent md:block" />
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Siguiente"
              className="absolute top-1/2 right-1 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-lg text-ink shadow-[0_10px_24px_-14px_rgba(25,21,18,0.35)] hover:border-peach hover:text-brand-deep md:grid"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Desktop: full grid, everything visible at once — no need to scroll to see what's new. */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
        {places.map((place) => (
          <ArrivalCard
            key={place.id}
            place={place}
            category={categoryIcon.get(place.category)}
          />
        ))}
      </div>
    </section>
  );
}
