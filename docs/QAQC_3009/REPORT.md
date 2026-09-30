# INFORME — QAQC 30.09

La rama `qa/qaqc-3009` deja el atlas usable sin mover la estampa del 30.09. Los gates G1–G8 quedan en verde sobre `index-CTIhc3pc.js`. No queda ningún S1 ni S2 abierto. Q08 y A1-10 siguen documentados. J1 y J2 firman en sus archivos.

## Métricas

| Gate | Base `7142b97` | Después `1cbd5b0` |
|---|---|---|
| G1 censo | 147 controles; dead 5, covered 23, small 10 | 214; los siete contadores en 0 |
| G2 health | 15/18 (consola, foco, toque) | 18/18 y 18/18 |
| G3 axe | 10 serious | 0 |
| G4 teclado y zoom | fugas de foco | A3 en verde |
| G5 tareas | sin corrida | U1–U12 dentro del tope |
| G6 estático | tsc 0, audit 0, knip justificado | igual, vitest 105 |
| G7 suite | 89 tests | typecheck, 105 tests, build, budget, e2e ×3, sonda 18/18 |
| G8 capturas | — | 48 JPG; cada diff tiene ticket |
| G9 producción | `index-DycVfQG7.js` | `index-CTIhc3pc.js`, health 18/18, censo de inicio y ficha 146 sin hallazgos |

Budget: JS gzip 106332, CSS gzip 11887, dist 4573658. Por debajo de 130 KB, 14 KB y 8 MB.

## Tickets

Cerrados S1: Q01, Q02, A1-01, A1-02, A1-03, A1-04.
Cerrados S2: Q05, A1-05…A1-09, UX-01.
Resueltos por el 30.09: Q03, Q04, Q06, Q07.
Documentados S3: Q08 (heap bajo el 20 %), A1-10 (exports de dominio y claves i18n sin uso).
Abiertos: ninguno.

## Tareas

U1–U12 quedan dentro del tope en escritorio y en móvil. El e2e de tareas pasó en los dos viewports. Heurísticas de J1: mínimo 4. Nota de J1: 94. Cero callejones.

## Riesgos

El heap de la segunda health sube un 10,6 % y el gate es 20 %. La hora del reloj cambia con el reloj de pared (D17), así que dos capturas del mismo estado no son idénticas. Knip no está en el proyecto: la corrida con `npx knip@5` no encontró archivos ni dependencias muertas.

## Firmas

Ver `SIGN_OFF.md`.
