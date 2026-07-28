import { dayName, formatPriceLevel } from "@planazo/shared";
import type { Place as RemotePlace, PlaceDetail as RemotePlaceDetail } from "@planazo/types";
import type { CategoryId, OpeningHour, Place, PhotoRef, Promotion, SocialLinks } from "@/data/types";

// Bridges planazo_backend's generic knowledge-graph shape to the site's
// display-oriented Place — the one seam that changes when the schema does.

const KNOWN_CATEGORIES: readonly CategoryId[] = ["comer", "cafes", "bares", "cultura", "aire-libre", "tecnologia"];

function resolveCategory(remote: RemotePlace): CategoryId {
  const slug = remote.categories[0]?.slug;
  return (KNOWN_CATEGORIES as readonly string[]).includes(slug ?? "") ? (slug as CategoryId) : "comer";
}

function toPriceLabel(priceLevel: number | null, price: number | null): string {
  if (price === null) return "Gratis";
  const levelPrefix = formatPriceLevel(priceLevel);
  return levelPrefix ? `${levelPrefix} · $${price} p/p` : `$${price} MXN`;
}

function toCover(remote: RemotePlace): PhotoRef {
  const first = remote.photos[0];
  if (first) return { url: first.url, alt: first.alt ?? remote.name };
  // No real photo uploaded yet — deterministic placeholder, same picsum seam the fixtures already use.
  return { seed: `planazo-${remote.slug}`, alt: remote.name };
}

function toGallery(remote: RemotePlace): PhotoRef[] {
  if (remote.photos.length === 0) return [toCover(remote)];
  return remote.photos.map((p) => ({ url: p.url, alt: p.alt ?? remote.name }));
}

function extractHandle(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/+|\/+$/g, "") || url;
  } catch {
    return url;
  }
}

function toSocial(socialLinks: RemotePlaceDetail["socialLinks"] | undefined): SocialLinks | undefined {
  if (!socialLinks || socialLinks.length === 0) return undefined;
  const instagramUrl = socialLinks.find((s) => s.platform.toLowerCase() === "instagram")?.url;
  const whatsappUrl = socialLinks.find((s) => s.platform.toLowerCase() === "whatsapp")?.url;
  if (!instagramUrl && !whatsappUrl) return undefined;
  return {
    instagram: instagramUrl ? extractHandle(instagramUrl) : undefined,
    whatsapp: whatsappUrl,
  };
}

function toOpeningHours(hours: RemotePlaceDetail["openingHours"] | undefined): OpeningHour[] | undefined {
  if (!hours || hours.length === 0) return undefined;
  return hours.map((h) => ({
    day: dayName(h.dayOfWeek),
    opens: h.opensAt ?? "",
    closes: h.closesAt ?? "",
    closed: h.closed,
  }));
}

function toPromotions(promos: RemotePlaceDetail["promotions"] | undefined): Promotion[] | undefined {
  if (!promos || promos.length === 0) return undefined;
  return promos.map((p) => ({
    title: p.title,
    description: p.description ?? "",
    validUntil: p.endDate ?? undefined,
  }));
}

export function adaptPlace(remote: RemotePlace): Place {
  return {
    id: remote.id,
    slug: remote.slug,
    name: remote.name,
    kind: "lugar",
    category: resolveCategory(remote),
    zone: remote.zone ?? "",
    address: remote.address ?? "",
    priceLabel: toPriceLabel(remote.priceLevel, remote.price),
    price: remote.price,
    rating: remote.rating ?? 0,
    reviewCount: remote.reviewCount,
    cover: toCover(remote),
    gallery: toGallery(remote),
    description: remote.description ?? "",
    tags: remote.tags.map((t) => t.name),
  };
}

export function adaptPlaceDetail(remote: RemotePlaceDetail): Place {
  const coordinates =
    remote.latitude && remote.longitude
      ? { lat: Number(remote.latitude), lng: Number(remote.longitude) }
      : undefined;

  return {
    ...adaptPlace(remote),
    openingHours: toOpeningHours(remote.openingHours),
    coordinates,
    services: remote.services.length > 0 ? remote.services.map((s) => s.name) : undefined,
    promotions: toPromotions(remote.promotions),
    social: toSocial(remote.socialLinks),
  };
}
