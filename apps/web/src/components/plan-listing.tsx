"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Plan } from "@/data/types";
import { resolvePhoto } from "@/lib/data";
import { formatReviewCount } from "@/lib/format";
import { PlanCard } from "@/components/plan-card";
import { AdSlot } from "@/components/ad-slot";

export type SortId = "fecha" | "precio" | "rating";

const SORT_LABELS: Record<SortId, string> = {
  fecha: "Fecha (próximos primero)",
  precio: "Precio: menor a mayor",
  rating: "Mejor calificados",
};

function sortPlans(plans: Plan[], sort: SortId): Plan[] {
  const sorted = [...plans];
  if (sort === "fecha") {
    sorted.sort((a, b) => {
      const aTime =
        a.kind === "evento" ? new Date(a.startDate).getTime() : Infinity;
      const bTime =
        b.kind === "evento" ? new Date(b.startDate).getTime() : Infinity;
      return aTime - bTime;
    });
  } else if (sort === "precio") {
    sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  } else {
    sorted.sort((a, b) => b.rating - a.rating);
  }
  return sorted;
}

export function PlanListing({
  plans,
  categoryIcon,
  sortIds = ["precio", "rating"],
}: {
  plans: Plan[];
  categoryIcon: Map<string, { icon: string; label: string }>;
  sortIds?: SortId[];
}) {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [sort, setSort] = useState<SortId>(sortIds[0]);

  const sorted = useMemo(() => sortPlans(plans, sort), [plans, sort]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-border bg-secondary p-1">
          <button
            type="button"
            onClick={() => setView("cards")}
            aria-pressed={view === "cards"}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold transition-colors ${
              view === "cards"
                ? "bg-card text-brand-deep shadow-sm"
                : "text-ink-soft"
            }`}
          >
            ▦ Cards
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold transition-colors ${
              view === "list"
                ? "bg-card text-brand-deep shadow-sm"
                : "text-ink-soft"
            }`}
          >
            ☰ Lista
          </button>
        </div>

        <label className="flex items-center gap-2 text-[13.5px] font-semibold text-ink-soft">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-[13.5px] font-bold text-ink"
          >
            {sortIds.map((id) => (
              <option key={id} value={id}>
                {SORT_LABELS[id]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {sorted.flatMap((plan, i) => {
            const card = (
              <PlanCard
                key={plan.id}
                plan={plan}
                icon={categoryIcon.get(plan.category)?.icon ?? "📍"}
                categoryLabel={categoryIcon.get(plan.category)?.label ?? ""}
              />
            );
            // Un anuncio cada 5 tarjetas, como en un feed.
            if ((i + 1) % 5 === 0) {
              return [
                card,
                <AdSlot
                  key={`ad-${plan.id}`}
                  size="300 × 250"
                  className="aspect-4/3 rounded-xl"
                />,
              ];
            }
            return [card];
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.flatMap((plan, i) => {
            const href =
              plan.kind === "lugar"
                ? `/lugares/${plan.slug}`
                : `/eventos/${plan.slug}`;
            const photo = resolvePhoto({
              ...plan.cover,
              width: 160,
              height: 160,
            });
            const row = (
              <Link
                key={plan.id}
                href={href}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-peach"
              >
                <div className="relative size-20 flex-none overflow-hidden rounded-lg bg-secondary">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[12.5px] font-bold text-brand-deep uppercase">
                    {categoryIcon.get(plan.category)?.icon}{" "}
                    {categoryIcon.get(plan.category)?.label}
                  </span>
                  <h3 className="truncate font-heading text-[17px] font-bold tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="mt-0.5 truncate text-[13.5px] text-ink-soft">
                    📍 {plan.zone}
                    {plan.kind === "evento" && <> · 📅 {plan.dateLabel}</>}
                  </p>
                </div>
                <div className="flex flex-none flex-col items-end gap-1 text-right">
                  <span className="text-[15px] font-bold">
                    {plan.priceLabel}
                  </span>
                  {plan.reviewCount > 0 && (
                    <span className="flex items-center gap-1 text-[13px] font-semibold text-ink-soft">
                      <span className="text-brand">★</span>
                      {plan.rating}
                      <span className="font-normal text-[#B5ADA6]">
                        ({formatReviewCount(plan.reviewCount)})
                      </span>
                    </span>
                  )}
                </div>
              </Link>
            );
            // Un anuncio cada 3 filas, en el mismo formato de lista.
            if ((i + 1) % 3 === 0) {
              return [
                row,
                <AdSlot
                  key={`ad-${plan.id}`}
                  size="728 × 90"
                  className="h-[90px]"
                />,
              ];
            }
            return [row];
          })}
        </div>
      )}
    </div>
  );
}
