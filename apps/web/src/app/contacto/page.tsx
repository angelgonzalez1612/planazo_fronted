import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos para reportar un lugar, resolver una duda o hablar de publicidad en Planazo.",
  alternates: { canonical: "/contacto" },
};

const REASONS = [
  {
    icon: "📍",
    title: "Reportar un lugar",
    text: "¿Un lugar cerró, cambió de horario o algo está mal? Dinos cuál y qué encontraste.",
    subject: "Reportar un lugar en Planazo",
  },
  {
    icon: "💬",
    title: "Dudas o comentarios",
    text: "Cualquier otra cosa sobre el sitio, el contenido o cómo lo usamos.",
    subject: "Duda sobre Planazo",
  },
  {
    icon: "📣",
    title: "Publicidad",
    text: "Tienes un negocio y quieres aparecer en Planazo más allá de los anuncios de Google.",
    subject: "Publicidad en Planazo",
  },
];

const CONTACT_EMAIL = "edangel.gonzalez.cruz@gmail.com";

export default function ContactoPage() {
  const categories = getCategories();

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <span className="font-semibold text-ink">Contacto</span>
      </div>

      <div className="mx-auto max-w-[760px] px-4 py-3.5 pb-16 md:px-10">
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(28px,4vw,44px)] leading-[1.08] font-extrabold tracking-tight">
          Contacto
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          No tenemos un call center ni respuestas automáticas — nos escribes directo a nosotros.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {REASONS.map((reason) => (
            <a
              key={reason.title}
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(reason.subject)}`}
              className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-5.5 transition-colors hover:border-peach"
            >
              <span className="text-2xl leading-none">{reason.icon}</span>
              <h2 className="font-heading text-[16px] font-bold tracking-tight text-ink">{reason.title}</h2>
              <p className="text-[13.5px] leading-relaxed text-ink-soft">{reason.text}</p>
            </a>
          ))}
        </div>

        <p className="mt-8 text-[15px] text-ink-soft">
          O escríbenos directo a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
