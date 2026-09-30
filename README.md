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
npm run probe
npm run qa
npm run fonts
npm run trace
```

`npm run build` deja el estático en `dist/`. `npm run e2e` abre Playwright (chromium y movimiento reducido) contra el preview en el puerto 4173. `npm run shots` guarda 48 JPG en `docs/T1_2909/shots/after/`. `npm run budget` exige dist menor de 8 MB, JS gzip como máximo 130 KB y CSS gzip como máximo 14 KB. `npm run probe` mide los 18 gates de la plancha. `npm run qa` corre salud, axe y censo contra `http://localhost:4173/`. Para guardar el JSON: `npm run qa:census -- http://127.0.0.1:4173/ docs/QAQC_3009/after/census.json` (igual con `qa:health` y `qa:axe`). `npm run fonts` regenera el subconjunto de Noto Serif SC. `npm run trace` regenera el contorno vectorial.

## Producción

https://acupuntura3d.vercel.app sirve el atlas 2D desde `main`: lámina SVG, sin canvas WebGL.

Runbook y rollback, solo desde `main` ya mergeado: [`docs/DEPLOY.md`](docs/DEPLOY.md).

CI: `.github/workflows/ci.yml` (typecheck, test, build, budget `< 8 MB`, job `probe` de los 18 gates, e2e).

Capturas de la estampa (MegaPrompt 30.09), en `docs/T1_3009/shots/after/`:

- [Anterior 1440](docs/T1_3009/shots/after/d1440-01-anterior.jpg)
- [ST36 1440](docs/T1_3009/shots/after/d1440-03-st36.jpg)
- [Rostro 1440](docs/T1_3009/shots/after/d1440-04-face.jpg)
- [Mano 1440](docs/T1_3009/shots/after/d1440-05-hand.jpg)
- [Anterior 390](docs/T1_3009/shots/after/m390-01-anterior.jpg)
- [ST36 390](docs/T1_3009/shots/after/m390-03-st36.jpg)

## Alcance de este MVP

Atlas **2D** (estampa de museo, SVG). No es un visor 3D. El dibujo vive dentro de la ventana de la plancha; el reloj, la clave, el zoom y el minimapa viven en el margen. La figura es duotono más un contorno vectorial. La marca mide unos 12 px en pantalla a cualquier zoom. A zoom 1 hay 15 rótulos de margen en anterior y 6 en posterior. Por encima de zoom 1.6 cada punto visible lleva su rótulo junto a la marca, dentro de la ventana.

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
Noto Serif SC: SIL OFL 1.1. El texto de la licencia está en `src/assets/fonts/OFL.txt`.
