# Deploy — Acupuntura3D

SPA educativa estática. **Vite**, no Next.js: el canvas WebGL no necesita SSR y evita hidratación. Cero backend, cero variables de entorno, cero secretos.

## Stack

- Node **22.x** (`engines`: `>=22.12.0 <25`)
- Vite 8 → `dist/`
- React **19.2.x** (no 19.3: peer de `@react-three/fiber@9.7`)
- Tailwind 4, Zustand, R3F 9.7, drei, three, Vitest

## Local

```bash
node -v          # 22.x o 24.x
npm ci
npm run typecheck
npm test
npm run build
npm run preview
```

## Vercel Dashboard

1. Importar `datanalytics86/Acupuntura3D`.
2. Framework: **Vite**. Root: `/`. Build: `npm run build`. Output: `dist`.
3. Node.js: **22.x**. Production branch: **main**.
4. **Cero env vars.**
5. Preview = cada PR. Production = push a `main`.

Proyecto Vercel: crear `acupuntura3d` si no existe.

## CLI (si hay sesión)

```bash
npx vercel login
npx vercel link --yes --project acupuntura3d
npx vercel deploy --prod --yes
```

## Rollback

Dashboard → Deployments → el último **READY** anterior → **Instant Rollback**.

## QA post-deploy

- `/` muestra cuerpo + meridianos (no pantalla negra).
- Click ST36 → ficha 足三里.
- Esc cierra drawer. `/` enfoca search.
- Play/pause Qi.
- ES/EN cambia topbar y `document.documentElement.lang`.
- Primera visita: modal legal. Footer disclaimer siempre visible.
- iPhone SE: clock y disclaimer legibles.

## CSP y fuentes

- Outfit + Cormorant Garamond: **self-host** (`@fontsource/*`).
- Noto Serif SC (hanzi): **CDN Google Fonts** para no reventar el budget CJK.
- `Content-Security-Policy-Report-Only` en `vercel.json`. El CDN de Noto viola un CSP estricto `font-src 'self'`; por eso report-only incluye `fonts.gstatic.com` / `fonts.googleapis.com`. Quitar el CDN de Noto es el siguiente paso de hardening, no de este release.

## Qué NO está en prod

- 361 anclas 3D (solo nomenclatura OMS en `pointCodes`).
- GLB / modelo con licencia.
- Backend, auth, DB, PWA offline, Sentry.
- i18n ZH real (`locale === "zh"` cae a EN).

## URL

Producción: *pendiente de `npx vercel deploy --prod` autenticado.*
Preview: cada PR en Vercel tras conectar el repo.
