"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Mood, Plan } from "@/data/types";
import { resolvePhoto } from "@/lib/data";

export function MoodPicker({
  moods,
  moodPlans,
}: {
  moods: Mood[];
  moodPlans: Record<string, Plan[]>;
}) {
  const [selected, setSelected] = useState(moods[0]?.id ?? "");
  const activeMood = moods.find((m) => m.id === selected);
  const plans = moodPlans[selected] ?? [];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {moods.map((mood) => {
          const active = mood.id === selected;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => setSelected(mood.id)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-xl border-[1.5px] p-3.5 text-left transition-colors ${
                active
                  ? "border-ink bg-ink shadow-[0_12px_26px_-14px_rgba(0,0,0,0.45)]"
                  : "border-transparent bg-card hover:border-ink/15"
              }`}
            >
              <span
                className={`grid size-11 flex-none place-items-center rounded-full text-xl leading-none ${
                  active ? "bg-white/15" : "bg-secondary"
                }`}
              >
                {mood.emoji}
              </span>
              <span
                className={`font-heading text-base leading-tight font-extrabold tracking-normal ${
                  active ? "text-white" : "text-ink"
                }`}
              >
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5.5 rounded-2xl bg-card p-4 text-ink shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold tracking-wide text-brand-deep uppercase">
            Para un plan {activeMood?.label.toLowerCase()} hoy
          </p>
          <Link
            href={`/mood/${selected}`}
            aria-label={`Ver todos los planes para ${activeMood?.label.toLowerCase()}`}
            className="text-[13px] font-bold text-brand hover:text-brand-pressed"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const photo = resolvePhoto({
              ...plan.cover,
              width: 128,
              height: 128,
            });
            const href =
              plan.kind === "lugar"
                ? `/lugares/${plan.slug}`
                : `/eventos/${plan.slug}`;
            return (
              <Link
                key={plan.id}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5 text-ink"
              >
                <div className="relative size-16 flex-none overflow-hidden rounded-xl bg-secondary">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading text-[15px] font-bold tracking-tight">
                    {plan.name}
                  </p>
                  <p className="mt-1 text-[13px] text-ink-soft">
                    {plan.zone} · {plan.priceLabel} · ★{plan.rating}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
