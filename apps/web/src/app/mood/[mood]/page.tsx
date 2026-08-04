import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@planazo/config";
import { getMoods, resolveMoodPlans, getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanCard } from "@/components/plan-card";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ mood: string }> };

export function generateStaticParams() {
  return getMoods().map((mood) => ({ mood: mood.id }));
}

function findMood(mood: string) {
  return getMoods().find((m) => m.id === mood);
}

// Copy tuned to match how people actually search ("qué hacer gratis en cdmx",
// "qué hacer en la noche") instead of just echoing the mood label.
const MOOD_SEO: Partial<Record<string, { heading: string; description: string }>> = {
  pareja: {
    heading: "Planes para una cita en CDMX",
    description: "Qué hacer en pareja en CDMX — planes para una cita, curados por gente que sale mucho.",
  },
  familiar: {
    heading: "Qué hacer en familia en CDMX",
    description: "Planes familiares en CDMX — qué hacer con niños, curados por gente que sale mucho.",
  },
  amigos: {
    heading: "Planes para salir con amigos en CDMX",
    description: "Qué hacer con amigos en CDMX — planes curados por gente que sale mucho.",
  },
  gratis: {
    heading: "Qué hacer gratis en CDMX",
    description: "Planes gratis en CDMX — museos, mercados y eventos sin costo, curados por gente que sale mucho.",
  },
  noche: {
    heading: "Qué hacer en la noche en CDMX",
    description: "Planes de noche en CDMX — bares, música en vivo y planes nocturnos, curados por gente que sale mucho.",
  },
  relajado: {
    heading: "Planes relajados en CDMX",
    description: "Qué hacer tranquilo en CDMX — planes relajados curados por gente que sale mucho.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mood } = await params;
  const found = findMood(mood);
  if (!found) return {};

  const seo = MOOD_SEO[found.id];
  return {
    title: seo?.heading ?? `Planes ${found.label.toLowerCase()}`,
    description: seo?.description ?? `Planes para cuando vienes ${found.label.toLowerCase()} — curados por gente que sale mucho.`,
  };
}

export default async function MoodPage({ params }: Props) {
  const { mood } = await params;
  const found = findMood(mood);
  if (!found) notFound();

  const plans = resolveMoodPlans(found.id);
  const categories = getCategories();
  const categoryIcon = new Map(categories.map((c) => [c.id, { icon: c.icon, label: c.label }]));
  const seo = MOOD_SEO[found.id];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: siteConfig.url },
    { name: found.label, url: `${siteConfig.url}/mood/${found.id}` },
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
        <span className="font-semibold text-ink">{found.label}</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          {found.emoji} Mood
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          {seo?.heading ?? `Planes para cuando vienes ${found.label.toLowerCase()}`}
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          {plans.length} {plans.length === 1 ? "plan curado" : "planes curados"} para este mood.
        </p>
        {found.intro && (
          <p className="mt-3 max-w-[75ch] text-[15px] leading-relaxed text-ink-soft">{found.intro}</p>
        )}
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        {plans.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-ink-soft">
            Todavía no hay planes para este mood.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                icon={categoryIcon.get(plan.category)?.icon ?? "📍"}
                categoryLabel={categoryIcon.get(plan.category)?.label ?? ""}
              />
            ))}
          </div>
        )}
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
