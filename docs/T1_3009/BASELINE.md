# Baseline T1 30.09

Base: `main` @ `3e29ca2`, rama `feat/t1-3009`.
Checks: `npm ci` 0, typecheck 0, test 69/69, build 0.
Sondeo: `docs/T1_3009/probe-before.json` sobre `http://127.0.0.1:4173/`.
Capturas: 48 JPG en `docs/T1_3009/shots/before`.

El diagnóstico del prompt esperaba 16 FAIL. Esta máquina dio **14 FAIL y 4 PASS**. Los dos gates de hanzi pasan en local porque Chromium resuelve «Noto Serif SC ExtraLight» del sistema. El build no sirve esa familia: Vite 8 sigue quitando el `<link>` de Google Fonts. Detalle en `DECISIONES.md`.

| Gate | Medido | Meta | |
|---|---|---|---|
| `hanziFontPlate` | Outfit Thin SemiBold + Noto Serif SC ExtraLight | Noto Serif SC (CDP) | PASS local, falso en esta máquina |
| `hanziFontFolio` | Cormorant Garamond Light Medium + Noto Serif SC ExtraLight | Noto Serif SC (CDP) | PASS local, falso en esta máquina |
| `seamDelta` | 1.5 | ≤ 1 | FAIL |
| `overlapBody` | 105 151 px² | 0 | FAIL |
| `overlapZoom4` | 111 515 px² | 0 | FAIL |
| `overlapST36` | 111 515 px² | 0 | FAIL |
| `overlapDantian` | 111 515 px² | 0 | FAIL |
| `figureShareDesktop` | 0.74 | ≥ 0.70 | PASS |
| `figureShareMobile` | 0.51 | ≥ 0.62 | FAIL |
| `idleRouteLabels` | 23 | ≤ 2 | FAIL |
| `zoomLabelCoverage` | 0 | 1 | FAIL |
| `orientationGapPx` | 559 | ≤ 96 | FAIL |
| `headerAccentText` | 3 | 0 | FAIL |
| `headFootDelta` | 26.4 | ≤ 3 | FAIL |
| `smallText` | 0 | 0 | PASS |
| `dantianGapPx` | 1 | ≥ 6 | FAIL |
| `mobileBrandTruncated` | true | false | FAIL |
| `sheetPeekShowsHanzi` | false | true | FAIL |

## V01–V24

- V01 Hanzi sin webfont en el build. F1.
- V02 Franja fantasma bajo el título (seamDelta 1.5). F2.
- V03 Sin plancha ni margen. F2.
- V04 Mobiliario sobre el dibujo (clave, reloj, zoom, colofón, minimapa). F2.
- V05 Cabecera y pie con Δ26.4. F2.
- V06 Figura de maniquí naranja, sin duotono. F3.
- V07 Contorno por filtro, engorda con el zoom. F3.
- V08 23 rótulos de ruta en reposo. T1.
- V09 Dantian a 1 px de los puntos. T2.
- V10 D/I a 559 px de la figura. T2.
- V11 Sin rótulos con zoom > 1.6. T2.
- V12 Máscara regional corta la cara y el pie. F3.
- V13 Folio repetido y subtítulo idéntico en todas las láminas. F2.
- V14 Clusters en desktop. T2.
- V15 Figura móvil al 51 % de la altura. U4.
- V16 Tres textos cinabrio en la cabecera. U1.
- V17 Reloj de sectores rellenos. U2.
- V18 Clave en caja y bilingüe. F2.
- V19 Zoom en cajas sobre el dibujo. F2.
- V20 Cerrar de la ficha abajo. U3.
- V21 Peek de ST36 sin hanzi. U3.
- V22 Marca truncada en móvil. U1.
- V23 Índice truncado y filtros partidos. U4.
- V24 Foco del CTA en rojo sobre rojo. U4.
