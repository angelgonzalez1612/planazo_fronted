import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@planazo/config";
import { getCategories, getPlaceCategories, getPlacesByCategory } from "@/lib/data";
import type { CategoryId } from "@/data/types";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanListing } from "@/components/plan-listing";
import { Prose } from "@/components/prose";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ categoria: string }> };

export function generateStaticParams() {
  return getPlaceCategories().map((categoria) => ({ categoria }));
}

function findCategory(categoria: string) {
  if (!getPlaceCategories().includes(categoria as CategoryId)) return undefined;
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
      "De las taquerías de banqueta que llevan generaciones sirviendo la misma receta a las mesas con estrella Michelin: en CDMX se puede comer distinto en cada colonia. Este directorio reúne restaurantes reales, visitados y descritos por gente de la ciudad — no reseñas genéricas ni listas compradas. Filtra por zona y precio para encontrar desde un antojito rápido hasta una cena para celebrar.\n\nLa Guía Michelin llegó a México apenas en mayo de 2024, ciento veinticinco años después de su creación en Francia, y repartió sus primeras 18 estrellas en una ceremonia en el auditorio El Cantoral de la ciudad. Pujol y Quintonil, ambos en CDMX, se llevaron las dos primeras estrellas dobles del país, y hasta una taquería entró a la selección: una señal de que aquí lo mismo se premia la alta cocina que el buen taco de esquina.",
  },
  cafes: {
    heading: "Dónde tomar café en CDMX",
    description: "Dónde tomar café en CDMX — cafeterías de especialidad y clásicas, curadas por gente que sale mucho.",
    intro:
      "Cafés de especialidad con grano tostado en casa, cafeterías clásicas para desayunar sin prisa y espacios donde sí puedes quedarte a trabajar toda la mañana. La escena cafetalera de CDMX crece cada año, sobre todo en Roma, Condesa y Coyoacán. Filtra por zona y precio para encontrar el que se ajuste al plan.\n\nEl grano que se tuesta en estas cafeterías casi siempre viene de tres estados: Chiapas aporta 41% de la producción nacional, Veracruz 24% y Puebla 15%, cada uno con un perfil distinto —de las notas a nuez y caramelo de Tapachula al toque floral y frutal de Pluma Hidalgo, Oaxaca—. México es el noveno productor mundial de café y el primero en café orgánico, así que buena parte de lo que se sirve en la ciudad ni siquiera necesitó cruzar una frontera.",
  },
  bares: {
    heading: "Dónde ir de copas en CDMX",
    description: "Dónde ir de copas en CDMX — bares, rooftops y cantinas curados por gente que sale mucho.",
    intro:
      "De rooftops con vista a la ciudad a cantinas de barrio con más de medio siglo de historia, pasando por un bar que llegó a ser considerado el mejor del mundo: la coctelería de CDMX está entre las más reconocidas de América Latina. Filtra por zona y presupuesto, desde una cerveza barata hasta una coctelería de autor.\n\nEse bar es el Handshake Speakeasy, escondido tras una puerta secreta en la colonia Juárez, que en 2024 se convirtió en el primer bar mexicano —y el primero fuera de Estados Unidos o Europa— en encabezar la lista The World's 50 Best Bars. Ahí manda la mixología molecular del bartender Eric van Beek, en un espacio de mármol negro y acabados dorados que evoca los speakeasies de los años veinte.",
  },
  cultura: {
    heading: "Qué hacer en CDMX: cultura y museos",
    description: "Qué hacer en CDMX si buscas planes de cultura — museos, exposiciones y centros culturales.",
    intro:
      "Museos de clase mundial, centros culturales independientes y casas convertidas en museo que cuentan la historia de la ciudad desde otro ángulo. CDMX tiene una de las ofertas culturales más grandes de América Latina, con entrada libre en varios museos los domingos. Filtra por zona para planear una visita sin perder medio día en traslados.\n\nCon entre 170 y 190 museos según la fuente que se consulte, la Ciudad de México es la segunda ciudad con más museos del mundo, solo detrás de Londres y por delante de París. Esa cifra no cuenta las galerías independientes ni los centros culturales sin registro oficial, así que la oferta real de planes culturales en la ciudad es todavía más grande de lo que sugiere cualquier lista.",
  },
  "aire-libre": {
    heading: "Planes al aire libre en CDMX",
    description: "Qué hacer al aire libre en CDMX — parques, jardines y planes fuera de techo.",
    intro:
      "Parques, jardines y canales para salir de la rutina sin salir de la ciudad. Del Bosque de Chapultepec a los canales de Xochimilco, CDMX tiene más verde del que parece cuando estás atorado en el tráfico. Filtra por zona según busques algo tranquilo o un plan más activo.\n\nUno de los rincones más singulares es la Reserva Ecológica del Pedregal de San Ángel, dentro de Ciudad Universitaria: 237 hectáreas de lava volcánica que dejó la erupción del Xitle hace casi 1,700 años, donde después creció un ecosistema único —el 'matorral de palo loco'— con cerca de 300 especies de plantas nativas. Se decretó zona protegida en 1983, tras la movilización de un comité de estudiantes de la UNAM que impidió que se siguiera construyendo encima.",
  },
  tecnologia: {
    heading: "Planes de tecnología en CDMX",
    description: "Museos de ciencia, makerspaces y espacios gamer en CDMX, curados por gente que sale mucho.",
    intro:
      "Museos de ciencia y tecnología, makerspaces para construir algo con tus manos y hasta un local que mezcla tacos con retrogaming. Es una categoría chica pero con opciones reales para pasar una tarde distinta, del Centro de Cultura Digital al Universum de la UNAM.\n\nEse Universum abrió el 12 de diciembre de 1992 en Ciudad Universitaria, con 550 módulos interactivos de física, astronomía, matemáticas, biología y ecología: fue el primer museo de ciencias del país y cerró con broche de oro el rectorado de José Sarukhán. La idea nació a mediados de los ochenta entre investigadores como Jorge Flores Valdés y Luis Estrada, pionero de la divulgación científica en México, y hoy sigue siendo el punto de partida obligado si buscas ciencia hecha para tocar y experimentar, no solo para leer en una vitrina.",
  },
  gaming: {
    heading: "Dónde jugar videojuegos en CDMX",
    description: "Cafés y centros gamer en CDMX para jugar en consola o PC con otras personas.",
    intro:
      "Cafés y centros gamer para jugar en consola o PC acompañado, no solo desde tu cuarto. De Condesa a Del Valle, estos son los espacios reales para una tarde de videojuegos en la ciudad.\n\nLa escena competitiva también ha tenido su casa en la ciudad: la Liga Mexicana de Videojuegos ha celebrado finales presenciales de Halo 5 y League of Legends en el Frontón México, el histórico recinto de la colonia Tabacalera reconvertido en centro de espectáculos. Es una muestra de que el gaming en CDMX no se queda solo en la pantalla de casa, sino que también llena foros pensados originalmente para otra cosa.",
  },
  viajes: {
    heading: "Escapadas cerca de CDMX",
    description: "Pueblos mágicos y zonas arqueológicas a menos de tres horas de CDMX, para una escapada de un día.",
    intro:
      "Cuando la ciudad se siente chica, estas son las escapadas de un día que no necesitan mucha planeación: una zona arqueológica y dos Pueblos Mágicos, todos a menos de tres horas de CDMX.\n\nTeotihuacan, la zona arqueológica más visitada del país, se abrió al público el 13 de septiembre de 1910 y en su momento de mayor esplendor llegó a albergar más de 100,000 habitantes, una de las ciudades más grandes del mundo antiguo en su época. El nombre no es propio: se lo pusieron los mexicas seis siglos después de que la ciudad fuera abandonada, cuando ya la encontraron en ruinas y la interpretaron como 'el lugar donde fueron creados los dioses'.",
  },
  "cine-tv": {
    heading: "Dónde ver una película en CDMX",
    description: "Salas de cine, autocinema y cine de autor en CDMX, curados por gente que sale mucho.",
    intro:
      "Salas de cine y autocinema para ver algo en pantalla grande, del circuito comercial al cine de autor. Encuentra la función según la zona y el tipo de experiencia que buscas.\n\nLa Cineteca Nacional que existe hoy no es la original: el 24 de marzo de 1982 un incendio de 16 horas destruyó el edificio de Tlalpan y Churubusco, y con él el 99% del archivo fílmico nacional y extranjero que resguardaba, más de 6,500 películas entre ellas negativos de Manuel Álvarez Bravo y dibujos de Diego Rivera. Las nuevas instalaciones, en la Plaza de los Compositores, abrieron apenas dos años después, el 27 de enero de 1984, y desde entonces la institución ha tenido que reconstruir buena parte de su acervo desde cero.",
  },
  geek: {
    heading: "Tiendas geek en CDMX",
    description: "Cómics, coleccionables y cultura friki en CDMX, curados por gente que sale mucho.",
    intro:
      "Tiendas de cómics, coleccionables y cultura friki repartidas por la ciudad — para surtir tu colección o encontrar ese número que llevas meses buscando.\n\nEsa cultura friki tuvo su gran cita en mayo de 2024, cuando la Comic Con Experience llegó por primera vez a México, en el Centro Citibanamex, con una expectativa de 90,000 visitantes. La marca, nacida en São Paulo en 2014, eligió la ciudad como su siguiente gran plaza en América Latina después de Brasil, señal de que la base de coleccionistas y fans de cómics de CDMX ya pesaba lo suficiente para justificar el salto.",
  },
  mascotas: {
    heading: "Planes pet friendly en CDMX",
    description: "Cafés y parques pet friendly en CDMX, curados por gente que sale mucho.",
    intro:
      "Cafés y parques donde tu perro entra tan a gusto como tú. De Condesa a Polanco, estos son los lugares reales pet friendly de la ciudad.\n\nNo es casualidad que la ciudad esté llena de negocios que reciben perros: 61.4% de los hogares de la Ciudad de México tiene una mascota, según cifras oficiales, un porcentaje altísimo aunque todavía por debajo del promedio nacional de 69.8%. Con esa cantidad de familias viviendo con un animal en casa, cada vez son más los cafés y parques que dejaron de ver al perro como una excepción y lo incorporaron como parte normal del plan.",
  },
  musica: {
    heading: "Dónde ver un concierto en CDMX",
    description: "Foros y recintos para música en vivo en CDMX, curados por gente que sale mucho.",
    intro:
      "Foros y recintos para ver un concierto en vivo, del foro independiente al recinto para miles de personas. Encuentra dónde tocan esta semana según la zona.\n\nEl Auditorio Nacional, con capacidad para 9,564 butacas, no nació como recinto de conciertos: el presidente Miguel Alemán lo encargó en 1948 como espacio para hipismo, inspirado en la victoria ecuestre mexicana en los Juegos Olímpicos de Londres. Abrió sin terminar en 1952 y se reinauguró en 1955 ya como recinto multifuncional; en 2007 el Billboard Touring Award lo nombró el mejor teatro del mundo para foros de hasta 10,000 butacas, un reconocimiento que sigue defendiendo cada vez que se llena en Reforma.",
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
    alternates: { canonical: `/${categoria}` },
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
          <Prose text={seo.intro} className="mt-3 max-w-[75ch] text-[15px] leading-relaxed text-ink-soft" />
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
