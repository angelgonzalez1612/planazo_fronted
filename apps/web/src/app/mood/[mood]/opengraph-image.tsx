import { getMoods } from "@/lib/data";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const alt = "Planes para cada ocasión en CDMX — Planazo";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: { params: Promise<{ mood: string }> }) {
  const { mood } = await params;
  const found = getMoods().find((m) => m.id === mood);
  return renderOgImage(
    found ? `Planes ${found.label.toLowerCase()}` : "Planazo",
    "Planes · CDMX",
  );
}
