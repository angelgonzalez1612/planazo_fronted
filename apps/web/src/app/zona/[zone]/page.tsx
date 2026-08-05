import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@planazo/config";
import { getAllZones, getZoneBySlug, getPlansByZone, getCategories, getAlcaldiaForZone } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanListing } from "@/components/plan-listing";
import { Prose } from "@/components/prose";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/structured-data";
import zoneIntros from "@/data/zone-intros.json";

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
    alternates: { canonical: `/zona/${zoneSlug}` },
  };
}

export default async function ZonePage({ params }: Props) {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);
  if (!zone) notFound();

  const plans = getPlansByZone(zone.slug);
  const intro = (zoneIntros as Record<string, string>)[zone.slug];
  const alcaldia = getAlcaldiaForZone(zone.label);
  const categories = getCategories();
  const categoryIcon = new Map(categories.map((c) => [c.id, { icon: c.icon, label: c.label }]));
  const sortIds = plans.some((p) => p.kind === "evento")
    ? (["fecha", "precio", "rating"] as const)
    : (["precio", "rating"] as const);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: siteConfig.url },
    { name: zone.label, url: `${siteConfig.url}/zona/${zone.slug}` },
  ]);
  const itemListJsonLd = buildItemListJsonLd(plans);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
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
        {intro && (
          <Prose text={intro} className="mt-3 max-w-[75ch] text-[15px] leading-relaxed text-ink-soft" />
        )}
        {alcaldia && (
          <Link
            href={`/alcaldia/${alcaldia.slug}`}
            className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand hover:underline"
          >
            Ver todo en la alcaldía {alcaldia.label} →
          </Link>
        )}
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
