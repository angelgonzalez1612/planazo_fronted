import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPlaceBySlug, getCategories, getComments, getSimilarPlans, getGuidesForPlace } from "@/lib/data";
import { resolvePhoto } from "@/lib/data";
import { PlanDetailView } from "@/components/plan-detail/plan-detail-view";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) return {};

  const cover = resolvePhoto(place.cover);
  return {
    title: `${place.name} — ${place.zone}, CDMX`,
    description: place.description,
    openGraph: { images: [cover.url] },
  };
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) notFound();

  const categories = getCategories();
  const category = categories.find((c) => c.id === place.category);

  return (
    <PlanDetailView
      plan={place}
      categoryIcon={category?.icon ?? "📍"}
      categoryLabel={category?.label ?? ""}
      categories={categories}
      comments={getComments(place.slug)}
      similar={getSimilarPlans(place)}
      guides={getGuidesForPlace(place.slug)}
    />
  );
}
