import { apiConfig } from '@planazo/config';
import type { Place, PlaceDetail } from '@planazo/types';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...init,
    next: { revalidate: 60, ...init?.next },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API request to ${path} failed with ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function getPlaces(params?: { category?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.category) search.set('category', params.category);
  if (params?.limit) search.set('limit', String(params.limit));
  const query = search.toString();
  return apiFetch<Place[]>(`/places${query ? `?${query}` : ''}`);
}

export async function getPlaceBySlug(slug: string): Promise<PlaceDetail | null> {
  try {
    return await apiFetch<PlaceDetail>(`/places/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
