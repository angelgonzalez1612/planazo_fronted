import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo Planazo recaba y usa tus datos: qué información recopilamos, con qué fin, y cómo ejercer tus derechos ARCO.",
};

export default function PrivacidadPage() {
  const categories = getCategories();

  return (
    <>
      <SiteHeader />

      <div className="mx-auto flex flex-wrap gap-2 px-4 pt-4.5 text-[13.5px] text-ink-soft md:px-10">
        <Link href="/" className="text-ink-soft hover:text-brand">Inicio</Link>
        <span>/</span>
        <span className="font-semibold text-ink">Aviso de privacidad</span>
      </div>

      <div className="mx-auto max-w-[760px] px-4 py-3.5 pb-16 md:px-10">
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(28px,4vw,44px)] leading-[1.08] font-extrabold tracking-tight">
          Aviso de privacidad
        </h1>
        <p className="mt-3 text-[14px] text-ink-soft">Última actualización: julio de 2026.</p>

        <div className="mt-8 flex flex-col gap-7 text-[15.5px] leading-relaxed text-[#3A332E]">
          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Responsable</h2>
            <p>
              Planazo (&ldquo;Planazo&rdquo;, &ldquo;nosotros&rdquo;) es responsable del tratamiento de tus datos
              personales conforme a este aviso. Para cualquier duda o solicitud relacionada con tus datos, escríbenos
              a{" "}
              <a href="mailto:edangel.gonzalez.cruz@gmail.com" className="font-semibold text-brand hover:underline">
                edangel.gonzalez.cruz@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Qué datos recabamos</h2>
            <p>
              Al navegar el sitio recabamos datos de uso y navegación de forma automática: páginas que visitas,
              tiempo en el sitio, tipo de dispositivo y ubicación aproximada (a nivel ciudad, a partir de tu IP). Si
              te suscribes a nuestro boletín, recabamos tu correo electrónico. No solicitamos ni almacenamos datos
              financieros ni información sensible.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Cookies y tecnologías similares</h2>
            <p>Usamos cookies y tecnologías equivalentes para tres fines:</p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5 list-disc">
              <li><strong>Analítica</strong> (Google Analytics y Microsoft Clarity): para entender qué contenido funciona y mejorar el sitio.</li>
              <li><strong>Funcionalidad</strong>: para recordar tu ciudad seleccionada y tus lugares guardados.</li>
              <li><strong>Publicidad</strong> (Google AdSense, cuando esté activo): para mostrar anuncios y medir su desempeño. Google puede usar cookies para personalizar los anuncios según tu actividad.</li>
            </ul>
            <p className="mt-2">
              Puedes administrar o desactivar las cookies de publicidad de Google desde{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand hover:underline"
              >
                Configuración de anuncios de Google
              </a>
              , y las de tu navegador desde su configuración de privacidad.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Con quién compartimos datos</h2>
            <p>
              No vendemos tus datos personales. Compartimos datos de navegación, en la medida necesaria para que
              operen, con estos terceros:
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 pl-5 list-disc">
              <li>
                <strong>Google</strong> (Analytics, AdSense, Maps) — sujeto a la{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
                  política de privacidad de Google
                </a>
                .
              </li>
              <li>
                <strong>Microsoft Clarity</strong> — sujeto a la{" "}
                <a href="https://privacy.microsoft.com/es-mx/privacystatement" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
                  declaración de privacidad de Microsoft
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Para qué usamos tus datos</h2>
            <p>
              Para operar y mejorar el sitio, entender qué planes buscan más los usuarios, enviar nuestro boletín a
              quien se suscribe, y — cuando esté activo — mostrar anuncios relevantes que ayudan a mantener Planazo
              gratuito.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Tus derechos ARCO</h2>
            <p>
              Tienes derecho a Acceder, Rectificar y Cancelar tus datos personales, así como a Oponerte a su
              tratamiento (derechos ARCO), en los términos de la Ley Federal de Protección de Datos Personales en
              Posesión de los Particulares. Para ejercerlos, escríbenos a{" "}
              <a href="mailto:edangel.gonzalez.cruz@gmail.com" className="font-semibold text-brand hover:underline">
                edangel.gonzalez.cruz@gmail.com
              </a>{" "}
              indicando tu solicitud; te responderemos en un plazo razonable.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading text-[19px] font-bold tracking-tight text-ink">Cambios a este aviso</h2>
            <p>
              Podemos actualizar este aviso conforme cambien nuestras prácticas o la ley aplicable. Publicaremos
              cualquier cambio en esta misma página con su fecha de actualización.
            </p>
          </section>
        </div>
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
