import type { MetadataRoute } from "next";
import { siteConfig } from "@planazo/config";
import {
  getPlaces,
  getEvents,
  getGuides,
  getAllZones,
  getMoods,
  getAllTags,
  getAllAlcaldias,
  getAlcaldiaCategoryCounts,
  categoryHref,
} from "@/lib/data";
import type { CategoryId } from "@/data/types";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const places = await getPlaces();
  const placeEntries: MetadataRoute.Sitemap = places.map((place) => ({
    url: `${siteConfig.url}/lugares/${place.slug}`,
  }));

  const categoryEntries: MetadataRoute.Sitemap = PLACE_CATEGORIES.map((id) => ({
    url: `${siteConfig.url}${categoryHref(id)}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventEntries: MetadataRoute.Sitemap = getEvents().map((event) => ({
    url: `${siteConfig.url}/eventos/${event.slug}`,
  }));

  const guideEntries: MetadataRoute.Sitemap = getGuides().map((guide) => ({
    url: `${siteConfig.url}/guias/${guide.slug}`,
  }));

  const zoneEntries: MetadataRoute.Sitemap = getAllZones().map((zone) => ({
    url: `${siteConfig.url}/zona/${zone.slug}`,
    changeFrequency: "weekly",
  }));

  const moodEntries: MetadataRoute.Sitemap = getMoods().map((mood) => ({
    url: `${siteConfig.url}/mood/${mood.id}`,
    changeFrequency: "weekly",
  }));

  const tagEntries: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${siteConfig.url}/etiqueta/${tag.slug}`,
    changeFrequency: "weekly",
  }));

  const alcaldias = getAllAlcaldias();
  const alcaldiaEntries: MetadataRoute.Sitemap = alcaldias.map((alcaldia) => ({
    url: `${siteConfig.url}/alcaldia/${alcaldia.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const alcaldiaCategoryEntries: MetadataRoute.Sitemap = alcaldias.flatMap((alcaldia) =>
    getAlcaldiaCategoryCounts(alcaldia.slug).map(({ category }) => ({
      url: `${siteConfig.url}/alcaldia/${alcaldia.slug}/${category}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/eventos`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    { url: `${siteConfig.url}/hoy`, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${siteConfig.url}/fin-de-semana`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    { url: `${siteConfig.url}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terminos`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/publicidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/contacto`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/quienes-somos`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/planes`, changeFrequency: "daily", priority: 0.7 },
    ...categoryEntries,
    ...placeEntries,
    ...eventEntries,
    ...guideEntries,
    ...zoneEntries,
    ...moodEntries,
    ...tagEntries,
    ...alcaldiaEntries,
    ...alcaldiaCategoryEntries,
  ];
}
