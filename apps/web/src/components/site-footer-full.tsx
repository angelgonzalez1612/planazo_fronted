"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/data/types";
import { categoryHref } from "@/lib/data";
import { useCity } from "@/components/providers/app-providers";

const CITIES = ["CDMX", "Guadalajara", "Monterrey", "Puebla", "Querétaro", "Mérida"];

// No social accounts yet confirmed to actually belong to Planazo (see the
// Organization JSON-LD note in layout.tsx) — showing icons that link nowhere
// would be the exact kind of invented content the site promises not to have.

export function SiteFooterFull({ categories }: { categories: Category[] }) {
  const { city, setCity } = useCity();

  return (
    <footer className="bg-ink font-sans text-[#CFC7C1]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-3 md:px-10 lg:grid-cols-5 lg:gap-10">
        <div className="col-span-2 min-w-[200px] sm:col-span-1">
          <div className="flex items-center gap-0.5 font-heading text-2xl font-extrabold tracking-tight text-white">
            <Image src="/logo.png" alt="Planazo" width={24} height={30} className="h-[30px] w-6 object-contain" />
            <span className="text-brand">plan</span>azo
          </div>
          <p className="mt-3.5 max-w-[28ch] text-sm leading-relaxed">
            La plataforma para descubrir qué hacer en tu ciudad.
          </p>
        </div>

        <div>
          <p className="mb-3.5 font-heading text-sm font-bold tracking-wider text-white uppercase">Categorías</p>
          <div className="flex flex-col gap-2.5 text-sm">
            {categories.map((c) => (
              <Link key={c.id} href={categoryHref(c.id)} className="text-[#CFC7C1] hover:text-brand">
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3.5 font-heading text-sm font-bold tracking-wider text-white uppercase">Ciudades</p>
          <div className="flex flex-col gap-2.5 text-sm">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                title={c === "CDMX" ? undefined : "Próximamente"}
                onClick={() => {
                  setCity(c);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`text-left hover:text-brand ${c === city ? "font-bold text-white" : "text-[#CFC7C1]"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3.5 font-heading text-sm font-bold tracking-wider text-white uppercase">Planazo</p>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/quienes-somos" className="hover:text-brand">Quiénes somos</Link>
            <Link href="/publica" className="hover:text-brand">Publica tu lugar</Link>
            <Link href="/publicidad" className="hover:text-brand">Publicidad</Link>
            <span className="cursor-default" title="Próximamente">Prensa</span>
            <span className="cursor-default" title="Próximamente">Trabaja con nosotros</span>
          </div>
        </div>

        <div>
          <p className="mb-3.5 font-heading text-sm font-bold tracking-wider text-white uppercase">Ayuda</p>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/contacto" className="hover:text-brand">Centro de ayuda</Link>
            <Link href="/contacto" className="hover:text-brand">Contacto</Link>
            <Link href="/contacto" className="hover:text-brand">Reportar un lugar</Link>
            <Link href="/publica" className="hover:text-brand">Sugerir un plan</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-4 border-t border-border-dark px-4 py-5 text-[13px] text-[#8C837C] md:px-10">
        <span>© 2026 Planazo</span>
        <div className="flex flex-wrap gap-4.5">
          <Link href="/privacidad" className="hover:text-[#CFC7C1]">Aviso de privacidad</Link>
          <Link href="/terminos" className="hover:text-[#CFC7C1]">Términos</Link>
          <Link href="/publicidad" className="hover:text-[#CFC7C1]">Publicidad</Link>
          <Link href="/contacto" className="hover:text-[#CFC7C1]">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}
