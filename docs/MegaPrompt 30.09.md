# MegaPrompt 30.09 — Estampa de museo: fondo, forma y estética Tier 1 (Grok 4.7 · multiagente · sin detenerse)

**Para:** Grok 4.7 en Grok Build / Grok Terminal (modo agente, con escritura, git y red para `npm`).
**Repo:** `datanalytics86/Acupuntura3D` · **base medida:** `main` @ `3e29ca2` (30-09-2026, ya incluye el MegaPrompt 29.09 ejecutado y mergeado en https://github.com/datanalytics86/Acupuntura3D/pull/10).
**Resultado:** rama `feat/t1-3009`, PR a `main` y, si todos los gates pasan, merge y verificación en producción (ver `MERGE_A_MAIN` abajo).

## Qué cambia respecto del 29.09

El 29.09 arregló la física de la lámina: escala en píxeles, cámara, pigmentos, rótulos de margen, ficha, paleta y reloj. Su propio juez se puso 8.75/10. Esta revisión independiente de `main` (48 capturas y un sondeo con métricas) muestra que **no es Tier 1 todavía**: `main` falla **16 de 18 gates objetivos**. Lo más grave:

1. **Los hanzi nunca usan Noto Serif SC, ni siquiera en producción.** Vite 8 borra del build el `<link>` de Google Fonts (multilínea, con `href` antes de `rel`). `dist/index.html` y acupuntura3d.vercel.app no lo tienen, así que los 67 hanzi caen en fuentes del sistema (WenQuanYi, SimSun, PingFang). El e2e lo dio por bueno porque `document.fonts.check()` devuelve `true` cuando no existe ninguna FontFace de esa familia.
2. **Fondo:** el mobiliario (clave, reloj, zoom, minimapa, colofón) flota **sobre** el dibujo. Hay 105 151 px² de solape a zoom 1 y 111 515 px² al acercarse: el título se imprime sobre los dedos y el pie legal sobre las manos. Además hay una franja fantasma bajo el título (Δ1.5) y la cabecera y el pie difieren 26 niveles de tono.
3. **Forma:** la figura sigue leyendo como «maniquí 3D de wiki» (piel naranja aerografiada) y su contorno engorda con el zoom. Hay 23 rótulos de ruta y chevrones encendidos en reposo, así que se ve un cableado. Rostro corta la cara por la mitad (la elipse de foco sale de los puntos, que en la cara están todos en x = 400, y mide 23 u de ancho). Al acercarse, los puntos pierden el nombre. Las letras D/I quedan a 559 px de la figura.
4. **Estética:** tres acentos cinabrio a la vez en la cabecera, un reloj que parece gráfico de torta pastel, una clave en caja bilingüe, controles en cajas, la marca truncada en móvil, un peek del sheet sin hanzi y la figura en móvil ocupando solo el 51 % de la altura.

## Cómo usarlo

1. Abre el repo en Grok 4.7 con permisos de escritura, git y red.
2. **Decide `MERGE_A_MAIN`** (primera línea del bloque). Viene en `sí`: Grok mergea y verifica producción solo si pasan todos los gates, y revierte solo si producción falla. Si prefieres revisar la preview antes, cámbialo a `no`.
3. Dáselo de una de estas dos formas:
   - **Opción A:** copia todo lo que va entre `=== PEGAR DESDE AQUÍ ===` y `=== FIN ===`.
   - **Opción B (recomendada, el bloque pesa ~100 KB):** pega solo esto:

     ```
     Ejecuta el MegaPrompt 30.09 sin detenerte. Léelo completo con:
     git fetch origin && git show "origin/main:docs/MegaPrompt 30.09.md"
     (si todavía no está en main, usa origin/claude/cool-allen-v4o0gq en lugar de origin/main).
     Sigue todo lo que va entre "=== PEGAR DESDE AQUÍ ===" y "=== FIN ===". MERGE_A_MAIN = sí.
     Ese bloque es tu aprobación: no preguntes y no entres en Plan mode.
     ```
4. Si Grok se corta, pega: `Continúa el MegaPrompt 30.09 desde la última firma en docs/T1_3009/SIGN_OFF.md. No repitas oleadas cerradas.`

## De dónde sale (evidencia)

- **Capturas:** 48 capturas de `main` @ `3e29ca2` (1440, 1280, 768 y 390 × 12 estados).
- **Sondeo:** `scripts/probe-plate.mjs` (§8.1) mide 18 gates en Chromium: fuentes de plataforma por CDP, costuras por píxel, solape entre mobiliario y ventana de dibujo, proporción de la figura, rótulos, acentos y móvil. Hoy da 16 FAIL sobre `main`.
- **Prototipos:** se probaron el duotono sepia con contorno vectorial, el encuadre por anatomía y el subconjunto de Noto Serif SC auto-alojado. Con fuente y tinta, el prototipo pasa de 16 a 13 FAIL y los hanzi pasan a renderizar en «Noto Serif SC Medium». El resto se resuelve con la plancha.
- **Código de referencia (§8):** compila con TypeScript strict y sus tests están en verde: fuentes 3/3, silueta 2/2 y anatomía regional 3/3.

---

=== PEGAR DESDE AQUÍ ===

MERGE_A_MAIN = sí

# MegaPrompt 30.09 — Acupuntura3D · Estampa de museo · enjambre Grok 4.7 · sin detenerse

## 0. Identidad, autoridad y modo

Eres **Grok 4.7** (Grok Build / Grok Terminal) y actúas como **OX, el orquestador** de un enjambre de 13 agentes hijos.
Repo `datanalytics86/Acupuntura3D`. Base: `main` @ `3e29ca2` o más nueva.

- **Este bloque ES la aprobación.** No entres en Plan mode, no pidas confirmación y no le preguntes nada al humano. Ante una ambigüedad aplica §0.3 y anótala en `docs/T1_3009/DECISIONES.md`.
- **No te detengas.** Encadena W0 → W5 sin esperar respuesta. Después de cada oleada anota como máximo 5 líneas en `docs/T1_3009/LOG.md` y sigue. Termina solo cuando se cumple §10 (entrega) o se agotan 3 bucles de corrección, y en ese caso entrega el estado honesto.
- Razonamiento al máximo. **Código completo y final:** nada de `TODO`, `FIXME`, stubs, funciones vacías, `any`, `as unknown as`, `@ts-ignore`, `@ts-expect-error` ni `eslint-disable`.
- Idioma: docs en español; identificadores y comentarios de código en inglés.

### 0.1 Git

```bash
git fetch origin && git checkout main && git pull --ff-only
git checkout -b feat/t1-3009
mkdir -p docs/T1_3009/shots/before docs/T1_3009/shots/after
```

Commits atómicos convencionales. Push a `origin feat/t1-3009` y PR a `main` titulada **«feat: estampa de museo — fondo, forma y estética T1 (MegaPrompt 30.09)»**. Nada de force-push ni de reescribir `main`. El merge solo ocurre en W5 y solo si `MERGE_A_MAIN = sí` y §9 está entero en verde.

### 0.2 Invariantes (romper uno = FAIL automático)

1. **Atlas 2D en `<svg>`.** Sin `three`, `@react-three/*`, `<canvas>` WebGL ni Canvas para la lámina. `npm run dev` abre el atlas.
2. **Solo los 20 puntos del seed.** No se inventan puntos, coordenadas de puntos ni hanzi. Los puntos no se mueven: si un trazo o un sello no calza, se mueve el trazo o el sello.
3. **Goran tek-en, CC BY-SA 4.0,** sigue siendo la figura. `public/atlas/ATTRIBUTION.md` suma cada cambio de composite y conserva sus frases exigidas por test. Noto Serif SC es **SIL OFL 1.1**: agrega su licencia y atribución (§3.7). Nada de copiar láminas comerciales (Encarta, Netter, Deadman, DK, Kenhub, Visible Body, Complete Anatomy).
4. **Nada de claims clínicos.** El aviso legal queda visible siempre.
5. Sin backend, sin secretos, sin variables de entorno. Stack fijo: Vite 8 + React 19.2.x (pin) + TS strict + Tailwind 4 + Zustand 5.
6. **Datos intocables:** 14 meridianos en orden OMS; **CV12 = 中脘**; ST36 = 足三里; LI4 y SP6 con precaución de embarazo; `unmapped.json = []`; landmarks 800×1600 (vértice 40, planta 1480, línea media 400).
7. **No regresar el 29.09.** D01–D29 siguen cerrados (escala en px × k, papel sin rectángulos fantasma, cámara que vuela, meridianos sobre la piel, pigmentos, cometa CSS, rótulos de margen, `@layer` en todo CSS propio, etc.) y los 69 tests actuales siguen en verde.
8. **Strings y contratos bloqueados por tests:** `Figure.tsx` referencia `body-anterior.png` y `body-posterior.png` y no contiene `fingerD(`, `capsuleD(`, `ellipseD(`, `encSkin`, `@react-three` ni `<Canvas`. `PlateTitle.tsx` contiene «Cuerpo humano — vista anterior». `Points2D.tsx` exporta `layoutCallouts` y `CalloutSeed`. Los previews SVG referencian sus PNG. El aviso usa `acu3d.disclaimer.v1`, `#legal-gate` y Enter/Esc. Siguen existiendo `setAtlasView`, `setAtlasRegion`, `setLocale`, `toggleLayer`, `showPoint`, `focusCenter` y `setSelected`, síncronos. Se mantienen los `data-testid` del 29.09. Si un test viejo choca con este prompt (por ejemplo `tests/regionFrames.test.ts`), actualízalo **conservando la garantía** que prueba y anótalo en DECISIONES.

### 0.3 Regla de desempate

La lámina impresa > el widget. Lo medido por `probe-plate` > la opinión. Menos elementos visibles > más elementos. El acento cinabrio solo marca estado o foco. Si dudas entre dos opciones, elige la que un grabador del siglo XIX reconocería como suya.

---

## 1. Misión y definición de terminado

**Misión:** convertir la lámina en una **estampa de museo**. Tres ejes:

- **FONDO — la plancha y el papel.** El dibujo vive dentro de una **ventana de plancha** recortada, con la huella de la plancha calcográfica. Todo el mobiliario va en los márgenes del papel y nunca sobre el dibujo. Un solo grano por superficie y ninguna costura.
- **FORMA — la figura y su jerarquía.** La figura es una **lámina a dos tintas**: duotono sepia más contorno vectorial de tinta de 1.1 px constante. Los meridianos tienen jerarquía cartográfica (el reposo es quieto y lo activo habla). Las regiones se encuadran por anatomía, no por puntos. Los rótulos existen a cualquier zoom.
- **ESTÉTICA — el mobiliario y el chrome.** Una cabecera con jerarquía y un solo acento. Un reloj grabado. Una clave sin caja. Controles de filete. Ficha y sheet editoriales. Un móvil donde la figura manda.

**Terminado** = los 18 gates de `scripts/probe-plate.mjs` en PASS en 1440 y 390, más typecheck, test, build, e2e ×3 y budget en 0, más H1 y H2 en PASS (§9).

---

## 2. Diagnóstico medido 30.09 — V01…V24 (no se debate: se corrige)

Sondeo sobre `main` @ `3e29ca2` (`docs/T1_3009/probe-before.json` lo regenera OX en W0):

| Gate | `main` hoy | Meta |
|---|---|---|
| `hanziFontPlate` | Outfit Thin SemiBold + WenQuanYi Zen Hei ❌ | Noto Serif SC (CDP) |
| `hanziFontFolio` | Cormorant Garamond Light Medium + WenQuanYi Zen Hei ❌ | Noto Serif SC (CDP) |
| `seamDelta` | 1.5 ❌ | ≤ 1 |
| `overlapBody` | 105 151 px² ❌ | 0 px² |
| `overlapZoom4` | 111 515 px² ❌ | 0 px² |
| `overlapST36` | 111 515 px² ❌ | 0 px² |
| `overlapDantian` | 111 515 px² ❌ | 0 px² |
| `figureShareDesktop` | 0.74 ✅ | ≥ 0.70 |
| `figureShareMobile` | 0.51 ❌ | ≥ 0.62 |
| `idleRouteLabels` | 23 ❌ | ≤ 2 |
| `zoomLabelCoverage` | 0 ❌ | 1 |
| `orientationGapPx` | 559 ❌ | ≤ 96 px |
| `headerAccentText` | 3 ❌ | 0 |
| `headFootDelta` | 26.4 ❌ | ≤ 3 |
| `smallText` | 0 ✅ | 0 |
| `dantianGapPx` | 1 ❌ | ≥ 6 px |
| `mobileBrandTruncated` | true ❌ | false |
| `sheetPeekShowsHanzi` | false ❌ | true |

**Crítico**
- **V01 · Hanzi sin su fuente, también en producción.** El build de Vite 8 descarta el `<link>` multilínea de Google Fonts de `index.html` (con `rel` primero y en una sola línea sobrevive, pero depender de un tercero no es T1). Los 67 hanzi del atlas se pintan con WenQuanYi, SimSun o PingFang según el sistema. El e2e T5 (`document.fonts.check`) es un falso positivo. **Arreglo:** auto-alojar un subconjunto de Noto Serif SC 500/600 (≈12.8 KB por peso) con Vite (URL con hash, caché inmutable), borrar el link externo y los `preconnect`, y dejar la CSP en `font-src 'self'` (§8.2).

**Fondo**
- **V02 · Franja fantasma bajo el título.** La banda del título es (248,244,235) y el área del SVG (250,246,237): Δ1.5 en todo el ancho, en y ≈ 128. Hay dos capas de grano (`main.paper-grain` + overlay) más el rect de papel del SVG. **Arreglo:** una sola fuente de grano por superficie y el papel pintado por un solo elemento.
- **V03 · La hoja dejó de ser objeto.** La lámina es papel a sangre de borde a borde, sin plancha, sin margen y sin huella. **Arreglo:** ventana de plancha con huella calcográfica (§3.1).
- **V04 · El mobiliario flota sobre el dibujo.** Clave 73 017 px², reloj 17 424, colofón 8 550, zoom 6 160 y minimapa 6 364 dentro del área de dibujo. Con zoom, el título se imprime sobre los dedos (ST36) y el pie legal sobre las manos (dantian). **Arreglo:** el dibujo se recorta a la ventana y el mobiliario vive en los márgenes. Gate: `overlap* = 0`.
- **V05 · Cabecera y pie de distinto tono.** Hay Δ26 niveles en pantalla por la viñeta del escritorio que oscurece el pie. **Arreglo:** barras planas del mismo `--color-desk` y la viñeta solo en el papel exterior, nunca en las barras.

**Forma**
- **V06 · La figura es un maniquí 3D de wiki.** Piel naranja uniforme (#CFA27A), aerógrafo, sin tinta. **Arreglo:** duotono sepia de 7 tonos (§3.2, validado) y fuera los washes elípticos.
- **V07 · El contorno de silueta es un filtro `feMorphology`.** Engorda con el zoom (≈ 4 px a ×4) y se ve borroso. **Arreglo:** contorno vectorial trazado del alfa (§8.3) con `strokeWidth = 1.1 * k`.
- **V08 · Cableado.** En reposo hay casing de 3.5 px en todos los trazos, chevrones cada 140 px en todos y 23 rótulos de ruta visibles («HT PC LU» apilados en los hombros, «LR KI» en los pies, «SI TE» en las manos). **Arreglo:** jerarquía de tinta (§3.3). Gate: `idleRouteLabels ≤ 2`.
- **V09 · Los dantian compiten con los puntos.** Hay sellos de 26 px con rótulo a zoom 1; 上丹田 pisa EX-HN3, 中丹田 se pega a CV17 y el rótulo de 下丹田 flota en el antebrazo en móvil. Gate: `dantianGapPx ≥ 6` (hoy 1).
- **V10 · Orientación D/I huérfana.** Las letras están en los bordes de la lámina, a 559 px de la figura; en la posterior la «D» queda bajo el botón «+». Gate: `orientationGapPx ≤ 96`.
- **V11 · Sin rótulos al acercarse.** Con zoom > 1.6 no hay ni un rótulo (`zoomLabelCoverage = 0`).
- **V12 · La máscara regional corta la anatomía.** `REGION_FOCUS` sale de la caja de los **puntos estrella**. En la cara todos están en x = 400, así que la elipse sólida mide ≈ 23 u de ancho: la mitad de la cara queda lavada con un borde vertical y el cuello aparece como una columna. En Pie se corta el pie izquierdo. **Arreglo:** `REGION_ANATOMY` medida del alfa + `fitRegion` + `focusEllipse` (§8.4, validado).
- **V13 · Las regiones repiten el mobiliario del cuerpo.** El subtítulo «Catorce meridianos · veinte puntos…» es igual en todas y el folio sale dos veces («LÁM. III» arriba a la izquierda y otra vez en el título).
- **V14 · Clusters en desktop.** En 1440 las manos muestran badges «4» y «2» aunque existen rótulos de margen: el rótulo apunta a un número, no a un punto.
- **V15 · La figura ocupa el 51 % de la altura en móvil** (meta ≥ 62 %).

**Estética**
- **V16 · Cabecera.** El orden es marca | utilidades | vistas y regiones al extremo derecho; vista y región van sin separación; hay **3 textos cinabrio** a la vez (Anterior, Cuerpo, ES). Gate: `headerAccentText = 0`.
- **V17 · Reloj = gráfico de torta pastel.** Sectores al 18 %, play en un cuadrado rosado, velocidades en cajas de formulario.
- **V18 · Clave.** Va en caja con borde, en los dos idiomas a la vez («Madera Wood 木») y con la línea redundante «木 火 土 金 水 · 任督».
- **V19 · Zoom.** Tres cajas de 44 px apiladas sobre el dibujo.
- **V20 · Ficha.** El «×» de cerrar está **abajo** a la izquierda, y la columna de la ficha no se distingue de la lámina (mismo papel, sin filete).
- **V21 · Sheet móvil.** El peek muestra «ST36 ■» sin hanzi (`sheetPeekShowsHanzi = false`) y la barra de acciones roza el aviso legal.
- **V22 · Marca truncada en móvil.** Se lee «Enciclopedia del …» (`mobileBrandTruncated = true`), y título + subtítulo suman 3–4 líneas.
- **V23 · Índice.** Los filtros de elemento se parten en dos filas con hueco y los nombres se truncan («Intestino Del…», «手太阳小…»).
- **V24 · Portada.** El CTA cinabrio con foco muestra un anillo cinabrio alrededor: rojo sobre rojo, doble marco.

**Lo que ya está bien y se queda:** papel y tinta, pigmentos minerales, cometa CSS, rótulos de margen sin cruces, paleta, ficha editorial, sheet con 3 alturas, reloj con lógica de horas, 69 tests y e2e.

---

## 3. Dirección de arte 30.09 — «Estampa de museo»

Referencia de nivel (no para copiar): una estampa calcográfica de atlas anatómico de los siglos XIX–XX, con papel de algodón, la huella de la plancha, una figura a dos tintas, rótulos en columna y el pie de estampa impreso **fuera** de la plancha. Encima, la precisión de un producto actual.

### 3.1 FONDO — la plancha (dueño: F2)

**Geometría** (la celda `plate` de la grilla de App se divide en márgenes y ventana):

```
┌──────────────────────────── papel exterior (--color-paper-outer) ────────────────────────────┐
│ LÁM. I            Cuerpo humano — vista anterior                               [minimapa]     │  ← banda título  --m-top
│                   Quince puntos estrella en esta lámina                                        │
│ ┌──────────────┬──────────────── VENTANA DE PLANCHA (recorta el SVG) ───────────┬──────────┐ │
│ │ margen izq.  │  huella: filete 1 px + luz interior 1 px + sombra interior      │ margen   │ │
│ │              │                                                                  │ der.     │ │
│ │  reloj 24 h  │        rótulos ·──┐        figura        ┌──· rótulos           │ ⊕ ⊖ ⟲    │ │
│ │  ½× 1× 2× 4× │                   D                      I                      │ CLAVE    │ │
│ └──────────────┴──────────────────────────────────────────────────────────────────┴──────────┘ │
│              Figura: Goran tek-en · CC BY-SA 4.0 · adaptada · Nomenclatura OMS                │  ← banda pie  --m-bottom
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Ancho de la celda `plate` | `--m-top` | `--m-bottom` | `--m-side` | Mobiliario |
|---|---|---|---|---|
| ≥ 1100 px | 72 px | 36 px | `clamp(132px, 12.8vw, 184px)` | reloj en el margen izquierdo, zoom + clave en el derecho, minimapa arriba a la derecha |
| 768–1099 px | 64 px | 36 px | 96 px | reloj de 96 px, clave plegada en un botón «Clave» (popover) |
| < 768 px | 44 px | 56 px | 8 px | título de 1 línea; barra inferior: chip del reloj · «Clave» · ⟲. Sin +/− (pinch). Colofón dentro de Ayuda |

**Huella de plancha** (`.plate-window::after`, por encima del SVG, `pointer-events: none`):

```css
box-shadow:
  inset 0 0 0 1px rgba(28, 25, 21, 0.22),      /* filete de la plancha */
  inset 0 0 0 2px rgba(255, 255, 255, 0.55),   /* luz del bisel */
  inset 0 2px 7px rgba(28, 25, 21, 0.07);      /* presión del tórculo */
```

**Papel:**
- `--color-paper-outer: #F4EDDF` en el papel de márgenes, con `.paper-grain` al 5 %.
- `--color-paper: #FBF7EE` dentro de la ventana, con grano al 2.5 %: la zona prensada es más lisa, como en una estampa real.
- **Una sola** capa de grano por superficie (V02). La viñeta cálida solo cae sobre el papel exterior; cabecera y pie son `--color-desk` plano (V05).

**Ventana:** `data-testid="plate-window"`, `position: relative; overflow: hidden`. El `<svg>` del Viewport la llena, así que su `ResizeObserver` mide **la ventana** y `plateBox`, `k` y los callouts se calculan sobre ella sin cambios de API. Queda prohibido volver a poner mobiliario dentro de la ventana, salvo las letras D/I y los rótulos del propio dibujo.

**Números esperados** (verificados a mano con la geometría): en 1440×900 la ventana mide ≈ 1072×709 y la figura ocupa ≈ 0.71 de la altura del viewport (gate ≥ 0.70). En 390×844 la ventana mide ≈ 374×612 y la figura ≈ 0.65 (gate ≥ 0.62). Con índice y ficha abiertos a la vez, si los rótulos de margen no caben, `layoutMarginCallouts` devuelve `null` y entran los rótulos de proximidad (§3.4).

**Banda de título:**
- Folio «LÁM. I» a la izquierda (11 px versalitas), **una sola vez**.
- Título centrado en Cormorant de 28 px (20 px en móvil, en una línea).
- Subtítulo **por lámina** en 13 px ink-2, con el número calculado de los datos visibles (nunca un número escrito a mano). Ejemplos: «Quince puntos estrella en esta lámina · toca uno para abrir su ficha», «Seis puntos de la mano y la muñeca». En móvil no hay subtítulo (V13, V22).

**Banda de pie:** el colofón centrado a 11 px ink-2.

### 3.2 FORMA — la figura a dos tintas (dueño: F3)

- **Duotono sepia** (probado en Chromium): **una sola** `<image>` con este filtro reemplaza a `fig-grade`, `fig-shade`, `fig-edge` y los washes:

  ```tsx
  <filter id="fig-duo" colorInterpolationFilters="sRGB">
    <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
    <feComponentTransfer>
      <feFuncR type="table" tableValues="0.23 0.45 0.66 0.80 0.89 0.95 0.985" />
      <feFuncG type="table" tableValues="0.15 0.31 0.50 0.65 0.78 0.87 0.94" />
      <feFuncB type="table" tableValues="0.10 0.21 0.37 0.51 0.65 0.77 0.86" />
    </feComponentTransfer>
  </filter>
  ```

  H1 puede elegir entre esta tabla («sepia») y una variante «cálida» (subir R en 0.02 y bajar B en 0.03 en los 4 tonos medios) comparando capturas. Condición: los pigmentos siguen ≥ 3:1 sobre la piel nueva. Agrega a `tests/tokens.test.ts` las muestras de piel del duotono medidas en captura sin trazos encima: luz de torso `#E2C8A9` y medio de brazo `#D5BC9E` (medidas en el prototipo; todos los pigmentos dan ≥ 4.9:1), más una sombra que mides tú (costado del torso o parte interna del muslo). El umbral de 3:1 no cambia.
- **Contorno vectorial:** `scripts/trace-silhouette.mts` (§8.3) genera `src/atlas/figure/silhouette.ts` (3 lazos por vista, ≈ 1 500 vértices, 38 KB, 14 KB gzip). Se dibuja con `<path d={SILHOUETTE[view]} fill="none" stroke="#3A2A1E" strokeOpacity={0.85} strokeWidth={1.1 * k} strokeLinejoin="round" />` dentro del `mask="url(#region-focus)"`. Carga el módulo con `import()` dinámico para no inflar el bundle inicial.
- **Plano púbico:** se queda (cubre el dibujo de la fuente), recoloreado a los tonos del duotono. Los dos trazos inguinales pasan a `#3A2A1E` al 35 %, con `strokeWidth = 0.9 * k`.
- **Sombra de contacto:** se queda (radial, zoom ≤ 1.3) en `#3A2A1E` al 10 %.
- **Regiones por anatomía (V12):** `src/atlas/regionAnatomy.ts` (§8.4). `REGION_ANATOMY` son cajas medidas del alfa (cara y cuello hasta GV14; mano y muñeca; ambos tobillos y pies hasta SP6). `fitRegion(region, view, plateBox)` calcula la cámara que muestra la caja entera **en la ventana** con un 12 % de aire, y reemplaza a los zooms fijos de `regionFrame`. `focusEllipse` es la elipse sólida que contiene las 4 esquinas; `PlateDefs` la usa y cae al 14 % fuera, con un fundido de al menos 120 px de pantalla. `inRegionFrame` pasa a usar la ventana visible, así que en Pie se ven las marcas de **ambos** pies.
- **Previews** `public/atlas/preview-*.svg`: regenerados con el duotono y el contorno (siguen referenciando el PNG). `ATTRIBUTION.md` suma «duotone grade, vector contour traced from the plate alpha».

### 3.3 FORMA — jerarquía de tinta (dueño: T1)

| Estado del trazo | Trazo | Opacidad | Casing de papel | Chevrones | Rótulo de ruta | Cometa |
|---|---|---|---|---|---|---|
| Reposo | 1.25 px | .70 | no | no | no | no |
| Hora del reloj | 1.5 px | .90 | 3 px, teñido 12 % | no | sí (1) | sí |
| Hover (lámina o índice) | 2 px | 1 | 4 px | sí | sí | no |
| Activo (elegido) | 2.25 px | 1 | 5 px | sí, cada 120 px | sí | sí |
| Atenuado (otro activo) | 1 px | .28 | no | no | no | no |
| En región de detalle, meridianos con puntos en la región | 1.75 px | .95 | 3 px | sí | sí | según estado |

Resultado: en reposo, cero rótulos de ruta salvo la hora (gate `idleRouteLabels ≤ 2`). Los rótulos de ruta evitan las marcas de puntos, los rótulos de margen y los sellos: si no hay lugar, no se dibujan.

### 3.4 FORMA — marcas, rótulos, dantian y orientación (dueño: T2)

- **Rótulos a cualquier zoom (V11):** con zoom ≤ 1.6 van los rótulos de margen (§8.3 del 29.09, ya en `callouts.ts`). Con zoom > 1.6 entran los **rótulos de proximidad** para cada punto dentro de la ventana, con `layoutCallouts` (el existente) y `data-testid="label-<CODE>"`. Gate: `zoomLabelCoverage = 1`.
- **Clusters (V14):** solo si `layoutMarginCallouts` devolvió `null` **y** `(pointer: coarse)`. En desktop con rótulos de margen cada punto se dibuja; si dos marcas quedan a menos de 10 px, la de atrás baja a r 4 px.
- **Dantian (V09):**
  - A zoom ≤ 1.6: sello de 14 px (anillo r 7 + punto r 1.5) en ink-2, **sin rótulo**. El rótulo aparece en hover, foco o selección.
  - Si el sello queda a menos de 6 px de una marca de punto, se desplaza 22 px de pantalla hacia el lado libre, con una guía punteada de 1 px a su ancla. El ancla no se mueve.
  - Con zoom > 1.6: sello de 22 px con rótulo, bajo las mismas reglas de distancia.
  - `data-testid="dantian-<lower|middle|upper>"`. Gate: `dantianGapPx ≥ 6`.
- **Orientación D/I (V10):** las letras van **dentro de la ventana**, a 24–40 px de la caja de la figura en pantalla, a la altura de las muñecas (y = 800 u), en Cormorant 16 px ink-2. Solo con región cuerpo y zoom ≤ 1.3. `data-testid="plate-side-left|right"`. Gate: `orientationGapPx ≤ 96`. La vista anterior pone la D (derecha del sujeto) a la izquierda del lector; la posterior, al revés.

### 3.5 ESTÉTICA — mobiliario (dueños: F2 y U2)

- **Clave (F2, V18):** sin caja. Filete superior de 1 px, título «CLAVE» en versalitas de 11 px, filas de 13 px **solo en el idioma activo** + hanzi del elemento (木 火 土 金 水, y 任督 para los vasos), en dos columnas en el margen derecho. Se borra la línea redundante. Muestras: yin/yang, punto, dantian y pulso de Qi. `data-testid="plate-key"`. Con ancho < 1100 se pliega en un botón «Clave» que abre un popover.
- **Zoom (F2, V19):** barra vertical en el margen derecho: filete de 1 px alrededor y 3 botones de 40×40 separados por filetes, iconos de tinta, sin fondo. `data-testid="plate-zoom"`. En móvil solo queda ⟲ en la barra inferior.
- **Minimapa (F2):** margen derecho, arriba, `data-testid="minimap"`. Se muestra con zoom > 1.25 o en región.
- **Reloj grabado (U2, V17):**
  - Anillo exterior de tinta de 1 px con 24 marcas de hora (las de 3 h más largas).
  - 12 sectores **sin relleno**. Solo el sector de la hora va relleno en el pigmento del meridiano al 85 %, con su código en papel.
  - Códigos en Outfit 600 de 11 px, dentro de cada sector. Aguja cinabrio de 1.5 px.
  - Centro: botón circular de 44 px con aro de tinta de 1 px y triángulo o pausa en tinta.
  - Debajo: «07:00–09:00 · ST Estómago» en 12 px, y la velocidad como texto «½× 1× 2× 4×» con el activo subrayado en cinabrio.
  - `data-testid="plate-clock"` en el contenedor y `clock-dial` / `clock-play` como hoy.

### 3.6 ESTÉTICA — chrome (dueños: U1, U3, U4)

- **Cabecera (U1, V16, V22):**
  - Orden: **marca | controles de lámina (centrados) | utilidades**.
  - Controles: segmentado `[Anterior | Posterior]`, un filete vertical de 1 px y las regiones `Cuerpo · Rostro · Mano · Pie`.
  - El activo va **en tinta** con subrayado cinabrio de 2 px. ES/EN activo en tinta 600 y el inactivo en ink-3. **Ningún texto cinabrio** (gate `headerAccentText = 0`).
  - Móvil: fila 1 = «针 Enciclopedia» (clave i18n `titleShort`, sin truncar) + ⌕ + ≡ + ES/EN; fila 2 = segmentado + regiones con scroll-x y fundido.
- **Ficha (U3, V20):** la columna folio va sobre `--color-paper-inset` con filete izquierdo de 1 px. El «×» va **arriba a la derecha**, a 44 px. Las acciones (← anterior · siguiente → · «Seguir el Qi») quedan en una barra fija al pie de la ficha, sobre un filete.
- **Sheet (U3, V21):** el peek (168 px) muestra hanzi de 40 px en Noto Serif SC + código + pinyin en itálica + nombre, visible y sin recorte (gate `sheetPeekShowsHanzi`). Las acciones van por encima de `.app-foot`, nunca pisadas.
- **Índice (U4, V23):** los filtros de elemento son una grilla de 5 columnas de «cuadrito + nombre». Cada meridiano ocupa 2 líneas: `ST  Estómago` y debajo `足阳明胃经 · 07–09 · 45`, sin truncar.
- **Portada (U4, V24):** foco del CTA = `outline: 2px solid var(--color-ink); outline-offset: 3px`. Nada de rojo sobre rojo.
- **Móvil (U4, V15):** barra inferior de 56 px con chip del reloj · «Clave» · ⟲, más el aviso legal. La figura ocupa ≥ 62 % de la altura (gate `figureShareMobile`).

### 3.7 ESTÉTICA — tipografía (dueño: F1)

- Noto Serif SC auto-alojada (§8.2): `src/assets/fonts/noto-serif-sc-{500,600}.woff2` + `src/app/fonts.css` importado **antes** de `index.css` en `main.tsx`.
- Se borran de `index.html` el link a Google Fonts y los dos `preconnect`. En `vercel.json` (CSP) se quitan `fonts.googleapis.com` y `fonts.gstatic.com`.
- Licencia: `src/assets/fonts/OFL.txt` (texto de la SIL Open Font License 1.1) y una línea en `README.md` → Licencias.
- **El e2e T5 se corrige.** Con `document.fonts.check` no alcanza. Usa:

  ```ts
  await expect.poll(() =>
    page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].some((f) => f.family.replace(/["']/g, "") === "Noto Serif SC" && f.status === "loaded");
    }),
  ).toBe(true);
  ```

  y además, por CDP, `CSS.getPlatformFontsForNode` sobre un `<tspan>` hanzi tiene que devolver «Noto Serif SC» (como hace `probe-plate`).

---

## 4. Contratos y mapa de archivos (un escritor por archivo por oleada)

| Dueño | Oleada | Archivos |
|---|---|---|
| F1 FUENTES | W1 | `scripts/fonts-hanzi.mjs` (nuevo), `src/assets/fonts/**` (nuevo), `src/app/fonts.css` (nuevo), `src/main.tsx` (una línea), `index.html`, `vercel.json`, `tests/fonts.test.ts` (nuevo), `e2e/atlas.spec.ts` (solo el bloque de fuente), `README.md` (licencia OFL) |
| F2 PLANCHA | W1 | `src/atlas/AtlasRoot.tsx`, `src/atlas/figure/PlateFurniture.tsx`, `src/atlas/figure/PlateTitle.tsx`, `src/atlas/figure/plate.css`, `src/atlas/figure/Minimap.tsx`, `src/atlas/ZoomControls.tsx`, `src/app/index.css` (tokens de papel, grano, viñeta), `src/app/shell.css` (barras) |
| F3 FIGURA | W1 | `src/atlas/figure/Figure.tsx`, `src/atlas/figure/silhouette.ts` (generado), `scripts/trace-silhouette.mts` (nuevo), `src/atlas/figure/PlateDefs.tsx`, `src/atlas/figure/interiorShading.ts`, `src/atlas/regionAnatomy.ts` (nuevo), `src/atlas/regionFrames.ts`, `src/state/viewerStore.ts` (solo el cableado de `fitRegion`), `tests/silhouette.test.ts`, `tests/regionAnatomy.test.ts`, `tests/regionFrames.test.ts`, `public/atlas/preview-*.svg`, `public/atlas/ATTRIBUTION.md` |
| T1 TINTA | W2 | `src/atlas/MeridianPaths.tsx`, `src/atlas/QiFlow.tsx`, `src/atlas/qi.css` |
| T2 MARCAS | W2 | `src/atlas/Points2D.tsx`, `src/atlas/DantianMarks.tsx`, `src/atlas/callouts.ts`, `src/atlas/PointTooltip.tsx`, `src/atlas/centers.ts` (solo desplazamiento de dibujo), `tests/callouts.test.ts`, `tests/labels.test.ts`; las letras D/I se dibujan en el SVG (T2) |
| U1 CABECERA | W2 | `src/ui/Topbar.tsx`, `src/ui/topbar.css` |
| U2 RELOJ | W2 | `src/ui/QiClock.tsx`, `src/ui/clock.css`, `tests/clock.test.ts` |
| U3 FICHA | W2 | `src/ui/PointDrawer.tsx`, `src/ui/CenterDrawer.tsx`, `src/ui/Sheet.tsx`, `src/ui/folio.css`, `src/ui/sheet.css`, `tests/sheet.test.ts` |
| U4 ÍNDICE Y MÓVIL | W2 | `src/ui/MeridianRail.tsx`, `src/ui/rail.css`, `src/ui/LegalModal.tsx`, `src/ui/HelpDialog.tsx`, `src/ui/Disclaimer.tsx`, `src/app/App.tsx` |
| Q1 BUILD/CI | W3 | `package.json` (scripts `probe`, `fonts`, `trace`), `.github/workflows/ci.yml`, `playwright.config.ts`, `e2e/**`, `scripts/budget.mjs` |
| Q2 VISUAL | W3 | `scripts/probe-plate.mjs` (solo si hay que ampliar gates, nunca relajarlos), `docs/T1_3009/shots/after/**`, `docs/T1_3009/probe-after.json` |
| OX | W0, W5 | `docs/T1_3009/*.md`, `docs/ARQUITECTURA.md`, `docs/DEPLOY.md`, `README.md` (salvo la licencia) |

- **i18n:** cada agente agrega sus claves en `src/i18n/messages.ts` **solo** dentro de un bloque `// --- <ID> ---` al final de `es` y de `en`; OX integra.
- **CSS:** todo en `@layer components`, en el archivo del dueño.
- **Store:** F3 es el único que lo toca en W1. En W2 nadie lo edita sin pasar por OX.
- **Contrato de la ventana:** F2 entrega en W1 `<div data-testid="plate-window" class="plate-window">` con el `Viewport` adentro, y los slots de margen `PlateMargin.left` (reloj), `PlateMargin.right` (zoom, clave, minimapa), `PlateMargin.top` (folio, título, subtítulo) y `PlateMargin.bottom` (colofón). U2 renderiza el reloj en el slot izquierdo a través de la prop `clock` de `AtlasRoot`.
- **`data-testid` nuevos:** `plate-window`, `plate-title`, `plate-key`, `plate-zoom`, `plate-clock`, `plate-colophon`, `plate-side-left`, `plate-side-right`, `minimap`, `dantian-<id>`, `label-<CODE>`.

---

## 5. Protocolo multiagente Grok 4.7 (sin detenerse)

- **Spawn** con la herramienta `Task`, como en los enjambres anteriores de este repo:

  ```
  Task(subagent_type: "generalPurpose" | "explore" | "bash",
       description: "<ID> <≤6 palabras>",
       prompt: "<tarjeta del rol (§7) + §0.2 + las secciones de §3/§4/§8 que le tocan + DoD + firma + 'no preguntes, no te detengas, reporta a OX'>")
  ```

- Máximo 8 hijos en vuelo, profundidad 1. Los hijos empiezan en frío: OX les pega todo lo que necesitan.
- **Worktree por escritor:** `git worktree add ../wt-<ID> -b t1/<ID> <base-de-la-oleada>`. OX integra con `git merge --no-ff` en el orden de §6 y corre `npm run typecheck` entre merge y merge.
- **Verificación antes de firmar:** `npm run typecheck && npm test && npm run build`. Si tocó algo visible, además `npm run probe` sobre `vite preview` y adjuntar los gates que le tocan.
- **Sin detenerse:** un hijo que falla se relanza una vez con el log. Si vuelve a fallar, OX lo arregla o recorta alcance y lo anota. Ningún rol se abandona en silencio. Tope de 45 min de reloj o 3 verificaciones fallidas por hijo.
- **Fallback:** sin `Task` o con cupo menor, OX ejecuta los roles **en serie** con las mismas firmas.
- **Navegador:** `npx playwright install chromium`. Si falla, usa `executablePath` de un Chromium del sistema. Si no hay ninguno, el sondeo y el e2e corren en CI y OX espera ese resultado antes de W4.

**Firma** (últimas líneas de cada hijo; OX las copia a `docs/T1_3009/SIGN_OFF.md`):

```
ID: F2
STATUS: PASS | FAIL
CLOSES: V02 V03 V04 V05 V13 V18 V19
CHANGED: <paths>
CHECKS: typecheck=0 test=0 (N) build=0 probe=<gates propios en PASS>/<total propios>
METRIC: overlapBody=0 overlapZoom4=0 seamDelta=0.4 headFootDelta=0 …
BROKEN: none | <lista>
NOTE: ≤ 2 frases
```

---

## 6. Roster (13 hijos + OX) y oleadas

| Oleada | ID | Rol | Tipo | Cierra | En vuelo |
|---|---|---|---|---|---|
| W0 | OX | Baseline: rama, probe-before, 48 capturas antes | tú | — | — |
| W1 | F1 | FUENTES auto-alojadas | generalPurpose + worktree | V01 | 3 |
| W1 | F2 | PLANCHA: ventana, huella, márgenes, papel, clave, zoom, minimapa, títulos | generalPurpose + worktree | V02 V03 V04 V05 V13 V18 V19 | |
| W1 | F3 | FIGURA: duotono, contorno vectorial, anatomía regional | generalPurpose + worktree | V06 V07 V12 | |
| W2 | T1 | TINTA: jerarquía cartográfica | generalPurpose + worktree | V08 | 6 |
| W2 | T2 | MARCAS: proximidad, clusters, dantian, D/I | generalPurpose + worktree | V09 V10 V11 V14 | |
| W2 | U1 | CABECERA | generalPurpose + worktree | V16 V22 | |
| W2 | U2 | RELOJ grabado | generalPurpose + worktree | V17 | |
| W2 | U3 | FICHA + SHEET | generalPurpose + worktree | V20 V21 | |
| W2 | U4 | ÍNDICE + PORTADA + MÓVIL | generalPurpose + worktree | V15 V23 V24 | |
| W3 | Q1 | BUILD / CI / E2E | bash | T10 | 2 |
| W3 | Q2 | VISUAL + PROBE | generalPurpose + bash | los 18 gates | |
| W4 | H1 | DIRECTOR DE ARTE (independiente) | explore | — | 2 |
| W4 | H2 | PRODUCTO (independiente) | explore + bash | — | |
| W5 | OX | Merge, producción, rollback si hace falta, docs | tú | — | — |

Orden de merge en W1: F1 → F3 → F2. En W2: T1 → T2 → U2 → U1 → U3 → U4.

---

## 7. Tarjetas de rol (OX pega la tarjeta entera al crear cada hijo)

### W0 · OX — Baseline

1. §0.1. Después `npm ci && npm run typecheck && npm test && npm run build`.
2. Crea `scripts/probe-plate.mjs` tal cual (§8.1). Suma a `package.json` el script `"probe": "node scripts/probe-plate.mjs"`.
3. Con `npx vite preview --port 4173` levantado: `node scripts/probe-plate.mjs http://localhost:4173/ docs/T1_3009/probe-before.json` (tiene que dar 16 FAIL; si da otra cosa, anota por qué) y `node scripts/shots.mjs docs/T1_3009/shots/before` (48 JPG).
4. Crea `docs/T1_3009/{BASELINE,DECISIONES,LOG,SIGN_OFF,DATA_NOTES}.md`. En BASELINE va el checklist V01–V24 y la tabla de §2.
5. Commit: `docs: baseline T1 30.09, probe y capturas antes`.

### W1 · F1 — FUENTES

**Cierra:** V01. Copia §8.2 tal cual: `scripts/fonts-hanzi.mjs`, `src/app/fonts.css` y `tests/fonts.test.ts`. Corre `node scripts/fonts-hanzi.mjs` (genera 2 woff2 de ≈ 12.8 KB y `hanzi-subset.txt` con 67 hanzi). Import en `main.tsx` antes de `index.css`. Limpia `index.html` y la CSP de `vercel.json`. Agrega `OFL.txt`. Corrige el bloque de fuente del e2e (§3.7).
**DoD:** `fonts.test` 3/3. `grep -c googleapis dist/index.html` = 0. Probe: `hanziFontPlate` y `hanziFontFolio` en PASS (Noto Serif SC por CDP).

### W1 · F2 — PLANCHA

**Cierra:** V02 V03 V04 V05 V13 V18 V19. Implementa §3.1 completo (grilla de márgenes, ventana con huella, papel exterior e interior, grano único, barras planas) y §3.5 (clave, zoom y minimapa). También los títulos y subtítulos por lámina, con números calculados de los datos.
- Folio una sola vez. `PlateTitle` sigue conteniendo el literal «Cuerpo humano — vista anterior».
- El `Viewport` va **dentro** de `plate-window`.
- Los `data-testid` de §4.
**DoD:** probe en PASS para `seamDelta ≤ 1`, `headFootDelta ≤ 3`, `overlapBody`, `overlapZoom4`, `overlapST36` y `overlapDantian` = 0, y `figureShareDesktop ≥ 0.70`. Capturas 1440, 1280, 768 y 390 sin mobiliario sobre el dibujo.

### W1 · F3 — FIGURA

**Cierra:** V06 V07 V12.
1. Copia §8.3 (`scripts/trace-silhouette.mts`, `tests/silhouette.test.ts`) y corre `node scripts/trace-silhouette.mts`.
2. `Figure.tsx` según §3.2: `fig-duo` en una sola `<image>`, contorno vectorial cargado con `import()`, pubis recoloreado y sin washes ni filtros viejos.
3. Copia §8.4 (`regionAnatomy.ts`, `tests/regionAnatomy.test.ts`). Cablea `fitRegion` en el store (`setAtlasRegion`, `setAtlasView` en región, `showPoint` dentro de una región, `focusCenter` en rostro) usando `plateBox`. Si `plateBox` es 0 (tests en node), cae a `regionFrame`.
4. `PlateDefs` usa `focusEllipse`, con fundido ≥ 120 px de pantalla y un piso del 14 %.
5. Store: agrega también `hoveredMeridianId: string | null` + `setHoveredMeridian(id)` (lo usa T1 en W2). `inRegionFrame` usa la ventana visible. Actualiza `tests/regionFrames.test.ts` conservando su garantía (el dantian inferior no aparece en la mano).
6. Regenera los previews y actualiza `ATTRIBUTION.md`.

**DoD:** tests en verde. En Rostro la cara entera queda nítida y sin corte vertical. En Pie se ven los dos pies con sus marcas. El contorno mide 1.1 ± 0.2 px a zoom 1 y a zoom 4 (e2e mide `getBoundingClientRect` de un tramo recto o el `stroke-width` × CTM).

### W2 · T1 — TINTA

**Cierra:** V08. Implementa la tabla de §3.3 en `MeridianPaths` y el cometa solo para el activo y la hora en `QiFlow`. Hover desde el índice y la lámina: `hoveredMeridianId` / `setHoveredMeridian` (lo agregó F3 en W1). El índice (U4) llama a `setHoveredMeridian` en `pointerenter` y `focus`.
**DoD:** probe `idleRouteLabels ≤ 2`. A zoom 1 en reposo no hay chevrones en el DOM (`[data-chevron]` = 0; márcalos así). El trazo activo mide 2.25 px.

### W2 · T2 — MARCAS

**Cierra:** V09 V10 V11 V14. Implementa §3.4: rótulos de proximidad con `label-<CODE>`, clusters solo en coarse sin margen, reglas de dantian con `dantian-<id>`, y D/I dentro de la ventana junto a la figura con `plate-side-*`. `tests/callouts.test.ts` y `labels.test.ts` en verde; suma un test puro para el desplazamiento de sellos (ningún sello a menos de 6 px de un punto en 1072×709 ni en 374×612).
**DoD:** probe en PASS para `zoomLabelCoverage = 1`, `dantianGapPx ≥ 6` y `orientationGapPx ≤ 96`.

### W2 · U1 — CABECERA

**Cierra:** V16 V22. §3.6: orden, separación, acento solo en subrayado, `titleShort` en móvil.
**DoD:** probe en PASS para `headerAccentText = 0` y `mobileBrandTruncated = false`. La cabecera móvil mide ≤ 104 px.

### W2 · U2 — RELOJ

**Cierra:** V17. §3.5, reloj grabado. Conserva `sectorAngle`, `meridianAtHour`, el radiogroup con flechas y `clock-dial` / `clock-play`.
**DoD:** `clock.test` en verde. El sector activo va relleno y el resto sin relleno (e2e: exactamente 1 `path[data-sector][data-on="true"]` con `fill` distinto de `none`).

### W2 · U3 — FICHA + SHEET

**Cierra:** V20 V21. §3.6: superficie, «×» arriba, barra de acciones, peek con hanzi, acciones sobre el pie.
**DoD:** probe `sheetPeekShowsHanzi = true`. El e2e de 390 verifica que la barra de acciones no intersecta `.app-foot`.

### W2 · U4 — ÍNDICE, PORTADA Y MÓVIL

**Cierra:** V15 V23 V24. §3.6: filtros en grilla, filas de 2 líneas sin truncar, foco del CTA en tinta, barra inferior móvil y colofón en Ayuda en móvil.
**DoD:** probe `figureShareMobile ≥ 0.62`. Ningún nodo del índice con `text-overflow: ellipsis` activo en 1440.

### W3 · Q1 — BUILD / CI / E2E

1. typecheck, test, build y budget en 0 (budget: dist < 8 MB, JS gzip inicial ≤ 130 KB, CSS gzip ≤ 14 KB). Lo roto lo arreglas tú.
2. CI: después de build, un job `probe` que levanta `vite preview` y corre `npm run probe` (falla si algún gate falla), más el job e2e existente.
3. e2e: T5 corregido (§3.7) y asserts nuevos de V04 (solape = 0), V11, V21 y V24. Tres corridas seguidas en verde.

### W3 · Q2 — VISUAL + PROBE

1. `npm run probe` → `docs/T1_3009/probe-after.json`: **18/18 PASS**. Si falla uno, devuelve el veto al dueño (§6) con el número; no relajes el umbral.
2. `node scripts/shots.mjs docs/T1_3009/shots/after`: 48 JPG, comparables 1 a 1 con `before/`.
3. Revisión a ojo de los 48 pares: anota cualquier colisión, costura, corte o texto truncado que el probe no mida, con captura y dueño.

### W4 · H1 — DIRECTOR DE ARTE (independiente, no escribió código)

Juzga **sin indulgencia**: el juez del 29.09 se puso 8.75 con 16 gates rojos. Usa `probe-after.json` y los 48 pares.

Puntúa de 0 a 10 con evidencia:
1. Primer segundo: ¿estampa de museo o app?
2. Plancha y papel.
3. Figura a dos tintas.
4. Jerarquía de tinta.
5. Rótulos y marcas.
6. Mobiliario en márgenes.
7. Tipografía y hanzi.
8. Color y acento.
9. Regiones.
10. Móvil.

**PASS** = los 18 gates en PASS + promedio ≥ 9 + ningún criterio < 8.5 + cero vetos.
**Vetos:** cualquier gate FAIL, mobiliario sobre el dibujo, costura visible, un hanzi en fuente de sistema, un corte anatómico en una región, texto truncado, rojo sobre rojo, más de un acento de color en el chrome, un contorno que engorda con el zoom, o cualquier canvas o 3D.
Escribe `docs/T1_3009/H1.md`. Si da FAIL, deja como máximo 7 vetos con `dueño + archivo + cambio`.

### W4 · H2 — PRODUCTO (independiente)

Las 12 tareas del H2 del 29.09 (portada, zusanli, ficha, ← →, P, región Mano, reloj, capas, teclado, ES↔EN, zoom, dantian medio), en 1440 y 390, más 4 nuevas:
13. Zoom ×4 sobre la pierna: cada punto visible tiene rótulo.
14. Rostro: la cara entera nítida y sin corte.
15. Pie: los dos pies con marcas.
16. Móvil: el peek de ST36 muestra 足三里 y las acciones no pisan el aviso.

**PASS** = las 16 × 2 OK. Escribe `docs/T1_3009/H2.md`.

### Bucles

Si H1 o H2 dan FAIL, o algún gate queda en FAIL, OX relanza solo a los dueños vetados, después Q1 + Q2 y después H1 + H2. **Máximo 3 bucles.** Nunca se declara PASS falso.

### W5 · OX — Cierre y producción

Ver §10.

---

## 8. Código de referencia (compilado y probado sobre `3e29ca2`)

Cópialo tal cual. Puedes extenderlo, pero no cambies firmas ni relajes umbrales.

### 8.1 `scripts/probe-plate.mjs` — los 18 gates (OX en W0)

Sobre `main` @ `3e29ca2` da 16 FAIL. Sobre el prototipo con fuente y tinta, 13. Sobre la entrega tiene que dar 0.

```js
// Usage: node scripts/probe-plate.mjs [baseUrl] [out.json]
// Objective gates for the plate: fonts, seams, furniture vs drawing window, labels, proportions.
// Works on the 29.09 UI (class fallbacks) and on the 30.09 UI (data-testid).
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4173/";
const outFile = process.argv[3] ?? "";
const CJK_FALLBACK = /WenQuanYi|Noto Sans CJK|Source Han Sans|SimSun|PingFang|Hiragino|Droid|Microsoft YaHei|Songti/i;

const WINDOW = '[data-testid="plate-window"]';
const FURNITURE = [
  '[data-testid="plate-title"]',
  '[data-testid="plate-key"]', ".plate-key",
  '[data-testid="plate-clock"]', '[data-testid="clock-dial"]',
  '[data-testid="plate-zoom"]', ".plate-zoom",
  '[data-testid="minimap"]', ".plate-minimap",
  '[data-testid="plate-colophon"]', ".plate-colophon",
  '[data-testid="folio"]',
  ".app-foot",
];

async function open(browser, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "load" });
  await page.waitForTimeout(400);
  await page.keyboard.press("Enter");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  return { ctx, page };
}

async function find(page, query) {
  await page.keyboard.press("/");
  await page.keyboard.type(query, { delay: 15 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
}

/** Drawing window: the explicit plate window, else the plate svg. */
async function windowRect(page) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) ?? document.querySelector('[data-testid="plate"] svg');
    return el ? el.getBoundingClientRect().toJSON() : null;
  }, WINDOW);
}

async function overlap(page) {
  return page.evaluate(({ win, furniture }) => {
    const w = (document.querySelector(win) ?? document.querySelector('[data-testid="plate"] svg'))?.getBoundingClientRect();
    if (!w) return { area: -1, hits: [] };
    const seen = new Set();
    const hits = [];
    let area = 0;
    for (const sel of furniture) {
      for (const el of document.querySelectorAll(sel)) {
        if (seen.has(el)) continue;
        seen.add(el);
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const ix = Math.max(0, Math.min(r.right, w.right) - Math.max(r.left, w.left));
        const iy = Math.max(0, Math.min(r.bottom, w.bottom) - Math.max(r.top, w.top));
        if (ix * iy > 0) {
          area += ix * iy;
          hits.push(`${sel}:${Math.round(ix * iy)}`);
        }
      }
    }
    return { area: Math.round(area), hits };
  }, { win: WINDOW, furniture: FURNITURE });
}

/** Screen rect of the figure frame (viewBox x 97.6..702.4, y 40..1480). */
async function figureRect(page) {
  return page.evaluate(() => {
    const svg = [...document.querySelectorAll('[data-testid="plate"] svg')].find((s) => s.querySelector("image"));
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const pt = (x, y) => new DOMPoint(x, y).matrixTransform(m);
    const a = pt(97.6, 40);
    const b = pt(702.4, 1480);
    return { left: a.x, top: a.y, right: b.x, bottom: b.y };
  });
}

async function hanziFonts(page, cdp, selector) {
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector });
  const fams = new Set();
  for (const id of nodeIds.slice(0, 6)) {
    try {
      const r = await cdp.send("CSS.getPlatformFontsForNode", { nodeId: id });
      for (const f of r.fonts) fams.add(f.familyName);
    } catch {
      /* node without text */
    }
  }
  return [...fams];
}

async function seam(page) {
  const w = await windowRect(page);
  if (!w) return { seam: -1, bars: -1 };
  const png = await page.screenshot({ type: "png" });
  return page.evaluate(async ({ data, w }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    const mean = (x0, y0, ww, hh) => {
      const d = x.getImageData(Math.round(x0), Math.round(y0), Math.round(ww), Math.round(hh)).data;
      const s = [0, 0, 0];
      for (let i = 0; i < d.length; i += 4) {
        s[0] += d[i];
        s[1] += d[i + 1];
        s[2] += d[i + 2];
      }
      const n = d.length / 4;
      return s.map((v) => v / n);
    };
    const band = Math.max(40, w.width * 0.12);
    const x0 = w.left + w.width * 0.04;
    const above = mean(x0, w.top - 8, band, 5);
    const below = mean(x0, w.top + 4, band, 5);
    const head = document.querySelector(".app-head")?.getBoundingClientRect();
    const foot = document.querySelector(".app-foot")?.getBoundingClientRect();
    let bars = -1;
    if (head && foot) {
      const a = mean(4, head.top + 2, 24, 4);
      const b = mean(4, foot.bottom - 6, 24, 4);
      bars = Math.max(...a.map((v, i) => Math.abs(v - b[i])));
    }
    return { seam: Math.max(...above.map((v, i) => Math.abs(v - below[i]))), bars };
  }, { data: png.toString("base64"), w });
}

const browser = await chromium.launch();
const m = {};

{
  const { ctx, page } = await open(browser, { width: 1440, height: 900 });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  m.hanziFontPlate = await hanziFonts(page, cdp, '[data-testid^="callout-"] text, [data-testid^="callout-"] tspan');
  const tone = await seam(page);
  m.seamDelta = Math.round(tone.seam * 10) / 10;
  m.headFootDelta = Math.round(tone.bars * 10) / 10;
  m.overlapBody = await overlap(page);
  const fig = await figureRect(page);
  m.figureShareDesktop = fig ? Math.round(((fig.bottom - fig.top) / 900) * 100) / 100 : -1;
  m.idleRouteLabels = await page.evaluate(() =>
    [...([...document.querySelectorAll('[data-testid="plate"] svg')].find((s) => s.querySelector("image"))?.querySelectorAll("text") ?? [])].filter((t) => {
      const r = t.getBoundingClientRect();
      return r.width > 0 && /^(LU|LI|ST|SP|HT|SI|BL|KI|PC|TE|GB|LR|GV|CV)$/.test(t.textContent.trim());
    }).length,
  );
  m.orientationGapPx = await page.evaluate((f) => {
    const marks = [...document.querySelectorAll('[data-testid^="plate-side"], .plate-side')].map((e) => e.getBoundingClientRect());
    if (!f || marks.length === 0) return -1;
    return Math.round(Math.max(...marks.map((r) => (r.right < f.left ? f.left - r.right : r.left > f.right ? r.left - f.right : 0))));
  }, fig);
  m.headerAccentText = await page.evaluate(() =>
    [...document.querySelectorAll(".app-head *, header *")].filter((e) => {
      const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      return own && getComputedStyle(e).color === "rgb(139, 30, 30)";
    }).length,
  );
  m.smallText = await page.evaluate(() =>
    [...document.querySelectorAll("body *")].filter((e) => {
      if (e.closest("svg")) return false;
      const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const r = e.getBoundingClientRect();
      return own && r.width > 0 && parseFloat(getComputedStyle(e).fontSize) < 11;
    }).length,
  );
  m.dantianGapPx = await page.evaluate(() => {
    const seals = [...document.querySelectorAll('[data-testid^="dantian-"], [data-testid="plate"] svg text')]
      .filter((t) => /丹田/.test(t.textContent))
      .map((t) => (t.closest("g")?.querySelector("circle") ?? t).getBoundingClientRect());
    const points = [...document.querySelectorAll('[data-testid^="point-"]')].map((p) => p.getBoundingClientRect());
    if (!seals.length || !points.length) return -1;
    let gap = Infinity;
    for (const s of seals) for (const p of points) {
      const d = Math.hypot(s.x + s.width / 2 - (p.x + p.width / 2), s.y + s.height / 2 - (p.y + p.height / 2));
      gap = Math.min(gap, d - s.width / 2 - 6);
    }
    return Math.round(gap);
  });
  for (let i = 0; i < 4; i += 1) await page.keyboard.press("+");
  await page.waitForTimeout(900);
  m.overlapZoom4 = await overlap(page);
  m.zoomLabelCoverage = await page.evaluate((sel) => {
    const w = (document.querySelector(sel) ?? document.querySelector('[data-testid="plate"] svg')).getBoundingClientRect();
    const inWin = (r) => r.width > 0 && r.left >= w.left && r.right <= w.right && r.top >= w.top && r.bottom <= w.bottom;
    const marks = [...document.querySelectorAll('[data-testid^="point-"]')].filter((e) => inWin(e.getBoundingClientRect()));
    const labels = new Set(
      [...document.querySelectorAll('[data-testid^="callout-"], [data-testid^="label-"]')]
        .filter((e) => e.getBoundingClientRect().width > 0)
        .map((e) => e.getAttribute("data-testid").replace(/^(callout|label)-/, "")),
    );
    const codes = marks.map((e) => e.getAttribute("data-testid").replace(/^point-/, ""));
    return codes.length ? Math.round((codes.filter((c) => labels.has(c)).length / codes.length) * 100) / 100 : -1;
  }, WINDOW);
  await page.keyboard.press("0");
  await find(page, "ST36");
  m.overlapST36 = await overlap(page);
  m.hanziFontFolio = await hanziFonts(page, cdp, "h2");
  await page.keyboard.press("Escape");
  await find(page, "dantian medio");
  m.overlapDantian = await overlap(page);
  await ctx.close();
}

{
  const { ctx, page } = await open(browser, { width: 390, height: 844 });
  const fig = await figureRect(page);
  m.figureShareMobile = fig ? Math.round(((fig.bottom - fig.top) / 844) * 100) / 100 : -1;
  m.mobileBrandTruncated = await page.evaluate(() =>
    [...document.querySelectorAll(".app-head *, header *")].some((e) => {
      const cs = getComputedStyle(e);
      return cs.textOverflow === "ellipsis" && e.scrollWidth > e.clientWidth + 1;
    }),
  );
  await find(page, "ST36");
  m.sheetPeekShowsHanzi = await page.evaluate(() => {
    const sheet = document.querySelector('[data-testid="sheet"]');
    if (!sheet) return false;
    return [...sheet.querySelectorAll("*")].some((e) => {
      if (e.children.length || !/足三里/.test(e.textContent ?? "")) return false;
      const r = e.getBoundingClientRect();
      if (r.height === 0 || r.top < 0 || r.bottom > innerHeight) return false;
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return Boolean(hit && (hit === e || e.contains(hit)));
    });
  });
  await ctx.close();
}
await browser.close();

const gates = {
  hanziFontPlate: m.hanziFontPlate.some((f) => /Noto Serif SC/.test(f)) && !m.hanziFontPlate.some((f) => CJK_FALLBACK.test(f)),
  hanziFontFolio: m.hanziFontFolio.some((f) => /Noto Serif SC/.test(f)) && !m.hanziFontFolio.some((f) => CJK_FALLBACK.test(f)),
  seamDelta: m.seamDelta >= 0 && m.seamDelta <= 1,
  overlapBody: m.overlapBody.area === 0,
  overlapZoom4: m.overlapZoom4.area === 0,
  overlapST36: m.overlapST36.area === 0,
  overlapDantian: m.overlapDantian.area === 0,
  figureShareDesktop: m.figureShareDesktop >= 0.7,
  figureShareMobile: m.figureShareMobile >= 0.62,
  idleRouteLabels: m.idleRouteLabels <= 2,
  zoomLabelCoverage: m.zoomLabelCoverage === 1,
  orientationGapPx: m.orientationGapPx >= 0 && m.orientationGapPx <= 96,
  headerAccentText: m.headerAccentText === 0,
  headFootDelta: m.headFootDelta >= 0 && m.headFootDelta <= 3,
  smallText: m.smallText === 0,
  dantianGapPx: m.dantianGapPx >= 6,
  mobileBrandTruncated: m.mobileBrandTruncated === false,
  sheetPeekShowsHanzi: m.sheetPeekShowsHanzi === true,
};
const failed = Object.entries(gates).filter(([, ok]) => !ok).map(([k]) => k);
const report = { metrics: m, gates, failed, pass: failed.length === 0 };
console.log(JSON.stringify(report, null, 2));
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2));
process.exitCode = failed.length === 0 ? 0 : 1;
```

### 8.2 Fuente hanzi auto-alojada (F1)

`scripts/fonts-hanzi.mjs`:

```js
// Usage: node scripts/fonts-hanzi.mjs
// Self-hosts Noto Serif SC (SIL OFL 1.1) as a subset holding exactly the hanzi the atlas uses.
// Writes src/assets/fonts/noto-serif-sc-{500,600}.woff2 (Vite hashes them) and hanzi-subset.txt.
// Re-run whenever data/ or src/ gain a new hanzi (tests/fonts.test.ts fails until you do).
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const HAN = /[\u3400-\u4dbf\u4e00-\u9fff]/gu;
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(json|ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

export function atlasHanzi() {
  const set = new Set();
  for (const file of [...walk(join(root, "data")), ...walk(join(root, "src"))]) {
    for (const ch of readFileSync(file, "utf8").match(HAN) ?? []) set.add(ch);
  }
  return [...set].sort().join("");
}

async function fetchOk(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const text = atlasHanzi();
  const outDir = join(root, "src/assets/fonts");
  mkdirSync(outDir, { recursive: true });
  for (const weight of [500, 600]) {
    const css = await (
      await fetchOk(
        `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@${weight}&display=swap&text=${encodeURIComponent(text)}`,
        { headers: { "user-agent": UA } },
      )
    ).text();
    const url = css.match(/url\((https:[^)]+)\)\s*format\('woff2'\)/)?.[1];
    if (!url) throw new Error(`no woff2 for ${weight}`);
    const buf = Buffer.from(await (await fetchOk(url)).arrayBuffer());
    writeFileSync(join(outDir, `noto-serif-sc-${weight}.woff2`), buf);
    console.log(`noto-serif-sc-${weight}.woff2 ${buf.length} bytes`);
  }
  writeFileSync(join(outDir, "hanzi-subset.txt"), `${text}\n`);
  console.log(`${[...text].length} hanzi → src/assets/fonts/hanzi-subset.txt`);
}
```

`src/app/fonts.css` (importado en `main.tsx` **antes** de `index.css`):

```css
/* Noto Serif SC, SIL OFL 1.1. Subset of the hanzi the atlas uses: node scripts/fonts-hanzi.mjs */
@font-face {
  font-family: "Noto Serif SC";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("../assets/fonts/noto-serif-sc-500.woff2") format("woff2");
}

@font-face {
  font-family: "Noto Serif SC";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("../assets/fonts/noto-serif-sc-600.woff2") format("woff2");
}
```

`tests/fonts.test.ts`:

```ts
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");
const HAN = /[\u3400-\u4dbf\u4e00-\u9fff]/gu;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(json|ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

describe("self-hosted hanzi font", () => {
  it("covers every hanzi in data/ and src/", () => {
    const subset = new Set(readFileSync(join(root, "src/assets/fonts/hanzi-subset.txt"), "utf8").trim());
    const missing = new Set<string>();
    for (const file of [...walk(join(root, "data")), ...walk(join(root, "src"))]) {
      for (const ch of readFileSync(file, "utf8").match(HAN) ?? []) if (!subset.has(ch)) missing.add(ch);
    }
    expect([...missing].join(""), "run: node scripts/fonts-hanzi.mjs").toBe("");
  });

  it("ships two small woff2 files and declares them in fonts.css", () => {
    for (const w of [500, 600]) {
      const file = join(root, `src/assets/fonts/noto-serif-sc-${w}.woff2`);
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThan(60_000);
    }
    const css = readFileSync(join(root, "src/app/fonts.css"), "utf8");
    expect(css).toMatch(/@font-face\s*{[^}]*"Noto Serif SC"[^}]*noto-serif-sc-500\.woff2/);
    expect(css).toMatch(/@font-face\s*{[^}]*"Noto Serif SC"[^}]*noto-serif-sc-600\.woff2/);
  });

  it("does not depend on Google Fonts (Vite 8 drops that <link> in build)", () => {
    expect(readFileSync(join(root, "index.html"), "utf8")).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  });
});
```

### 8.3 Contorno vectorial de la silueta (F3)

`scripts/trace-silhouette.mts` (Node 22 importa el decodificador TS del repo directamente; ~1 s):

```ts
// Usage: node scripts/trace-silhouette.mts
// Traces the alpha edge of the Goran plates into vector paths (viewBox 800×1600),
// so the ink contour stays 1 px on screen at any zoom. Output: src/atlas/figure/silhouette.ts
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decodePngAlpha, type PngAlpha } from "../tests/pngAlpha.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Same rects as BODY_PLATE in src/atlas/figure/Figure.tsx (xMidYMid meet). */
const PLATES = {
  anterior: { x: 97.61, y: 40, width: 604.79, height: 1440, file: "public/atlas/body-anterior.png" },
  posterior: { x: 97.47, y: 40, width: 605.06, height: 1440, file: "public/atlas/body-posterior.png" },
} as const;

const THRESHOLD = 127;
const EPSILON_PX = 0.9;
const MIN_LOOP_PX = 40;

type P = [number, number];

function inside(img: PngAlpha, x: number, y: number): number {
  if (x < 0 || y < 0 || x >= img.width || y >= img.height) return 0;
  return (img.alpha[y * img.width + x] ?? 0) > THRESHOLD ? 1 : 0;
}

/** Marching squares over the pixel grid. Edge midpoints are keyed on a doubled grid. */
function loops(img: PngAlpha): P[][] {
  const adj = new Map<number, number[]>();
  const W2 = img.width * 2 + 4;
  const key = (x2: number, y2: number) => (y2 + 2) * W2 + (x2 + 2);
  const link = (a: number, b: number) => {
    (adj.get(a) ?? adj.set(a, []).get(a)!).push(b);
    (adj.get(b) ?? adj.set(b, []).get(b)!).push(a);
  };
  for (let y = -1; y < img.height; y += 1) {
    for (let x = -1; x < img.width; x += 1) {
      const tl = inside(img, x, y);
      const tr = inside(img, x + 1, y);
      const br = inside(img, x + 1, y + 1);
      const bl = inside(img, x, y + 1);
      const c = (tl << 3) | (tr << 2) | (br << 1) | bl;
      if (c === 0 || c === 15) continue;
      const T = key(2 * x + 1, 2 * y);
      const R = key(2 * x + 2, 2 * y + 1);
      const B = key(2 * x + 1, 2 * y + 2);
      const L = key(2 * x, 2 * y + 1);
      switch (c) {
        case 1: case 14: link(L, B); break;
        case 2: case 13: link(B, R); break;
        case 3: case 12: link(L, R); break;
        case 4: case 11: link(T, R); break;
        case 6: case 9: link(T, B); break;
        case 7: case 8: link(L, T); break;
        case 5: link(L, T); link(B, R); break;
        case 10: link(T, R); link(L, B); break;
      }
    }
  }
  const seen = new Set<number>();
  const out: P[][] = [];
  const toPoint = (k: number): P => [((k % W2) - 2) / 2 + 0.5, (Math.floor(k / W2) - 2) / 2 + 0.5];
  for (const start of adj.keys()) {
    if (seen.has(start)) continue;
    const loop: P[] = [];
    let prev = -1;
    let cur = start;
    while (!seen.has(cur)) {
      seen.add(cur);
      loop.push(toPoint(cur));
      const next = (adj.get(cur) ?? []).find((n) => n !== prev && !seen.has(n));
      if (next === undefined) break;
      prev = cur;
      cur = next;
    }
    if (loop.length >= MIN_LOOP_PX) out.push(loop);
  }
  return out;
}

function rdp(pts: P[], eps: number): P[] {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0]!;
  const [bx, by] = pts[pts.length - 1]!;
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let best = -1;
  let far = 0;
  for (let i = 1; i < pts.length - 1; i += 1) {
    const [px, py] = pts[i]!;
    const d = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / len;
    if (d > far) {
      far = d;
      best = i;
    }
  }
  if (far <= eps) return [pts[0]!, pts[pts.length - 1]!];
  return [...rdp(pts.slice(0, best + 1), eps).slice(0, -1), ...rdp(pts.slice(best), eps)];
}

function toPath(view: keyof typeof PLATES): { d: string; points: number; loops: number } {
  const plate = PLATES[view];
  const img = decodePngAlpha(join(root, plate.file));
  const s = Math.min(plate.width / img.width, plate.height / img.height);
  const ox = plate.x + (plate.width - img.width * s) / 2;
  const oy = plate.y + (plate.height - img.height * s) / 2;
  let points = 0;
  const all = loops(img);
  const parts = all.map((loop) => {
    const mid = Math.floor(loop.length / 2);
    const simple = [...rdp(loop.slice(0, mid + 1), EPSILON_PX).slice(0, -1), ...rdp(loop.slice(mid).concat([loop[0]!]), EPSILON_PX).slice(0, -1)];
    points += simple.length;
    return (
      "M" +
      simple.map(([x, y]) => `${(ox + x * s).toFixed(1)} ${(oy + y * s).toFixed(1)}`).join("L") +
      "Z"
    );
  });
  return { d: parts.join(""), points, loops: all.length };
}

const a = toPath("anterior");
const p = toPath("posterior");
const file = join(root, "src/atlas/figure/silhouette.ts");
writeFileSync(
  file,
  `/** Generated by scripts/trace-silhouette.mts from the Goran plates. Do not edit by hand. */\n` +
    `export const SILHOUETTE = {\n  anterior: "${a.d}",\n  posterior: "${p.d}",\n} as const;\n`,
);
console.log(`anterior loops=${a.loops} points=${a.points} · posterior loops=${p.loops} points=${p.points} → ${file}`);
```

`tests/silhouette.test.ts`:

```ts
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SILHOUETTE } from "@/atlas/figure/silhouette";
import { decodePngAlpha } from "./pngAlpha";

const PLATES = {
  anterior: { x: 97.61, y: 40, w: 604.79, h: 1440, file: "public/atlas/body-anterior.png" },
  posterior: { x: 97.47, y: 40, w: 605.06, h: 1440, file: "public/atlas/body-posterior.png" },
} as const;

describe("vector silhouette", () => {
  for (const view of ["anterior", "posterior"] as const) {
    it(`${view}: every vertex sits on the alpha edge (≤ 1.5 u) and the outline spans the figure`, () => {
      const p = PLATES[view];
      const img = decodePngAlpha(join(__dirname, "..", p.file));
      const s = Math.min(p.w / img.width, p.h / img.height);
      const ox = p.x + (p.w - img.width * s) / 2;
      const oy = p.y + (p.h - img.height * s) / 2;
      const on = (x: number, y: number) => {
        const px = Math.floor((x - ox) / s);
        const py = Math.floor((y - oy) / s);
        if (px < 0 || py < 0 || px >= img.width || py >= img.height) return false;
        return (img.alpha[py * img.width + px] ?? 0) > 127;
      };
      const nums = SILHOUETTE[view].replace(/[MLZ]/g, " ").trim().split(/\s+/).map(Number);
      expect(nums.length % 2).toBe(0);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < nums.length; i += 2) {
        const x = nums[i]!;
        const y = nums[i + 1]!;
        minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        let edge = false;
        for (let a = 0; a < 16 && !edge; a += 1) {
          const t = (a / 16) * Math.PI * 2;
          edge = on(x + 1.5 * Math.cos(t), y + 1.5 * Math.sin(t)) !== on(x - 1.5 * Math.cos(t), y - 1.5 * Math.sin(t));
        }
        expect(edge, `${view} vertex ${x},${y}`).toBe(true);
      }
      expect(minX).toBeLessThan(100);
      expect(maxX).toBeGreaterThan(700);
      expect(minY).toBeLessThan(42);
      expect(maxY).toBeGreaterThan(1477);
    });
  }
});
```

### 8.4 Regiones por anatomía (F3)

`src/atlas/regionAnatomy.ts` (cajas medidas del alfa del PNG, umbral 127):

```ts
import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { ZOOM_MAX, ZOOM_MIN } from "@/atlas/camera";
import type { PlateBox } from "@/atlas/screen";
import type { AtlasRegion, AtlasView, Point2D } from "@/types";

export interface Box {
  l: number;
  t: number;
  r: number;
  b: number;
}

/**
 * Anatomy each detail plate must show whole, measured on the plate alpha (> 127),
 * viewBox 800×1600. Face includes the neck down to GV14; foot includes the ankle up to SP6.
 */
export const REGION_ANATOMY: Record<Exclude<AtlasRegion, "body">, Record<AtlasView, Box>> = {
  face: {
    anterior: { l: 326, t: 40, r: 476, b: 282 },
    posterior: { l: 320, t: 40, r: 470, b: 282 },
  },
  hand: {
    anterior: { l: 98, t: 680, r: 260, b: 893 },
    posterior: { l: 98, t: 680, r: 260, b: 893 },
  },
  foot: {
    anterior: { l: 308, t: 1340, r: 492, b: 1480 },
    posterior: { l: 306, t: 1340, r: 490, b: 1480 },
  },
};

/** Share of the anatomy box added as air on every side. */
const AIR = 0.12;

/**
 * Camera that shows the whole anatomy box inside the drawing window (meet), with air.
 * Replaces the fixed zooms of regionFrame(): the window size decides the zoom.
 */
export function fitRegion(region: AtlasRegion, view: AtlasView, box: PlateBox): { pan: Point2D; zoom: number } {
  if (region === "body" || box.w <= 0 || box.h <= 0) return { pan: { x: VIEW_W / 2, y: VIEW_H / 2 }, zoom: 1 };
  const a = REGION_ANATOMY[region][view];
  const needW = (a.r - a.l) * (1 + 2 * AIR);
  const needH = (a.b - a.t) * (1 + 2 * AIR);
  const c = Math.max(VIEW_W / box.w, VIEW_H / box.h);
  const zoom = c / Math.max(needW / box.w, needH / box.h);
  return {
    pan: { x: (a.l + a.r) / 2, y: (a.t + a.b) / 2 },
    zoom: Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom)),
  };
}

/**
 * Solid part of the regional loupe: the smallest ellipse with the box's aspect that holds its four corners,
 * plus 8 u. The drawn ellipse is this divided by the solid stop of the gradient (PlateDefs).
 */
export function focusEllipse(region: Exclude<AtlasRegion, "body">, view: AtlasView): { cx: number; cy: number; rx: number; ry: number } {
  const a = REGION_ANATOMY[region][view];
  return {
    cx: (a.l + a.r) / 2,
    cy: (a.t + a.b) / 2,
    rx: ((a.r - a.l) / 2) * Math.SQRT2 + 8,
    ry: ((a.b - a.t) / 2) * Math.SQRT2 + 8,
  };
}
```

`tests/regionAnatomy.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { loadAcupoints } from "@/data";
import { REGION_ANATOMY, fitRegion, focusEllipse } from "@/atlas/regionAnatomy";
import { unitsPerPx, visibleRect } from "@/atlas/screen";

const WINDOWS = [
  { w: 1072, h: 709 },
  { w: 784, h: 709 },
  { w: 560, h: 709 },
  { w: 374, h: 612 },
];
const REGIONS = ["face", "hand", "foot"] as const;
const VIEWS = ["anterior", "posterior"] as const;

describe("detail plates frame whole anatomy", () => {
  it("fitRegion shows the whole anatomy box in every window size", () => {
    for (const region of REGIONS) {
      for (const view of VIEWS) {
        for (const box of WINDOWS) {
          const cam = fitRegion(region, view, box);
          expect(cam.zoom).toBeGreaterThanOrEqual(1);
          expect(cam.zoom).toBeLessThanOrEqual(6);
          const k = unitsPerPx(800 / cam.zoom, 1600 / cam.zoom, box);
          const vis = visibleRect(cam.pan, k, box);
          const a = REGION_ANATOMY[region][view];
          const tag = `${region}/${view} ${box.w}×${box.h}`;
          if (cam.zoom > 1) {
            expect(vis.l, tag).toBeLessThanOrEqual(a.l);
            expect(vis.r, tag).toBeGreaterThanOrEqual(a.r);
            expect(vis.t, tag).toBeLessThanOrEqual(a.t);
            expect(vis.b, tag).toBeGreaterThanOrEqual(a.b);
          }
        }
      }
    }
  });

  it("the solid loupe holds the four corners of the anatomy box (no cut through the face)", () => {
    for (const region of REGIONS) {
      for (const view of VIEWS) {
        const e = focusEllipse(region, view);
        const a = REGION_ANATOMY[region][view];
        for (const [x, y] of [[a.l, a.t], [a.r, a.t], [a.l, a.b], [a.r, a.b]] as const) {
          expect(((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2, `${region}/${view}`).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it("every star point of a region sits inside its anatomy box", () => {
    const members: Record<(typeof REGIONS)[number], string[]> = {
      face: ["GV20", "EX-HN3", "GB20", "GV14", "EX-B1"],
      hand: ["LI4", "LU7", "HT7", "PC6", "TE5", "SI3"],
      foot: ["SP6", "KI3", "LR3"],
    };
    for (const region of REGIONS) {
      for (const code of members[region]) {
        const pt = loadAcupoints().find((p) => p.code === code);
        for (const view of VIEWS) {
          const pos = pt?.position2d?.[view];
          if (!pos) continue;
          const a = REGION_ANATOMY[region][view];
          const x = Math.min(pos.x, 800 - pos.x);
          expect(x >= a.l && x <= a.r && pos.y >= a.t && pos.y <= a.b, `${code} ${view} in ${region}`).toBe(true);
        }
      }
    }
  });
});
```

---

## 9. Gates (todo en verde antes de W5)

```bash
npm ci
npm run typecheck
npm test              # 69 actuales + fonts, silhouette, regionAnatomy y los que agreguen los dueños
npm run build
npm run budget
npx vite preview --port 4173 &   # en otra terminal
npm run probe -- http://localhost:4173/ docs/T1_3009/probe-after.json   # 18/18 PASS
npm run e2e           # 3 corridas seguidas en verde
```

Greps de muerte (0 resultados cada uno):

```bash
rg -n "fonts\.(googleapis|gstatic)\.com" index.html vercel.json src
rg -n "fig-grade|fig-shade|fig-edge|WashLayer" src/atlas/figure/Figure.tsx
rg -n "rounded-(full|xl|2xl)|<Canvas|@react-three|from ['\"]three['\"]" src
rg -n "TODO|FIXME|@ts-ignore|@ts-expect-error|eslint-disable|: any\b|as any\b" src tests e2e scripts
rg -n "text-\[(8|9|10)px\]" src
rg -n "中腔" src data tests
```

---

## 10. Cierre autónomo (W5)

1. Integra todo en `feat/t1-3009`. §9 entero en verde. Push. PR a `main` con resumen, 6 pares antes/después (1440 anterior, ST36, Rostro, Mano; 390 anterior y ST36), la tabla de gates antes → después, las firmas y los riesgos.
2. Si `MERGE_A_MAIN = sí` **y** §9 está en verde **y** H1 y H2 dieron PASS:
   - `git checkout main && git pull --ff-only && git merge --no-ff feat/t1-3009 && git push origin main` (o merge de la PR si tienes la herramienta).
   - Espera el deploy de Vercel, hasta 10 min: consulta `curl -s https://acupuntura3d.vercel.app/ | grep -o 'assets/index-[^"]*\.js'` hasta que el hash coincida con tu `dist` de `main`.
   - Corre `node scripts/probe-plate.mjs https://acupuntura3d.vercel.app/ docs/T1_3009/probe-prod.json`.
   - **Si falla un gate en producción:** `git revert -m 1 <merge-sha> && git push origin main` (producción vuelve a lo anterior), abre un issue o nota en la PR con el gate que falló y relanza el bucle.
   - La QA post-deploy de `docs/DEPLOY.md` sigue valiendo: sin canvas WebGL, `<svg>` presente, A/P, ficha de ST36 y aviso legal.
3. Si `MERGE_A_MAIN = no` o algo quedó en rojo: deja la PR abierta con el estado honesto.
4. Docs: `README.md` (alcance, capturas, scripts `probe`, `fonts`, `trace`, licencia OFL), `docs/ARQUITECTURA.md` (plancha, ventana, duotono, silueta, regionAnatomy, fuentes), `docs/DEPLOY.md` (job probe y verificación de producción) y `docs/T1_3009/SIGN_OFF.md` (13 firmas, V01–V24, gates antes → después, producción).
5. Respuesta final al humano, en ≤ 12 líneas: link de la PR, estado del merge y de producción, gates antes → después y vetos abiertos si los hay.

---

## 11. Anti-patrones (si aparece uno, se revierte)

- Relajar un umbral de `probe-plate` para pasar.
- Volver a poner mobiliario sobre el dibujo «porque cabe».
- Pintar el contorno con un filtro, o cualquier tamaño en unidades del viewBox sin multiplicar por `k`.
- Mover un punto del seed. Inventar un hanzi, un punto o una coordenada.
- Volver a Google Fonts o a una fuente de sistema para los hanzi.
- Dos capas de grano en la misma superficie. Viñeta sobre las barras.
- Texto cinabrio en la cabecera. Rojo sobre rojo.
- Números escritos a mano en los subtítulos.
- Detenerse a preguntar. Declarar PASS con un gate en rojo.

---

## 12. Recordatorio final (reléelo antes de cada merge)

SVG 2D · 20 puntos · CV12 = 中脘 · aviso visible · Goran CC BY-SA y Noto OFL con atribución · el dibujo dentro de la plancha y el mobiliario en el margen · duotono + contorno vectorial · reposo quieto y lo activo habla · rótulos a cualquier zoom · regiones por anatomía · un acento · hanzi en Noto Serif SC de verdad · probe 18/18 · sin detenerse.

**Arranca ahora:** W0 → W1 (F1, F2, F3) → merge → W2 (T1, T2, U1, U2, U3, U4) → merge → W3 (Q1, Q2) → W4 (H1, H2) → bucles → W5.

=== FIN ===
