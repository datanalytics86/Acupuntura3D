# Deploy — Acupuntura3D

Atlas 2D estático. **Vite**, output `dist`. Cero backend, cero variables de entorno, cero secretos. No hay servidor de aplicación.

La rama de producción es **main**. https://acupuntura3d.vercel.app sirve el atlas 2D (SVG, sin R3F).

## Runtime

- Node **>=22.12.0 <25** (`engines` en `package.json`; 22.x o 24.x)
- Vite → `dist/`
- React, TypeScript, Tailwind, Zustand

## Local

```bash
node -v
npm ci
npm run typecheck
npm test
npm run build
npm run preview
```

## Vercel

1. Proyecto: `acupuntura3d` (repo `datanalytics86/Acupuntura3D`).
2. Framework: **Vite**. Root: `/`. Build: `npm run build`. Output: `dist`.
3. Node.js: **22.x** (dentro de `>=22.12.0 <25`).
4. Production branch: **main**. Production solo cuando `feat/atlas-2d` ya está en `main`.
5. **Cero env vars.**
6. Preview = cada PR. Production = push a `main` ya mergeado.

## CLI (si hay sesión)

Solo desde `main` ya mergeado con `feat/atlas-2d`:

```bash
npx vercel deploy --prod --yes
```

## Rollback

Dashboard de Vercel → Deployments → el último **READY** anterior → **Instant Rollback**.

## QA post-deploy

Sobre el deploy del atlas 2D, después del merge a `main`:

- La página no debe contener un `<canvas>` de WebGL.
- Debe haber un `<svg>` con la lámina.
- Vistas Anterior y Posterior.
- Ficha de ST36.
- Aviso legal visible.

## Fuentes y CSP

- Outfit + Cormorant Garamond: self-host (`@fontsource/*`).
- Noto Serif SC (hanzi): CDN Google Fonts.
- `Content-Security-Policy-Report-Only` en `vercel.json` (incluye `fonts.gstatic.com` / `fonts.googleapis.com`).

## Qué no entra en este atlas

- 361 puntos. Solo el seed (20 estrella) más nomenclatura; lo no anclado no se inventa.
- Backend, auth, DB, PWA offline.
- Copy de interfaz en chino. El idioma de la UI es ES/EN. El hanzi de cada punto se queda.

## URL

- Producción: https://acupuntura3d.vercel.app (atlas 2D).
- Dashboard: https://vercel.com/datanalytics86s-projects/acupuntura3d
- Preview: cada PR.
