# Planazo — Frontend

Sitio público de Planazo (Next.js 16, App Router). El backend modela el
contenido como un **motor de conocimiento**: un `Place` (lugar) es una
entidad reutilizable que se relaciona con artículos, eventos, promociones y
rankings, en vez de vivir dentro de un único post de blog.

Este repo es hermano de [`planazo_backend`](https://github.com/angelgonzalez1612/planazo_backend)
(API NestJS + Drizzle) y [`planazo_cms`](https://github.com/angelgonzalez1612/planazo_cms)
(panel de generación de contenido con IA, en construcción). Los tres
consumen el mismo contrato en `packages/types`, y este frontend solo lee
contenido — nunca escribe directo a la base de datos ni le habla al CMS.

## Estructura

```
apps/
  web/      Next.js 16 (App Router) — sitio público, SSR/SSG, SEO
packages/
  types/    Contrato de datos compartido (Place, Article, Ranking, ...)
  config/   Config de sitio (nombre, URL, OG) y de API
  shared/   Utilidades puras (slugify, formatPriceLevel, ...)
```

**Estado actual: corre solo, sin backend.** Mientras se termina de conectar
`planazo_backend`, los datos viven en JSON estático dentro de
`apps/web/src/data/*.json`, leídos por `apps/web/src/lib/data/*` — el mismo
punto de entrada (`getPlaces`, `getPlaceBySlug`, etc.) que usará la versión
real. Migrar es reescribir el *cuerpo* de esas funciones en `lib/data` para
que hagan `fetch` a `planazo_backend` en vez de leer el JSON — ningún
componente ni página cambia.

## Requisitos

- Node.js 20+
- pnpm 9 (`corepack enable` si no lo tienes)

## Puesta en marcha

```bash
pnpm install
pnpm --filter @planazo/web dev
```

- Web: http://localhost:3000 — funciona de inmediato, sin variables de entorno.

## Variables de entorno (`apps/web/.env.local`)

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL de `planazo_backend` (`http://localhost:3001/api` en dev) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (para metadata/sitemap/OG) |

## Scripts

- `pnpm dev` — corre `apps/web`
- `pnpm build` / `pnpm lint` / `pnpm typecheck`

## Decisiones ya tomadas (y por qué)

- **Next.js 16**: App Router, RSC, SSR/SSG en la versión estable actual.
- **Sin autenticación real todavía**: el modal de "inicia sesión" que aparece
  al guardar un plan o comentar es una captura de correo (mismo patrón que
  el newsletter) — no hay cuentas de usuario reales aún, a propósito.
- **Diseño**: naranja `#FF5A00`, negro suave `#191512`, tipografías Sora + DM
  Sans. Los tokens viven en `apps/web/src/app/globals.css`.
- **Fotos**: mientras no hay Supabase Storage, `src/lib/data/photo.ts`
  resuelve cada `seed` guardado en el JSON contra picsum.photos.
