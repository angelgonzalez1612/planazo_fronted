import { getCategories, getPlaceCategories } from "@/lib/data";
import type { CategoryId } from "@/data/types";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const alt = "Directorio de CDMX — Planazo";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const isPlaceCategory = getPlaceCategories().includes(categoria as CategoryId);
  const category = isPlaceCategory ? getCategories().find((c) => c.id === categoria) : undefined;
  return renderOgImage(category ? `${category.label} en CDMX` : "Planazo", "Categoría · CDMX");
}
