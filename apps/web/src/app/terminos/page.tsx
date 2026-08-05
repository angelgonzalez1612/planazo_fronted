import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Condiciones de uso del directorio Planazo: qué es, qué no es, y los límites de responsabilidad sobre la información publicada.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  const categories = getCategories();

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <span className="font-semibold text-ink">Términos</span>
      </div>

      <div className="mx-auto max-w-[760px] px-4 py-3.5 pb-16 md:px-10">
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(28px,4vw,44px)] leading-[1.08] font-extrabold tracking-tight">
          Términos de uso
        </h1>
        <p className="mt-3 text-[14px] text-ink-soft">Última actualización: julio de 2026.</p>

        <div className="mt-8 flex flex-col gap-7 text-[15.5px] leading-relaxed text-[#3A332E]">
          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Qué es Planazo</h2>
            <p>
              Planazo es un directorio informativo de lugares y eventos en Ciudad de México. No somos una agencia de
              viajes, ni una plataforma de reservaciones, ni vendemos boletos o servicios de los negocios que
              aparecen aquí — solo describimos y organizamos información para ayudarte a decidir a dónde ir.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Exactitud de la información</h2>
            <p>
              Hacemos lo posible por mantener horarios, precios y direcciones actualizados, pero los negocios pueden
              cambiar sus condiciones sin avisarnos. Antes de salir, sobre todo si es un plan importante, te
              recomendamos confirmar directamente con el lugar. No garantizamos que la información esté siempre
              100% al día.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Comentarios y contenido de usuarios</h2>
            <p>
              Si dejas un comentario u opinión en el sitio, debe ser tuyo, honesto y respetuoso. Nos reservamos el
              derecho de eliminar contenido que sea falso, ofensivo, spam, o que infrinja derechos de terceros.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Publicidad</h2>
            <p>
              Planazo puede mostrar anuncios de terceros, incluyendo Google AdSense, para financiar el sitio y
              mantenerlo gratuito. No somos responsables por el contenido de esos anuncios ni por los productos o
              servicios que promocionan.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Propiedad intelectual</h2>
            <p>
              Los textos y la curaduría son de Planazo. Las fotografías provienen de los propios negocios o de bancos
              de imágenes con licencia (como Unsplash) cuando aún no tenemos una foto real del lugar — en ese caso lo
              señalamos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Límite de responsabilidad</h2>
            <p>
              Usas el sitio bajo tu propio criterio. Planazo no es responsable por decisiones tomadas con base en la
              información publicada, ni por experiencias en los lugares o eventos listados.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Cambios a estos términos</h2>
            <p>
              Podemos actualizar estos términos cuando el sitio cambie. La fecha al inicio de esta página siempre
              indica la versión más reciente.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Contacto</h2>
            <p>
              ¿Dudas sobre estos términos? Escríbenos a{" "}
              <a href="mailto:edangel.gonzalez.cruz@gmail.com" className="font-semibold text-brand hover:underline">
                edangel.gonzalez.cruz@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
