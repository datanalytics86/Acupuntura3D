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
npm run budget
npm run preview
npm run e2e
```

## CI

`.github/workflows/ci.yml` corre en cada push a `main` y en cada pull request.

1. Job `build`: `npm ci`, typecheck, test, build y `npm run budget` (dist < 8 MB, JS gzip ≤ 130 KB, CSS gzip ≤ 14 KB).
2. Job `probe`: depende de `build`. Levanta `vite preview` en el puerto 4173 y corre `npm run probe`. Falla si algún gate de la plancha falla.
3. Job `e2e`: depende de `build`. Instala Chromium y corre `npm run e2e` (proyecto chromium y proyecto `reduced` con `prefers-reduced-motion`).

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

## QA en cada PR

`.github/workflows/qa.yml` corre en cada pull request hacia `main`: `npm ci`, Playwright chromium, `vite preview` en el puerto 4173 y, en serie, `qa:health`, `qa:axe` y `qa:census`. Cada uno escribe su JSON en `docs/QAQC_3009/ci/`. El job tiene `timeout-minutes: 30`. No baja umbrales.

En local, con el preview ya servido:

```bash
npm run qa:health -- http://127.0.0.1:4173/ docs/QAQC_3009/after/health.json
npm run qa:axe -- http://127.0.0.1:4173/ docs/QAQC_3009/after/axe.json
npm run qa:census -- http://127.0.0.1:4173/ docs/QAQC_3009/after/census.json
```

Salud no se solapa con el censo ni con axe: cada script abre su propio Chromium y el de salud es sensible al tiempo.

## QA post-deploy

Sobre el deploy del atlas 2D, después del merge a `main`:

- El hash `assets/index-*.js` del HTML en https://acupuntura3d.vercel.app coincide con `dist/` de `main`.
- `node scripts/probe-plate.mjs https://acupuntura3d.vercel.app/ docs/T1_3009/probe-prod.json` deja los 18 gates en PASS. Si uno falla, `git revert -m 1` del merge y push a `main`.
- La página no debe contener un `<canvas>` de WebGL.
- Debe haber un `<svg>` con la lámina.
- Vistas Anterior y Posterior.
- Ficha de ST36.
- Aviso legal visible.

## Fuentes y CSP

- Outfit + Cormorant Garamond: self-host (`@fontsource/*`).
- Noto Serif SC (hanzi): woff2 autoalojado, SIL OFL 1.1 (`src/assets/fonts/OFL.txt`).
- `Content-Security-Policy` en `vercel.json`: `font-src 'self' data:`.

## Qué no entra en este atlas

- 361 puntos. Solo el seed (20 estrella) más nomenclatura; lo no anclado no se inventa.
- Backend, auth, DB, PWA offline.
- Copy de interfaz en chino. El idioma de la UI es ES/EN. El hanzi de cada punto se queda.

## URL

- Producción: https://acupuntura3d.vercel.app (atlas 2D).
- Dashboard: https://vercel.com/datanalytics86s-projects/acupuntura3d
- Preview: cada PR.
