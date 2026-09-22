# AGENTS.md — Acupuntura3D

Eres Grok Build / Grok Terminal trabajando en un atlas 2D educativo de acupuntura.

## Misión
Lámina del cuerpo: meridianos, puntos e interacción. Click en un punto abre ficha. El Qi se ve sobre los trazos. Español primero. No es un dispositivo médico.

No es un visor 3D. No uses R3F, no uses three, no uses Canvas WebGL. No entres en Plan mode. No pidas entrar en Plan.

## Antes de codear
1. Lee README.md, docs/ARQUITECTURA.md y docs/DEPLOY.md.
2. No implementes los 361 puntos.
3. Commits atómicos. TypeScript estricto.

## Stack
Vite + React + TypeScript + Tailwind + Zustand.
Datos JSON bajo `data/`. Sin backend.
Deploy estático a Vercel (`npm run build` → `dist`).

## Reglas
- No inventar 361 puntos. Si no hay ancla en el seed, no se fabrica.
- No copiar texto de manuales con copyright. Nomenclatura OMS + resúmenes originales + fuente.
- No afirmar eficacia clínica. Aviso legal visible.
- No secretos ni API keys.
- No instalar `three`, `@react-three/fiber` ni `@react-three/drei`.
- `npm run dev` debe abrir el atlas SVG.

## Hecho de este atlas
- Lámina en `<svg>`, vistas Anterior / Posterior
- 20 puntos estrella con ficha al click
- Qi 2D con play/pause
- Búsqueda, rail, aviso legal
- Producción: solo `main`, y solo después de mergear `feat/atlas-2d`. Hasta ese merge la URL pública sigue siendo el MVP 3D. Ver docs/DEPLOY.md.
