export const siteConfig = {
  name: "Planazo",
  title: "Planazo CDMX — Descubre los mejores planes cerca de ti",
  description:
    "Planazo: el directorio de planes en CDMX. Restaurantes, eventos y recomendaciones con información siempre actualizada.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es-MX",
  defaultOgImage: "/opengraph-image",
  social: {
    instagram: "https://instagram.com/planazo",
    tiktok: "https://tiktok.com/@planazo",
  },
} as const;

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
} as const;
