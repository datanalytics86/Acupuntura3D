# LOG T1 30.09

## W0
- Rama `feat/t1-3009` desde `main` @ `3e29ca2`. typecheck 0, test 69/69, build 0.
- `probe-before`: 14 FAIL, 4 PASS. Hanzi en PASS local por Noto Serif SC ExtraLight del sistema (D01).
- 48 JPG en `docs/T1_3009/shots/before`. Script `probe` en `package.json`.

## W1
- Merge F1 `a209f7e`, F3 `c529459`, F2 `a789085`. typecheck 0, test 77/77, build 0.
- Probe integrado: hanzi en Noto Serif SC Medium, seam 0, solapes 0, figura 0.71 / 0.65, headFoot 0.
- Siguen en rojo: idleRouteLabels 23, zoomLabelCoverage 0, orientationGap −1, headerAccent 3, dantianGap 1, marca móvil, peek sin hanzi.

## W2
- Merge T1 `1e43319`, T2 `fd9bdba`, U2 `102c6c4`, U1 `cb6ff9f`, U3 `b116fd3`, U4 `2d6005c`.
- Probe integrado: 18/18. idleRouteLabels 1, zoomLabelCoverage 1, orientationGapPx 32, headerAccentText 0, dantianGapPx 9, marca móvil sin elipsis, peek con 足三里.

## W3
- Q1: scripts `fonts` y `trace`, job CI `probe`, asserts e2e de V04 V11 V21 V24, foco del CTA en tinta, rueda sobre la ventana.
- D03: el zoom acumula. D04: minimapa de 20×40 en la barra móvil; rótulos de proximidad medidos a `12 × k` y sujetos a la ventana.
- typecheck 0, test 89/89, build 0, budget dist 4 560 575 / JS gzip 102 752 / CSS gzip 11 800.
- e2e ×3 en verde (17 passed, 2 skipped) después del arreglo de rótulos.
- Q2: `probe-after.json` 18/18. 48 JPG en `shots/after`. A ojo: sin costura, sin mobiliario sobre el dibujo. En zoom 390 los rótulos de la muñeca comparten fila y no salen de la ventana.

## W4
- H1 PASS, promedio 9.08, cero vetos. H2 PASS, 16 × 2.
- Un bucle antes de la firma: el primer zoom móvil cortaba 合谷 y 后溪. T2 los devolvió a la ventana. Probe y e2e ×3 repetidos.
