import type { Metadata } from "next";
import Link from "next/link";
import {
  getEvents,
  getWeekendAgenda,
  getPlans,
  getCategories,
  categoryHref,
} from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanCard } from "@/components/plan-card";
import { mexicoCityNow, formatMexicoDay } from "@/lib/date";

// "Hoy" only changes once a day — no need to recompute on every request.
export const revalidate = 3600;

function isLastSundayOfMonth(date: Date): boolean {
  if (date.getDay() !== 0) return false;
  const nextWeek = new Date(date);
  nextWeek.setDate(date.getDate() + 7);
  return nextWeek.getMonth() !== date.getMonth();
}

export function generateMetadata(): Metadata {
  const label = formatMexicoDay(mexicoCityNow());
  return {
    title: `Qué hacer hoy en CDMX — ${label}`,
    description: `Planes, eventos y lugares recomendados para hoy, ${label}, en Ciudad de México.`,
  };
}

export default function HoyPage() {
  const today = mexicoCityNow();
  const label = formatMexicoDay(today);

  const events = getEvents();
  const todayEvents = events.filter((e) =>
    e.slug === "cicloton-cdmx"
      ? isLastSundayOfMonth(today)
      : (e.recurringDays ?? []).includes(today.getDay()),
  );
  // Nothing lands exactly today most days of the week — show what's coming
  // up instead of leaving the page looking empty.
  const upcomingEvents = todayEvents.length === 0 ? getWeekendAgenda() : [];

  const categories = getCategories();
  const categoryIcon = new Map(
    categories.map((c) => [c.id, { icon: c.icon, label: c.label }]),
  );

  const plans = getPlans();
  const startOfYear = new Date(today.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((today.getTime() - startOfYear) / 86_400_000);
  const spotlight = plans[dayOfYear % plans.length];

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">
          Inicio
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink">Hoy</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          📅 Hoy es {label}
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          ¿Qué hacer hoy en CDMX?
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          Esta página se actualiza sola cada día — lo que ves abajo es lo que
          realmente pasa hoy en la ciudad.
        </p>
      </div>

      {(todayEvents.length > 0 || upcomingEvents.length > 0) && (
        <div className="mx-auto max-w-[1280px] px-4 pb-10 md:px-10">
          <h2 className="mb-4 font-heading text-[22px] font-bold tracking-tight">
            {todayEvents.length > 0
              ? "Esto pasa hoy"
              : "Hoy no hay nada de esto, pero se viene"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {(todayEvents.length > 0 ? todayEvents : upcomingEvents).map(
              (event) => (
                <PlanCard
                  key={event.id}
                  plan={event}
                  icon={categoryIcon.get(event.category)?.icon ?? "📍"}
                  categoryLabel={categoryIcon.get(event.category)?.label ?? ""}
                />
              ),
            )}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1280px] px-4 pb-10 md:px-10">
        <h2 className="mb-4 font-heading text-[22px] font-bold tracking-tight">
          Plan del día
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PlanCard
            plan={spotlight}
            icon={categoryIcon.get(spotlight.category)?.icon ?? "📍"}
            categoryLabel={categoryIcon.get(spotlight.category)?.label ?? ""}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        <h2 className="mb-4 font-heading text-[22px] font-bold tracking-tight">
          Explora por categoría
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((c) => c.id !== "eventos")
            .map((c) => (
              <Link
                key={c.id}
                href={categoryHref(c.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:border-peach hover:text-brand-deep"
              >
                {c.icon} {c.label}
              </Link>
            ))}
        </div>
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
