import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { HomePageBody } from "@/components/home-page-body";
import {
  getFeaturedPlans,
  getLatestPlaces,
  getCategories,
  getDirectoryTiles,
  getWeekendAgenda,
  getMoods,
  resolveMoodPlans,
  getGuides,
  getSearchSuggestions,
  getSiteContent,
  getPlans,
  getAllZones,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Qué hacer hoy en CDMX",
  description:
    "Qué hacer hoy y este finde en CDMX: restaurantes, bares, cultura y planes por zona, curados por gente que sale seguido. Sin reseñas genéricas, sin datos inventados.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const moods = getMoods();
  const moodPlans = Object.fromEntries(moods.map((m) => [m.id, resolveMoodPlans(m.id)]));

  return (
    <>
      <SiteHeader />
      <HomePageBody
        featuredPlans={getFeaturedPlans()}
        latestPlaces={getLatestPlaces()}
        categories={getCategories()}
        directoryTiles={getDirectoryTiles()}
        weekendEvents={getWeekendAgenda()}
        moods={moods}
        moodPlans={moodPlans}
        guides={getGuides()}
        searchSuggestions={getSearchSuggestions()}
        site={getSiteContent()}
        planCount={getPlans().length}
        zones={getAllZones().slice(0, 12)}
      />
    </>
  );
}
