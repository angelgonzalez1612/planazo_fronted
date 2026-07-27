import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center font-sans">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          No encontramos esta página
        </h1>
        <p className="text-ink-soft">El lugar que buscas no existe o ya no está disponible.</p>
        <Link
          href="/"
          className="rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-14px_rgba(255,90,0,0.8)] hover:bg-brand-pressed"
        >
          Volver al inicio
        </Link>
      </main>
    </>
  );
}
