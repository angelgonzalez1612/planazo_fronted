import type { PhotoRef } from "@/data/types";

/**
 * Placeholder photo provider. JSON fixtures store a stable `seed`, not a URL —
 * swapping to real photos (Supabase Storage) later means changing only this
 * function, not every place that renders a photo.
 */
export function resolvePhoto(photo: PhotoRef): { url: string; alt: string } {
  const width = photo.width ?? 640;
  const height = photo.height ?? 480;
  return {
    url: `https://picsum.photos/seed/${photo.seed}/${width}/${height}`,
    alt: photo.alt,
  };
}
