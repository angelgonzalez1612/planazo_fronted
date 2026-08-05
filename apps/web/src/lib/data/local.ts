import { slugify } from "@planazo/shared";
import { getPlaces as apiGetPlaces, getPlaceBySlug as apiGetPlaceBySlug } from "@/lib/api";
import { adaptPlace, adaptPlaceDetail } from "./adapt-place";
import placesData from "@/data/places.json";
import eventsData from "@/data/events.json";
import categoriesData from "@/data/categories.json";
import directoryData from "@/data/directory.json";
import citiesData from "@/data/cities.json";
import guidesData from "@/data/guides.json";
import moodsData from "@/data/moods.json";
import siteData from "@/data/site.json";
import type {
  Place,
  EventItem,
  Plan,
  Category,
  CategoryId,
  DirectoryTile,
  City,
  Guide,
  Mood,
  SiteContent,
} from "@/data/types";

const places = placesData as Place[];
const events = eventsData as EventItem[];

const plansBySlug = new Map<string, Plan>([
  ...places.map((p): [string, Plan] => [p.slug, p]),
  ...events.map((e): [string, Plan] => [e.slug, e]),
]);

export function getSiteContent(): SiteContent {
  return siteData as SiteContent;
}

export function getCategories(): Category[] {
  return categoriesData as Category[];
}

/** All categories except "eventos", which has its own dedicated /eventos route. */
export function getPlaceCategories(): CategoryId[] {
  return getCategories()
    .map((c) => c.id)
    .filter((id) => id !== "eventos");
}

/** Where "see everything in this category" leads — /eventos for events, /[categoria] otherwise. */
export function categoryHref(id: CategoryId): string {
  return id === "eventos" ? "/eventos" : `/${id}`;
}

/**
 * Connected to planazo_backend — real published places for this category.
 * Falls back to the local fixture while the backend isn't deployed yet;
 * once it is, this starts returning real data with no code change.
 */
export async function getPlacesByCategory(id: CategoryId): Promise<Place[]> {
  const remote = await apiGetPlaces().catch(() => null);
  if (!remote) return places.filter((p) => p.category === id);
  return remote.filter((p) => p.categories.some((c) => c.slug === id)).map(adaptPlace);
}

export function getDirectoryTiles(): DirectoryTile[] {
  return directoryData as DirectoryTile[];
}

export function getCities(): City[] {
  return citiesData as City[];
}

export function getGuides(): Guide[] {
  return guidesData as Guide[];
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getGuides().find((g) => g.slug === slug);
}

/** Guides can curate places or events, by slug — look up both, not just places.json. */
export function getPlansForGuide(guide: Guide): Plan[] {
  return guide.placeSlugs
    .map((slug) => plansBySlug.get(slug))
    .filter((p): p is Plan => Boolean(p));
}

/** Reverse lookup for a place's detail page — which collections it's curated into. */
export function getGuidesForPlace(slug: string): Guide[] {
  return getGuides().filter((g) => g.placeSlugs.includes(slug));
}

/**
 * Connected to planazo_backend — every published place.
 * Falls back to the local fixture while the backend isn't deployed yet.
 */
export async function getPlaces(): Promise<Place[]> {
  const remote = await apiGetPlaces().catch(() => null);
  return remote ? remote.map(adaptPlace) : places;
}

export function getEvents(): EventItem[] {
  return events;
}

export function getPlans(): Plan[] {
  return [...places, ...events];
}

export interface TagInfo {
  label: string;
  slug: string;
  count: number;
}

export function getAllTags(): TagInfo[] {
  const counts = new Map<string, TagInfo>();
  for (const plan of getPlans()) {
    for (const tag of plan.tags ?? []) {
      const slug = slugify(tag);
      const existing = counts.get(slug);
      if (existing) existing.count += 1;
      else counts.set(slug, { label: tag, slug, count: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

export function getTagBySlug(tagSlug: string): TagInfo | undefined {
  return getAllTags().find((t) => t.slug === tagSlug);
}

export function getPlansByTag(tagSlug: string): Plan[] {
  return getPlans().filter((plan) => (plan.tags ?? []).some((tag) => slugify(tag) === tagSlug));
}

export interface ZoneInfo {
  label: string;
  slug: string;
  count: number;
}

/** Colonias/zonas reales de los lugares y eventos — base de las páginas /zona/[zone]. */
export function getAllZones(): ZoneInfo[] {
  const counts = new Map<string, ZoneInfo>();
  for (const plan of getPlans()) {
    const slug = slugify(plan.zone);
    const existing = counts.get(slug);
    if (existing) existing.count += 1;
    else counts.set(slug, { label: plan.zone, slug, count: 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

export function getZoneBySlug(zoneSlug: string): ZoneInfo | undefined {
  return getAllZones().find((z) => z.slug === zoneSlug);
}

export function getPlansByZone(zoneSlug: string): Plan[] {
  return getPlans().filter((plan) => slugify(plan.zone) === zoneSlug);
}

// Colonia/zona -> alcaldía real de CDMX. Solo cubre las colonias que aparecen
// en los datos; una alcaldía sin entrada aquí simplemente no tiene página propia.
const ALCALDIA_BY_ZONE: Record<string, string> = {
  "Centro Histórico": "Cuauhtémoc",
  Centro: "Cuauhtémoc",
  "Roma Norte": "Cuauhtémoc",
  "Roma Sur": "Cuauhtémoc",
  Roma: "Cuauhtémoc",
  Condesa: "Cuauhtémoc",
  Juárez: "Cuauhtémoc",
  Doctores: "Cuauhtémoc",
  Guerrero: "Cuauhtémoc",
  Buenavista: "Cuauhtémoc",
  Cuauhtémoc: "Cuauhtémoc",
  Reforma: "Cuauhtémoc",
  "San Rafael": "Cuauhtémoc",
  Polanco: "Miguel Hidalgo",
  Chapultepec: "Miguel Hidalgo",
  "Bosque de Chapultepec": "Miguel Hidalgo",
  "Lomas de Chapultepec": "Miguel Hidalgo",
  "Del Valle": "Benito Juárez",
  Nápoles: "Benito Juárez",
  Narvarte: "Benito Juárez",
  Xoco: "Benito Juárez",
  Coyoacán: "Coyoacán",
  Coapa: "Tlalpan",
  "San Ángel": "Álvaro Obregón",
  Tlalpan: "Tlalpan",
  Xochimilco: "Xochimilco",
};

// De las alcaldías reales, solo estas dos juntan suficiente contenido para que
// una página propia (y sus combinaciones por categoría) no salga delgada o
// duplicada de una zona que ya existe — ver auditoría de contenido.
const ALCALDIAS_CON_PAGINA = ["Cuauhtémoc", "Miguel Hidalgo"];

export interface AlcaldiaInfo {
  label: string;
  slug: string;
  count: number;
}

export function getAllAlcaldias(): AlcaldiaInfo[] {
  const counts = new Map<string, number>();
  for (const plan of getPlans()) {
    const alcaldia = ALCALDIA_BY_ZONE[plan.zone];
    if (!alcaldia || !ALCALDIAS_CON_PAGINA.includes(alcaldia)) continue;
    counts.set(alcaldia, (counts.get(alcaldia) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, slug: slugify(label), count }))
    .sort((a, b) => b.count - a.count);
}

export function getAlcaldiaBySlug(alcaldiaSlug: string): AlcaldiaInfo | undefined {
  return getAllAlcaldias().find((a) => a.slug === alcaldiaSlug);
}

export function getPlansByAlcaldia(alcaldiaSlug: string): Plan[] {
  return getPlans().filter((plan) => slugify(ALCALDIA_BY_ZONE[plan.zone] ?? "") === alcaldiaSlug);
}

export interface AlcaldiaCategoryCount {
  category: CategoryId;
  count: number;
}

/** Combinaciones alcaldía×categoría con suficiente contenido real para tener su propia página. */
export function getAlcaldiaCategoryCounts(alcaldiaSlug: string): AlcaldiaCategoryCount[] {
  const counts = new Map<CategoryId, number>();
  for (const plan of getPlansByAlcaldia(alcaldiaSlug)) {
    counts.set(plan.category, (counts.get(plan.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .filter((c) => c.count >= 2)
    .sort((a, b) => b.count - a.count);
}

export function getPlansByAlcaldiaAndCategory(alcaldiaSlug: string, category: CategoryId): Plan[] {
  return getPlansByAlcaldia(alcaldiaSlug).filter((plan) => plan.category === category);
}

/** La alcaldía de una zona, solo si tiene página propia — para el cruce zona -> alcaldía. */
export function getAlcaldiaForZone(zoneLabel: string): AlcaldiaInfo | undefined {
  const alcaldia = ALCALDIA_BY_ZONE[zoneLabel];
  if (!alcaldia || !ALCALDIAS_CON_PAGINA.includes(alcaldia)) return undefined;
  return getAllAlcaldias().find((a) => a.label === alcaldia);
}

export function searchPlans(query: string): Plan[] {
  const q = slugify(query);
  if (!q) return [];

  const categoryLabel = new Map(getCategories().map((c) => [c.id, c.label]));
  return getPlans().filter((plan) => {
    const haystack = slugify(
      [plan.name, plan.zone, categoryLabel.get(plan.category) ?? "", ...(plan.tags ?? [])].join(" "),
    );
    return haystack.includes(q);
  });
}

export function getWeekendAgenda(): EventItem[] {
  return events.filter((e) => e.weekend);
}

export function getPlanBySlug(slug: string): Plan | undefined {
  return plansBySlug.get(slug);
}

/**
 * Connected to planazo_backend — the real detail page for a place.
 * Falls back to the local fixture while the backend isn't deployed yet.
 */
export async function getPlaceBySlug(slug: string): Promise<Place | undefined> {
  const remote = await apiGetPlaceBySlug(slug).catch(() => null);
  if (remote) return adaptPlaceDetail(remote);
  return places.find((p) => p.slug === slug);
}

export function getEventBySlug(slug: string): EventItem | undefined {
  return events.find((e) => e.slug === slug);
}

export function getFeaturedPlans(): Plan[] {
  const { destacadosOrder } = getSiteContent();
  return destacadosOrder
    .map((slug) => plansBySlug.get(slug))
    .filter((plan): plan is Plan => Boolean(plan));
}

/**
 * Lugares recién sumados al directorio, distintos a los ya destacados.
 * No hay campo de fecha en el fixture — el orden del JSON hace de proxy
 * de "agregado más reciente" (los últimos del arreglo).
 */
export function getLatestPlaces(limit = 8): Place[] {
  const featuredSlugs = new Set(getFeaturedPlans().map((p) => p.slug));
  return [...places].reverse().filter((p) => !featuredSlugs.has(p.slug)).slice(0, limit);
}

export function getSimilarPlans(plan: Plan, limit = 12): Plan[] {
  return [...places, ...events]
    .filter((p) => p.slug !== plan.slug && p.category === plan.category)
    .slice(0, limit);
}

export function getMoods(): Mood[] {
  return moodsData as Mood[];
}

export function resolveMoodPlans(moodId: string): Plan[] {
  const mood = getMoods().find((m) => m.id === moodId);
  if (!mood) return [];
  return mood.suggestions
    .map((ref) => plansBySlug.get(ref.slug))
    .filter((plan): plan is Plan => Boolean(plan));
}

export interface SearchSuggestion {
  type: "Plan" | "Categoría" | "Guía" | "Etiqueta" | "Zona" | "Ciudad";
  icon: string;
  label: string;
  sub: string;
  /** Present for Plan/Categoría/Guía/Etiqueta — where to navigate on pick. */
  href?: string;
  /** Present for Ciudad — sets the active city instead of navigating. */
  city?: string;
}

export function getSearchSuggestions(): SearchSuggestion[] {
  const categories = getCategories();
  const categoryIcon = new Map(categories.map((c) => [c.id, c.icon]));

  const planSuggestions: SearchSuggestion[] = [...places, ...events].map((p) => ({
    type: "Plan",
    icon: categoryIcon.get(p.category) ?? "📍",
    label: p.name,
    sub: `${p.zone} · ${p.priceLabel}`,
    href: p.kind === "lugar" ? `/lugares/${p.slug}` : `/eventos/${p.slug}`,
  }));

  const categorySuggestions: SearchSuggestion[] = categories.map((c) => ({
    type: "Categoría",
    icon: c.icon,
    label: c.label,
    sub: "Ver planes de esta categoría",
    href: categoryHref(c.id),
  }));

  const guideSuggestions: SearchSuggestion[] = getGuides().map((g) => ({
    type: "Guía",
    icon: "📖",
    label: g.title,
    sub: `Guía · ${g.categoryLabel}`,
    href: `/guias/${g.slug}`,
  }));

  const tagSuggestions: SearchSuggestion[] = getAllTags().map((tag) => ({
    type: "Etiqueta",
    icon: "🏷️",
    label: tag.label,
    sub: `${tag.count} ${tag.count === 1 ? "plan" : "planes"} con esta etiqueta`,
    href: `/etiqueta/${tag.slug}`,
  }));

  const zoneSuggestions: SearchSuggestion[] = getAllZones().map((zone) => ({
    type: "Zona",
    icon: "📍",
    label: zone.label,
    sub: `${zone.count} ${zone.count === 1 ? "plan" : "planes"} en esta zona`,
    href: `/zona/${zone.slug}`,
  }));

  const citySuggestions: SearchSuggestion[] = getCities()
    .filter((c) => !c.active)
    .map((c) => ({
      type: "Ciudad",
      icon: "📍",
      label: c.name,
      sub: "Próximamente",
      city: c.name,
    }));

  return [...planSuggestions, ...categorySuggestions, ...guideSuggestions, ...tagSuggestions, ...zoneSuggestions, ...citySuggestions];
}
