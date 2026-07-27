import { SiteHeader } from "@/components/site-header";
import { HomePageBody } from "@/components/home-page-body";
import {
  getFeaturedPlans,
  getCategories,
  getDirectoryTiles,
  getWeekendAgenda,
  getMoods,
  resolveMoodPlans,
  getGuides,
  getSearchSuggestions,
  getSiteContent,
} from "@/lib/data";

export default function HomePage() {
  const moods = getMoods();
  const moodPlans = Object.fromEntries(moods.map((m) => [m.id, resolveMoodPlans(m.id)]));

  return (
    <>
      <SiteHeader />
      <HomePageBody
        featuredPlans={getFeaturedPlans()}
        categories={getCategories()}
        directoryTiles={getDirectoryTiles()}
        weekendEvents={getWeekendAgenda()}
        moods={moods}
        moodPlans={moodPlans}
        guides={getGuides()}
        searchSuggestions={getSearchSuggestions()}
        site={getSiteContent()}
      />
    </>
  );
}
