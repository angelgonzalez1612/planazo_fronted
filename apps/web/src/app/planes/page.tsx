import type { Metadata } from "next";
import Link from "next/link";
import { getPlans, getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanCard } from "@/components/plan-card";

export const metadata: Metadata = {
  title: "Todos los planes",
  description: "Lugares y eventos en CDMX — el directorio completo, curado por gente que sale mucho.",
};

export default function PlanesPage() {
  const plans = getPlans();
  const categories = getCategories();
  const categoryIcon = new Map(categories.map((c) => [c.id, { icon: c.icon, label: c.label }]));

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <span className="font-semibold text-ink">Todos los planes</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          ✨ Directorio completo
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          Todos los planes en CDMX
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          Lugares y eventos, en un solo lugar — {plans.length} planes curados por gente que sale mucho.
        </p>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
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
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
