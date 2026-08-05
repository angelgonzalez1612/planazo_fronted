import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";

export const metadata: Metadata = {
  title: "Publicidad",
  description: "Cómo se financia Planazo y cómo anunciar tu negocio en el directorio.",
  alternates: { canonical: "/publicidad" },
};

export default function PublicidadPage() {
  const categories = getCategories();

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <span className="font-semibold text-ink">Publicidad</span>
      </div>

      <div className="mx-auto max-w-[760px] px-4 py-3.5 pb-16 md:px-10">
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(28px,4vw,44px)] leading-[1.08] font-extrabold tracking-tight">
          Publicidad
        </h1>

        <div className="mt-8 flex flex-col gap-7 text-[15.5px] leading-relaxed text-[#3A332E]">
          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Cómo se financia Planazo</h2>
            <p>
              Planazo es gratuito para quien lo usa. Para mantenerlo así, el sitio muestra anuncios de Google
              AdSense en algunos espacios marcados como &ldquo;Publicidad&rdquo;. Esos anuncios los elige y sirve
              Google, no nosotros directamente — puedes leer más sobre cómo funcionan en el{" "}
              <Link href="/privacidad" className="font-semibold text-brand hover:underline">
                aviso de privacidad
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Anuncios y curaduría son cosas distintas</h2>
            <p>
              Ningún lugar aparece en el directorio, ni recibe mejor trato editorial, por pagarnos. La selección de
              qué lugares mostramos y cómo los describimos sigue siendo independiente de la publicidad del sitio.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">¿Tienes un negocio y quieres anunciarte?</h2>
            <p>
              Si buscas otra forma de aparecer en Planazo — más allá de los anuncios de Google — escríbenos a{" "}
              <a href="mailto:edangel.gonzalez.cruz@gmail.com" className="font-semibold text-brand hover:underline">
                edangel.gonzalez.cruz@gmail.com
              </a>{" "}
              contándonos tu negocio. Todavía no tenemos un paquete o tarifa fija publicada — lo estamos armando —
              pero respondemos cada correo.
            </p>
          </section>
        </div>
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
