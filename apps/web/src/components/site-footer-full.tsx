"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/data/types";
import { categoryHref } from "@/lib/data";
import { useCity } from "@/components/providers/app-providers";

const CITIES = ["CDMX", "Guadalajara", "Monterrey", "Puebla", "Querétaro", "Mérida"];

const SOCIALS = [
  {
    label: "Instagram",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 2h-3.2v13.6a3.1 3.1 0 1 1-2.6-3.06V9.4a6.3 6.3 0 1 0 5.8 6.28V9.86a8.1 8.1 0 0 0 4.9 1.66V8.3a4.9 4.9 0 0 1-4.9-4.9V2Z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.4 3.6-6.4 3.6Z" />
      </svg>
    ),
  },
];

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
          <div className="mt-4.5 flex gap-2.5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                title={social.label}
                aria-label={social.label}
                className="grid size-[38px] place-items-center rounded-full border border-border-dark text-[#CFC7C1] hover:border-brand"
              >
                {social.icon}
              </a>
            ))}
          </div>
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
            <span className="cursor-default" title="Próximamente">Quiénes somos</span>
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
