# SWARM Q1 — QAQC datos

Resultado: PASS

- Schema: las 20 filas de `data/acupoints.seed.json` validan `data/schema/acupoint.schema.json`. Los 14 meridianos de `data/meridians.json` validan `data/schema/meridian.schema.json`. `tests/schema.test.ts` no se tocó y sigue en verde.
- Hanzi sin cambio: CV12 es 中脘. ST36 es 足三里.
- Embarazo: LI4 y SP6 usan `precautions: string[]` con el texto «Evitar en embarazo (tradición clásica)». El schema no tiene `pregnancyCaution`. El campo no se renombró. `precautions` cumple ese contrato.
- Piel: viewBox 800×1600. Placas de `Figure.tsx`: anterior x=97.61 y=40 width=604.79 height=1440 (`body-anterior.png`, 1874×4462); posterior x=97.47 y=40 width=605.06 height=1440 (`body-posterior.png`, 1874×4460). Mapeo SVG `preserveAspectRatio="xMidYMid meet"`. Pasa con un pixel alpha>16 a ≤12 unidades de viewBox.
- Muestras sobre la piel: 21/21. Son 20 puntos; GV20 se mide en anterior y en posterior. Diecinueve colocaciones ya caían en alpha 255 (distancia 0).
- Anterior en piel: LI4, LU7, ST36, SP6, HT7, PC6, LR3, GB34, KI3, CV12, CV17, GV20, TE5, SI3, EX-HN3.
- Posterior en piel: GB20, BL23, BL40, GV20, GV14, EX-B1.
- Nudge ≤12, sin inventar anatomía: HT7 (215,756) estaba en alpha 0, a 4.49 de piel y a 5.39 de alpha 255 → (210,754). PC6 (220,740) estaba en alpha 0, a 6.24 → (213,740), nudge de 7. Ningún punto quedó a más de 12.
- `data/unmapped.json` es `[]`. Coherente: cada código del seed tiene `position2d` en cada vista declarada en `views`. No se listan los 361 puntos OMS que no están en el seed.
- Prueba: `npm.cmd test` — 3 files, 17 tests, PASS (schema 2, smoke 11, skin 4). El PNG se decodifica en `tests/pngAlpha.ts` con `node:zlib` (IHDR+IDAT). Sin dependencias npm nuevas.
