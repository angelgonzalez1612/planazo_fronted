import { getZoneBySlug } from "@/lib/data";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const alt = "Qué hacer en esta zona de CDMX — Planazo";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: { params: Promise<{ zone: string }> }) {
  const { zone: zoneSlug } = await params;
  const zone = getZoneBySlug(zoneSlug);
  return renderOgImage(zone ? `Qué hacer en ${zone.label}` : "Planazo", "Zona · CDMX");
}
