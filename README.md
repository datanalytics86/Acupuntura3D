# Acupuntura3D

Atlas 3D interactivo del cuerpo humano con meridianos, puntos de acupuntura (estándar OMS) y visualización educativa del flujo de Qi.

**Repositorio:** https://github.com/datanalytics86/Acupuntura3D

> Herramienta educativa. No es un dispositivo médico y no sustituye el criterio de un profesional de Medicina Tradicional China.

## Cómo desarrollar

Requisitos: Node.js 22.12+ o 24 (esta máquina usa 24.18).

```bash
npm install
npm run dev
```

Otros scripts:

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

`npm run build` deja el estático en `dist/`.

## Producción

Deploy estático en Vercel (framework Vite, output `dist`, Node 22, **cero env vars**). Runbook y rollback: [`docs/DEPLOY.md`](docs/DEPLOY.md).

**Producción:** https://acupuntura3d.vercel.app

Si hay que redeployar:

```bash
npx vercel login
npx vercel link --yes --project acupuntura3d
npx vercel deploy --prod --yes
```

CI: `.github/workflows/ci.yml` (typecheck, test, build, budget `< 8 MB`).

## Alcance de este MVP

- Cuerpo procedural (cápsulas), órbita / zoom / pan
- 14 meridianos OMS: LU LI ST SP HT SI BL KI PC TE GB LR GV CV
- 20 puntos estrella clickables con ficha (ES primero; toggle EN)
- Flujo de Qi (tubo + partículas), play/pause/velocidad, color Wu Xing, boost circadiano
- Búsqueda por código y pinyin; rail de meridianos; drawer / bottom sheet
- **No** hay 361 coordenadas 3D. Los `pointCodes` listan nomenclatura OMS; el ancla espacial es solo el seed, `confidence: low`

## Stack

Vite 8 + React 19.2 + TypeScript strict + Tailwind 4 + Zustand + React Three Fiber 9 + drei + three.

React está pinneado a **19.2.x** porque `@react-three/fiber@9.7` no admite React 19.3.

## Datos

JSON versionado en `data/`. Ver `data/README.md`. Fuentes de nomenclatura: WHO y GB/T 12346. Textos educativos originales; no copiar manuales comerciales.

## Licencia

Código: MIT. Textos educativos originales. Nomenclatura según estándares OMS.
