# Sign-off T1 29.09

| ID | STATUS | CLOSES | CHECKS | NOTE |
|---|---|---|---|---|
| A1 | PASS | D12 D17 D18 D22 D29 | typecheck=0 test=0 (34 en su rama) build=0 | 5642896. Pigmentos ≥3.31:1 sobre piel y ≥8.40:1 sobre papel. |
| A2 | PASS | D01 D02 D03 D04 D05 | typecheck=0 test=0 (34 en su rama) build=0 | abc46a5. flyTo clamp 6. ZoomControls sin montar: lo monta B1. |
| A3 | PASS | D06 D07 | typecheck=0 test=0 (33 en su rama) build=0 | 5116a3c. Offskin 91/1525 máx 55 u y 23/444 máx 19 u → 0/1664 y 0/902, máx 3 u. HT7 16.8 → 0. |
| B1 | PASS | D02 D13 D14 D15 D16 D25 D27 | typecheck=0 test=0 (43) build=0 | 61aabbd. Máscara regional y mobiliario. |
| B2 | PASS | D08 D09 D28 | typecheck=0 test=0 (43) build=0 | 1c4bc19. Cometa CSS, trazo 1.25k / 2.25k. |
| B3 | PASS | D01 D10 D11 | typecheck=0 test=0 (46) build=0 | 20fbaf8. Callouts 15 / 6, null en 350×500. |
| C1 | PASS | D20 D24 | typecheck=0 test=0 (53) build=0 | 642f8ed. Paleta y index-toggle. |
| C2 | PASS | D19 D21 D22 | typecheck=0 test=0 (51) build=0 | 409a57d. Sheet peek/half/full. |
| C3 | PASS | D21 D23 D25 | typecheck=0 test=0 (43) build=0 | 8b9003c. Grilla y portada. AtlasRoot final es el de B1. |
| C4 | PASS | D23 D24 D26 | typecheck=0 test=0 (45) build=0 | 0a66f2b. sectorAngle 45 y 105. |
| Q1 | PASS | T10 | typecheck=0 test=0 (66 en su rama) build=0 budget=0 | f56f090. Job e2e después de build. JS gzip 98050, CSS gzip 10140, dist 4437325. El spec lo escribe Q3. |
| Q2 | PASS | | typecheck=0 test=0 (68) | 6f0ea19. Paridad es/en, aria-live «ST36 Zúsānlǐ seleccionado», alias CSS borrados. Axe lo corre Q3. |
| Q3 | PASS | T1 T3 T5 T7 T8 T9 T10 | typecheck=0 test=0 (68) build=0 e2e×3 budget=0 | E2E 10 passed, 1 skipped (franjas solo en 1440). Axe 0 serious/critical. Reduced: cometa ausente. 48 JPG. dist 4438779, JS gzip 98346, CSS gzip 10260. |
| Q4 | PASS | D28 | typecheck=0 test=0 (66 en su rama) build=0 | 45f7fe3. Figure y MeridianPaths en memo; no leen atlasPan. Sin webp ni observer de long tasks. |
| H1 | PASS | | promedio 8.75, mínimo 8, 0 vetos | docs/T1_2909/H1.md. GV20 ya no corta el título. |
| H2 | PASS | | 12 × 2 | docs/T1_2909/H2.md. En 390 los rótulos de margen quedan en hover, como §3.3. |

## T1–T10

| ID | Estado | Evidencia |
|---|---|---|
| T1 | PASS | Marca ST36 12 ± 1.5 px a zoom 1 y 4. Trazo 1.25k. Capturas d1440-01 y m390-01. |
| T2 | PASS | Callouts 15 anterior / 6 posterior en 1440. Solape de textos 0 en la medición del preview. En 390, hover. |
| T3 | PASS | e2e `expectMarkPx` a zoom 1 y tras cuatro «+». |
| T4 | PASS | A3: offskin 91/1525 y 23/444 → 0/1664 y 0/902, máx. 3 u. HT7 16.8 → 0. El test sigue en verde. |
| T5 | PASS | `document.fonts.check("16px 'Noto Serif SC'", "足三里")`. Grep de textos < 11 px en 0. |
| T6 | PASS | tokens.test. Pigmentos ≥ 3.31:1 sobre piel y ≥ 8.40:1 sobre papel (A1). |
| T7 | PASS | flyTo 420 ms. e2e reduced: 0 `.qi-comet`, reloj en pausa. |
| T8 | PASS | Cabecera móvil ≤ 104 px. Sheet peek/half/full. Targets de botón 44 px. |
| T9 | PASS | Axe 0 serious/critical en portada, anterior, ficha y paleta. Tab → Enter → Esc devuelve el foco al punto. |
| T10 | PASS | typecheck, 68 tests, build, e2e × 3, budget. CI con jobs build y e2e. |

## D01–D29

Cerrados en la rama: D01 escala en px, D02 papel sin rectángulo fantasma, D03 zoom al cursor y +/−/0, D04 cámara que vuela, D05 doble clic con minimapa, D06 piel, D07 posterior con sus trazos, D08 pigmentos, D09 cometa CSS, D10 rótulos, D11 cruces en mano, D12 cifras lining, D13 lámina, D14 foco regional, D15 subtítulo, D16 sombra, D17 Noto Serif SC, D18 nada bajo 11 px, D19 ficha sin duplicar, D20 cabecera, D21 sheet, D22 foco, D23 reloj, D24 paleta, D25 ayuda, D26 índice, D27 precarga de la otra vista, D28 memo, D29 CSS en `@layer`.

## Fuera de este corte

- Los 361 puntos. Sigue el seed de 20.
- WebP de las láminas y el observer de long tasks de Q4. El memo de Figure y MeridianPaths sí está.
- Rótulos de margen en 390. La lámina estrecha los enseña al hover o al seleccionar.

