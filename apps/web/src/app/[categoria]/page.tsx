import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@planazo/config";
import { getCategories, getPlacesByCategory } from "@/lib/data";
import type { CategoryId } from "@/data/types";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanListing } from "@/components/plan-listing";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ categoria: string }> };

// "eventos" is its own dedicated route (/eventos) with a different card shape —
// this route only ever serves the place categories.
const PLACE_CATEGORIES: CategoryId[] = [
  "comer",
  "cafes",
  "bares",
  "cultura",
  "aire-libre",
  "tecnologia",
  "gaming",
  "viajes",
  "cine-tv",
  "geek",
  "mascotas",
  "musica",
];

export function generateStaticParams() {
  return PLACE_CATEGORIES.map((categoria) => ({ categoria }));
}

function findCategory(categoria: string) {
  if (!PLACE_CATEGORIES.includes(categoria as CategoryId)) return undefined;
  return getCategories().find((c) => c.id === categoria);
}

// Copy tuned to match how people actually search ("dónde comer en cdmx",
// "dónde ir de copas") instead of just echoing the category label. `intro`
// is real body copy (not just a meta description) — category pages need
// unique, substantive text or they read as thin, templated listings.
const CATEGORY_SEO: Partial<
  Record<CategoryId, { heading: string; description: string; intro: string }>
> = {
  comer: {
    heading: "Dónde comer en CDMX",
    description: "Dónde comer en CDMX — restaurantes, antojitos y taquerías curados por gente que sale mucho.",
    intro:
      "De las taquerías de banqueta que llevan generaciones sirviendo la misma receta a las mesas con estrella Michelin: en CDMX se puede comer distinto en cada colonia. Este directorio reúne restaurantes reales, visitados y descritos por gente de la ciudad — no reseñas genéricas ni listas compradas. Filtra por zona y precio para encontrar desde un antojito rápido hasta una cena para celebrar.",
  },
  cafes: {
    heading: "Dónde tomar café en CDMX",
    description: "Dónde tomar café en CDMX — cafeterías de especialidad y clásicas, curadas por gente que sale mucho.",
    intro:
      "Cafés de especialidad con grano tostado en casa, cafeterías clásicas para desayunar sin prisa y espacios donde sí puedes quedarte a trabajar toda la mañana. La escena cafetalera de CDMX crece cada año, sobre todo en Roma, Condesa y Coyoacán. Filtra por zona y precio para encontrar el que se ajuste al plan.",
  },
  bares: {
    heading: "Dónde ir de copas en CDMX",
    description: "Dónde ir de copas en CDMX — bares, rooftops y cantinas curados por gente que sale mucho.",
    intro:
      "De rooftops con vista a la ciudad a cantinas de barrio con más de medio siglo de historia, pasando por un bar que llegó a ser considerado el mejor del mundo: la coctelería de CDMX está entre las más reconocidas de América Latina. Filtra por zona y presupuesto, desde una cerveza barata hasta una coctelería de autor.",
  },
  cultura: {
    heading: "Qué hacer en CDMX: cultura y museos",
    description: "Qué hacer en CDMX si buscas planes de cultura — museos, exposiciones y centros culturales.",
    intro:
      "Museos de clase mundial, centros culturales independientes y casas convertidas en museo que cuentan la historia de la ciudad desde otro ángulo. CDMX tiene una de las ofertas culturales más grandes de América Latina, con entrada libre en varios museos los domingos. Filtra por zona para planear una visita sin perder medio día en traslados.",
  },
  "aire-libre": {
    heading: "Planes al aire libre en CDMX",
    description: "Qué hacer al aire libre en CDMX — parques, jardines y planes fuera de techo.",
    intro:
      "Parques, jardines y canales para salir de la rutina sin salir de la ciudad. Del Bosque de Chapultepec a los canales de Xochimilco, CDMX tiene más verde del que parece cuando estás atorado en el tráfico. Filtra por zona según busques algo tranquilo o un plan más activo.",
  },
  tecnologia: {
    heading: "Planes de tecnología en CDMX",
    description: "Museos de ciencia, makerspaces y espacios gamer en CDMX, curados por gente que sale mucho.",
    intro:
      "Museos de ciencia y tecnología, makerspaces para construir algo con tus manos y hasta un local que mezcla tacos con retrogaming. Es una categoría chica pero con opciones reales para pasar una tarde distinta, del Centro de Cultura Digital al Universum de la UNAM.",
  },
  gaming: {
    heading: "Dónde jugar videojuegos en CDMX",
    description: "Cafés y centros gamer en CDMX para jugar en consola o PC con otras personas.",
    intro:
      "Cafés y centros gamer para jugar en consola o PC acompañado, no solo desde tu cuarto. De Condesa a Del Valle, estos son los espacios reales para una tarde de videojuegos en la ciudad.",
  },
  viajes: {
    heading: "Escapadas cerca de CDMX",
    description: "Pueblos mágicos y zonas arqueológicas a menos de tres horas de CDMX, para una escapada de un día.",
    intro:
      "Cuando la ciudad se siente chica, estas son las escapadas de un día que no necesitan mucha planeación: una zona arqueológica y dos Pueblos Mágicos, todos a menos de tres horas de CDMX.",
  },
  "cine-tv": {
    heading: "Dónde ver una película en CDMX",
    description: "Salas de cine, autocinema y cine de autor en CDMX, curados por gente que sale mucho.",
    intro:
      "Salas de cine y autocinema para ver algo en pantalla grande, del circuito comercial al cine de autor. Encuentra la función según la zona y el tipo de experiencia que buscas.",
  },
  geek: {
    heading: "Tiendas geek en CDMX",
    description: "Cómics, coleccionables y cultura friki en CDMX, curados por gente que sale mucho.",
    intro:
      "Tiendas de cómics, coleccionables y cultura friki repartidas por la ciudad — para surtir tu colección o encontrar ese número que llevas meses buscando.",
  },
  mascotas: {
    heading: "Planes pet friendly en CDMX",
    description: "Cafés y parques pet friendly en CDMX, curados por gente que sale mucho.",
    intro:
      "Cafés y parques donde tu perro entra tan a gusto como tú. De Condesa a Polanco, estos son los lugares reales pet friendly de la ciudad.",
  },
  musica: {
    heading: "Dónde ver un concierto en CDMX",
    description: "Foros y recintos para música en vivo en CDMX, curados por gente que sale mucho.",
    intro:
      "Foros y recintos para ver un concierto en vivo, del foro independiente al recinto para miles de personas. Encuentra dónde tocan esta semana según la zona.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const category = findCategory(categoria);
  if (!category) return {};

  const seo = CATEGORY_SEO[category.id];
  return {
    title: seo?.heading ?? `${category.label} en CDMX`,
    description: seo?.description ?? `${category.label} en CDMX — el directorio completo, curado por gente que sale mucho.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params;
  const category = findCategory(categoria);
  if (!category) notFound();

  const places = await getPlacesByCategory(category.id);
  const categories = getCategories();
  const categoryIcon = new Map([[category.id, { icon: category.icon, label: category.label }]]);
  const seo = CATEGORY_SEO[category.id];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: siteConfig.url },
    { name: category.label, url: `${siteConfig.url}/${category.id}` },
  ]);
  const itemListJsonLd = buildItemListJsonLd(places);

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
        <span className="font-semibold text-ink">{category.label}</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          {category.icon} Directorio
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          {seo?.heading ?? `${category.label} en CDMX`}
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          El directorio completo, curado por gente que sale mucho — {places.length}{" "}
          {places.length === 1 ? "lugar" : "lugares"}.
        </p>
        {seo?.intro && (
          <p className="mt-3 max-w-[75ch] text-[15px] leading-relaxed text-ink-soft">
            {seo.intro}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        {places.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-ink-soft">
            Todavía no hay lugares publicados en esta categoría.
          </p>
        ) : (
          <PlanListing plans={places} categoryIcon={categoryIcon} sortIds={["precio", "rating"]} />
        )}
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
