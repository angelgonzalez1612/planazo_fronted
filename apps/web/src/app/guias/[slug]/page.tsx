import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@planazo/config";
import { getGuides, getGuideBySlug, getPlansForGuide, getCategories, resolvePhoto } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanCard } from "@/components/plan-card";
import { AdSlot } from "@/components/ad-slot";
import { Prose } from "@/components/prose";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

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

  const places = getPlansForGuide(guide);
  const placesBySlug = new Map(places.map((p) => [p.slug, p]));
  const categories = getCategories();
  const categoryIcon = new Map(categories.map((c) => [c.id, { icon: c.icon, label: c.label }]));
  const cover = resolvePhoto(guide.cover);
  const guideUrl = `${siteConfig.url}/guias/${guide.slug}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: siteConfig.url },
    { name: "Guías", url: `${siteConfig.url}/#guias` },
    { name: guide.title, url: guideUrl },
  ]);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    image: cover.url,
    url: guideUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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

        {guide.intro && (
          <Prose text={guide.intro} className="mt-5.5 text-[15.5px] leading-relaxed text-ink-soft" />
        )}

        {guide.sections?.map((section, i) => {
          const linkedPlace = section.placeSlug ? placesBySlug.get(section.placeSlug) : undefined;
          return (
            <div key={i} className="mt-7">
              <h2 className="font-heading text-[21px] font-bold tracking-tight">{section.heading}</h2>
              <Prose text={section.body} className="mt-2 text-[15.5px] leading-relaxed text-ink-soft" />
              {linkedPlace && (
                <Link
                  href={linkedPlace.kind === "evento" ? `/eventos/${linkedPlace.slug}` : `/lugares/${linkedPlace.slug}`}
                  className="mt-2 inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand hover:underline"
                >
                  Ver {linkedPlace.name} →
                </Link>
              )}
            </div>
          );
        })}

        <AdSlot size="728 × 90" className="mt-6 h-[90px]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        <h2 className="mb-4.5 font-heading text-2xl font-bold tracking-tight">
          {places.length} {places.length === 1 ? "lugar en esta guía" : "lugares en esta guía"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {places.flatMap((place, i) => {
            const card = (
              <PlanCard
                key={place.id}
                plan={place}
                icon={categoryIcon.get(place.category)?.icon ?? "📍"}
                categoryLabel={categoryIcon.get(place.category)?.label ?? ""}
              />
            );
            // Un anuncio cada 5 tarjetas, como en el resto de los listados.
            if ((i + 1) % 5 === 0) {
              return [card, <AdSlot key={`ad-${place.id}`} size="300 × 250" className="aspect-4/3 rounded-xl" type="feed" />];
            }
            return [card];
          })}
        </div>
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
