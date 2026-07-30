import type { Metadata } from "next";
import Link from "next/link";
import { getEvents, getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanListing } from "@/components/plan-listing";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Festivales, conciertos, ferias y planes con fecha en CDMX — toda la agenda en un solo lugar.",
};

export default function EventsPage() {
  const events = getEvents();
  const categories = getCategories();
  const categoryIcon = new Map(categories.map((c) => [c.id, { icon: c.icon, label: c.label }]));

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <span className="font-semibold text-ink">Eventos</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          🎉 Agenda completa
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          Eventos en CDMX
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          Festivales, conciertos, ferias y planes con fecha — {events.length} eventos activos ahora mismo.
        </p>
        <p className="mt-3 max-w-[75ch] text-[15px] leading-relaxed text-ink-soft">
          A diferencia de los lugares fijos del directorio, esto cambia todo el tiempo: festivales,
          conciertos, ferias, mercados y funciones que solo pasan una vez o se repiten cada semana.
          Actualizamos la agenda seguido para que no te enteres tarde — filtra por fecha o precio
          para armar tu semana.
        </p>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        <PlanListing plans={events} categoryIcon={categoryIcon} sortIds={["fecha", "precio", "rating"]} />
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
