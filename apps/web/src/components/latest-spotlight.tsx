"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryId, EventItem, Plan } from "@/data/types";
import { resolvePhoto } from "@/lib/data";

const ROTATE_MS = 5000;
const FADE_MS = 400;
const RESUME_AFTER_MANUAL_MS = 7000;

function planHref(plan: Plan): string {
  return plan.kind === "lugar"
    ? `/lugares/${plan.slug}`
    : `/eventos/${plan.slug}`;
}

const navBtnClass =
  "grid size-10 flex-none place-items-center rounded-full bg-ink/40 text-white backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-ink/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

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
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(
    () => () => {
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    },
    [],
  );

  function goTo(next: number, e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    if (next === index) return;

    setVisible(false);
    setTimeout(() => {
      setIndex(next);
      setVisible(true);
    }, FADE_MS);

    // A manual pick shouldn't get immediately overridden by autoplay — pause, then resume.
    setPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(
      () => setPaused(false),
      RESUME_AFTER_MANUAL_MS,
    );
  }

  const plan = items[index];
  if (!plan) return null;
  const cover = resolvePhoto(plan.cover);
  const category = categoryIcon.get(plan.category);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="group relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-secondary shadow-[0_28px_60px_-30px_rgba(25,21,18,0.4)] sm:aspect-16/10 lg:aspect-4/3 lg:flex-[1.35]"
    >
      <Link href={planHref(plan)} className="absolute inset-0 z-0">
        <Image
          src={cover.url}
          alt={cover.alt}
          fill
          priority
          sizes="(min-width:1024px) 55vw, 100vw"
          className={`object-cover transition-[opacity,transform] duration-[400ms] group-hover:scale-[1.03] ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/35 via-40% to-transparent" />

        {category && (
          <span className="absolute top-4 left-4 z-10 rounded-full bg-background/94 px-3.5 py-1.5 text-xs font-bold tracking-wide">
            {category.icon} {category.label}
          </span>
        )}

        <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
          <h3 className="text-wrap-balance font-heading text-[clamp(21px,2.7vw,29px)] leading-[1.08] font-extrabold tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)]">
            {plan.name}
          </h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] font-semibold text-white/85">
            <span>📍 {plan.zone}</span>
            <span className="text-white/40">·</span>
            <span style={{ color: "#FFB27A" }}>{plan.priceLabel}</span>
          </p>
          <span className="mt-3 hidden items-center gap-1 text-[12.5px] font-bold text-white/0 transition-[opacity,transform] duration-200 sm:inline-flex sm:group-hover:translate-x-0.5 sm:group-hover:text-white">
            Ver plan
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Plan anterior"
            onClick={(e) => goTo((index - 1 + items.length) % items.length, e)}
            className={`absolute top-1/2 left-3 z-20 -translate-y-1/2 opacity-80 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 ${navBtnClass}`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Plan siguiente"
            onClick={(e) => goTo((index + 1) % items.length, e)}
            className={`absolute top-1/2 right-3 z-20 -translate-y-1/2 opacity-80 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 ${navBtnClass}`}
          >
            ›
          </button>

          <div className="absolute top-4 right-4 z-20 flex gap-1 rounded-full bg-ink/35 px-1.5 py-2 backdrop-blur-sm">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Ver ${item.name}`}
                aria-current={i === index}
                onClick={(e) => goTo(i, e)}
                className="grid size-8 place-items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                    i === index
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/75"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
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
          const [day, time] = event.dateLabel.split("·").map((s) => s.trim());
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
                className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 via-45% to-transparent" />

              <span className="absolute top-2.5 left-2.5 flex flex-col items-center rounded-[9px] bg-background/95 px-2 py-1 leading-none shadow-[0_4px_10px_-4px_rgba(25,21,18,0.4)]">
                <span className="font-mono text-[8.5px] font-bold tracking-[.04em] text-brand-deep uppercase">
                  {day}
                </span>
                {time && (
                  <span className="mt-0.5 text-[9px] font-semibold text-ink-soft">
                    {time}
                  </span>
                )}
              </span>

              <span className="absolute inset-x-3 bottom-3">
                <span className="line-clamp-2 text-[13.5px] leading-[1.25] font-bold tracking-tight text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
                  {event.name}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-white/0 transition-[opacity] duration-200 group-hover:text-white/85">
                  Ver evento <span aria-hidden>→</span>
                </span>
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
    <section
      id="ciudad"
      className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14 md:px-10 lg:py-18"
    >
      <div className="mb-6.5">
        <h2 className="font-heading text-[clamp(26px,3.4vw,40px)] font-bold tracking-tight">
          La ciudad no para
        </h2>
        <p className="mt-2 text-[16px] text-ink-soft">
          Lo destacado de hoy y lo que se viene este fin.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:gap-6">
        <SpotlightRotator items={rotatorItems} categoryIcon={categoryIcon} />
        <SpotlightMosaic events={events} />
      </div>
    </section>
  );
}
