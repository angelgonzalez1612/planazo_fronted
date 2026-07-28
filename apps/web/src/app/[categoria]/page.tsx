import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getPlacesByCategory } from "@/lib/data";
import type { CategoryId } from "@/data/types";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanListing } from "@/components/plan-listing";

type Props = { params: Promise<{ categoria: string }> };

// "eventos" is its own dedicated route (/eventos) with a different card shape —
// this route only ever serves the place categories.
const PLACE_CATEGORIES: CategoryId[] = [
  "comer",
  "cafes",
  "bares",
  "cultura",
  "aire-libre",
  "tecnologia",
  "gaming",
  "viajes",
  "cine-tv",
  "geek",
  "mascotas",
  "musica",
];

export function generateStaticParams() {
  return PLACE_CATEGORIES.map((categoria) => ({ categoria }));
}

function findCategory(categoria: string) {
  if (!PLACE_CATEGORIES.includes(categoria as CategoryId)) return undefined;
  return getCategories().find((c) => c.id === categoria);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const category = findCategory(categoria);
  if (!category) return {};

  return {
    title: category.label,
    description: `${category.label} en CDMX — el directorio completo, curado por gente que sale mucho.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params;
  const category = findCategory(categoria);
  if (!category) notFound();

  const places = await getPlacesByCategory(category.id);
  const categories = getCategories();
  const categoryIcon = new Map([[category.id, { icon: category.icon, label: category.label }]]);

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <span className="font-semibold text-ink">{category.label}</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          {category.icon} Directorio
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          {category.label} en CDMX
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          El directorio completo, curado por gente que sale mucho — {places.length}{" "}
          {places.length === 1 ? "lugar" : "lugares"}.
        </p>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        {places.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-ink-soft">
            Todavía no hay lugares publicados en esta categoría.
          </p>
        ) : (
          <PlanListing plans={places} categoryIcon={categoryIcon} sortIds={["precio", "rating"]} />
        )}
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
