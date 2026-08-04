import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@planazo/config";
import {
  getAllAlcaldias,
  getAlcaldiaBySlug,
  getPlansByAlcaldia,
  getAlcaldiaCategoryCounts,
  getCategories,
} from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanListing } from "@/components/plan-listing";
import { Prose } from "@/components/prose";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ alcaldia: string }> };

export function generateStaticParams() {
  return getAllAlcaldias().map((alcaldia) => ({ alcaldia: alcaldia.slug }));
}

// Solo dos alcaldías tienen suficiente contenido real para una página propia
// (ver lib/data/local.ts, ALCALDIAS_CON_PAGINA) — el copy es a propósito
// específico de cada una, no una plantilla genérica.
const ALCALDIA_SEO: Record<string, { heading: string; description: string; intro: string }> = {
  cuauhtemoc: {
    heading: "Qué hacer en la alcaldía Cuauhtémoc",
    description:
      "Qué hacer en la alcaldía Cuauhtémoc — Centro Histórico, Roma y Condesa: bares, restaurantes, mercados y museos curados por gente que sale mucho.",
    intro:
      "La alcaldía Cuauhtémoc concentra el corazón histórico y la vida de calle más densa de la ciudad: desde el Centro Histórico —el centro histórico más grande de América Latina, Patrimonio de la Humanidad desde 1987, levantado sobre las ruinas de Tenochtitlan— hasta colonias porfirianas como la Roma, trazada en 1903 con calles a la europea, y la Condesa, construida sobre el antiguo hipódromo del Jockey Club entre 1925 y 1927. Es la alcaldía con más lugares curados en Planazo: bares con historia, mercados gastronómicos y museos, casi todo a distancia caminable.",
  },
  "miguel-hidalgo": {
    heading: "Qué hacer en la alcaldía Miguel Hidalgo",
    description:
      "Qué hacer en la alcaldía Miguel Hidalgo — Polanco y el Bosque de Chapultepec: alta cocina, museos y planes al aire libre.",
    intro:
      "La alcaldía Miguel Hidalgo reúne Polanco, el corredor comercial más caro de América Latina desde los años ochenta, con el Bosque de Chapultepec, el pulmón más grande de la ciudad, con ocupación humana desde hace más de dos mil años y un castillo que fue Colegio Militar antes de convertirse en museo. Es la alcaldía de los museos de clase mundial y la alta cocina de la ciudad.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { alcaldia: alcaldiaSlug } = await params;
  const alcaldia = getAlcaldiaBySlug(alcaldiaSlug);
  if (!alcaldia) return {};

  const seo = ALCALDIA_SEO[alcaldiaSlug];
  return {
    title: seo?.heading ?? `Qué hacer en la alcaldía ${alcaldia.label}`,
    description:
      seo?.description ??
      `Qué hacer en la alcaldía ${alcaldia.label}, CDMX — curado por gente que sale mucho.`,
  };
}

export default async function AlcaldiaPage({ params }: Props) {
  const { alcaldia: alcaldiaSlug } = await params;
  const alcaldia = getAlcaldiaBySlug(alcaldiaSlug);
  if (!alcaldia) notFound();

  const plans = getPlansByAlcaldia(alcaldia.slug);
  const categoryCounts = getAlcaldiaCategoryCounts(alcaldia.slug);
  const categories = getCategories();
  const categoryLabel = new Map(categories.map((c) => [c.id, c]));
  const categoryIcon = new Map(categories.map((c) => [c.id, { icon: c.icon, label: c.label }]));
  const seo = ALCALDIA_SEO[alcaldiaSlug];
  const sortIds = plans.some((p) => p.kind === "evento")
    ? (["fecha", "precio", "rating"] as const)
    : (["precio", "rating"] as const);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: siteConfig.url },
    { name: alcaldia.label, url: `${siteConfig.url}/alcaldia/${alcaldia.slug}` },
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
        <span className="font-semibold text-ink">{alcaldia.label}</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          🏛️ Alcaldía
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          {seo?.heading ?? `Qué hacer en la alcaldía ${alcaldia.label}`}
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          {plans.length} {plans.length === 1 ? "plan curado" : "planes curados"} en esta alcaldía.
        </p>
        {seo?.intro && (
          <Prose text={seo.intro} className="mt-3 max-w-[75ch] text-[15px] leading-relaxed text-ink-soft" />
        )}

        {categoryCounts.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {categoryCounts.map(({ category, count }) => {
              const cat = categoryLabel.get(category);
              if (!cat) return null;
              return (
                <Link
                  key={category}
                  href={`/alcaldia/${alcaldia.slug}/${category}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  {cat.icon} {cat.label} <span className="text-ink-soft">({count})</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        {plans.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-ink-soft">
            Todavía no hay planes publicados en esta alcaldía.
          </p>
        ) : (
          <PlanListing plans={plans} categoryIcon={categoryIcon} sortIds={[...sortIds]} />
        )}
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
