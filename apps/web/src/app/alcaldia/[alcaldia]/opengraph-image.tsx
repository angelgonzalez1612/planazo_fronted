import { getAlcaldiaBySlug } from "@/lib/data";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const alt = "Qué hacer en esta alcaldía de CDMX — Planazo";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: { params: Promise<{ alcaldia: string }> }) {
  const { alcaldia: alcaldiaSlug } = await params;
  const alcaldia = getAlcaldiaBySlug(alcaldiaSlug);
  return renderOgImage(
    alcaldia ? `Qué hacer en la alcaldía ${alcaldia.label}` : "Planazo",
    "Alcaldía · CDMX",
  );
}
