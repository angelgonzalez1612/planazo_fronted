import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@planazo/config";
import { getGuides, getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { GuidesSection } from "@/components/guides-section";
import { buildBreadcrumbJsonLd, buildGuideListJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Guías de CDMX",
  description: "Guías curadas de CDMX por barrio, presupuesto y plan — artículos completos, no listas genéricas.",
  alternates: { canonical: "/guias" },
};

export default function GuidesIndexPage() {
  const guides = getGuides();
  const categories = getCategories();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: siteConfig.url },
    { name: "Guías", url: `${siteConfig.url}/guias` },
  ]);
  const itemListJsonLd = buildGuideListJsonLd(guides);

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
        <span className="font-semibold text-ink">Guías</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          📖 Guías
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          Guías de CDMX
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          Artículos completos por barrio, presupuesto y plan — {guides.length} guías curadas por gente que sale mucho, con parada por parada y datos investigados, no listas genéricas.
        </p>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        <GuidesSection guides={guides} />
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
