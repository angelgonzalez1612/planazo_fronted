import Link from "next/link";
import type { Metadata } from "next";
import { searchPlans, getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanListing } from "@/components/plan-listing";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Resultados para "${q}"` : "Buscar" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const plans = searchPlans(q);
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
        <span className="font-semibold text-ink">{q ? `"${q}"` : "Búsqueda"}</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(28px,4vw,44px)] leading-[1.06] font-extrabold tracking-tight">
          {q ? `Resultados para "${q}"` : "¿Qué quieres hacer?"}
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          {plans.length} {plans.length === 1 ? "plan encontrado" : "planes encontrados"}.
        </p>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        {plans.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-ink-soft">
            No encontramos planes para &ldquo;{q}&rdquo;. Intenta con otra búsqueda.
          </p>
        ) : (
          <PlanListing plans={plans} categoryIcon={categoryIcon} sortIds={[...sortIds]} />
        )}
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
