import type { Metadata } from "next";
import Link from "next/link";
import { getWeekendAgenda, getCategories, categoryHref } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanCard } from "@/components/plan-card";
import { mexicoCityNow } from "@/lib/date";

// Same reasoning as /hoy — the weekend only changes once a day, no need to
// recompute this on every request.
export const revalidate = 3600;

function currentOrUpcomingWeekend(today: Date): { saturday: Date; sunday: Date } {
  const day = today.getDay();
  if (day === 6) {
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + 1);
    return { saturday: today, sunday };
  }
  if (day === 0) {
    const saturday = new Date(today);
    saturday.setDate(today.getDate() - 1);
    return { saturday, sunday: today };
  }
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + (6 - day));
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  return { saturday, sunday };
}

function formatWeekendLabel(saturday: Date, sunday: Date): string {
  const opts = { month: "long" as const, timeZone: "America/Mexico_City" };
  const satMonth = saturday.toLocaleDateString("es-MX", opts);
  const sunMonth = sunday.toLocaleDateString("es-MX", opts);
  return satMonth === sunMonth
    ? `sábado ${saturday.getDate()} y domingo ${sunday.getDate()} de ${satMonth}`
    : `sábado ${saturday.getDate()} de ${satMonth} y domingo ${sunday.getDate()} de ${sunMonth}`;
}

export function generateMetadata(): Metadata {
  const { saturday, sunday } = currentOrUpcomingWeekend(mexicoCityNow());
  const label = formatWeekendLabel(saturday, sunday);
  return {
    title: `Qué hacer este fin de semana en CDMX — ${label}`,
    description: `Planes, eventos y lugares recomendados para este fin de semana, ${label}, en Ciudad de México.`,
  };
}

export default function FinDeSemanaPage() {
  const { saturday, sunday } = currentOrUpcomingWeekend(mexicoCityNow());
  const label = formatWeekendLabel(saturday, sunday);

  const weekendEvents = getWeekendAgenda();
  const categories = getCategories();
  const categoryIcon = new Map(
    categories.map((c) => [c.id, { icon: c.icon, label: c.label }]),
  );

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">
          Inicio
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink">Este fin de semana</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          🎉 Este fin de semana
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          ¿Qué hacer este fin de semana en CDMX?
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          {label} — lo que se puede hacer este sábado y domingo en la ciudad.
        </p>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-10 md:px-10">
        <h2 className="mb-4 font-heading text-[22px] font-bold tracking-tight">
          La agenda del finde
        </h2>
        {weekendEvents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-ink-soft">
            Todavía no hay eventos publicados para este fin de semana.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {weekendEvents.map((event) => (
              <PlanCard
                key={event.id}
                plan={event}
                icon={categoryIcon.get(event.category)?.icon ?? "📍"}
                categoryLabel={categoryIcon.get(event.category)?.label ?? ""}
              />
            ))}
          </div>
        )}
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
