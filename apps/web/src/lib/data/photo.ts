import type { PhotoRef } from "@/data/types";

/**
 * Photo provider. Real uploaded photos (from planazo_backend, e.g. Supabase
 * Storage) carry a `url` directly. JSON fixtures — and any real place that
 * hasn't had a photo uploaded yet — only carry a `seed`, resolved against
 * picsum.photos as a stand-in.
 */
export function resolvePhoto(photo: PhotoRef): { url: string; alt: string } {
  if (photo.url) {
    return { url: photo.url, alt: photo.alt };
  }

  const width = photo.width ?? 640;
  const height = photo.height ?? 480;
  return {
    url: `https://picsum.photos/seed/${photo.seed}/${width}/${height}`,
    alt: photo.alt,
  };
}
