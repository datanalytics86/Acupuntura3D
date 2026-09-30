# Acupuntura3D

Lámina Encarta 2D.

Atlas 2D del cuerpo: lámina, meridianos, puntos y flujo de Qi.

**Repositorio:** https://github.com/datanalytics86/Acupuntura3D

> Herramienta educativa. No es un dispositivo médico y no sustituye el criterio de un profesional de Medicina Tradicional China.

## Cómo desarrollar

Requisitos: Node.js 22.12+ o 24 (esta máquina usa 24.18).

```bash
npm ci
npm run dev
```

Otros scripts:

```bash
npm run typecheck
npm test
npm run build
npm run preview
npm run e2e
npm run shots
npm run budget
```

`npm run build` deja el estático en `dist/`. `npm run e2e` construye y abre Playwright (chromium y movimiento reducido) contra el preview en el puerto 4173. `npm run shots` guarda 48 JPG en `docs/T1_2909/shots/after/`. `npm run budget` exige dist menor de 8 MB, JS gzip como máximo 130 KB y CSS gzip como máximo 14 KB.

## Producción

https://acupuntura3d.vercel.app sirve el atlas 2D desde `main`: lámina SVG, sin canvas WebGL.

Runbook y rollback, solo desde `main` ya mergeado: [`docs/DEPLOY.md`](docs/DEPLOY.md).

CI: `.github/workflows/ci.yml` (typecheck, test, build, budget `< 8 MB`, e2e).

Capturas a 1440×900, después del rediseño Tier 1:

- [Anterior](docs/T1_2909/shots/after/d1440-01-anterior.jpg)
- [Posterior](docs/T1_2909/shots/after/d1440-02-posterior.jpg)
- [ST36](docs/T1_2909/shots/after/d1440-03-st36.jpg)
- [Móvil 390](docs/T1_2909/shots/after/m390-01-anterior.jpg)

## Alcance de este MVP

Atlas **2D** (lámina de museo, SVG). No es un visor 3D. La marca mide unos 12 px en pantalla a cualquier zoom. A zoom 1 hay 15 rótulos en anterior y 6 en posterior.

- Figura humana adulta de pie, vistas Anterior / Posterior
- 14 meridianos OMS: LU LI ST SP HT SI BL KI PC TE GB LR GV CV
- 20 puntos estrella clickables con ficha (ES primero; toggle EN)
- Flujo de Qi 2D (trazo + pulso), play/pause/velocidad, color Wu Xing
- Búsqueda por código y pinyin; rail; drawer / bottom sheet
- **No** hay 361 coordenadas. Anclas 2D solo del seed, `confidence: low`

## Stack

Vite 8 + React 19.2 + TypeScript strict + Tailwind 4 + Zustand. Vista: SVG inline (sin R3F).

React está pinneado a **19.2.x**.

## Datos

JSON versionado en `data/`. Ver `data/README.md`. Fuentes de nomenclatura: WHO y GB/T 12346. Textos educativos originales; no copiar manuales comerciales.

## Licencia

Código: MIT. Textos educativos originales. Nomenclatura según estándares OMS.
