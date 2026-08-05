export type CategoryId =
  | "eventos"
  | "comer"
  | "cafes"
  | "bares"
  | "cultura"
  | "aire-libre"
  | "tecnologia"
  | "gaming"
  | "viajes"
  | "cine-tv"
  | "geek"
  | "mascotas"
  | "musica";

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
}

export interface DirectoryTile {
  label: string;
  categoryId: CategoryId;
  photoSeed: string;
  count: number;
}

export interface PhotoRef {
  /** Picsum placeholder seed — used when there's no real photo yet. */
  seed?: string;
  /** A real uploaded photo URL (e.g. Supabase Storage) — takes priority over `seed` when present. */
  url?: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SocialLinks {
  instagram?: string;
  whatsapp?: string;
}

interface PlanBase {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  zone: string;
  address: string;
  priceLabel: string;
  price: number | null;
  rating: number;
  reviewCount: number;
  cover: PhotoRef;
  gallery: PhotoRef[];
  description: string;
  /** Extra paragraph(s) shown on the detail page, below `description` — never fed to meta/JSON-LD. */
  descriptionLong?: string;
  /** Short callouts ("Qué pedir", "Cómo llegar") — real findings only, never filler. */
  highlights?: ContentSection[];
  /** Paid sponsored placement label (e.g. "Patrocinado") — rendered as a solid brand-color pill, distinct from editorial content. Never used for curation signals; see /publicidad's promise that ads and curation stay separate. */
  badge?: string;
  /** Descriptive labels ("Pet friendly", "Para trabajar") — what a collection filters by. */
  tags?: string[];
  social?: SocialLinks;
}

/** A titled block of body text — one or more paragraphs separated by \n\n. */
export interface ContentSection {
  heading: string;
  body: string;
  /** Only meaningful in Guide.sections — links the section to its place card. */
  placeSlug?: string;
}

export interface OpeningHour {
  day: string;
  opens: string;
  closes: string;
  closed?: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Promotion {
  title: string;
  description: string;
  validUntil?: string;
}

export interface Place extends PlanBase {
  kind: "lugar";
  openingHours?: OpeningHour[];
  coordinates?: Coordinates;
  /** Amenities ("Wifi", "Estacionamiento") — distinct from tags, which are descriptive. */
  services?: string[];
  promotions?: Promotion[];
}

export interface WeekendInfo {
  day: string;
  time: string;
}

export interface EventItem extends PlanBase {
  kind: "evento";
  dateLabel: string;
  /** ISO 8601 — cuándo empieza, para poder ordenar por fecha (dateLabel es solo texto). Fallback si no hay recurringDays; el JSON-LD calcula la próxima ocurrencia real. */
  startDate: string;
  weekend?: WeekendInfo;
  /** Días de la semana en que se repite (0 = domingo ... 6 = sábado), para la página /hoy. */
  recurringDays?: number[];
  /** Entidad organizadora real (nunca inventada) — omitir si no hay una identificable. */
  organizer?: string;
  /** Persona o grupo que se presenta, solo cuando es verificable (p. ej. una compañía fija, no un acto que rota cada semana). */
  performer?: string;
}

export type Plan = Place | EventItem;

export interface MoodSuggestionRef {
  kind: "lugar" | "evento";
  slug: string;
}

export interface Mood {
  id: string;
  label: string;
  emoji: string;
  intro?: string;
  suggestions: MoodSuggestionRef[];
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Opening paragraph(s) shown on the guide page — description stays short for meta/subtitle use. */
  intro?: string;
  /** Structured body — one section per stop/theme, rendered after intro. */
  sections?: ContentSection[];
  categoryLabel: string;
  readTime: string;
  cover: PhotoRef;
  /** Places this collection curates, by slug — the place's data lives once, in places.json. */
  placeSlugs: string[];
}

export interface City {
  id: string;
  name: string;
  active: boolean;
}

export interface SiteContent {
  heroExamples: string[];
  ticker: Array<{ label: string; href: string }>;
  destacadosOrder: string[];
}
