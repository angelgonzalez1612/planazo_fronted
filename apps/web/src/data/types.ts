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
  badge?: string;
  /** Descriptive labels ("Pet friendly", "Para trabajar") — what a collection filters by. */
  tags?: string[];
  social?: SocialLinks;
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
  /** ISO 8601 — cuándo empieza, para poder ordenar por fecha (dateLabel es solo texto). */
  startDate: string;
  weekend?: WeekendInfo;
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
  suggestions: MoodSuggestionRef[];
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  description: string;
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
  heroBadge: string;
  heroExamples: string[];
  ticker: Array<{ label: string; href: string }>;
  newsletterCount: number;
  destacadosOrder: string[];
}

export interface Comment {
  name: string;
  timeAgo: string;
  text: string;
}
