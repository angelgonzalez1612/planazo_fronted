import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllZones, getZoneBySlug, getPlansByZone, getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanListing } from "@/components/plan-listing";

type Props = { params: Promise<{ zone: string }> };

export function generateStaticParams() {
  return getAllZones().map((zone) => ({ zone: zone.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);
  if (!zone) return {};

  return {
    title: `Qué hacer en ${zone.label}`,
    description: `Qué hacer en ${zone.label}, CDMX — restaurantes, bares, cultura y planes curados por gente que sale mucho.`,
  };
}

export default async function ZonePage({ params }: Props) {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);
  if (!zone) notFound();

  const plans = getPlansByZone(zone.slug);
  const categories = getCategories();
  const categoryIcon = new Map(categories.map((c) => [c.id, { icon: c.icon, label: c.label }]));
  const sortIds = plans.some((p) => p.kind === "evento")
    ? (["fecha", "precio", "rating"] as const)
    : (["precio", "rating"] as const);

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <span className="font-semibold text-ink">{zone.label}</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          📍 Zona
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          Qué hacer en {zone.label}
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          {plans.length} {plans.length === 1 ? "plan curado" : "planes curados"} en esta zona.
        </p>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        {plans.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-ink-soft">
            Todavía no hay planes publicados en esta zona.
          </p>
        ) : (
          <PlanListing plans={plans} categoryIcon={categoryIcon} sortIds={[...sortIds]} />
        )}
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
