# GAPFIX — 22 sep 2026

Prod verificado en https://acupuntura3d.vercel.app después del merge a `main` (`0aae429`).

## P0 SHIP — PASS

- `main` ya no es el MVP 3D. El merge de `feat/atlas-2d` borró `src/scene` (Canvas, cápsulas, tubos).
- PR: https://github.com/datanalytics86/Acupuntura3D/pull/2
- PR #1 (hardening 3D) quedó cerrado, sin merge.
- En la página en vivo: título «Enciclopedia del cuerpo · Atlas de meridianos», `canvas` = 0, `svg` = 1. Tras «Entiendo» el aviso se va. La barra muestra Anterior, Posterior, Cuerpo, Rostro, Mano, Pie.

## P0 UX — PASS

- Esas cuatro regiones están en el topbar, junto a Anterior/Posterior, a 44px. Las teclas 1–4 siguen en `App.tsx`.
- En ≥1100px la barra es una fila: el título no se parte y el buscador queda al final. Las cinco capas pasaron al rail de meridianos.

## P1 higiene — PASS

- `tubes` y `quality*` salieron de i18n. La confianza del ancla usa `confidenceHigh/Medium/Low`.
- `Locale` es `es | en`. `documentElement.lang` sigue al locale. No hay `lang=en` con locale zh.
- `AGENTS.md`, `docs/DEPLOY.md` y `docs/ARQUITECTURA.md` describen el atlas 2D, sin R3F.
- `tests/controls.test.ts`: 11 tests. La suite queda en 29, typecheck y build en 0. `package.json` sin `three`.

## P2

361 puntos OMS no se implementan. Sigue anotado en el README.
