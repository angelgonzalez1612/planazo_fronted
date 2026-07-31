import Link from "next/link";
import type {
  Category,
  DirectoryTile,
  EventItem,
  Guide,
  Mood,
  Place,
  Plan,
  SiteContent,
} from "@/data/types";
import type { SearchSuggestion, ZoneInfo } from "@/lib/data";
import { HeroCarousel } from "@/components/hero-carousel";
import { HeroSearch } from "@/components/hero-search";
import { LatestSpotlight } from "@/components/latest-spotlight";
import { LatestArrivals } from "@/components/latest-arrivals";
import { CategoryChipBar } from "@/components/category-chip-bar";
import { TickerBar } from "@/components/ticker-bar";
import { AdSlot } from "@/components/ad-slot";
import { PlanCard } from "@/components/plan-card";
import { WeekendAgenda } from "@/components/weekend-agenda";
import { DirectoryTiles } from "@/components/directory-tiles";
import { MoodPicker } from "@/components/mood-picker";
import { GuidesSection } from "@/components/guides-section";
import { SiteFooterFull } from "@/components/site-footer-full";

export function HomePageBody({
  featuredPlans,
  latestPlaces,
  categories,
  directoryTiles,
  weekendEvents,
  moods,
  moodPlans,
  guides,
  searchSuggestions,
  site,
  planCount,
  zones,
}: {
  featuredPlans: Plan[];
  latestPlaces: Place[];
  categories: Category[];
  directoryTiles: DirectoryTile[];
  weekendEvents: EventItem[];
  moods: Mood[];
  moodPlans: Record<string, Plan[]>;
  guides: Guide[];
  searchSuggestions: SearchSuggestion[];
  site: SiteContent;
  planCount: number;
  zones: ZoneInfo[];
}) {
  const categoryIcon = new Map(
    categories.map((c) => [c.id, { icon: c.icon, label: c.label }]),
  );

  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-background">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-8 px-4 py-10 sm:py-16 md:px-10 lg:gap-16">
            <div className="min-w-[300px] flex-1 basis-[460px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-peach bg-card px-3.5 py-1.5 text-[13px] font-bold text-brand-deep">
                ✦ {planCount} planes curados en CDMX
              </span>
              <h1 className="text-wrap-balance mt-4.5 font-heading text-[clamp(40px,6.4vw,76px)] leading-[0.98] font-extrabold tracking-tight">
                Encuentra tu
                <br />
                próximo <span className="text-brand">plan</span> en CDMX
              </h1>
              <p className="mt-4.5 mb-7 max-w-[34ch] text-[clamp(16px,1.6vw,20px)] leading-relaxed text-ink-soft">
                Eventos, lugares y experiencias para disfrutar México.
              </p>

              <HeroSearch
                suggestions={searchSuggestions}
                examples={site.heroExamples}
              />
            </div>

            <HeroCarousel />
          </div>

          <div className="mx-auto max-w-[1280px] px-4 pb-7 md:px-10 md:pb-11">
            <CategoryChipBar categories={categories} />
          </div>

          <div className="mx-auto max-w-[1280px] px-4 pb-7 md:px-10 md:pb-11">
            <AdSlot size="970 × 90" className="h-[90px]" />
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pt-4 md:px-10">
          <TickerBar items={site.ticker} />
        </section>

        <section className="mx-auto mt-5 max-w-[1280px] px-4 md:px-10">
          <AdSlot size="970 × 90" className="h-[90px]" />
        </section>

        <LatestSpotlight
          featured={featuredPlans}
          events={weekendEvents}
          categoryIcon={categoryIcon}
        />

        <section className="mx-auto mt-2 max-w-[1280px] px-4 md:px-10">
          <AdSlot size="970 × 90" className="h-[90px]" />
        </section>

        <LatestArrivals places={latestPlaces} categoryIcon={categoryIcon} />

        <section className="mx-auto mt-6 max-w-[1280px] px-4 md:px-10">
          <AdSlot size="970 × 90" className="h-[90px]" />
        </section>

        <section
          id="destacados"
          className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14 md:px-10 lg:py-18"
        >
          <div className="mb-6.5 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="font-heading text-[clamp(26px,3.4vw,40px)] font-bold tracking-tight">
                Planes destacados
              </h2>
              <p className="mt-2 text-[16px] text-ink-soft">
                Lo que no te puedes perder esta semana.
              </p>
            </div>
            <Link
              href="/planes"
              aria-label="Ver todos los planes destacados"
              className="border-b-2 border-peach pb-0.5 text-[15px] font-bold text-brand hover:text-brand-pressed"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {featuredPlans.flatMap((plan, i) => {
              const card = (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  icon={categoryIcon.get(plan.category)?.icon ?? "📍"}
                  categoryLabel={categoryIcon.get(plan.category)?.label ?? ""}
                />
              );
              // Un anuncio cada 5 tarjetas, como en un feed.
              if ((i + 1) % 5 === 0) {
                return [
                  card,
                  <AdSlot
                    key={`ad-${plan.id}`}
                    size="300 × 250"
                    className="aspect-4/3 rounded-xl"
                    type="feed"
                  />,
                ];
              }
              return [card];
            })}
          </div>
        </section>

        <section id="finde" className="bg-ink text-background">
          <div className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14 md:px-10 lg:py-18">
            <div className="mb-6.5 flex flex-wrap items-end justify-between gap-5">
              <div>
                <span className="inline-block rounded-full bg-brand-deep px-3.5 py-1.5 text-xs font-bold tracking-wide text-white uppercase">
                  Agenda
                </span>
                <h2 className="mt-3.5 font-heading text-[clamp(26px,3.4vw,40px)] font-bold tracking-tight">
                  Qué hacer este fin de semana
                </h2>
              </div>
              <Link
                href="/eventos"
                className="text-[15px] font-bold text-peach hover:underline"
              >
                Toda la agenda →
              </Link>
            </div>
            <WeekendAgenda events={weekendEvents} />
          </div>
        </section>

        <section
          id="lugares"
          className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14 md:px-10 lg:py-18"
        >
          <h2 className="font-heading text-[clamp(26px,3.4vw,40px)] font-bold tracking-tight">
            Descubre lugares
          </h2>
          <p className="mt-2 mb-6.5 text-[16px] text-ink-soft">
            El directorio de CDMX, curado por gente que sale mucho.
          </p>
          <DirectoryTiles tiles={directoryTiles} />
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pb-10 md:px-10">
          <h2 className="font-heading text-[clamp(24px,3vw,32px)] font-bold tracking-tight">
            Explora por zona
          </h2>
          <p className="mt-2 mb-5 text-[16px] text-ink-soft">
            Qué hacer, colonia por colonia.
          </p>
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => (
              <Link
                key={zone.slug}
                href={`/zona/${zone.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:border-peach hover:text-brand-deep"
              >
                📍 {zone.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pb-10 md:px-10">
          <AdSlot size="970 × 90" className="h-[90px]" />
        </section>

        <section className="bg-brand-deep text-background">
          <div className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14 md:px-10 lg:py-18">
            <h2 className="font-heading text-[clamp(26px,3.4vw,40px)] font-bold tracking-tight">
              Planes según tu mood
            </h2>
            <p className="mt-2 mb-6.5 text-[16px] text-[#FFF2E8]">
              Dinos cómo vienes hoy y armamos el plan.
            </p>
            <MoodPicker moods={moods} moodPlans={moodPlans} />
          </div>
        </section>

        <section
          id="guias"
          className="mx-auto max-w-[1280px] px-4 py-10 sm:py-14 md:px-10 lg:py-18"
        >
          <div className="mb-6.5 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="font-heading text-[clamp(26px,3.4vw,40px)] font-bold tracking-tight">
                Guías de la ciudad
              </h2>
              <p className="mt-2 text-[16px] text-ink-soft">
                Listas cortas, probadas y sin relleno.
              </p>
            </div>
          </div>
          <GuidesSection guides={guides} />
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pb-8 md:px-10 lg:pb-12">
          <AdSlot size="970 × 90" className="h-[100px]" dark />
        </section>
      </main>

      <SiteFooterFull categories={categories} />
    </>
  );
}
