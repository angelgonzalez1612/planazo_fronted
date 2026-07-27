"use client";

import { useEffect, useRef, useState } from "react";
import type { Plan } from "@/data/types";
import { PlanCard } from "@/components/plan-card";

export function PlanCardCarousel({
  plans,
  icon,
  categoryLabel,
}: {
  plans: Plan[];
  icon: string;
  categoryLabel: string;
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
  }, [plans]);

  function scrollByCard(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {plans.map((plan) => (
          <div key={plan.id} className="w-[240px] flex-none snap-start sm:w-[270px]">
            <PlanCard plan={plan} icon={icon} categoryLabel={categoryLabel} />
          </div>
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
  );
}
