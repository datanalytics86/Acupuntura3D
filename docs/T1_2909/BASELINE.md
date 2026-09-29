# Baseline T1 29.09

Base: `main` @ `d938da3` (29-09-2026). Rama de trabajo: `feat/t1-2909`.

## Medición

| Comando | Resultado | Tiempo de reloj |
|---|---|---|
| `npm ci` | 71 paquetes, 0 vulnerabilidades | ~2 s (caché local) |
| `npm run typecheck` | 0 | 10.5 s |
| `npm test` | 29 passed (5 archivos) | 13.5 s (vitest 4.19 s) |
| `npm run build` | 0 | 7.1 s |

`dist` = 4 180 675 bytes (3.99 MB). JS `index-CMkVeLew.js` 267.13 KB, gzip 82.87 KB. CSS `index-BE32HhI_.css` 32.30 KB, gzip 6.77 KB.

Tests: smoke 11, controls 11, skin 4, labels 1, schema 2.

Capturas antes: `docs/T1_2909/shots/before/` (4 viewports × 12 estados). `@playwright/test` 1.63.0.

## Defectos (D01–D29)

- [ ] D01 Todo se dibuja en unidades del viewBox. A zoom 1 en 1440×900, 1 u ≈ 0.43 px: meridiano ≈ 0.55 px, punto ≈ 1 px, hit ≈ 14 px, rótulo de dantian ≈ 5.6 px.
- [ ] D02 Rectángulos fantasma: el papel y el grano no cubren el rectángulo visible del `meet`.
- [ ] D03 La rueda hace zoom al centro, no al cursor. No hay +/−/0. `preventDefault` en un listener pasivo.
- [ ] D04 Buscar, región o dantian mueven la cámara de golpe.
- [ ] D05 El doble clic resetea y nada lo indica.
- [ ] D06 5.6 % de muestras (91/1632) a más de 4 u de la piel. TE anterior hasta 54 u. HT7 a 16.8 u de su trazo.
- [ ] D07 Posterior solo tiene trazo para SI, BL, KI, GB y GV.
- [ ] D08 Los 14 meridianos en reposo son la misma tinta. `activeMeridianId` arranca en ST. Los `color` de `meridians.json` son Tailwind saturados.
- [ ] D09 El Qi son cuentas en JS por frame. En pausa no se lee el sentido.
- [ ] D10 A zoom 1 no hay rótulos.
- [ ] D11 Guías cruzadas en Mano. EX-HN3 y GV20 se pisan. El sello tapa EX-HN3.
- [ ] D12 Cifras old-style de Cormorant en los códigos.
- [ ] D13 La lámina es mucho más ancha que la figura: papel muerto.
- [ ] D14 Mano muestra pelvis. Rostro sale de la piel. Pie sigue más allá de los dedos. El título «Mano — dorso» es falso.
- [ ] D15 La pista «Elige un punto…» pisa sombra y crédito.
- [ ] D16 La sombra de contacto es una elipse plana.
- [ ] D17 `--font-hanzi` es Cormorant. Noto Serif SC se descarga y no se usa.
- [ ] D18 Hay 15 textos de 9–10 px.
- [ ] D19 La ficha duplica «Uso tradicional educativo».
- [ ] D20 La barra no tiene jerarquía. En 390 px ocupa 180 px.
- [ ] D21 Paneles absolutos. En móvil la ficha tapa la lámina. No hay bottom sheet.
- [ ] D22 Foco programático con doble marco cinabrio.
- [ ] D23 El reloj se recorta en móvil y el aviso pisa «Pausar Qi».
- [ ] D24 La búsqueda filtra el índice. «dantian medio» no lista resultados.
- [ ] D25 El pie muestra atajos crípticos en vez de ayuda.
- [ ] D26 El hilo del índice usa los colores Tailwind de D08.
- [ ] D27 Cada vista pesa 1.6 MB y la otra no se precarga.
- [ ] D28 `anchorsToPath` se recalcula en cada render.
- [ ] D29 El CSS propio sin `@layer` le gana a las utilidades de Tailwind.

## Lo que no se rompe

Paleta papel/tinta/cinabrio, Paper Cabinet sin pills, Goran con alpha, 20 puntos sobre la piel, regiones 1–4, ficha con precauciones, aviso legal, 29 tests.
