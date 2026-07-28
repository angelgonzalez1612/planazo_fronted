"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCity, useSignupPrompt } from "@/components/providers/app-providers";
import { NavSearchOverlay } from "@/components/nav-search-overlay";
import { getSearchSuggestions } from "@/lib/data";

const NAV_LINKS = [
  { href: "/#destacados", label: "Planes" },
  { href: "/#lugares", label: "Lugares" },
  { href: "/#finde", label: "Este finde" },
  { href: "/#guias", label: "Guías" },
];

const CITIES = ["CDMX", "Guadalajara", "Monterrey", "Puebla", "Querétaro", "Mérida"];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const { city, setCity } = useCity();
  const { triggerAuthPrompt } = useSignupPrompt();
  const cityMenuRef = useRef<HTMLDivElement>(null);
  const searchSuggestions = useMemo(() => getSearchSuggestions(), []);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 12);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (cityMenuRef.current && !cityMenuRef.current.contains(e.target as Node)) {
        setCityMenuOpen(false);
      }
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-border font-sans transition-[box-shadow,background-color] duration-200 ${
        isScrolled ? "bg-background/97 shadow-[0_10px_30px_-20px_rgba(25,21,18,0.35)]" : "bg-background/88"
      } backdrop-blur-md`}
    >
      <div
        className={`mx-auto flex max-w-[1280px] items-center gap-3 px-4 transition-[padding] duration-200 sm:gap-6 md:px-10 ${
          isScrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        <Link href="/" className="group flex items-center gap-0.5 font-heading text-2xl font-extrabold tracking-tight">
          <Image
            src="/logo.png"
            alt="Planazo"
            width={24}
            height={30}
            className="h-[30px] w-6 object-contain transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105"
          />
          <span className="text-brand">plan</span>azo
        </Link>

        <nav className="hidden flex-1 flex-wrap gap-1 text-[14.5px] font-semibold md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-ink transition-colors hover:bg-accent hover:text-brand-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:ml-auto md:flex">
          <NavSearchOverlay suggestions={searchSuggestions} />
          <div className="relative" ref={cityMenuRef}>
            <button
              type="button"
              onClick={() => setCityMenuOpen((v) => !v)}
              aria-expanded={cityMenuOpen}
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-2 text-sm font-semibold text-ink"
            >
              <span className="text-[13px]">📍</span>
              {city}
              <span className={`text-[9px] text-ink-soft transition-transform ${cityMenuOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            {cityMenuOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 z-50 flex min-w-[170px] flex-col rounded-2xl border border-border bg-card p-1.5 shadow-[0_18px_40px_-20px_rgba(25,21,18,0.3)]">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCity(c);
                      setCityMenuOpen(false);
                    }}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-accent hover:text-brand-deep"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => triggerAuthPrompt("cuenta")}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(255,90,0,0.28)] transition-[transform,box-shadow,background-color] hover:-translate-y-px hover:bg-brand-pressed hover:shadow-[0_10px_22px_rgba(255,90,0,0.36)]"
          >
            Regístrate
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <NavSearchOverlay
            suggestions={searchSuggestions}
            className="grid size-10 flex-none place-items-center rounded-[10px] border border-border bg-card text-lg"
          />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            className={`grid size-10 place-items-center rounded-[10px] border border-border ${
              mobileOpen ? "bg-secondary" : "bg-card"
            }`}
          >
            <span className="text-lg leading-none">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      <nav
        className={`flex flex-col gap-0.5 overflow-hidden border-b border-border bg-background px-4 shadow-[0_18px_30px_-24px_rgba(25,21,18,0.3)] transition-[max-height,opacity,padding] duration-300 md:hidden ${
          mobileOpen ? "max-h-[480px] py-2 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="border-b border-border/60 py-3 text-[15.5px] font-semibold"
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => {
            const next = CITIES[(CITIES.indexOf(city) + 1) % CITIES.length];
            setCity(next);
          }}
          className="border-b border-border/60 py-3 text-left text-[15.5px] font-semibold"
        >
          📍 Cambiar de ciudad ({city})
        </button>
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            triggerAuthPrompt("cuenta");
          }}
          className="py-3 text-left text-[15.5px] font-bold text-brand"
        >
          Regístrate →
        </button>
      </nav>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-transparent">
        <div className="h-full bg-brand transition-[width] duration-150" style={{ width: `${scrollPct}%` }} />
      </div>
    </header>
  );
}
