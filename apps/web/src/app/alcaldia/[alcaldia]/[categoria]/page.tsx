import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@planazo/config";
import {
  getAllAlcaldias,
  getAlcaldiaBySlug,
  getAlcaldiaCategoryCounts,
  getPlansByAlcaldiaAndCategory,
  getCategories,
} from "@/lib/data";
import type { CategoryId } from "@/data/types";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { PlanListing } from "@/components/plan-listing";
import { Prose } from "@/components/prose";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ alcaldia: string; categoria: string }> };

export function generateStaticParams() {
  return getAllAlcaldias().flatMap((alcaldia) =>
    getAlcaldiaCategoryCounts(alcaldia.slug).map(({ category }) => ({
      alcaldia: alcaldia.slug,
      categoria: category,
    })),
  );
}

// Copy específico por combinación alcaldía+categoría — solo existen las que
// de verdad tienen suficiente contenido real (ver getAlcaldiaCategoryCounts).
const ALCALDIA_CATEGORY_SEO: Partial<
  Record<string, { heading: string; description: string; intro: string }>
> = {
  "cuauhtemoc|aire-libre": {
    heading: "Planes al aire libre en la alcaldía Cuauhtémoc",
    description:
      "Parques, tianguis y ciclismo urbano en la alcaldía Cuauhtémoc — planes al aire libre curados por gente que sale mucho.",
    intro:
      "El Parque México, con la elipse del antiguo hipódromo del Jockey Club todavía dibujada en sus calles, y la Alameda Central, el parque público más viejo de América desde 1592, son los dos pulmones verdes de la alcaldía. Los sábados, el Tianguis Cultural del Chopo llena de contracultura las calles cerca de Buenavista, y el último domingo de mes el Ciclotón cierra Reforma a los coches para recorrerla en bici, patines o a pie.\n\nLa Alameda no siempre fue un lugar de descanso: en su extremo poniente estuvo el quemadero de la Inquisición, donde el Santo Oficio ejecutaba sus sentencias más severas contra herejes y blasfemos. Apenas dos décadas después de instalado el tribunal, el virrey Luis de Velasco ordenó en 1592 convertir esa misma zona en jardín público, sobre un antiguo tianguis mexica — un giro de sitio de castigo a parque que hoy alberga el Hemiciclo a Juárez.",
  },
  "cuauhtemoc|bares": {
    heading: "Los mejores bares en la alcaldía Cuauhtémoc",
    description:
      "Cantinas centenarias, mezcalerías y el bar nombrado mejor del mundo — la coctelería de la alcaldía Cuauhtémoc, de la Roma al Centro Histórico.",
    intro:
      "De Handshake, nombrado el mejor bar del mundo por The World's 50 Best Bars en 2024, a La Ópera Bar, cantina desde 1895 con el balazo de Pancho Villa todavía marcado en el techo, la alcaldía Cuauhtémoc concentra la coctelería más premiada de la ciudad. Entre el Centro Histórico y la Roma también caben una terraza con vista al Zócalo, una mezcalería en penumbra y Zinco, el único club de jazz mexicano entre los 106 mejores del mundo según DownBeat.\n\nLa cantina más vieja de todas, El Nivel, estuvo abierta 151 años en la esquina de Moneda y Seminario, entre la Catedral y el Palacio Nacional: fue la primera en obtener un permiso oficial de venta de alcohol, en 1857, y por su barra pasaron desde Antonio López de Santa Anna y Benito Juárez hasta Luis Donaldo Colosio. Cerró en 2008 cuando la UNAM tomó posesión completa del edificio, que hoy es un museo universitario — el final de la cantina más antigua de la ciudad.",
  },
  "cuauhtemoc|cafes": {
    heading: "Dónde tomar café en la alcaldía Cuauhtémoc",
    description: "Cafeterías de especialidad en Roma, Condesa y Juárez para trabajar o desayunar sin prisa, en la alcaldía Cuauhtémoc.",
    intro:
      "Entre la Roma y la Condesa, la alcaldía Cuauhtémoc tiene la escena cafetalera más consolidada de la ciudad: cafés de especialidad con grano tostado en casa, wifi de verdad y mesas para quedarte toda la mañana. En la Juárez, Café Nin —el tercer proyecto de Elena Reygadas, con pan de Panadería Rosetta— suma una opción más de café literario para quedarte horas. Buena zona para alternar entre cafeterías serias y una cafebrería si el plan también incluye hojear libros con un café en la mano.\n\nEn el Centro, sobre Bucareli, sigue abierto el Café La Habana, que cumplió 70 años y donde Fidel Castro y el Che Guevara se sentaban a conversar tras conocerse en 1955, mucho antes de que Cuba entrara en revolución. Por sus mesas también pasaron Octavio Paz, Gabriel García Márquez y Elena Poniatowska, uno de los pocos cafés de la ciudad donde la historia literaria y la política latinoamericana se cruzaron literalmente en la misma taza.",
  },
  "cuauhtemoc|cine-tv": {
    heading: "Dónde ver una película en la alcaldía Cuauhtémoc",
    description:
      "Cine independiente en la Roma Sur y cine de barrio de 1962 sobre Reforma — dos formas de ver una película en la alcaldía Cuauhtémoc.",
    intro:
      "Cine Tonalá, en la Roma Sur, proyecta documentales y cine independiente entre butacas recuperadas de los años 80, con boleto en $90. Sobre Reforma, Cinépolis Diana ocupa el edificio del antiguo Cine Diana de 1962, con casi 1,850 butacas y un mural de Manuel Felguérez que hoy vive en el MUAC — buena opción de estrenos comerciales con historia de fondo.\n\nEsos cines de Reforma e Insurgentes nacieron en la misma década en que el cine mexicano vivía su época dorada, cuando salas de mil butacas o más se construían como catedrales del entretenimiento de fin de semana. Que el mural de Felguérez terminara en el MUAC en vez de perderse con la remodelación del Diana es la excepción: la mayoría de esas salas de los sesenta desapareció o se subdividió en multiplex sin dejar rastro de su decoración original.",
  },
  "cuauhtemoc|comer": {
    heading: "Dónde comer en la alcaldía Cuauhtémoc",
    description: "De la taquería de banqueta con estrella Michelin al italiano viral de porciones gigantes — dónde comer en la alcaldía Cuauhtémoc.",
    intro:
      "La alcaldía Cuauhtémoc reúne desde Los Cocuyos, taquería de banqueta con más de 50 años sirviendo tacos las 24 horas, hasta Máximo Bistrot y Contramar, dos referentes de la Roma con estrella Michelin y reconocimiento internacional. Mercado Roma y Mercado El 100 cubren el plan de mercado gastronómico o de productores locales, Azul Histórico sirve cocina mexicana tradicional en un palacio colonial del Centro, y Bartola se volvió viral por sus porciones para compartir —hasta Tyler, The Creator pasó por ahí en 2026.\n\nContramar abrió en 1998 cuando la chef Gabriela Cámara adaptó un antiguo local de refacciones para refrigeradores y lo convirtió en una palapa de playa dentro de la Roma, con esqueletos de pescado pintados en la pared. De ahí salió su plato insignia, la tostada de atún con mayonesa de chipotle y chile pasilla, que desde entonces se volvió un estándar que otros restaurantes de la ciudad citan o imitan. Azul Histórico, por su parte, ocupa el Palacio de los Condes de Miravalle, mansión del siglo XVII que Alonso Dávalos Bracamontes mandó construir tras recibir el título de conde en 1690 — de las casonas coloniales más viejas que sobreviven en el Centro.",
  },
  "cuauhtemoc|cultura": {
    heading: "Museos y cultura en la alcaldía Cuauhtémoc",
    description: "Del Templo Mayor a la biblioteca más grande de México: los museos y espacios culturales de la alcaldía Cuauhtémoc.",
    intro:
      "El Palacio de Bellas Artes, con el telón de cristal de los talleres Tiffany y murales de Rivera, Orozco y Siqueiros, es la visita obligada. A un lado, el Museo del Templo Mayor exhibe lo que se descubrió por accidente en 1978 al topar con el monolito de Coyolxauhqui, y el Museo Nacional de Arte reúne siglos de pintura mexicana en un edificio porfiriano de Tacuba. El Museo del Estanquillo, con la colección de Carlos Monsiváis, tiene entrada libre los domingos, como los otros dos. Y en Buenavista, la Biblioteca Vasconcelos —la más grande del país, con estanterías que parecen flotar— es gratis todos los días.\n\nBellas Artes tardó 30 años en construirse: el arquitecto italiano Adamo Boari la empezó en 1904 con mármol de Carrara pese a las advertencias de que el subsuelo no aguantaría el peso, la Revolución interrumpió la obra y Boari salió del país en 1916 sin verla terminada. Se inauguró hasta 1934, y desde entonces el edificio se ha hundido cerca de tres metros respecto al nivel original de la calle — el mismo fenómeno que se nota en todo el Centro Histórico, pero aquí con mármol italiano hundiéndose de por medio.",
  },
  "cuauhtemoc|eventos": {
    heading: "Eventos y tradiciones en la alcaldía Cuauhtémoc",
    description: "Lucha libre en la Arena México, danzón en el Salón Los Ángeles y el mercado dominical de antigüedades de La Lagunilla.",
    intro:
      "La Arena México, la \"Catedral de la Lucha Libre\", opera el CMLL desde 1933 con su función insignia cada viernes. El Salón Los Ángeles, en la colonia Guerrero, abrió en 1937 y nunca ha cerrado sus puertas — por su pista pasaron Pérez Prado y la Sonora Santanera. Y cada domingo, el Mercado de Antigüedades de La Lagunilla llena de vinilos, cámaras análogas y objetos de otras décadas un terreno que ya era zona de comercio antes de la Conquista.\n\nDesde 1948 el propio Salón Los Ángeles adoptó como lema 'quien no conoce Los Ángeles no conoce México', una frase que con las décadas se volvió casi cierta: en 1998 ahí se reunieron José Saramago, Carlos Fuentes, Gabriel García Márquez y Carlos Monsiváis para celebrar los setenta años de Fuentes, y la actriz María Rojo ensayó en su pista los pasos de danzón para la película 'Danzón', filmada buena parte ahí mismo.",
  },
  "cuauhtemoc|gaming": {
    heading: "Dónde jugar juegos de mesa en la alcaldía Cuauhtémoc",
    description: "Dos cafés de juegos de mesa, en la Roma Norte y frente al Parque México, para pasar la tarde con amigos.",
    intro:
      "Tláloc, en la Roma Norte, maneja un catálogo de más de 300 juegos de mesa con consumo mínimo y sin reloj sobre tu cabeza. El Ocho, frente al Parque México en la Condesa, suma más de 120 juegos de su librero además de un menú pet friendly — dos opciones cercanas para una tarde de tablero entre amigos.\n\nEntre esos cientos de cajas casi siempre hay un mazo de Lotería, el juego más viejo de la mesa mexicana: llegó de España en el siglo XVIII como pasatiempo exclusivo de las clases altas coloniales, pero se popularizó durante la Guerra de Independencia, cuando los soldados lo adoptaron como entretenimiento de campamento y lo llevaron con ellos de regreso a sus pueblos al terminar la guerra. Los 54 versos que se cantan para anunciar cada carta son, en el fondo, tan antiguos como el propio México independiente.",
  },
  "cuauhtemoc|geek": {
    heading: "Tiendas geek en la alcaldía Cuauhtémoc",
    description: "Cómic europeo en la Roma, figuras de colección en Condesa y tres pisos de cultura geek en el Centro.",
    intro:
      "Global Cómics, en la Roma Norte, es de las pocas tiendas de la ciudad enfocadas en cómic europeo y manga. The Limited Company, en Condesa, surte figuras de Hot Toys, Funko y Bandai. Y Frikiplaza, un edificio de tres pisos sobre Eje Central con más de 250 locales, es la apuesta si buscas algo de una franquicia rara — los fines de semana recibe hasta 5 mil visitantes.\n\nAntes de que existieran estas tiendas, la cultura geek mexicana ya tenía sus propios íconos de papel: Kalimán, nacido como radionovela en 1963 y publicado en historieta de 1965 a 1991, fue el primer superhéroe genuinamente mexicano, mientras que Memín Pinguín, creado en 1943 por Yolanda Vargas Dulché con personajes de su propia infancia en la colonia Guerrero, se volvió una de las historietas más vendidas del país. Esa tradición de cómic nacional es la que, generaciones después, alimenta las cajas de colección que hoy se buscan en Frikiplaza.",
  },
  "cuauhtemoc|mascotas": {
    heading: "Planes pet friendly en la alcaldía Cuauhtémoc",
    description: "Dos cafés en Condesa y un parque canino gratuito en la Roma Norte, en la alcaldía Cuauhtémoc.",
    intro:
      "Enhorabuena Café tiene patio y jardín donde tu perro anda suelto sin correa mientras tú desayunas. Latte Pelitos recibe con camita y galleta de cortesía apenas llegas, y hasta tiene carta pensada para mascotas — los dos están en Condesa, a unas calles uno del otro. En la Roma Norte, el Jardín Pushkin tiene una explanada canina abierta las 24 horas para hasta 35 perros, con clínica veterinaria gratuita entre semana.\n\nSi el plan sigue después del café o el parque, la Ley de Movilidad de la CDMX de 2019 permite viajar con tu perro en Metro y Metrobús, siempre que vaya en una jaula o mochila transportadora completamente cerrada, sin cabeza ni extremidades de fuera; solo los perros guía y de asistencia certificados pueden ir sin transportador. Es una de las reglas que explica por qué en Cuauhtémoc es tan común ver a alguien bajarse del transporte público con una mochila que de pronto asoma un hocico.",
  },
  "cuauhtemoc|tecnologia": {
    heading: "Planes de tecnología en la alcaldía Cuauhtémoc",
    description: "Arte digital gratuito sobre Reforma, un makerspace en el Centro y el mercado de tecnología de toda la vida.",
    intro:
      "El Centro de Cultura Digital, bajo la Estela de Luz, ofrece exposiciones, cine y talleres de arte digital completamente gratis. Hacedores Makerspace, detrás de la Catedral, fue el primer taller colaborativo de fabricación digital del Centro Histórico, con impresoras 3D y cortadora láser. Y la Plaza de la Tecnología lleva desde los años 80 vendiendo y reparando celulares y componentes sobre Eje Central.\n\nLa Estela de Luz bajo la que está el Centro de Cultura Digital tiene su propia historia accidentada: se planeó para inaugurarse el 15 de septiembre de 2010, en el Bicentenario de la Independencia, pero se retrasó 15 meses y su presupuesto pasó de 393 millones de pesos a más de mil millones, lo que le ganó el apodo de 'monumento a la corrupción'. Es, de cierta forma, un recordatorio de que hasta la tecnología y el arte digital gratuitos de la ciudad conviven con la historia más incómoda de sus propios edificios.",
  },
  "miguel-hidalgo|comer": {
    heading: "Dónde comer en la alcaldía Miguel Hidalgo",
    description: "De Pujol y Quintonil con estrella Michelin a un bistró junto al lago de Chapultepec — dónde comer en Polanco y el bosque.",
    intro:
      "Polanco concentra parte de la alta cocina más reconocida de la ciudad: Pujol y Quintonil, ambos con estrella Michelin, están a unas calles de distancia entre sí, y ameritan reservar con tiempo. Si el plan es más de bolsillo, El Turix lleva desde los años ochenta sirviendo cochinita pibil sobre Emilio Castelar por menos de 150 pesos. Y dentro del Bosque de Chapultepec hay dos opciones distintas: el Bistró Chapultepec, con mesas junto al Lago Mayor y buffet dominical, y la Sala Gastronómica, la terraza semi-subterránea del Museo Nacional de Antropología con cocina organizada por regiones del país.\n\nEl platillo más citado de Pujol, el mole madre, nació de un experimento con el tiempo: en marzo de 2013, para el primer aniversario de Quintonil, el chef Enrique Olvera preparó un mole de más de cien ingredientes y, en vez de terminarlo, empezó a añadirle mole nuevo cada semana sin dejar que se agotara del todo. Más de una década después, esa olla original sigue viva y evolucionando con cada temporada, lo que la volvió un símbolo de que en Pujol ningún platillo llega realmente terminado.",
  },
  "miguel-hidalgo|cultura": {
    heading: "Museos en la alcaldía Miguel Hidalgo",
    description: "El Museo Nacional de Antropología, el Tamayo, el de Arte Moderno y Papalote, los cuatro dentro o junto al Bosque de Chapultepec.",
    intro:
      "El Museo Nacional de Antropología, el Museo Tamayo, el Museo de Arte Moderno y Papalote Museo del Niño están todos dentro o a un lado del Bosque de Chapultepec, así que se prestan para combinar visitas en un mismo día. El de Arte Moderno, en un edificio circular de Pedro Ramírez Vázquez, y el Tamayo tienen entrada libre los domingos, y Papalote sigue siendo la apuesta más segura para niños de 2 a 12 años, con áreas pensadas para que toquen y experimenten.\n\nEl propio Ramírez Vázquez también diseñó el Museo Nacional de Antropología, construido en apenas 19 meses entre 1963 y 1964, con 'El Paraguas', una fuente-techo de 17 metros de altura y 82 de largo que se volvió su sello arquitectónico. La pieza más importante de la colección, la Piedra del Sol o Calendario Azteca, se trasladó ahí el 27 de junio de 1964 sobre una plataforma de siete metros con 16 ruedas, bajo la supervisión del propio Ramírez Vázquez — desde entonces ocupa el lugar central de la Sala Mexica.",
  },
  "miguel-hidalgo|cafes": {
    heading: "Dónde tomar café en la alcaldía Miguel Hidalgo",
    description: "Cafés en Polanco y dentro del Bosque de Chapultepec, de $50 a $280 por persona.",
    intro:
      "Touló, sobre Emilio Castelar en Polanco, es café-patisserie de inspiración parisina junto al Parque Lincoln. Dentro del bosque, Chiquitito Café y México Arte & Sabor —este último en Casa del Lago, el centro cultural de la UNAM— ofrecen opciones para hacer una pausa entre museo y museo, con el segundo entre los tickets más accesibles del parque, desde $50 por persona.\n\nEsa Casa del Lago no nació como espacio cultural: Porfirio Díaz ordenó construirla en 1906 como sede del Automóvil Club, y se inauguró en 1908 junto al Lago Mayor con un estilo afrancesado típico del régimen. Tras la Revolución, Francisco I. Madero la declaró propiedad nacional, pasó a ser parte del Instituto de Biología de la UNAM en 1931, y no fue hasta 1959 que se convirtió en el primer centro cultural de la universidad fuera de Ciudad Universitaria — un porfiriano club de autos convertido, medio siglo después, en punto de café y arte dentro del bosque.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { alcaldia: alcaldiaSlug, categoria } = await params;
  const alcaldia = getAlcaldiaBySlug(alcaldiaSlug);
  if (!alcaldia) return {};

  const seo = ALCALDIA_CATEGORY_SEO[`${alcaldiaSlug}|${categoria}`];
  if (!seo) return {};

  return {
    title: seo.heading,
    description: seo.description,
    alternates: { canonical: `/alcaldia/${alcaldiaSlug}/${categoria}` },
  };
}

export default async function AlcaldiaCategoryPage({ params }: Props) {
  const { alcaldia: alcaldiaSlug, categoria } = await params;
  const alcaldia = getAlcaldiaBySlug(alcaldiaSlug);
  const seo = ALCALDIA_CATEGORY_SEO[`${alcaldiaSlug}|${categoria}`];
  if (!alcaldia || !seo) notFound();

  const categories = getCategories();
  const category = categories.find((c) => c.id === categoria);
  if (!category) notFound();

  const plans = getPlansByAlcaldiaAndCategory(alcaldia.slug, categoria as CategoryId);
  if (plans.length === 0) notFound();

  const categoryIcon = new Map([[category.id, { icon: category.icon, label: category.label }]]);
  const sortIds = plans.some((p) => p.kind === "evento")
    ? (["fecha", "precio", "rating"] as const)
    : (["precio", "rating"] as const);

  const pageUrl = `${siteConfig.url}/alcaldia/${alcaldia.slug}/${categoria}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: siteConfig.url },
    { name: alcaldia.label, url: `${siteConfig.url}/alcaldia/${alcaldia.slug}` },
    { name: category.label, url: pageUrl },
  ]);
  const itemListJsonLd = buildItemListJsonLd(plans);

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
        <Link href={`/alcaldia/${alcaldia.slug}`} className="text-ink-soft hover:text-brand">
          {alcaldia.label}
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink">{category.label}</span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-8 md:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep uppercase">
          {category.icon} {alcaldia.label}
        </span>
        <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-extrabold tracking-tight">
          {seo.heading}
        </h1>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-soft">
          {plans.length} {plans.length === 1 ? "lugar" : "lugares"}, curados por gente que sale mucho.
        </p>
        <Prose text={seo.intro} className="mt-3 max-w-[75ch] text-[15px] leading-relaxed text-ink-soft" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 md:px-10">
        <PlanListing plans={plans} categoryIcon={categoryIcon} sortIds={[...sortIds]} />
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
