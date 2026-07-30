import { siteConfig } from "@planazo/config";
import type { CategoryId, Plan } from "@/data/types";
import { resolvePhoto } from "@/lib/data/photo";

// Maps our categories to the closest schema.org type Google actually keys
// rich results off of for "dónde comer / tomar algo" style local searches.
const SCHEMA_TYPE_BY_CATEGORY: Record<CategoryId, string> = {
  eventos: "LocalBusiness",
  comer: "Restaurant",
  cafes: "CafeOrCoffeeShop",
  bares: "BarOrPub",
  cultura: "TouristAttraction",
  "aire-libre": "TouristAttraction",
  tecnologia: "LocalBusiness",
  gaming: "LocalBusiness",
  viajes: "TouristAttraction",
  "cine-tv": "LocalBusiness",
  geek: "LocalBusiness",
  mascotas: "LocalBusiness",
  musica: "LocalBusiness",
};

/** JSON-LD for a place detail page — LocalBusiness/Restaurant/etc, whichever fits the category. */
export function buildPlaceJsonLd(plan: Extract<Plan, { kind: "lugar" }>) {
  const cover = resolvePhoto(plan.cover);
  const url = `${siteConfig.url}/lugares/${plan.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE_BY_CATEGORY[plan.category],
    name: plan.name,
    description: plan.description,
    image: cover.url,
    url,
    address: {
      "@type": "PostalAddress",
      streetAddress: plan.address,
      addressLocality: plan.zone,
      addressRegion: "CDMX",
      addressCountry: "MX",
    },
    ...(plan.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: plan.coordinates.lat,
        longitude: plan.coordinates.lng,
      },
    }),
    ...(plan.price != null && { priceRange: plan.priceLabel }),
    ...(plan.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: plan.rating,
        reviewCount: plan.reviewCount,
      },
    }),
  };
}

/** JSON-LD for an event detail page. */
export function buildEventJsonLd(plan: Extract<Plan, { kind: "evento" }>) {
  const cover = resolvePhoto(plan.cover);
  const url = `${siteConfig.url}/eventos/${plan.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: plan.name,
    description: plan.description,
    image: cover.url,
    url,
    startDate: plan.startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: plan.zone,
      address: {
        "@type": "PostalAddress",
        streetAddress: plan.address,
        addressLocality: plan.zone,
        addressRegion: "CDMX",
        addressCountry: "MX",
      },
    },
    offers: {
      "@type": "Offer",
      price: plan.price ?? 0,
      priceCurrency: "MXN",
      url,
      availability: "https://schema.org/InStock",
    },
  };
}

export function buildPlanJsonLd(plan: Plan) {
  return plan.kind === "lugar" ? buildPlaceJsonLd(plan) : buildEventJsonLd(plan);
}
