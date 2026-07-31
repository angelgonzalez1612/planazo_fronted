"use client";

import Image from "next/image";
import Link from "next/link";
import { slugify } from "@planazo/shared";
import type { Plan } from "@/data/types";
import { resolvePhoto } from "@/lib/data";
import { formatReviewCount } from "@/lib/format";
import { useFavorites } from "@/components/providers/app-providers";

export function PlanCard({
  plan,
  icon,
  categoryLabel,
}: {
  plan: Plan;
  icon: string;
  categoryLabel: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const href =
    plan.kind === "lugar" ? `/lugares/${plan.slug}` : `/eventos/${plan.slug}`;
  const cover = resolvePhoto(plan.cover);
  const saved = isFavorite(plan.id);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-4/3 bg-secondary">
        <Image
          src={cover.url}
          alt={cover.alt}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-start justify-between p-3">
          <span className="rounded-full bg-background/94 px-3 py-1.5 text-xs font-bold tracking-wide">
            {icon} {categoryLabel}
          </span>
          <button
            type="button"
            title="Guardar"
            onClick={() => toggleFavorite(plan.id)}
            className={`grid size-[38px] place-items-center rounded-full bg-background/94 text-lg leading-none ${
              saved ? "text-brand" : "text-ink"
            }`}
          >
            {saved ? "♥" : "♡"}
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4.5 pb-5">
        <h3 className="font-heading text-[19px] leading-tight font-bold tracking-tight">
          <Link href={href} className="hover:text-brand">
            {plan.name}
          </Link>
        </h3>
        <Link
          href={`/zona/${slugify(plan.zone)}`}
          className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-brand"
        >
          📍 {plan.zone}
        </Link>
        {plan.kind === "evento" && (
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-deep">
            📅 {plan.dateLabel}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#F2EEEA] pt-3">
          <span className="text-[15px] font-bold">{plan.priceLabel}</span>
          {plan.reviewCount > 0 && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
              <span className="text-brand">★</span>
              {plan.rating}
              <span className="font-normal text-[#B5ADA6]">
                ({formatReviewCount(plan.reviewCount)})
              </span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
