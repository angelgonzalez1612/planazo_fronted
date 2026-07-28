"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryId, EventItem, Plan } from "@/data/types";
import { resolvePhoto } from "@/lib/data";

const ROTATE_MS = 5000;
const FADE_MS = 400;

function planHref(plan: Plan): string {
  return plan.kind === "lugar" ? `/lugares/${plan.slug}` : `/eventos/${plan.slug}`;
}

function SpotlightRotator({
  items,
  categoryIcon,
}: {
  items: Plan[];
  categoryIcon: Map<CategoryId, { icon: string; label: string }>;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const interval = setInterval(() => {
      setVisible(false);
      const timeout = setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, FADE_MS);
      return () => clearTimeout(timeout);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [items.length, paused]);

  const plan = items[index];
  if (!plan) return null;
  const cover = resolvePhoto(plan.cover);
  const category = categoryIcon.get(plan.category);

  return (
    <Link
      href={planHref(plan)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="group relative block aspect-4/3 w-full overflow-hidden rounded-3xl bg-secondary shadow-[0_28px_60px_-30px_rgba(25,21,18,0.4)] sm:aspect-16/10 lg:aspect-4/3 lg:flex-[1.35]"
    >
      <Image
        src={cover.url}
        alt={cover.alt}
        fill
        priority
        sizes="(min-width:1024px) 55vw, 100vw"
        className={`object-cover transition-[opacity,transform] duration-[400ms] motion-safe:group-hover:scale-[1.03] ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

      {category && (
        <span className="absolute top-4 left-4 rounded-full bg-background/94 px-3.5 py-1.5 text-xs font-bold tracking-wide">
          {category.icon} {category.label}
        </span>
      )}

      <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
        <h3 className="font-heading text-[clamp(20px,2.6vw,28px)] leading-tight font-bold tracking-tight text-white">
          {plan.name}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13.5px] font-medium text-white/80">
          📍 {plan.zone} · {plan.priceLabel}
        </p>
      </div>

      {items.length > 1 && (
        <div className="absolute right-4 bottom-4 flex gap-1.5 sm:right-6 sm:bottom-6">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/45"
              }`}
            />
          ))}
        </div>
      )}
    </Link>
  );
}

function SpotlightMosaic({ events }: { events: EventItem[] }) {
  if (events.length === 0) return null;

  return (
    <div className="w-full lg:flex-1" style={{ minWidth: 280 }}>
      <span className="mb-3 inline-block font-mono text-[11px] font-semibold tracking-[.08em] text-brand-deep uppercase">
        Se viene esta semana
      </span>
      <div className="grid grid-cols-2 gap-3">
        {events.slice(0, 4).map((event) => {
          const cover = resolvePhoto(event.cover);
          return (
            <Link
              key={event.id}
              href={planHref(event)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary"
            >
              <Image
                src={cover.url}
                alt={cover.alt}
                fill
                sizes="(min-width:1024px) 20vw, 40vw"
                className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent" />
              <span className="absolute top-2.5 left-2.5 rounded-full bg-background/94 px-2.5 py-1 text-[10.5px] font-bold text-brand-deep">
                {event.dateLabel.split("·")[0].trim()}
              </span>
              <span className="absolute inset-x-2.5 bottom-2.5 line-clamp-2 text-[13px] leading-tight font-bold text-white">
                {event.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function LatestSpotlight({
  featured,
  events,
  categoryIcon,
}: {
  featured: Plan[];
  events: EventItem[];
  categoryIcon: Map<CategoryId, { icon: string; label: string }>;
}) {
  const rotatorItems = featured.slice(0, 5);
  if (rotatorItems.length === 0 && events.length === 0) return null;

  return (
    <section id="ciudad" className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14 md:px-10 lg:py-18">
      <div className="mb-6.5">
        <h2 className="font-heading text-[clamp(26px,3.4vw,40px)] font-bold tracking-tight">
          Qué se cuece en la ciudad
        </h2>
        <p className="mt-2 text-[16px] text-ink-soft">Lo más nuevo y lo que se viene, antes de que se llene.</p>
      </div>

      <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:gap-6">
        <SpotlightRotator items={rotatorItems} categoryIcon={categoryIcon} />
        <SpotlightMosaic events={events} />
      </div>
    </section>
  );
}
