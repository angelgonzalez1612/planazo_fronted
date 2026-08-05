import { siteConfig } from "@planazo/config";
import type { CategoryId, Guide, Plan } from "@/data/types";
import { resolvePhoto } from "@/lib/data/photo";
import { mexicoCityNow } from "@/lib/date";
import { nextEventOccurrence } from "@/lib/event-schedule";
import { buildOpeningHoursSpecification } from "@/lib/opening-hours";

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
  const openingHoursSpecification = buildOpeningHoursSpecification(plan.openingHours);

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
    ...(openingHoursSpecification && { openingHoursSpecification }),
  };
}

/** JSON-LD for an event detail page. */
export function buildEventJsonLd(plan: Extract<Plan, { kind: "evento" }>) {
  const cover = resolvePhoto(plan.cover);
  const url = `${siteConfig.url}/eventos/${plan.slug}`;
  // Recurring events (weekly markets, danzón, lucha libre) would otherwise ship
  // a hardcoded startDate that goes stale within days — this recomputes the
  // next real occurrence on every request instead.
  const { startDate, endDate } = nextEventOccurrence(plan, mexicoCityNow());

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: plan.name,
    description: plan.description,
    image: cover.url,
    url,
    startDate,
    ...(endDate && { endDate }),
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
    ...(plan.organizer && {
      organizer: {
        "@type": "Organization",
        name: plan.organizer,
      },
    }),
    ...(plan.performer && {
      performer: {
        "@type": "PerformingGroup",
        name: plan.performer,
      },
    }),
    offers: {
      "@type": "Offer",
      price: plan.price ?? 0,
      priceCurrency: "MXN",
      url,
      availability: "https://schema.org/InStock",
      // Walk-up/ongoing offers with no fixed sale-start date — "valid as of now" is
      // the honest value rather than fabricating a ticket sale date we don't have.
      validFrom: new Date().toISOString(),
    },
  };
}

export function buildPlanJsonLd(plan: Plan) {
  return plan.kind === "lugar" ? buildPlaceJsonLd(plan) : buildEventJsonLd(plan);
}

/** JSON-LD breadcrumb trail — mirrors the visual "Inicio / X / Y" breadcrumbs on every listing/detail page. */
export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** JSON-LD item list for listing pages (zona, categoría, mood, etiqueta) — tells Google what the page catalogs. */
export function buildItemListJsonLd(plans: Plan[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: plans.map((plan, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteConfig.url}/${plan.kind === "evento" ? "eventos" : "lugares"}/${plan.slug}`,
    })),
  };
}

/** Same idea as buildItemListJsonLd but for the /guias index — guides aren't Plans. */
export function buildGuideListJsonLd(guides: Guide[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteConfig.url}/guias/${guide.slug}`,
    })),
  };
}
