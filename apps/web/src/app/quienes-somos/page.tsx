import type { Metadata } from "next";
import Link from "next/link";
import { getPlans, getGuides, getCategories, getSiteContent } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { NewsletterCta } from "@/components/newsletter-cta";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Planazo es un directorio de planes en CDMX curado por gente que sale mucho — no por un algoritmo.",
};

const PRINCIPLES = [
  {
    icon: "🎙️",
    title: "Voz de amigo, no de folleto",
    text: "Contamos los lugares como te los contaría alguien que sale mucho, no como un comunicado de prensa turístico.",
  },
  {
    icon: "📸",
    title: "Fotos reales, no relleno",
    text: "Si todavía no tenemos una foto real de un lugar, no la inventamos con stock genérico — lo dejamos claro.",
  },
  {
    icon: "🎯",
    title: "El naranja es para lo que importa",
    text: "Nada de diseño saturado por saturar. El color se usa para señalar lo relevante, no para decorar.",
  },
  {
    icon: "🚫",
    title: "Cero datos inventados",
    text: "Precio, horario, calificación: si no lo sabemos con certeza, no lo ponemos. Preferimos un espacio en blanco a un dato falso.",
  },
];

export default function QuienesSomosPage() {
  const plans = getPlans();
  const guides = getGuides();
  const categories = getCategories();
  const site = getSiteContent();

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <span className="font-semibold text-ink">Quiénes somos</span>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 pt-3.5 pb-12 md:px-10 lg:pb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          ✦ Sobre Planazo
        </span>
        <h1 className="text-wrap-balance mt-3.5 max-w-[20ch] font-heading text-[clamp(32px,5vw,56px)] leading-[1.04] font-extrabold tracking-tight">
          Hecho por gente que sí sale
        </h1>
        <p className="mt-4.5 max-w-[62ch] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-ink-soft">
          Planazo nació porque estábamos hartos de guías turísticas genéricas y reseñas que nadie puede verificar.
          Aquí seleccionamos nosotros, salimos nosotros, y si algo cierra o cambia, lo actualizamos nosotros.
        </p>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-14 md:px-10 lg:pb-20">
        <div className="flex flex-wrap gap-10 lg:gap-16">
          <div className="min-w-[280px] flex-[1.3]">
            <h2 className="font-heading text-[clamp(24px,3vw,32px)] font-bold tracking-tight">Por qué existe Planazo</h2>
            <p className="mt-4 max-w-[65ch] text-[16px] leading-relaxed text-ink-soft">
              La mayoría de las apps de &ldquo;qué hacer&rdquo; viven de listas genéricas y reseñas que nadie puede
              verificar. Planazo es distinto: cada lugar que ves aquí lo revisó una persona real, no un algoritmo
              que junta datos de quién sabe dónde.
            </p>
            <p className="mt-4 max-w-[65ch] text-[16px] leading-relaxed text-ink-soft">
              No somos una guía de turismo oficial ni queremos serlo. Somos más como ese amigo que siempre sabe a
              dónde ir este finde — con la diferencia de que lo escribimos para que lo consultes cuando quieras.
            </p>
          </div>

          <div className="flex min-w-[220px] flex-1 flex-col gap-4 rounded-3xl border border-border bg-card p-7">
            <p className="font-mono text-[11px] font-semibold tracking-[.08em] text-brand-deep uppercase">
              Ahorita en Planazo
            </p>
            <div className="flex flex-col gap-3.5">
              <div>
                <span className="font-heading text-[28px] font-extrabold tracking-tight">{plans.length}</span>
                <span className="ml-1.5 text-[14px] text-ink-soft">planes curados</span>
              </div>
              <div>
                <span className="font-heading text-[28px] font-extrabold tracking-tight">{guides.length}</span>
                <span className="ml-1.5 text-[14px] text-ink-soft">guías temáticas</span>
              </div>
              <div>
                <span className="font-heading text-[28px] font-extrabold tracking-tight">
                  {site.newsletterCount.toLocaleString("es-MX")}
                </span>
                <span className="ml-1.5 text-[14px] text-ink-soft">personas en el boletín</span>
              </div>
              <div>
                <span className="font-heading text-[28px] font-extrabold tracking-tight">{categories.length}</span>
                <span className="ml-1.5 text-[14px] text-ink-soft">categorías, empezando por CDMX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-background">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-10 lg:py-16">
          <h2 className="font-heading text-[clamp(24px,3vw,32px)] font-bold tracking-tight">Cómo trabajamos</h2>
          <p className="mt-2 max-w-[60ch] text-[15.5px] text-[#CFC7C1]">
            Cuatro reglas que seguimos al armar cada ficha, tal cual las aplicamos por dentro.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="flex flex-col gap-3 rounded-2xl border border-border-dark bg-surface-dark p-5.5">
                <span className="text-2xl leading-none">{p.icon}</span>
                <h3 className="font-heading text-[16px] font-bold tracking-tight text-white">{p.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-[#CFC7C1]">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 md:px-10 lg:py-16">
        <NewsletterCta subscriberCount={site.newsletterCount} />
      </section>

      <SiteFooterFull categories={categories} />
    </>
  );
}
