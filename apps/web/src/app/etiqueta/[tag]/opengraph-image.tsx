import { getTagBySlug } from "@/lib/data";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const alt = "Lugares y eventos con esta etiqueta en CDMX — Planazo";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: tagSlug } = await params;
  const tag = getTagBySlug(tagSlug);
  return renderOgImage(tag ? tag.label : "Planazo", "Etiqueta · CDMX");
}
