# LOG — QAQC 30.09

## F0
- Base `7142b97`. Typecheck 0, vitest 89/89, build igual al hash de producción.
- Health 15/18: caen `consoleErrors` (AbortError de View Transition), `focusLeakLegal` 25, `tapAccuracy` (`ST36→GB34`, `SP6→KI3`, `LR3→KI3`, `CV12→nada`).
- Censo: dead 5, covered 23, smallTarget 10, clickFailed = errors = unnamed = overflowAfter = 0.
- Axe: 10 serious `target-size` en las velocidades del reloj, 0 critical.
- Q03, Q04, Q06 y Q07 quedan resueltos por el 30.09. Q08 documentado (11 % &lt; 20 %).

## F1
- A1: knip 12 exports y 14 tipos, madge 0 ciclos, audit 0. Sin archivos ni dependencias muertas.
- A2: censo 214 en `index-CTIhc3pc.js`. dead = clickFailed = errors = unnamed = covered = smallTarget = overflowAfter = 0.
- A3: axe 0 serious. Zoom 400 % sin overflow. Forced-colors con 10 marcas y 18 botones.
- A4: U1–U12 dentro del tope en 1440 y 390. Microcopy en `MICROCOPY.md`.
- A5: health 18/18 dos veces. Trazas en `after/robust.json`. Q08 sigue documentado.

## F2
- `447c74b` cierra Q02, Q09 y A1-01…A1-09.
- `14c8a3d` cierra marca cubierta y sectores.
- `1cbd5b0` cierra el toque que se movía con la columna y la región en el mismo turno.
- Tests que fallaban antes: `paperTransition`, `pointStep`, `coarseHit`, `controls`, `e2e/tap.spec.ts`.
- Cero S1 y cero S2 abiertos. Q08 y A1-10 documentados.

## F3
- Typecheck 0, vitest 105/105, budget js 106332, css 11887, dist 4573658, audit 0.
- e2e ×3: 21 en verde y 2 omitidos, sobre `index-CTIhc3pc.js`.
- Censo 214 en cero, axe 0, health 18/18 y 18/18, sonda 18/18 (`dantianGapPx` 9).
- 48 JPG contra `docs/T1_3009/shots/after`. Cada diff tiene ticket: D11, D17, UX-01, Q05, D09, D15.
- La figura y el color de la estampa no cambian.

## F4
- J1 PASS. Nota 94. Heurísticas mínimas 4. Tareas 2/2. Cero callejones.
- J2 PASS. paperTransition, pointStep y coarseHit fallan sin el arreglo y pasan al restaurar.
- G1–G8 en verde. Cero S1 y cero S2 abiertos. Q08 y A1-10 documentados.
- El workflow `qa.yml` espera el PR. El verde de GitHub se confirma antes del merge.

## F6
- PR 13 mergeada en `e1fc60b`. CI `qa` en verde antes del merge.
- Producción sirve `index-CTIhc3pc.js`.
- Health de producción: 18/18. LCP 1688 ms. Cero toques mal abiertos.
- Censo ligero de inicio y ficha: 146 controles, sin hallazgos.
- No hizo falta revertir.
