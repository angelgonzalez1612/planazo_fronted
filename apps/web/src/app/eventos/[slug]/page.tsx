import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug, getCategories, getComments, getSimilarPlans, resolvePhoto } from "@/lib/data";
import { PlanDetailView } from "@/components/plan-detail/plan-detail-view";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  const cover = resolvePhoto(event.cover);
  return {
    title: `${event.name} — ${event.zone}, CDMX`,
    description: event.description,
    openGraph: { images: [cover.url] },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const categories = getCategories();
  const category = categories.find((c) => c.id === event.category);

  return (
    <PlanDetailView
      plan={event}
      categoryIcon={category?.icon ?? "🎉"}
      categoryLabel={category?.label ?? ""}
      categories={categories}
      comments={getComments(event.slug)}
      similar={getSimilarPlans(event)}
      guides={[]}
    />
  );
}
