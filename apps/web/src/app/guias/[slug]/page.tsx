import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getGuideBySlug, getPlacesForGuide, getCategories, resolvePhoto } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanCard } from "@/components/plan-card";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  const cover = resolvePhoto(guide.cover);
  return {
    title: guide.title,
    description: guide.description,
    openGraph: { images: [cover.url] },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const places = getPlacesForGuide(guide);
  const categories = getCategories();
  const categoryIcon = new Map(categories.map((c) => [c.id, { icon: c.icon, label: c.label }]));
  const cover = resolvePhoto(guide.cover);

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <Link href="/#guias" className="text-ink-soft hover:text-brand">Guías</Link>
        <span>/</span>
        <span className="font-semibold text-ink">{guide.title}</span>
      </div>

      <div className="mx-auto max-w-[880px] px-4 py-3.5 pb-12 sm:pb-16 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          {guide.categoryLabel}
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(28px,4vw,44px)] leading-[1.08] font-extrabold tracking-tight">
          {guide.title}
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{guide.description}</p>
        <p className="mt-2 text-[13px] text-ink-soft">{guide.readTime}</p>

        <div className="relative mt-5.5 aspect-video overflow-hidden rounded-2xl bg-secondary">
          <Image src={cover.url} alt={cover.alt} fill priority sizes="880px" className="object-cover" />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        <h2 className="mb-4.5 font-heading text-2xl font-bold tracking-tight">
          {places.length} {places.length === 1 ? "lugar en esta guía" : "lugares en esta guía"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {places.map((place) => (
            <PlanCard
              key={place.id}
              plan={place}
              icon={categoryIcon.get(place.category)?.icon ?? "📍"}
              categoryLabel={categoryIcon.get(place.category)?.label ?? ""}
            />
          ))}
        </div>
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
