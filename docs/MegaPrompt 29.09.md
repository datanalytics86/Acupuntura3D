# MegaPrompt 29.09 — Rediseño Tier 1 del atlas (Grok 4.7 · multiagente)

**Para:** Grok 4.7 en Grok Build / Grok Terminal (modo agente, con escritura y git).
**Repo:** `datanalytics86/Acupuntura3D` · **base medida:** `main` @ `d938da3` (29-09-2026).
**Resultado:** rama `feat/t1-2909` y un PR a `main` con el sitio rediseñado completo: código, tests, e2e, capturas antes/después y firmas de cada agente. Revisas la preview de Vercel del PR y el merge lo haces tú.

## Cómo usarlo

1. Abre el repo en Grok 4.7 (Grok Build o Grok Terminal) con permisos de escritura, git y red para `npm`.
2. Elige cómo dárselo:
   - **Opción A (pegar):** copia **todo** lo que va entre `=== PEGAR DESDE AQUÍ ===` y `=== FIN ===` y pégalo en un solo mensaje.
   - **Opción B (recomendada: el bloque pesa ~90 KB y algunas interfaces cortan mensajes largos):** pega solo esto:

     ```
     Ejecuta el MegaPrompt 29.09. Léelo completo con:
     git fetch origin && git show "origin/main:docs/MegaPrompt 29.09.md"
     (si todavía no está en main, usa origin/claude/cool-allen-v4o0gq en lugar de origin/main).
     Sigue todo lo que va entre "=== PEGAR DESDE AQUÍ ===" y "=== FIN ===".
     Ese bloque es tu aprobación: no preguntes y no entres en Plan mode.
     ```
3. No respondas preguntas intermedias. El prompt ya trae las decisiones y una regla de desempate.
4. Al terminar, Grok te entrega el link del PR, `docs/T1_2909/SIGN_OFF.md` y las capturas en `docs/T1_2909/shots/`.
5. Si Grok se corta a mitad de camino, pega solo esto:
   `Continúa el MegaPrompt 29.09 desde la última firma en docs/T1_2909/SIGN_OFF.md. No repitas oleadas cerradas.`

## De dónde sale

- Auditoría real en Chromium a 1440×900 y 390×844 (48 capturas: 4 viewports × 12 estados) y mediciones sobre el código y los PNG (§2 del prompt).
- El código de referencia de §8 se compiló y se probó sobre `d938da3`: typecheck 0, 35 tests en verde. `tests/meridianSkin.test.ts` queda en rojo a propósito, porque ponerlo en verde es la tarea de A3.
- También se armó un prototipo rápido con escala en pantalla, pigmentos y rótulos de margen. Con eso, los 20 puntos pasaron de ~2 px (invisibles) a marcas legibles con rótulo. Los valores de §3 salen de ese prototipo.

---

=== PEGAR DESDE AQUÍ ===

# MegaPrompt 29.09 — Acupuntura3D · Rediseño Tier 1 · enjambre Grok 4.7

## 0. Identidad, autoridad y modo

Eres **Grok 4.7** en Grok Build / Grok Terminal y actúas como **OX, el orquestador** de un enjambre de 16 agentes hijos.
Repo `datanalytics86/Acupuntura3D`. Base: `main` @ `d938da3` o más nueva.

- **Este bloque ES la aprobación.** No entres en Plan mode, no pidas aprobación y no le hagas preguntas al humano. Si algo es ambiguo, aplica la regla de desempate de §0.3 y anota la decisión en `docs/T1_2909/DECISIONES.md` (una línea por decisión: qué, por qué, quién).
- Razonamiento al máximo. **Escribe código completo y final.** Quedan prohibidos `TODO`, `FIXME`, `...` como código, stubs, funciones vacías, «pendiente», `any`, `as unknown as`, `// @ts-ignore`, `// @ts-expect-error` y `eslint-disable`.
- Idioma: docs y comunicación en español; identificadores y comentarios de código en inglés, como el código actual.
- Antes de cada oleada, escribe como máximo 5 líneas de plan en `docs/T1_2909/LOG.md` y ejecuta. No narres: produce.

### 0.1 Git

```bash
git fetch origin && git checkout main && git pull --ff-only
git checkout -b feat/t1-2909
mkdir -p docs/T1_2909/shots/before docs/T1_2909/shots/after
```

- Commits atómicos con prefijos convencionales (`feat(atlas):`, `feat(ui):`, `fix(...)`, `test:`, `docs:`, `perf:`, `ci:`).
- Push: `git push -u origin feat/t1-2909`. Abre un PR a `main` titulado **«feat: rediseño Tier 1 — lámina de museo viva (MegaPrompt 29.09)»**.
- **Prohibido:** hacer merge a `main`, force-push, reescribir historia de `main`, tocar la config de Vercel. El PR genera la preview y el humano mergea.

### 0.2 Invariantes del repo (AGENTS.md + tests). Romper uno = FAIL automático

1. **Atlas 2D en `<svg>`.** Prohibidos `three`, `@react-three/*`, `<canvas>` WebGL y cualquier Canvas para la lámina. `npm run dev` abre el atlas SVG.
2. **Nada de 361 puntos.** Solo los 20 puntos estrella del seed. No se inventan puntos, coordenadas de puntos ni hanzi. Si un punto parece mal ubicado, se anota en `docs/T1_2909/DATA_NOTES.md` y no se mueve.
3. **Nada de copiar** textos ni láminas con copyright (Encarta, Netter, Deadman, DK, Kenhub, Visible Body, Complete Anatomy). La figura Goran tek-en (CC BY-SA 4.0) se queda y `public/atlas/ATTRIBUTION.md` se actualiza sin perder sus frases exigidas por test.
4. **Nada de eficacia clínica.** El aviso legal queda visible siempre. En textos nuevos no aparecen «cura», «trata» ni «diagnostica».
5. Sin backend, sin secretos, sin variables de entorno. Deploy estático (`npm run build` → `dist`).
6. Stack fijo: Vite 8 + React **19.2.x (pin exacto)** + TypeScript strict + Tailwind 4 + Zustand 5. Las dependencias nuevas se limitan a devDependencies de test (`@playwright/test`, `@axe-core/playwright`), con versión exacta.
7. **Datos intocables:** 14 meridianos en orden OMS (LU LI ST SP HT SI BL KI PC TE GB LR GV CV). **CV12 = 中脘** (un megaprompt viejo decía 中腔 y **está mal**: el test exige 中脘). ST36 = 足三里. LI4 y SP6 llevan precaución de embarazo en `precautions`. `data/unmapped.json` = `[]`. Contrato de landmarks 800×1600: vértice 40, planta 1480, línea media 400.
8. **Strings y rutas bloqueados por tests** (se pueden mover de lugar, pero tienen que seguir existiendo donde el test los busca):
   - `src/atlas/figure/Figure.tsx` referencia `body-anterior.png` y `body-posterior.png`, y no contiene `fingerD(`, `capsuleD(`, `ellipseD(`, `encSkin`, `@react-three` ni `<Canvas`.
   - `src/atlas/figure/PlateTitle.tsx` contiene el literal `Cuerpo humano — vista anterior`.
   - `src/atlas/AtlasRoot.tsx` no contiene `rounded-[8px]`.
   - `src/app/App.tsx` contiene `AtlasRoot` y no `@react-three/fiber`.
   - `src/app/index.css` contiene `--color-paper` y no `background: #07090d`. `src/atlas/Viewport.tsx` contiene `var(--color-paper)`.
   - `src/atlas/Points2D.tsx` exporta `layoutCallouts` y `type CalloutSeed` (test `tests/labels.test.ts`). Si cambias la API, actualiza el test y conserva la propiedad que prueba: GV14 y los dos EX-B1 separados por ≥ 4 u.
   - `public/atlas/preview-anterior.svg` y `public/atlas/preview-posterior.svg` referencian sus PNG.
   - El aviso legal usa la clave `acu3d.disclaimer.v1`, el contenedor `#legal-gate` y acepta con Enter o Esc.
   - El store conserva `setAtlasView`, `setAtlasRegion`, `setLocale`, `toggleLayer`, `showPoint`, `focusCenter` y `setSelected`, y actualiza vista, región y selección **de forma síncrona**.

### 0.3 Regla de desempate

1. Legibilidad de la lámina > ornamento.
2. Honestidad de los datos > completitud.
3. Tokens y consistencia > gusto local.
4. Lo que se mide en un test > una opinión.
5. Menos código > más código, si el resultado visual es el mismo.

---

## 1. Misión y definición operacional de «Tier 1»

**Misión:** rediseñar el sitio completo para que sea una **lámina de museo viva**. Se ve como un atlas editorial impreso de primera y se usa como un producto de primer nivel: cámara que vuela, búsqueda tipo paleta, ficha editorial y móvil nativo.
Primero se arregla la física de la lámina (escala, tinta, rótulos, composición). Después se viste.

**Tier 1 significa que las diez condiciones se cumplen y se miden (§9):**

| # | Condición | Cómo se mide |
|---|---|---|
| T1 | Legible en 1 s: a 1440×900 y 390×844, sin tocar nada, se ven los meridianos como trazos distinguibles y los puntos estrella como marcas | captura + e2e: trazo ≥ 1.25 px, marca ≥ 10 px |
| T2 | Rotulado de atlas: en desktop, cada punto visible tiene rótulo en una columna de margen con línea guía | `tests/callouts.test.ts`: 0 solapes, 0 cruces |
| T3 | Todo tamaño visual en **px de pantalla constantes**, sin importar zoom ni viewport | e2e mide `getBoundingClientRect` a zoom 1 y 4 |
| T4 | Geometría honesta: meridianos sobre la piel | `tests/meridianSkin.test.ts`: ≤ 0.5 % de muestras a > 4 u, máx. 6 u |
| T5 | Tipografía: 3 familias con rol, hanzi en Noto Serif SC de verdad, cifras lining en códigos, nada < 11 px | grep + `document.fonts.check` en e2e |
| T6 | Color: solo tokens; pigmentos minerales con contraste ≥ 3:1 sobre la piel más oscura y ≥ 7:1 sobre papel; texto ≥ 4.5:1 | `tests/tokens.test.ts` |
| T7 | Movimiento: la cámara vuela en 380–480 ms (ease-out-quint, zoom logarítmico), transiciones de 160–240 ms, `prefers-reduced-motion` = sin animación | tests de cámara + e2e con `reducedMotion` |
| T8 | Móvil de verdad: cabecera ≤ 104 px, ficha en bottom sheet de 3 alturas, nada recortado ni superpuesto, targets ≥ 44 px | e2e a 390×844 |
| T9 | Accesible: WCAG 2.2 AA, puntos navegables con teclado, combobox ARIA, foco visible solo con teclado | axe = 0 serious/critical + e2e de teclado |
| T10 | Verde: typecheck, test, build, e2e y presupuesto | CI |

---

## 2. Estado medido — baseline 29.09 (no se debate: se corrige)

Auditoría del 29-09-2026 sobre `d938da3` con Chromium a 1440×900 y 390×844. Cada defecto tiene un ID. Cada agente lista en su firma los IDs que cierra (`CLOSES:`).

**Escala y motor**
- **D01** Todo se dibuja en unidades del viewBox. A zoom 1 en 1440×900, 1 u ≈ 0.43 px: el meridiano de 1.28 u queda en ≈ 0.55 px (invisible), el punto de r 2.45 u en ≈ 1 px, el área de clic de r 16 u en ≈ 14 px de diámetro (menos que los 24 px de WCAG 2.5.8) y el rótulo de dantian de 13 u en ≈ 5.6 px (ilegible). En 390×844 es peor: 1 u ≈ 0.31 px. Ver `MeridianPaths.tsx:46`, `Points2D.tsx:158-184` y `DantianMarks.tsx:34-54`.
- **D02** Rectángulos fantasma alrededor de la figura. El viewBox usa `meet` y muestra más que 800 u en X, pero el papel y el grano solo cubren viewBox ± 40 u (`Viewport.tsx:101-114`) y el grano de la placa solo 0..800 (`Figure.tsx:99,192`). Se ven dos marcos: #FBF7EE → #FAF6ED → #F8F4EC.
- **D03** La rueda hace zoom hacia el centro y no hacia el cursor (`Viewport.tsx:20-22`). No hay botones +/−/reset ni atajos +/−/0. `preventDefault` dentro de un `onWheel` de React corre en un listener pasivo.
- **D04** Buscar, cambiar de región o elegir un dantian mueve la cámara de golpe, sin animación.
- **D05** El doble clic resetea la vista, pero nada lo indica.

**Geometría de meridianos**
- **D06** El 5.6 % de las muestras (91/1632) cae a más de 4 u fuera de la piel. Los peores casos: TE anterior hasta 54 u (un arco en el aire del hombro a la oreja), GB posterior con 40 % fuera (máx. 19 u), PC 24 %, TE 21 %, HT 18 %, LI 10 %, y KI termina 11–15 u por debajo de la planta. HT7 queda a 16.8 u de su propio meridiano.
- **D07** En la vista posterior solo hay trazo para SI, BL, KI, GB y GV, y se ve vacía (ver la regla de A3 antes de agregar nada).

**Tinta y color**
- **D08** Los 14 meridianos en reposo son la misma tinta #1C1915 al 82 % y no se distinguen entre sí. Al arrancar, `activeMeridianId = "ST"` atenúa los otros 13. El `color` de `data/meridians.json` es un Tailwind saturado (#E23B3B, #2B6CB0, #F59E0B) que solo aparece en el hilo del índice: no cuadra con la lámina.
- **D09** El Qi son cuentas movidas por JS con `getPointAtLength` en cada frame. En pausa no se sabe hacia dónde fluye cada meridiano.

**Puntos y rótulos**
- **D10** A zoom 1 no hay rótulos: los 20 puntos no se descubren sin hover.
- **D11** En Mano, las guías de TE5, LU7, HT7 y PC6 se cruzan. En Rostro, EX-HN3 y GV20 se pisan. El sello de dantian (44 px a ese zoom) tapa EX-HN3.
- **D12** Los códigos usan las cifras old-style de Cormorant: en TE5, LU7 y EX-HN3, el 3, el 5 y el 7 bajan de la línea.

**Composición y regiones**
- **D13** La lámina mide 1358 px de ancho y la figura 250 px: el 80 % es papel muerto, sin función.
- **D14** La región Mano pone la mano a la izquierda y deja la pelvis y los genitales en la mitad derecha, con el sello del dantian inferior. En Rostro los meridianos se salen de la piel. En Pie los trazos siguen más allá de los dedos. El título «Mano — dorso» es falso: HT7, PC6 y LU7 son palmares.
- **D15** La pista «Elige un punto…» flota abajo a la derecha y pisa la sombra en desktop y el crédito en móvil.
- **D16** La sombra de contacto es una elipse plana (`Figure.tsx:120`) que a zoom 2.4 se ve como una losa gris.

**Tipografía**
- **D17** `--font-hanzi` es Cormorant, que no tiene CJK, y `.hanzi` usa `--font-serif` (`index.css:13,63-64`). Noto Serif SC se descarga de Google Fonts y **nunca se usa**: los hanzi caen en la fuente del sistema. Lo mismo pasa en el SVG (`fontFamily="Cormorant Garamond…"`).
- **D18** Hay 15 textos de 9–10 px (`text-[10px]`, `text-[9px]`).
- **D19** La ficha muestra «USO TRADICIONAL EDUCATIVO Uso tradicional educativo: …» duplicado: los 20 registros ya traen ese prefijo y `PointDrawer.tsx:108` lo agrega otra vez.

**Chrome y layout**
- **D20** La barra superior es plana: vista, región e idioma tienen el mismo estilo y no hay jerarquía. En 390 px ocupa 180 px (21 % de la pantalla) repartidos en 4 filas.
- **D21** Los paneles son absolutos (`top-28`, `bottom-[5.5rem]`, todos con `z-20`). En móvil el índice tapa la fila Anterior/Posterior, y la ficha (`w-full max-w-md right-3`) se sale 12 px por la izquierda y tapa toda la lámina. No es un bottom sheet, aunque el README diga que sí.
- **D22** El foco programático en la ficha dibuja un doble marco cinabrio.
- **D23** La barra del reloj se recorta en móvil y el aviso legal pisa el botón «Pausar Qi». El reloj es una lista de siglas, no un gráfico.
- **D24** Al teclear en la búsqueda se abre el índice filtrado. Con «dantian medio» se enfoca el centro, pero el índice dice «Ningún punto coincide». No hay lista de resultados ni navegación con teclado.
- **D25** El pie de la lámina muestra la línea críptica «A/P · 1–4 región · C centros · / buscar» en lugar de una ayuda de atajos.
- **D26** El hilo de color de cada meridiano en el índice usa los colores Tailwind de D08.

**CSS y rendimiento**
- **D27** Cada vista pesa 1.6 MB en PNG y la otra no se precarga: al cambiar A/P con red lenta hay parpadeo.
- **D28** `anchorsToPath` se recalcula en cada render de `MeridianPaths` y `QiFlow`.
- **D29** Esta es la causa de D22 y un riesgo de todo el CSS. En Tailwind 4 las utilidades viven en `@layer utilities`, y el CSS propio **sin capa** (`:focus-visible`, `.file-link`, `.plate-chip`, `.archive-field`…) les gana siempre. Por eso `outline-none` no apaga el foco y cualquier `px-*` sobre `.file-link` se ignora.

**Lo que ya está bien y no se rompe:** la paleta papel/tinta/cinabrio, el Paper Cabinet sin pills, Goran con alpha real, los 20 puntos sobre la piel (test), las regiones 1–4, la ficha con precauciones, el aviso legal y los 29 tests existentes.

---

## 3. Dirección de arte — «Lámina de museo viva»

### 3.1 Norte

Un extraño ve la página 1 segundo y dice «lámina» o «atlas». A los 10 segundos dice «esto está hecho con obsesión».

- **Referencias de nivel (no para copiar):** láminas anatómicas de los siglos XIX y XX (rótulos en columna con líneas guía), la cartografía suiza (casing de trazos, jerarquía), el zoom de Google Arts & Culture, la precisión de los gráficos del NYT y Reuters, y los pigmentos minerales de la pintura china (石绿 malaquita, 朱砂 cinabrio, 赭石 ocre, 石青 azurita).
- **Anti:** dashboard SaaS, glassmorphism, neón, gradientes de marca, pills, emoji, sombras apiladas, librerías de iconos, cualquier 3D.

### 3.2 Tokens (fuente única: `src/app/index.css` + espejo TS en `src/lib/tokens.ts`)

**Color (hex exactos, medidos):**

```
--color-desk          #E7DCC6   escritorio (se queda)
--color-paper         #FBF7EE   hoja
--color-paper-inset   #F3EBDD   filas activas, sheet
--color-ink           #1C1915   texto principal       16.4:1 sobre papel
--color-ink-2         #4A4238   texto secundario       9.2:1
--color-ink-3         #5E554A   meta (nunca < 11 px)   6.8:1
--color-rule          rgba(28,25,21,.18)
--color-rule-strong   rgba(28,25,21,.32)
--color-cinnabar      #8B1E1E   ÚNICO acento de UI: activo, foco, CTA
--pigment-wood        #1B5139   石绿 malaquita  GB LR
--pigment-fire        #8A231D   朱砂 cinabrio   HT SI PC TE
--pigment-earth       #5F3D0C   赭石 ocre       ST SP
--pigment-metal       #3D4A54   铅灰 plomo      LU LI
--pigment-water       #1F3F6E   石青 azurita    BL KI
--pigment-vessel      #1C1915   墨 tinta        GV CV
```

Contraste medido sobre la placa renderizada (muestras de piel: torso #CFA27A, muslo #C7926F, tibia #B8977A):

| pigmento | papel | muslo | tibia |
|---|---|---|---|
| wood #1B5139 | 8.60 | 3.40 | 3.39 |
| fire #8A231D | 8.40 | 3.32 | 3.31 |
| earth #5F3D0C | 9.10 | 3.60 | 3.59 |
| metal #3D4A54 | 8.52 | 3.37 | 3.36 |
| water #1F3F6E | 9.85 | 3.90 | 3.88 |
| vessel #1C1915 | 16.38 | 6.48 | 6.46 |

**Regla:** el color nunca es el único portador de información. Los yin van en trazo continuo y los yang en guion largo. Cada trazo lleva además un rótulo de ruta con su código.
`data/meridians.json → color` pasa a ser el hex del pigmento de su elemento; GV y CV usan vessel. El schema solo exige un string.

**Tipografía:**

| Rol | Familia | Uso |
|---|---|---|
| Display | Cormorant Garamond 500/600 | títulos de lámina, portada, nombre en la ficha |
| Pinyin | Cormorant Garamond 500 *italic* (`@fontsource/cormorant-garamond/500-italic.css`) | pinyin en rótulos y ficha |
| UI y códigos | Outfit 400/500/600, `font-variant-numeric: lining-nums tabular-nums` | todo el chrome; los códigos en 600 con tracking .04em |
| Hanzi | **Noto Serif SC** 500/600 (ya enlazada en `index.html`) | todo hanzi, en HTML y en SVG |

Escala en px: **11** (meta en versalitas, tracking .14em) · **12** (rótulos de lámina) · **13** (UI) · **15** (cuerpo de ficha, interlineado 1.55) · **18** · **24** · **32** (título de lámina; 24 en móvil) · **64** (hanzi de ficha; 48 en móvil). **Mínimo absoluto: 11 px.**

**Espaciado:** base de 4 px. Gutter interno de la lámina: 24 px en desktop, 12 px en móvil. Cabecera: 56 px en desktop; 48 + 44 px en móvil.
**Radio:** 2 px. `rounded-full`, `rounded-xl` y `rounded-2xl` están prohibidos.
**Sombras:** una para la hoja, `0 18px 40px rgba(28,25,21,.10)` más el filete. Una para popover/sheet, `0 8px 24px rgba(28,25,21,.14)`.
**Movimiento:** `--dur-1: 120ms` (hover), `--dur-2: 200ms` (paneles), `--dur-3: 420ms` (cámara), `--ease-paper: cubic-bezier(.22,1,.36,1)`. La cámara usa easeOutQuint (§8.2).
**z-index:** lámina 0 · mobiliario 10 · cabecera 30 · índice en overlay 40 · sheet 45 · paleta y ayuda 60 · aviso legal 70.
**Iconos:** propios, en `src/ui/icons.tsx`: SVG de 20×20, trazo 1.25, `currentColor`, `aria-hidden`. Son lupa, más, menos, reset, play, pausa, capas, índice, cerrar, flecha izquierda, flecha derecha y ayuda. Sin librería de iconos.

### 3.3 Composición de la lámina

Desktop (≥ 1024 px):

```
┌─ cabecera 56 px ────────────────────────────────────────────────────────────┐
│ 针 Enciclopedia del cuerpo │ [Anterior|Posterior] Cuerpo Rostro Mano Pie │ ⌕ Buscar  / │ ES·EN │ ? │
├─ índice 0|288 ─┬──────────────────── LÁMINA ─────────────────────┬─ ficha 0|400 ─┤
│                │ LÁM. I          Cuerpo humano — vista anterior   │               │
│                │        Catorce meridianos · veinte puntos · toca uno            │
│                │ GV20 百会 ·──────┐        ◉        ┌──────· EX-HN3 印堂        │
│                │ CV17 膻中 ·──────┤ D     /|\     I ├──────· CV12 中脘          │
│                │    columnas de rótulos      figura      columnas de rótulos    │
│                │ ┌reloj┐                                  ┌─ clave ─────────┐   │
│                │ │ 24h │  Goran tek-en · CC BY-SA 4.0     │ ─ yin  - - yang │   │
│                │ └─────┘                     ⊕ ⊖ ⟲        └─────────────────┘   │
├────────────────┴── pie: aviso legal (1 línea, siempre visible) ─────────────────┤
```

Móvil (390×844):

```
┌ 针 Enciclopedia     ⌕   ≡   ES ┐ 48 px
│ [Ant|Post]  Cuerpo Rostro Mano Pie → │ 44 px (scroll-x con fundido)
│                                │
│        LÁMINA a ancho completo  │  rótulos: solo hover/seleccionado; clusters
│                                │
│ ▶ 07 ST  (reloj chip)     ⊕ ⊖ ⟲ │
│ aviso legal (1–2 líneas)        │
└────────────────────────────────┘
+ ficha en bottom sheet: peek 168 px · half 52dvh · full (100dvh − 48 px)
```

**Mobiliario de la lámina (B1):**
- **Folio** «LÁM. I» arriba a la izquierda, en versalitas de 11 px. Numeración: I anterior, II posterior, III rostro, IV mano, V pie.
- **Título** centrado en Cormorant 32 px, con un subtítulo de 13 px en ink-2: «Catorce meridianos · veinte puntos estrella · toca un punto para abrir su ficha». Este subtítulo reemplaza a D15.
- **Orientación:** «D» e «I» son derecha e izquierda **del sujeto**, a los lados de la figura. En la vista anterior la D va a la izquierda del lector; en la posterior, a la derecha.
- **Columnas de rótulos** (B3, §3.5).
- **Clave** abajo a la derecha, en un `<details>`: abierta desde 1280 px y cerrada en móvil. Contiene los 5 pigmentos más vessel con nombre de elemento ES/EN y hanzi (木 火 土 金 水 · 任督), una muestra yin/yang, la marca de punto, el sello de dantian y el pulso de Qi.
- **Reloj de órganos** abajo a la izquierda, en un slot (C4 lo dibuja y B1 lo ubica).
- **Colofón** bajo el reloj: «Figura: Goran tek-en · CC BY-SA 4.0 · adaptada · Nomenclatura OMS».
- **Minimapa** arriba a la derecha cuando el zoom es > 1.25 o la región no es cuerpo.
- **Controles de zoom** ⊕ ⊖ ⟲ de 44 px, sobre la clave.

### 3.4 Tinta: meridianos (B2)

- **Doble pase cartográfico.** Primero un casing de papel `rgba(251,247,238,.6)` y después el trazo de pigmento, ambos en px de pantalla con `strokeWidth = px * k` (§8.1):
  - En reposo: casing 3.5 px + trazo 1.25 px, opacidad .85.
  - Activo: casing 5 px + trazo 2.25 px, opacidad 1.
  - Atenuado (hay un meridiano activo elegido por el usuario y este no es): opacidad .28.
- **Yin** en trazo continuo. **Yang** en guion `7 2.5` px. Si H1 lo veta por ruido, todos pasan a continuo y se agregan rótulos de ruta, y se anota en DECISIONES.
- **Rótulo de ruta:** el código del meridiano (Outfit 600, 11 px, con halo de papel) junto al primer ancla de cada trazo, sin pisar marcas de puntos.
- **Chevrones de flujo:** un chevron de 5 px cada ~140 px de pantalla, orientado según el sentido del Qi (orden de las anclas, que ya coincide con `flow` en los 14 meridianos). Son estáticos y siguen visibles en pausa.
- **Hora del reloj:** el meridiano de la hora actual lleva el casing teñido con su pigmento al 12 %.
- **Estado inicial:** `activeMeridianId = null`, así que no hay nada atenuado al cargar. Con `null`, el Qi recorre el meridiano de la hora actual.
- Los paths se memorizan por `(id, vista, lado)` (D28).

### 3.5 Puntos, rótulos y dantian (B3)

- **Marca = sello de registro** (px de pantalla): halo de papel r 6 + aro de 1.25 en el pigmento del meridiano + núcleo de tinta r 2.5.
  - Hover: r 7, aro de 1.6 en cinabrio.
  - Seleccionado: aro cinabrio de 2 + cuatro ticks de registro de 4 px (la cruz de impresor) + **un solo** pulso de 600 ms (no infinito).
- **Hit:** círculo transparente de r = 12 px, o 22 px en `(pointer: coarse)`.
- **Clusters:** si dos o más marcas quedan a menos de 14 px en pantalla (la mano en móvil), se dibuja una sola marca con el número. Al tocarla, `flyTo` a la región (mano, pie o rostro) o zoom ×2.5 sobre el centroide.
- **Teclado:** cada punto tiene **una** parada de tab (la instancia L; la espejo lleva `tabIndex={-1}` y `aria-hidden`), con `role="button"` y `aria-label="ST36 Zúsānlǐ, Tres li del pie, meridiano Estómago"`. Enter o Espacio lo selecciona. El anillo de foco se dibuja en SVG (cinabrio de 2 px), porque `outline` no sirve en `<g>`.
- **Tooltip** en desktop: un popover HTML (no SVG) junto a la marca, con código · hanzi · pinyin · nombre, y 120 ms de retardo. Se posiciona con `unitsToClient` (§8.2).
- **Rótulos de margen** (la pieza insignia, §8.3). A zoom ≤ 1.6 en la región cuerpo, cada punto visible lleva un rótulo en una columna izquierda o derecha. La línea guía hace un codo: sale horizontal del punto hasta una x de quiebre común a la columna y sigue en diagonal hasta el rótulo. Como el orden se conserva, **no hay cruces por construcción**, y el test lo verifica.
  - Formato del rótulo: `ST36` en Outfit 600 12 px lining + `足三里` en Noto Serif SC 12.5 px. La guía es de 0.75 px en tinta al 55 % y remata en un punto de 1.3 px.
  - Si el margen no alcanza (móvil), `layoutMarginCallouts` devuelve `null` y solo se rotula el punto en hover o seleccionado.
  - En las regiones se usa el mismo algoritmo, con la caja de la región como «figura» (`REGION_FOCUS`, §4).
  - El hover sobre un rótulo resalta su punto y viceversa. El clic en el rótulo selecciona el punto.
- **Dantian:** sello de 26 px de diámetro (32 px como máximo en las regiones), con hanzi de 13 px y pinyin de 11 px en itálica. Si un punto queda a menos de 20 px, el sello baja al 70 % y su rótulo se corre hacia afuera: nunca tapa un punto (D11). El eje punteado es de 1 px.

### 3.6 Qi (B2)

- **Cometa en CSS**, sin JS por frame. Se dibujan tres capas sobre el mismo `<path pathLength={1}>`: cabeza, medio y cola, con dash de 0.04, 0.08 y 0.16, y anchos de 3.5, 2.6 y 2 px en opacidades 1, .5 y .22, todas en el pigmento del meridiano. Cada capa se anima con `stroke-dashoffset` usando **keyframes fijos por capa** (§8.5).
  - ⚠️ Probado en Chromium: `var()` **dentro** de `@keyframes` para `stroke-dashoffset` se ignora, y el cometa queda clavado en el inicio. Usa tres `@keyframes` con offsets literales.
- **Duración** = largo del trazo en u / (160 × velocidad) segundos. El largo sale de `pathLength()` (§8.4), que es analítico y no necesita DOM.
- **Pausa** con `animation-play-state: paused`: el cometa queda congelado y los chevrones siguen visibles.
- Con `prefers-reduced-motion`, el cometa no existe, los chevrones se quedan y Play queda deshabilitado con tooltip.
- La lógica del reloj de órganos (`useOrganClock`) se mantiene.

### 3.7 Figura y regiones (B1)

- **D02:** se elimina el grano en SVG, tanto en Viewport como en Figure. El grano pasa a CSS: la clase `.paper-grain` de A1 es un data-URI SVG con `feTurbulence` al 4 % sobre la hoja. El papel del SVG cubre `visibleRect` (§8.1).
- **D16:** la sombra de contacto es un `radialGradient` elíptico (no una elipse plana), con opacidad .14, rx 240 y ry 12, y solo aparece con zoom ≤ 1.3.
- **D14, foco regional:** `PlateDefs.tsx` define `<mask id="region-focus">` y se renderiza siempre, aunque la capa cuerpo esté apagada. En la región cuerpo el mask es blanco completo. En Rostro, Mano y Pie es una elipse difuminada (blanco al 100 % en el centro y 12 % fuera), así que el contexto queda como un fantasma, como con la lupa de un museo. Figure y MeridianPaths aplican `mask="url(#region-focus)"`. Los puntos no se enmascaran.
- **Títulos honestos:** «LÁM. III — Rostro y cabeza», «LÁM. IV — Mano y muñeca», «LÁM. V — Tobillo y pie».
- **D27:** el PNG de la vista actual se precarga con `<link rel="preload" as="image" fetchpriority="high">` y el de la otra vista con `requestIdleCallback`.
- **Grade:** puedes afinar la matriz `fig-grade` (menos naranja, medios más altos) solo con A/B en capturas; H1 elige y el encuadre no cambia.
- `PlateThumb` (miniatura de 72×144 con la marca del punto) sirve para la ficha, y `Minimap` para el zoom.
- `public/atlas/ATTRIBUTION.md` suma una línea por cambio de composite (foco regional, grade, grano en CSS) y conserva todas las frases del test.

### 3.8 Chrome (C1–C4)

- **Cabecera (C1):** tres grupos con jerarquía. A la izquierda la marca (针 + título Cormorant). Al centro los controles de lámina: un segmentado Anterior|Posterior (`role="radiogroup"`, subrayado cinabrio de 2 px que se desliza) y las regiones Cuerpo · Rostro · Mano · Pie (otro radiogroup). A la derecha las utilidades: el disparador «Buscar /», el conmutador «ES · EN» y el botón «?».
- **Paleta de búsqueda (C1):** un diálogo modal centrado de `min(640px, 92vw)` en desktop y a pantalla completa en móvil, con `input` `role="combobox"` + `listbox`.
  - Resultados agrupados: **Puntos** (código, hanzi, pinyin, nombre y cuadrito de pigmento), **Meridianos**, **Centros**, **Vistas y regiones** («Ir a Posterior», «Región Mano») y **Acciones** («Pausar Qi», «Mostrar capas»).
  - Coincidencia sin acentos ni tonos sobre código, pinyin (sin espacios), nombres ES/EN, hanzi y alias.
  - ↑↓, Enter y Esc. Recientes en `localStorage` con la clave `acu3d.recent.v1`, dentro de try/catch. Se abre con `/`, `Ctrl+K` y `⌘K`.
  - La lógica pura va en `src/lib/search.ts` con tests. El código exacto, el hanzi exacto o el pinyin exacto quedan primeros y Enter los abre (compatible con `exactPoints` de `tests/controls.test.ts`).
- **Índice (C4):** columna de 288 px.
  - **Capas:** 5 interruptores con glifo.
  - **Elementos:** 5 filtros con un cuadrito de pigmento de 8×8 y etiqueta, sin pills.
  - **Meridianos**, agrupados Madera → Fuego → Tierra → Metal → Agua → Vasos. Cada fila tiene cuadrito de pigmento, código (Outfit 600 lining), nombre, `names.zh` (足阳明胃经…), número de puntos y hora («07–09»).
  - Los puntos estrella se anidan bajo el meridiano activo.
  - **La búsqueda ya no filtra el índice** (D24).
- **Ficha (C2):**
  - Cabecera: código + cuadrito de pigmento con el meridiano; hanzi de 64 px en Noto Serif SC; pinyin en itálica Cormorant de 22 px; nombre en 15 px.
  - `dl` de metadatos: Meridiano · Elemento (con 木火土金水) · Polaridad · Lateralidad (Bilateral / Línea media) · Hora del reloj.
  - Localización: texto + `PlateThumb`.
  - Funciones. Uso tradicional, con el prefijo quitado por `stripTraditionalPrefix()` (D19). Precauciones (se queda el bloque de filete). Combinaciones.
  - Confianza: medidor de 3 pasos + la línea «ancla didáctica 2D, no una medición clínica».
  - Fuentes como notas numeradas.
  - Pie: ← anterior / siguiente → dentro del mismo meridiano (solo puntos del seed), «Seguir el Qi» como botón secundario con contorno, y cerrar.
  - En desktop es una columna de 400 px integrada en la grilla: la lámina se reacomoda y nada se superpone. En móvil va en `Sheet` (peek / half / full).
- **Sheet (C2):** asa, arrastre con pointer events, snaps por umbral y velocidad (función pura `nextSnap`, testeada), `env(safe-area-inset-bottom)`, trampa de foco solo en full. En peek y half la lámina sigue interactiva y la cámara se corre para que el punto quede centrado en el área visible sobre el sheet.
- **D22:** el contenedor del diálogo lleva `outline: none` (dentro de `@layer`, ver D29) y el foco programático va al `h2` con `tabIndex={-1}`.
- **Reloj de órganos (C4):** un dial SVG de 24 h con las 0 arriba y 12 sectores de 30°. Cada sector tiene el pigmento de su meridiano al 18 %, con el sector activo al 100 % y una aguja cinabrio. El código va dentro del sector.
  - Play/pausa de 44 px en el centro. Debajo, «07:00–09:00 · ST Estómago» y un segmentado de velocidad 0.5× · 1× · 2× · 4×.
  - Teclado: `radiogroup` con flechas.
  - Desktop: dial de 132 px en el slot de la lámina. Móvil: chip de 44 px en el pie («▶ 07 ST») que abre un popover con el dial.
- **Pie y portada (C3):** el aviso legal es una línea permanente de 11 px en ink-2 y nunca queda tapado (tiene su fila propia en la grilla). La portada (`LegalModal`) es editorial: título, una introducción de 3 líneas y tres ítems («Qué es / Qué no es / Fuentes»), con el CTA «Entiendo, entrar al atlas». Misma clave, mismo `#legal-gate`, Enter/Esc.
- **Ayuda «?» (C3):** un diálogo con los atajos: `/` o `⌘K` buscar · `A`/`P` vista · `1–4` región · `C` centros · `+`/`−`/`0` zoom · `←`/`→` punto anterior/siguiente · `Esc` cerrar · `?` ayuda. Reemplaza a D25.

---

## 4. Arquitectura objetivo y contratos entre agentes

Los agentes trabajan en paralelo. **Estos contratos son la ley.** Si un agente necesita algo que no está aquí, se lo pide a OX, que decide y lo anota en DECISIONES.

### 4.1 Mapa de archivos (un solo escritor por archivo por oleada)

| Archivo | Dueño | Oleada |
|---|---|---|
| `src/app/index.css`, `index.html`, `src/lib/colors.ts`, `src/lib/tokens.ts` (nuevo), `src/ui/icons.tsx` (nuevo), `tests/tokens.test.ts` (nuevo) | A1 | W1 |
| `src/atlas/Viewport.tsx`, `src/atlas/screen.ts` (nuevo, §8.1), `src/atlas/camera.ts` (nuevo, §8.2), `src/atlas/cameraKeys.ts` (nuevo), `src/atlas/ZoomControls.tsx` (nuevo), `src/state/viewerStore.ts`, `src/atlas/regionFrames.ts`, `src/lib/paperTransition.ts`, `tests/camera.test.ts` (nuevo), `tests/controls.test.ts` (solo agregar) | A2 | W1 |
| `src/atlas/meridianAnchors.ts`, `data/meridians.json` (solo `anchors2d` y `color`), `src/atlas/catmullRom.ts` (§8.4), `tests/meridianSkin.test.ts` (nuevo, §8.4), `docs/T1_2909/DATA_NOTES.md` | A3 | W1 |
| `src/atlas/AtlasRoot.tsx`, `src/atlas/figure/**` (+ `PlateDefs.tsx`, `PlateFurniture.tsx`, `PlateThumb.tsx`, `Minimap.tsx`), `public/atlas/preview-*.svg`, `public/atlas/ATTRIBUTION.md` | B1 | W2 |
| `src/atlas/MeridianPaths.tsx`, `src/atlas/QiFlow.tsx`, `src/atlas/qiTime.ts`, `src/atlas/qi.css` (nuevo) | B2 | W2 |
| `src/atlas/Points2D.tsx`, `src/atlas/DantianMarks.tsx`, `src/atlas/callouts.ts` (nuevo, §8.3), `src/atlas/PointTooltip.tsx` (nuevo), `src/atlas/centers.ts` (solo posición y layout, no textos), `tests/callouts.test.ts` (nuevo), `tests/labels.test.ts` | B3 | W2 |
| `src/ui/Topbar.tsx`, `src/ui/SearchBox.tsx`, `src/ui/CommandPalette.tsx` (nuevo), `src/lib/search.ts` (nuevo), `tests/search.test.ts` (nuevo) | C1 | W2 |
| `src/ui/PointDrawer.tsx`, `src/ui/CenterDrawer.tsx`, `src/ui/Sheet.tsx` (nuevo), `src/lib/text.ts` (nuevo), `tests/text.test.ts`, `tests/sheet.test.ts` (nuevos) | C2 | W2 |
| `src/app/App.tsx`, `src/ui/Disclaimer.tsx`, `src/ui/LegalModal.tsx`, `src/ui/HelpDialog.tsx` (nuevo), `src/app/ErrorBoundary.tsx`, `src/main.tsx` | C3 | W2 |
| `src/ui/MeridianRail.tsx`, `src/ui/QiClock.tsx`, `tests/clock.test.ts` (nuevo) | C4 | W2 |
| `.github/workflows/ci.yml`, `package.json` (scripts), `scripts/budget.mjs` (nuevo) | Q1 | W3 |
| `src/i18n/messages.ts` (paridad y limpieza), `tests/i18n.test.ts` (nuevo) | Q2 | W3 |
| `playwright.config.ts`, `e2e/**`, `scripts/shots.mjs` (§8.6), `docs/T1_2909/shots/after/**` | Q3 | W3 |
| parches de rendimiento (memo), `vite.config.ts` | Q4 | W3 |
| `README.md`, `docs/ARQUITECTURA.md`, `docs/DEPLOY.md`, `docs/T1_2909/*.md` | OX | W0, W5 |

**CSS por feature:** el CSS de un componente va en un archivo propio junto a él (`qi.css`, `sheet.css`, `palette.css`…), importado desde ese componente y **siempre dentro de `@layer components`**. `index.css` es solo de A1 (tokens, base, utilidades comunes).
**i18n:** cada agente agrega sus claves en `src/i18n/messages.ts` **solo** dentro de un bloque delimitado `// --- <ID> ---` al final de `es` y de `en`, con las mismas claves en ambos. OX resuelve los merges y Q2 ordena y verifica paridad en W3.

### 4.2 Contrato del store (A2 lo implementa en W1; los demás solo lo consumen)

```ts
// state nuevo
plateBox: { w: number; h: number };  setPlateBox(b: { w: number; h: number }): void;  // lo escribe Viewport (ResizeObserver)
paletteOpen: boolean;   setPaletteOpen(v: boolean): void;
helpOpen: boolean;      setHelpOpen(v: boolean): void;
sheetSnap: "closed" | "peek" | "half" | "full"; setSheetSnap(s): void;
labelsMode: "auto" | "all" | "none";          setLabelsMode(m): void;  // auto = columnas si caben
activeMeridianId: string | null;               // valor inicial: null (antes "ST")
// cámara (§8.2)
flyTo(target: Camera, opts?: { duration?: number }): void;  // anima; reduced-motion o sin rAF = instantáneo
zoomBy(factor: number, anchor?: Point2D): void;
stopFlight(): void;                            // se llama en pointerdown del usuario
resetAtlasCamera(): void;                      // ahora vuela
```

- `showPoint`, `focusCenter`, `setAtlasRegion`, `setAtlasView` y `resetAtlasCamera` fijan selección, vista y región **de forma síncrona** y mueven la cámara **con `flyTo`**.
- `regionFrames.ts` exporta además `REGION_FOCUS: Record<AtlasRegion, { cx: number; cy: number; rx: number; ry: number } | null>`. A2 deriva los valores de `regionFrame()` y de la caja de los puntos estrella de cada región: todos los puntos de la región deben quedar dentro, con ≥ 16 u de margen (test).
- `cameraKeys.ts` exporta `handleCameraKey(e: KeyboardEvent): boolean` para `+`, `=`, `-`, `0`. C3 lo llama desde el handler de teclado de `App`.
- `camera.ts` exporta además `unitsToClient(p, rect, pan, k)`, la inversa de `clientToUnits`.

### 4.3 Contrato de layout (C3 es dueño de `App.tsx`)

```css
.app {
  display: grid; height: 100dvh;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: var(--index-w, 0px) minmax(0, 1fr) var(--folio-w, 0px);
  grid-template-areas: "head head head" "index plate folio" "foot foot foot";
  transition: grid-template-columns var(--dur-2) var(--ease-paper);
}
/* ≥1024px: --index-w 288px si el índice está abierto; --folio-w 400px si hay selección.
   <1024px: columnas en 0; el índice es un drawer en overlay con scrim y la ficha es Sheet. */
```

- `AtlasRoot` recibe `clock?: ReactNode` y renderiza `<main id="plate" data-testid="plate">` llenando su celda (`relative h-full w-full`), **sin** offsets absolutos ni cálculos de `railOpen`/`detailOpen`.
- Dentro de la lámina, `AtlasRoot` ubica `ZoomControls`, `Minimap`, la clave y el slot del reloj a través de `PlateFurniture`.
- **`data-testid` estables (e2e):** `legal-accept`, `index-toggle`, `search-trigger`, `palette-input`, `palette-option`, `plate`, `point-<CODE>` (instancia principal), `callout-<CODE>`, `folio`, `sheet`, `sheet-handle`, `clock-dial`, `clock-play`, `zoom-in`, `zoom-out`, `zoom-reset`, `help-dialog`, `view-anterior`, `view-posterior`, `region-<body|face|hand|foot>`.

### 4.4 Contrato de tokens (A1 → todos)

`src/lib/tokens.ts` exporta `INK`, `INK_2`, `INK_3`, `PAPER`, `CINNABAR`, `RULE`, `PIGMENT: Record<Elemento | "vessel", string>`, `ELEMENT_HANZI: Record<Elemento, string>` y `meridianPigment(m: { id: string; element?: Elemento }): string` (GV y CV → vessel).
`src/lib/colors.ts` reexporta `INK` y `CINNABAR` para no romper imports, y `getMeridianColor(id)` devuelve el pigmento.
Clases CSS comunes de A1: `.paper-grain`, `.desk-grain`, `.code`, `.hanzi`, `.pinyin`, `.t-meta`, `.t-label`, `.t-body`, `.btn`, `.btn-primary`, `.btn-ghost`, `.seg` (segmentado), `.chip-square` (cuadrito de pigmento), `.rule`, `.plate-shell`.

---

## 5. Protocolo multiagente Grok 4.7

- **Spawn:** usa la herramienta `Task`, igual que en los enjambres anteriores de este repo:

  ```
  Task(
    subagent_type: "generalPurpose" | "explore" | "bash",
    description: "<ID> <≤6 palabras>",
    prompt: "<tarjeta completa del rol (§6) + §0.2 + las secciones de §3 y §4 que le tocan + el snippet de §8 si aplica + DoD + formato de firma + 'no preguntes; reporta a OX'>"
  )
  ```

- Hasta **8 hijos en vuelo** (OX no cuenta). Profundidad 1: los hijos no crean nietos.
- **Los hijos empiezan en frío:** OX les pega todo lo que necesitan, porque no leen este prompt.
- **Worktree por escritor:** `git worktree add ../wt-<ID> -b t1/<ID> <base-de-la-oleada>`. Cada hijo commitea en su rama. OX integra en `feat/t1-2909` con `git merge --no-ff t1/<ID>`, en el orden de la tabla de §6. Ante un conflicto gana el dueño del archivo; OX resuelve `messages.ts` e `index.css`.
- **Verificación antes de firmar** (en su worktree): `npm run typecheck && npm test && npm run build`. Si tocó UI, además una captura propia con `scripts/shots.mjs` (§8.6) cuando haya navegador.
- **Reintentos:** un hijo que falla se relanza **una vez** con el log del fallo. Si falla de nuevo, OX lo arregla o recorta alcance y lo anota en DECISIONES. Nunca se abandona un rol en silencio.
- **Timebox:** si un hijo pasa ~45 min de reloj o acumula 3 verificaciones fallidas, se detiene, firma FAIL con BLOCKER y OX decide.
- **Fallback:** si el runtime no expone `Task` o limita a menos de 8 hijos, OX ejecuta los roles **en serie**, en el orden de las oleadas, con las mismas firmas. No se omite ningún rol.
- **Navegador:** Playwright necesita Chromium (`npx playwright install chromium`). Si no se puede instalar, prueba `executablePath` de un Chrome o Chromium del sistema. Si no hay ninguno, Q3 lo declara en su firma, el e2e corre solo en CI y H1 juzga con el código, los previews y las capturas de CI.

**Firma obligatoria** (las últimas líneas de la respuesta de cada hijo; OX las copia a `docs/T1_2909/SIGN_OFF.md`):

```
ID: B3
STATUS: PASS | FAIL
CLOSES: D01 D10 D11
CHANGED: src/atlas/Points2D.tsx, src/atlas/callouts.ts, tests/callouts.test.ts
CHECKS: typecheck=0 test=0 (N tests) build=0
METRIC: <las métricas de su DoD, con números>
BROKEN: none | <lista>
NOTE: ≤ 2 frases
```

---

## 6. Roster (16 hijos + OX) y oleadas

| Oleada | ID | Rol | Tipo | En vuelo |
|---|---|---|---|---|
| W0 | OX | Baseline, rama, capturas «antes» | tú | — |
| W1 | A1 | SISTEMA: tokens, tipografía, iconos, capas CSS | generalPurpose + worktree | 3 |
| W1 | A2 | MOTOR: escala en pantalla, cámara, viewport, store | generalPurpose + worktree | |
| W1 | A3 | GEOMETRÍA: meridianos sobre la piel | generalPurpose + worktree | |
| W2 | B1 | LÁMINA: figura, composición, regiones, mobiliario | generalPurpose + worktree | 7 |
| W2 | B2 | TINTA: meridianos + Qi | generalPurpose + worktree | |
| W2 | B3 | MARCAS: puntos, rótulos de margen, dantian | generalPurpose + worktree | |
| W2 | C1 | CABECERA + PALETA | generalPurpose + worktree | |
| W2 | C2 | FICHA + SHEET | generalPurpose + worktree | |
| W2 | C3 | LAYOUT + PORTADA + AYUDA + TECLADO | generalPurpose + worktree | |
| W2 | C4 | ÍNDICE + RELOJ DE ÓRGANOS | generalPurpose + worktree | |
| W3 | Q1 | BUILD / CI / presupuesto | bash | 4 |
| W3 | Q2 | A11Y + I18N + DATOS | generalPurpose | |
| W3 | Q3 | QA VISUAL + E2E | generalPurpose + bash | |
| W3 | Q4 | RENDIMIENTO | generalPurpose | |
| W4 | H1 | DIRECTOR DE ARTE (veto estético) | explore | 2 |
| W4 | H2 | PRODUCTO (veto funcional) | explore + bash | |
| W5 | OX | Cierre: merge, docs, PR | tú | — |

Orden de merge en W2: B1 → B2 → B3 → C3 → C1 → C2 → C4. Después de cada merge: `npm run typecheck`.

---

## 7. Tarjetas de rol (OX pega la tarjeta entera al crear cada hijo)

### W0 · OX — Baseline

1. §0.1 (rama y carpetas).
2. `npm ci && npm run typecheck && npm test && npm run build`. Anota tiempos, número de tests y tamaño de `dist` en `docs/T1_2909/BASELINE.md`.
3. Crea `scripts/shots.mjs` (§8.6) e instala `@playwright/test` como devDependency exacta. Con `npm run build && npx vite preview --port 4173` levantado, corre `node scripts/shots.mjs docs/T1_2909/shots/before`. Son 48 JPG.
4. Copia §2 (D01–D29) a `BASELINE.md` como checklist `- [ ] D01 …`. Los agentes marcan lo que cierran.
5. Crea `DECISIONES.md`, `LOG.md`, `DATA_NOTES.md` y `SIGN_OFF.md` (tabla vacía de firmas).
6. Commit: `docs: baseline T1 29.09 y capturas antes`.

### W1 · A1 — SISTEMA

**Cierra:** D12 D17 D18 D22 D29 (base) · **Dueño:** ver §4.1 · **No toca:** componentes.

1. Tokens de §3.2 en `@theme` de Tailwind 4, para que existan `bg-paper`, `text-ink-2`, `border-rule` y demás. Los pigmentos van como `--pigment-*` en `:root` y los mismos hex en `src/lib/tokens.ts` (§4.4).
2. **Capas (D29):** todo el CSS propio va a `@layer base` (reset, `:focus-visible`, `html/body`) y `@layer components` (`.btn`, `.seg`, `.file-link`…). Fuera de capa solo quedan `@theme` y `@keyframes`. Comprueba en el navegador que `outline-none` y `px-*` funcionan sobre esas clases.
3. **Tipografía:** `--font-hanzi: "Noto Serif SC", "Songti SC", "SimSun", serif`, y `.hanzi` usa `--font-hanzi`. `.code` = Outfit 600, `font-variant-numeric: lining-nums tabular-nums`, tracking .04em. `.pinyin` = Cormorant 500 italic, importando `@fontsource/cormorant-garamond/500-italic.css`. Clases de escala `.t-meta` (11 px caps .14em), `.t-label` 12, `.t-ui` 13, `.t-body` 15/1.55, `.t-title` 32/24.
4. Deja `index.html` con el link de Noto Serif SC (`wght@500;600`) y agrega `<link rel="preload" as="image" href="/atlas/body-anterior.png" fetchpriority="high">`. Opcional: genera un `&text=` con todos los hanzi de `data/`, `centers.ts` y `messages.ts` desde `scripts/hanzi-subset.mjs`, con un test que verifique que ninguno falta.
5. `:focus-visible` con outline cinabrio de 2 px y offset 2. `[tabindex="-1"]:focus { outline: none }`.
6. `.paper-grain` y `.desk-grain`: data-URI SVG `feTurbulence` (baseFrequency 1.15 y 0.75) al 4–5 %, más la viñeta cálida del escritorio (la que hoy está inline en App).
7. `src/ui/icons.tsx`: los 12 iconos de §3.2.
8. Deja los alias viejos (`--color-brass`, `--color-brass-line`, `--color-jade-ink`) apuntando a ink-2 y rule, marcados `/* deprecated */`. Q2 los borra al final si nadie los usa.
9. `tests/tokens.test.ts`: implementa la luminancia relativa WCAG y verifica cada pigmento ≥ 3:1 contra #CFA27A, #C7926F y #B8977A, y ≥ 7:1 contra el papel; ink, ink-2 e ink-3 ≥ 4.5:1 contra papel y paper-inset. Además, que cada hex de `tokens.ts` aparezca en `index.css` (comparando sin distinguir mayúsculas).

**DoD:** tokens.test en verde. `rg -n "text-\[(9|10)px\]" src` sigue igual (los usos los migran los dueños en W2), pero ninguna clase nueva de A1 baja de 11 px. Typecheck, test y build en 0.

### W1 · A2 — MOTOR

**Cierra:** D01 (infraestructura) D02 (Viewport) D03 D04 D05 · **Dueño:** ver §4.1.

1. `screen.ts` y `camera.ts` **exactamente** como en §8.1 y §8.2. Puedes agregar exports, no cambiar firmas.
2. **Viewport:**
   - `ResizeObserver` → `plateBox` en el store + `ScreenContext.Provider value={{ k, box }}`.
   - El rect de papel cubre `visibleRect(pan, k, box)`. Se borran los rects y el filtro de grano.
   - Rueda: listener nativo `{ passive: false }` en `useEffect`, con `zoomAbout` hacia el cursor (`clientToUnits`). `ctrlKey` + rueda (pinch del trackpad) usa el mismo camino.
   - Arrastre con pointer capture; `stopFlight()` al empezar.
   - Pinch con dos pointer events (no touch events), anclado en el punto medio.
   - Doble clic o doble tap → `resetAtlasCamera()`.
   - Pan acotado: la figura (0..800 × 0..1600) nunca sale del todo del área visible.
3. **Store:** todo §4.2, con `flyTo` como en §8.2. `activeMeridianId` arranca en `null`. `showPoint` → `flyTo({ pan: pos, zoom: 2.4 })`; regiones → `flyTo(regionFrame(...))`; dantian → `flyTo(...)`. Todo lo demás se fija síncrono.
4. `REGION_FOCUS` en `regionFrames.ts` (§4.2), con un test: cada punto estrella de la región está dentro de su elipse con ≥ 16 u de margen.
5. `cameraKeys.ts` y `ZoomControls.tsx` (⊕ ⊖ ⟲ de 44 px, con `data-testid` de §4.3, icons de A1 y `aria-label` i18n).
6. **Tests:** `tests/camera.test.ts` (§8.2) + los agregados a `controls.test.ts`: `flyTo` sin rAF aplica al instante y acota; `showPoint("ST36")` deja `selectedPointId` síncrono; `zoomBy` respeta el ancla.

**DoD:** en la captura 1440 `01-anterior`, los píxeles de papel en x = 20 %, 35 %, 65 % y 80 % del ancho de la lámina (y = 50 %) son #FBF7EE ± 2 por canal (D02). Rueda sobre ST36 ×4: ST36 sigue a ≤ 2 px del cursor (sin navegador, alcanza con el test de `zoomAbout` de §8.2; el e2e de Q3 lo confirma en W3). Typecheck, test y build en 0.

### W1 · A3 — GEOMETRÍA

**Cierra:** D06, y D07 si aplica · **Dueño:** ver §4.1.

1. Agrega `samplePath` y `pathLength` a `catmullRom.ts` (§8.4) y crea `tests/meridianSkin.test.ts` (§8.4). **Hoy falla:** LI a 7 u, KI a 15 u, HT7 a 16.8 u de su trazo. Esa es tu meta.
2. Corrige las anclas (primero `data/meridians.json → anchors2d` si existe, si no `MERIDIAN_ANCHORS_2D`). Suma anclas intermedias donde el Catmull–Rom se escapa: cuello y hombro de TE, LI, SI y GB; antebrazo de HT y PC; el final de KI sobre la planta. **Mueve el trazo, nunca el punto:** los puntos pasan el test de piel y son la verdad.
3. **Invariante de flujo** (agrégalo al test): primera → última ancla según `flow`. `head-to-foot`: y crece. `foot-to-chest` y `ascending-*`: y decrece. `chest-to-hand`: |x − 400| crece. `hand-to-head`: |x − 400| decrece. Hoy se cumple en los 14 y no puede romperse.
4. `color` de cada meridiano = hex del pigmento de su elemento (GV y CV = #1C1915). Usa los hex de §3.2, porque A1 escribe tokens.ts en paralelo.
5. **D07:** solo puedes agregar trayectos `posterior` para canales yang cuyo recorrido clásico es dorsal (LI, SI, TE en brazo y hombro dorsal; GB lateral), con el comentario `// didactic trajectory, low confidence, WHO 2008 regional course`, **sin puntos nuevos** y pasando el test de piel. Ante la duda no lo agregues: anótalo en DATA_NOTES.
6. Si ves un punto del seed en una cara anatómica dudosa (por ejemplo TE5, que es dorsal y aparece en la vista anterior), anótalo en `DATA_NOTES.md` para el humano. No lo toques.

**DoD:** `meridianSkin.test.ts` en verde. Ninguna muestra a más de 6 u, ≤ 0.5 % a más de 4 u por vista, y cada punto a ≤ 8 u de su trazo. METRIC con el número antes y después.

### W2 · B1 — LÁMINA

**Cierra:** D02 (Figure) D13 D14 D15 D16 D25 D27 · **Dueño:** ver §4.1 · **Consume:** A1 (tokens, grain), A2 (screen, REGION_FOCUS, ZoomControls).

1. `AtlasRoot` según el contrato §4.3. Se van el `railOpen`/`detailOpen` absoluto, el hint flotante (D15) y la línea críptica (D25).
2. `PlateDefs.tsx` (siempre renderizado, primero dentro del Viewport): `#region-focus` (§3.7) y gradientes compartidos.
3. `PlateFurniture.tsx` en HTML, superpuesto a la lámina con `pointer-events` solo en los controles: folio, título + subtítulo (el literal «Cuerpo humano — vista anterior» sigue en `PlateTitle.tsx`), marcas D/I, clave `<details>`, colofón, slot del reloj, `ZoomControls` y `Minimap`.
4. `Figure.tsx`: fuera `plate-grain` (D02) y la clase `.paper-grain` se aplica a la hoja; sombra radial solo con zoom ≤ 1.3 (D16); `mask="url(#region-focus)"`; títulos honestos por región (§3.7).
5. `PlateThumb.tsx` y `Minimap.tsx`: `<svg>` chicos que reusan el PNG en caché. El minimapa dibuja el rectángulo de `visibleRect`; clic = reset.
6. Precarga de la otra vista (D27).
7. Actualiza `preview-*.svg` (siguen referenciando el PNG) y `ATTRIBUTION.md` (§3.7).

**DoD:** en «Mano», la pelvis queda como fantasma (≤ 15 % de opacidad) y la mano ocupa el centro. No quedan rectángulos fantasma (misma prueba de píxeles que A2). A zoom 2.4 no se ve la sombra. `smoke.test.ts` sigue en verde.

### W2 · B2 — TINTA

**Cierra:** D08 D09 D28 · **Consume:** A1 (`meridianPigment`), A2 (`useUnitsPerPx`), A3 (`samplePath`, `pathLength`), B1 (`#region-focus`).

1. `MeridianPaths` según §3.4: casing + pigmento en px de pantalla, yin continuo y yang en guion, rótulos de ruta, chevrones con `samplePath(anchors, 140 * k)` y el ángulo de la muestra, realce de la hora del reloj, atenuación solo con meridiano activo elegido, `mask="url(#region-focus)"`, y paths memorizados.
2. `QiFlow` según §3.6 y §8.5: tres capas CSS por trazo en `qi.css` (`@layer components`), duración por `pathLength`, pausa con `animation-play-state`, reduced motion. Con `activeMeridianId === null` corre el meridiano de la hora. Los streams de dantian y órbita se mantienen con el mismo cometa.
3. Borra el loop de rAF de las cuentas. `useOrganClock` se queda.

**DoD:** a zoom 1, el trazo medido en pantalla es 1.25 ± 0.2 px en reposo y 2.25 ± 0.2 px activo, y a zoom 4 da lo mismo. En pausa, el cometa no se mueve entre dos capturas separadas 500 ms. Con reduced motion no hay elementos `.qi-comet` en el DOM.

### W2 · B3 — MARCAS

**Cierra:** D01 (puntos y dantian) D10 D11 · **Consume:** A1, A2 (`useUnitsPerPx`, `usePlateBox`, `visibleRect`, `unitsToClient`, `REGION_FOCUS`).

1. Copia `callouts.ts` y `tests/callouts.test.ts` **tal cual** de §8.3 (ya están validados con el seed real: 15 puntos anteriores y 6 posteriores, 0 solapes, 0 cruces, y `null` en 350×500).
2. `Points2D` según §3.5: marcas de registro en px, hit de 12/22 px, clusters, teclado (una parada por punto), `data-testid="point-<CODE>"` y `callout-<CODE>`, tooltip HTML (`PointTooltip.tsx`, portal en `#plate`), columnas de margen en cuerpo (zoom ≤ 1.6) y en regiones (figura = caja de `REGION_FOCUS`), y resaltado cruzado rótulo↔punto.
3. `layoutCallouts` (el viejo, para el foco y el hover) se conserva exportado o se reemplaza, actualizando `labels.test.ts` con la misma garantía (§0.2-8).
4. `DantianMarks` según §3.5: sello de 26 px, 70 % si hay un punto a menos de 20 px, sin tapar puntos.
5. Hanzi del SVG con `fontFamily` de `--font-hanzi` y códigos con la clase `code` (lining).

**DoD:** los tests de callouts están en verde. En la captura d1440 anterior hay 15 rótulos visibles, y en la posterior 6. En Rostro, EX-HN3 y GV20 no se tocan. En Mano, ninguna guía se cruza. Las marcas miden 12 ± 1 px de diámetro a zoom 1 y a zoom 4.

### W2 · C1 — CABECERA + PALETA

**Cierra:** D20 D24 · **Consume:** A1, A2 (`paletteOpen`, `flyTo` vía `showPoint`/`focusCenter`).

1. `Topbar` según §3.8, con `role="radiogroup"` para vista y región, `aria-checked`, flechas para moverse dentro del grupo y los `data-testid` de §4.3. En móvil son 2 filas (48 + 44 px) y las regiones en scroll-x con fundido en los bordes. Altura total ≤ 104 px.
2. `src/lib/search.ts` es puro: `searchAll(query, { points, meridians, centers, commands }) → Result[]` con puntaje (exacto > prefijo > contiene; código > hanzi > pinyin > nombre > alias), sin acentos ni tonos (reusa `fold`).
3. `CommandPalette.tsx`: diálogo con combobox/listbox ARIA (`aria-activedescendant`), grupos, recientes, `/` y `⌘K`/`Ctrl+K`. Enter abre y Esc cierra devolviendo el foco al disparador. `SearchBox.tsx` pasa a ser el disparador (o se borra si nadie lo importa).
4. `tests/search.test.ts`: `st36`, `ST36`, `zusanli`, `Zúsānlǐ` y `足三里` → ST36 primero; `dantian medio` → centro middle; `estomago` → meridiano ST; `hegu` → LI4; `posterior` → comando de vista.

**DoD:** tests en verde. En móvil la cabecera mide ≤ 104 px (e2e). En desktop cabe en una fila desde 1100 px.

### W2 · C2 — FICHA + SHEET

**Cierra:** D19 D21 (ficha) D22 · **Consume:** A1, A2 (`sheetSnap`, `plateBox`, `flyTo`), B1 (`PlateThumb`).

1. `PointDrawer` y `CenterDrawer` según §3.8 (ficha editorial). En desktop van en la columna `folio`; en móvil (< 1024 px) dentro de `Sheet`.
2. `Sheet.tsx`: snaps peek (168 px), half (52dvh) y full (100dvh − 48 px). `nextSnap(current, dyPx, vyPxPerMs)` es pura. Arrastre por el asa (`data-testid="sheet-handle"`), Esc cierra y hay trampa de foco solo en full. En peek y half la cámara se corre para que el punto quede centrado sobre el sheet: `flyTo({ pan: { x, y: y + (sheetPx / 2) * k }, zoom })`, con `k` sacado de `unitsPerPx(VIEW_W / zoom, VIEW_H / zoom, plateBox)`.
3. `src/lib/text.ts`: `stripTraditionalPrefix(s)` quita «Uso tradicional educativo:» o «Traditional educational use:», sin importar mayúsculas y espacios.
4. Navegación ← → dentro del meridiano, con los mismos datos que usan las flechas del teclado.
5. Foco al `h2` al abrir y sin doble marco (D22).

**DoD:** `text.test.ts` y `sheet.test.ts` en verde. En 390×844 con ST36 abierto, el sheet en peek no tapa ST36 (la marca queda dentro del área visible de la lámina, verificado por e2e). No hay overflow horizontal (`document.documentElement.scrollWidth ≤ innerWidth`).

### W2 · C3 — LAYOUT + PORTADA + AYUDA + TECLADO

**Cierra:** D21 (grilla) D23 (pie) D25 (ayuda) · **Consume:** todos los contratos.

1. `App.tsx` con la grilla de §4.3 y las variables `--index-w`/`--folio-w` según el estado. Pasa `<QiClock variant="dial" />` a `AtlasRoot`. El fondo `.desk-grain` reemplaza el SVG inline.
2. **Teclado:** conserva todos los atajos actuales (A, P, C, 1–4, `/`, Esc, ←/→) y suma `?` (ayuda), `⌘K`/`Ctrl+K` (paleta) y `handleCameraKey` de A2. Mantiene el guard de `#legal-gate` y el de inputs.
3. `Disclaimer` como pie de la grilla: 11 px ink-2, 1–2 líneas, `env(safe-area-inset-bottom)`. En móvil comparte fila con el chip del reloj sin superponerse (D23).
4. `LegalModal` como portada editorial (§3.8). Misma clave, mismo id y mismo comportamiento con Enter/Esc; el CTA lleva `data-testid="legal-accept"`.
5. `HelpDialog.tsx` con la lista de atajos (i18n) y `data-testid="help-dialog"`.
6. `ErrorBoundary` con el estilo nuevo, conservando su texto y el botón de recarga.

**DoD:** a 1440, 1280, 768 y 390 no hay elementos que se superpongan entre cabecera, lámina, índice, ficha y pie (el e2e compara bounding boxes). Todo atajo funciona en e2e.

### W2 · C4 — ÍNDICE + RELOJ DE ÓRGANOS

**Cierra:** D23 (reloj) D24 (índice) D26 · **Consume:** A1 (pigmentos), A2.

1. `MeridianRail` según §3.8: capas, elementos, meridianos agrupados con pigmento, `names.zh`, puntos y hora, y los puntos anidados. En < 1024 px es un drawer con scrim, Esc y foco. Ya no filtra por búsqueda. `data-testid="index-toggle"` en el botón que lo abre (que vive en Topbar: coordínalo con C1 vía OX, o expón `IndexToggle` desde tu archivo y C1 lo importa).
2. `QiClock({ variant: "dial" | "chip" })`: dial SVG de 24 h según §3.8, con sectores por `clockHour`, aguja, play/pausa, velocidad y teclado `radiogroup`. `data-testid="clock-dial"` y `clock-play`.
3. `tests/clock.test.ts`: el ángulo de sector de cada meridiano (LU 03 h = 45°, ST 07 h = 105°, etc.) y `meridianAtHour` sin cambios.

**DoD:** el clic en el sector ST fija 07:00 y resalta ST en la lámina. En móvil, el chip abre el dial y Esc lo cierra.

### W3 · Q1 — BUILD / CI

1. `npm run typecheck`, `npm test` y `npm run build` en 0 sobre `feat/t1-2909` ya integrada. Lo que esté roto lo arreglas tú (tipos, imports muertos, tests); no lo devuelves.
2. `scripts/budget.mjs` falla si `dist` ≥ 8 MB, JS gzip > 130 KB o CSS gzip > 14 KB. Script `npm run budget`.
3. CI: suma un job `e2e` que corre después de `build`: `npm ci`, `npx playwright install --with-deps chromium`, `npm run e2e`. Suma `npm run budget` al job build.
4. Greps de muerte (§9.2) en 0.

### W3 · Q2 — A11Y + I18N + DATOS

1. `tests/i18n.test.ts`: mismas claves en `es` y `en`, ningún valor vacío y ningún string de UI hardcodeado en `src/ui` (heurística: texto JSX de 3 o más letras fuera de `t()`, con whitelist de hanzi, códigos y «Esc»).
2. Invariantes de datos §0.2-7 (siguen los tests actuales). Borra los alias CSS deprecados sin uso.
3. Auditoría manual y con axe (lo corre Q3): roles, nombres accesibles, orden de tab (cabecera → lámina → índice → ficha → pie), `aria-live="polite"` que anuncia la selección («ST36 Zúsānlǐ seleccionado»), `lang` sincronizado, reduced motion y targets ≥ 24 px (≥ 44 px en coarse).
4. Si arreglas algo en un archivo ajeno, que sea un parche mínimo con una nota en DECISIONES.

### W3 · Q3 — QA VISUAL + E2E

1. `playwright.config.ts`: `webServer` = `npm run build && npx vite preview --port 4173`, proyecto chromium, `reducedMotion: 'reduce'` en un proyecto adicional. Scripts: `"e2e": "playwright test"` y `"shots": "node scripts/shots.mjs docs/T1_2909/shots/after"`.
2. `e2e/atlas.spec.ts`: las 12 tareas de H2 (§7 H2) en desktop y móvil, más `@axe-core/playwright` con 0 serious/critical en anterior, ficha abierta, paleta y portada. Además:
   - **T3:** la marca de ST36 mide 12 ± 1.5 px a zoom 1 y a zoom 4.
   - **T5:** `document.fonts.check("16px 'Noto Serif SC'", "足三里") === true` una vez cargada.
   - Sin rectángulos fantasma: en la captura del área `#plate`, la desviación estándar por canal en 4 franjas de papel vacío es ≤ 2.
   - Sin overflow horizontal a 390 px.
   - Sin solapes entre las regiones de la grilla.
3. `node scripts/shots.mjs docs/T1_2909/shots/after`: 48 JPG, comparables 1 a 1 con `before/`.
4. Anti-flake: el e2e tiene que pasar **3 veces seguidas** en local antes de firmar PASS.

### W3 · Q4 — RENDIMIENTO

1. React Profiler (o contadores en dev): durante el arrastre solo re-renderizan Viewport, Points2D, QiFlow (si depende del zoom) y Minimap. `Figure` y `MeridianPaths` no (`memo` + selectores finos de Zustand).
2. Memoriza `layoutMarginCallouts` por `(view, region, zoom redondeado a 0.05, plateBox)`.
3. Sin long tasks > 50 ms al cambiar de región o de vista (`PerformanceObserver` en e2e).
4. Opcional: `body-*.webp` (calidad 90, con alpha) para mostrar, dejando los PNG para la máscara y los tests. Solo si baja ≥ 40 % el peso transferido y los tests siguen verdes.

### W4 · H1 — DIRECTOR DE ARTE (no codea)

Lee los diffs, `shots/before` vs `shots/after` y los tokens. Puntúa de 0 a 10 con evidencia (ruta de la captura):

1. Primer segundo: ¿se lee «lámina/atlas» y no «app»?
2. Jerarquía: figura héroe y mobiliario en retícula.
3. Tinta: los 14 meridianos distinguibles sin pelear con la piel.
4. Puntos: descubribles, con rótulos de atlas.
5. Tipografía: roles claros, hanzi reales, cifras lining, nada < 11 px.
6. Color: disciplina de tokens, un solo acento de UI.
7. Composición: folio, orientación, clave y colofón alineados.
8. Movimiento: cámara y transiciones con intención, reduced motion correcto.
9. Regiones: foco honesto, sin anatomía irrelevante dominando.
10. Móvil: se siente nativo y nada se tapa.

**PASS** = promedio ≥ 8.5, ningún criterio < 8 y **cero vetos**.
**Vetos automáticos:** rectángulo fantasma · trazo visible fuera de la piel · rótulos que se pisan o se cruzan · texto < 11 px · pill o `rounded-full` · hex fuera de tokens · hanzi en fuente de sistema · sheet tapando el punto seleccionado · cualquier canvas o 3D · gradiente decorativo · segundo color de acento en el chrome.
Escribe `docs/T1_2909/H1.md`. Si da FAIL, deja como máximo 7 vetos accionables, cada uno con `ID dueño + archivo + cambio concreto`.

### W4 · H2 — PRODUCTO (no codea features; hotfix de 1 archivo si Q dejó un rojo)

Doce tareas, cada una en desktop 1440 y móvil 390, con evidencia de e2e:

1. Portada → Enter → la lámina queda interactiva.
2. `/` → «zusanli» → Enter: la ficha de ST36 se abre, la cámara vuela y ST36 queda visible (no bajo el sheet).
3. La ficha muestra 足三里 en Noto Serif SC, precauciones visibles en LI4 y SP6, y ningún texto duplicado.
4. → recorre al siguiente punto del meridiano; ← vuelve.
5. P → la placa posterior cambia de verdad (href del PNG) y se ven 6 rótulos.
6. 3 → Mano: foco regional, rótulos sin cruces; Esc; 1 → cuerpo.
7. Reloj: clic en el sector LR → 01:00, LR resaltado; pausa: el cometa se congela; play.
8. Capas: apagar Meridianos y Qi y volver a encenderlos, sin errores.
9. Solo teclado: Tab hasta un punto, Enter abre la ficha y Esc la cierra con el foco devuelto.
10. ES ↔ EN: la UI cambia, el hanzi se queda y `lang` se actualiza.
11. Zoom: rueda hacia el cursor, + − 0, doble clic resetea y el minimapa aparece y desaparece.
12. «dantian medio» en la paleta → la ficha del centro y «Abrir el punto CV17 膻中» funcionan.

Tres personas, con un párrafo cada una: estudiante de MTC en laptop, docente proyectando a 1920×1080 con zoom del navegador al 150 %, y curioso en móvil con una mano.
**PASS** = las 12 × 2 OK. Escribe `docs/T1_2909/H2.md`.

### Bucles

Si H1 o H2 dan FAIL, OX relanza **solo** a los dueños nombrados en los vetos (W2b), después Q1 + Q3 (W3b) y después H1 + H2 (W4b). **Máximo 2 bucles.** Si después de 2 sigue en FAIL, se entrega el PR con el estado honesto en SIGN_OFF. Nunca se declara PASS falso.

### W5 · OX — Cierre

1. Integra todo. Gates de §9 en verde.
2. `README.md`: nuevo alcance, capturas (enlaces a `docs/T1_2909/shots/after/d1440-01-anterior.jpg`, etc.), scripts `e2e`, `shots` y `budget`. `docs/ARQUITECTURA.md`: módulos nuevos (screen, camera, callouts, PlateDefs, Sheet, CommandPalette, tokens). `docs/DEPLOY.md`: suma el job e2e al CI.
3. `SIGN_OFF.md`: tabla de las 16 firmas, D01–D29 marcados, T1–T10 con evidencia, y lo que quedó fuera (con motivo).
4. Push y PR (§0.1). Cuerpo del PR: resumen, antes/después (4 pares de capturas), checklist T1–T10, riesgos y cómo probar (`npm ci && npm run dev`; `npm run e2e`).
5. Respuesta final al humano: ≤ 12 líneas con el link del PR, el estado de H1/H2, las métricas clave (offskin antes → después, callouts, tamaños en px, JS gzip) y los vetos abiertos si los hay.

---

## 8. Código de referencia (compilado y probado sobre `d938da3`)

Copia estos archivos tal cual. Puedes extenderlos, pero no cambies sus firmas.

### 8.1 `src/atlas/screen.ts` (A2)

```ts
import { createContext, useContext } from "react";
import type { Point2D } from "@/types";

/** CSS size of the plate <svg>, measured by Viewport with a ResizeObserver. */
export interface PlateBox {
  w: number;
  h: number;
}

/**
 * viewBox units per CSS pixel for a `meet` viewBox of (vbW × vbH) drawn into (box.w × box.h).
 * Multiply a pixel size by k to draw it at a constant size on screen.
 */
export function unitsPerPx(vbW: number, vbH: number, box: PlateBox): number {
  if (box.w <= 0 || box.h <= 0) return 1;
  return Math.max(vbW / box.w, vbH / box.h);
}

/** What the viewer actually sees, in viewBox units. `meet` shows more than the viewBox on one axis. */
export function visibleRect(
  pan: Point2D,
  k: number,
  box: PlateBox,
): { l: number; t: number; r: number; b: number } {
  const w = box.w * k;
  const h = box.h * k;
  return { l: pan.x - w / 2, t: pan.y - h / 2, r: pan.x + w / 2, b: pan.y + h / 2 };
}

export const ScreenContext = createContext<{ k: number; box: PlateBox }>({ k: 1, box: { w: 800, h: 1600 } });

/** viewBox units per CSS px inside the plate. */
export function useUnitsPerPx(): number {
  return useContext(ScreenContext).k;
}

export function usePlateBox(): PlateBox {
  return useContext(ScreenContext).box;
}
```

Uso en Viewport (esqueleto):

```tsx
const svgRef = useRef<SVGSVGElement>(null);
const setPlateBox = useViewerStore((s) => s.setPlateBox);
const [box, setBox] = useState<PlateBox>({ w: 0, h: 0 });
useEffect(() => {
  const el = svgRef.current;
  if (!el) return;
  const ro = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const next = { w: entry.contentRect.width, h: entry.contentRect.height };
    setBox(next);
    setPlateBox(next);
  });
  ro.observe(el);
  return () => ro.disconnect();
}, [setPlateBox]);
const k = unitsPerPx(VIEW_W / zoom, VIEW_H / zoom, box);
const vis = visibleRect(pan, k, box);
// <ScreenContext.Provider value={{ k, box }}> <svg ref={svgRef} …>
//   <rect x={vis.l} y={vis.t} width={vis.r - vis.l} height={vis.b - vis.t} fill="var(--color-paper)" />
```

En cualquier componente de la lámina: `const k = useUnitsPerPx(); <path strokeWidth={1.25 * k} />`.
No uses `vector-effect="non-scaling-stroke"`: con `pathLength` y dasharray su comportamiento varía entre motores. Multiplica por `k`.

### 8.2 `src/atlas/camera.ts` (A2) + `flyTo` en el store

```ts
import type { Point2D } from "@/types";

export interface Camera {
  pan: Point2D;
  zoom: number;
}

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 6;

export function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}

export function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

/** Pan eases linearly in space, zoom in log space, so a fly reads as one steady move. */
export function lerpCamera(a: Camera, b: Camera, t: number): Camera {
  const e = easeOutQuint(Math.min(1, Math.max(0, t)));
  const za = Math.log(a.zoom);
  const zb = Math.log(b.zoom);
  return {
    pan: { x: a.pan.x + (b.pan.x - a.pan.x) * e, y: a.pan.y + (b.pan.y - a.pan.y) * e },
    zoom: Math.exp(za + (zb - za) * e),
  };
}

/** Zoom by `factor` about `anchor` (viewBox units). The anchor stays under the cursor. */
export function zoomAbout(cam: Camera, factor: number, anchor: Point2D): Camera {
  const zoom = clampZoom(cam.zoom * factor);
  const s = cam.zoom / zoom;
  return {
    zoom,
    pan: { x: anchor.x + (cam.pan.x - anchor.x) * s, y: anchor.y + (cam.pan.y - anchor.y) * s },
  };
}

/** Client pixel → viewBox units for a `meet` svg centred on `pan`. */
export function clientToUnits(
  client: Point2D,
  rect: { left: number; top: number; width: number; height: number },
  pan: Point2D,
  k: number,
): Point2D {
  return {
    x: pan.x + (client.x - (rect.left + rect.width / 2)) * k,
    y: pan.y + (client.y - (rect.top + rect.height / 2)) * k,
  };
}

/** viewBox units → client pixel. Inverse of clientToUnits. */
export function unitsToClient(
  p: Point2D,
  rect: { left: number; top: number; width: number; height: number },
  pan: Point2D,
  k: number,
): Point2D {
  return {
    x: rect.left + rect.width / 2 + (p.x - pan.x) / k,
    y: rect.top + rect.height / 2 + (p.y - pan.y) / k,
  };
}
```

En `viewerStore.ts`:

```ts
import { clampZoom, lerpCamera, zoomAbout, type Camera } from "@/atlas/camera";

let flight = 0;

function stopFlight(): void {
  if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(flight);
}

// interface ViewerActions { … }
//   flyTo: (target: Camera, opts?: { duration?: number }) => void;
//   zoomBy: (factor: number, anchor?: Point2D) => void;
//   stopFlight: () => void;

// dentro de create<ViewerState & ViewerActions>((set, get) => ({ … })):
  resetAtlasCamera: () => {
    set({ atlasRegion: "body" });
    get().flyTo({ pan: { x: 400, y: 800 }, zoom: 1 });
  },
  flyTo: (target, opts) => {
    const to: Camera = { pan: target.pan, zoom: clampZoom(target.zoom) };
    const duration = opts?.duration ?? 420;
    stopFlight();
    if (duration <= 0 || prefersReducedMotion() || typeof requestAnimationFrame !== "function") {
      set({ atlasPan: to.pan, atlasZoom: to.zoom });
      return;
    }
    const from: Camera = { pan: get().atlasPan, zoom: get().atlasZoom };
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const cam = lerpCamera(from, to, t);
      set({ atlasPan: cam.pan, atlasZoom: cam.zoom });
      if (t < 1) flight = requestAnimationFrame(step);
    };
    flight = requestAnimationFrame(step);
  },
  zoomBy: (factor, anchor) => {
    const s = get();
    get().flyTo(zoomAbout({ pan: s.atlasPan, zoom: s.atlasZoom }, factor, anchor ?? s.atlasPan), { duration: 160 });
  },
  stopFlight,
```

`tests/camera.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { clientToUnits, lerpCamera, zoomAbout } from "@/atlas/camera";
import { unitsPerPx } from "@/atlas/screen";

describe("camera", () => {
  it("keeps the cursor anchor fixed while zooming", () => {
    const box = { w: 1000, h: 800 };
    const rect = { left: 0, top: 0, width: box.w, height: box.h };
    const cam = { pan: { x: 400, y: 800 }, zoom: 1 };
    const cursor = { x: 700, y: 200 };
    const before = clientToUnits(cursor, rect, cam.pan, unitsPerPx(800 / cam.zoom, 1600 / cam.zoom, box));
    const next = zoomAbout(cam, 2, before);
    const after = clientToUnits(cursor, rect, next.pan, unitsPerPx(800 / next.zoom, 1600 / next.zoom, box));
    expect(after.x).toBeCloseTo(before.x, 6);
    expect(after.y).toBeCloseTo(before.y, 6);
  });

  it("lands exactly on the target and clamps zoom", () => {
    const a = { pan: { x: 400, y: 800 }, zoom: 1 };
    const b = { pan: { x: 338, y: 1185 }, zoom: 2.4 };
    expect(lerpCamera(a, b, 0)).toEqual(a);
    const end = lerpCamera(a, b, 1);
    expect(end.pan).toEqual(b.pan);
    expect(end.zoom).toBeCloseTo(2.4, 9);
    expect(zoomAbout(a, 100, a.pan).zoom).toBe(6);
    expect(zoomAbout(a, 0.01, a.pan).zoom).toBe(1);
  });
});

// agregar a tests/controls.test.ts
it("flyTo applies at once without rAF (node) and clamps", () => {
  useViewerStore.getState().flyTo({ pan: { x: 338, y: 1185 }, zoom: 9 });
  expect(useViewerStore.getState().atlasZoom).toBe(6);
  expect(useViewerStore.getState().atlasPan).toEqual({ x: 338, y: 1185 });
  useViewerStore.getState().resetAtlasCamera();
  expect(useViewerStore.getState().atlasZoom).toBe(1);
  useViewerStore.getState().zoomBy(2, { x: 400, y: 400 });
  expect(useViewerStore.getState().atlasZoom).toBe(2);
  expect(useViewerStore.getState().atlasPan.y).toBe(600);
});
```

### 8.3 `src/atlas/callouts.ts` (B3): rótulos de margen sin cruces

```ts
import type { Point2D } from "@/types";

export type Side = "left" | "right";
type Rect = { l: number; t: number; r: number; b: number };

export interface CalloutInput {
  key: string;
  text: string;
  /** Every marker of this point on the plate, in viewBox units. Bilateral points pass both. */
  anchors: Point2D[];
  /** Label width in CSS px (see estimateLabelPx). */
  widthPx: number;
}

export interface Callout {
  key: string;
  text: string;
  side: Side;
  /** Marker the leader leaves from. */
  from: Point2D;
  /** End of the horizontal run, shared by the whole column. */
  bend: Point2D;
  /** Leader end. The label baseline sits here: text-anchor end on the left, start on the right. */
  to: Point2D;
  box: Rect;
}

export interface ColumnFrame {
  /** Visible plate, viewBox units (screen.visibleRect). */
  view: Rect;
  /** Horizontal extent of the figure, viewBox units. */
  figure: { l: number; r: number };
  /** viewBox units per CSS px. */
  k: number;
  sizePx?: number;
  rowPx?: number;
  gapPx?: number;
  runPx?: number;
  padPx?: number;
}

const MID = 400;

/** Outfit caps and digits ≈ 0.62em, hanzi 1em, space 0.3em. */
export function estimateLabelPx(text: string, sizePx: number): number {
  let em = 0;
  for (const ch of text) {
    if (ch === " ") em += 0.3;
    else if (ch.charCodeAt(0) > 0x2e80) em += 1;
    else em += 0.62;
  }
  return em * sizePx;
}

/** Keep order, stay as close as possible to the wished y: merge overlapping runs and centre them. */
function spread(wish: number[], row: number, top: number, bottom: number): number[] {
  type Run = { first: number; n: number; y: number };
  const runs: Run[] = [];
  const place = (r: Run) => {
    let sum = 0;
    for (let j = 0; j < r.n; j += 1) sum += wish[r.first + j]! - j * row;
    r.y = Math.min(Math.max(sum / r.n, top), Math.max(top, bottom - (r.n - 1) * row));
  };
  wish.forEach((_, i) => {
    const run: Run = { first: i, n: 1, y: 0 };
    place(run);
    runs.push(run);
    while (runs.length > 1) {
      const b = runs[runs.length - 1]!;
      const a = runs[runs.length - 2]!;
      if (a.y + a.n * row <= b.y) break;
      runs.pop();
      a.n += b.n;
      place(a);
    }
  });
  const ys: number[] = [];
  for (const r of runs) for (let j = 0; j < r.n; j += 1) ys.push(r.y + j * row);
  return ys;
}

/**
 * Anatomical-plate callouts: two label columns in the margins, one elbow leader per point.
 * Order is kept per column and every horizontal run ends at one shared bend x, so leaders never cross.
 * Returns null when a margin cannot hold its column: the caller falls back to hover labels.
 */
export function layoutMarginCallouts(items: CalloutInput[], frame: ColumnFrame): Callout[] | null {
  const { view, figure, k } = frame;
  const size = (frame.sizePx ?? 12) * k;
  const row = (frame.rowPx ?? 22) * k;
  const gap = (frame.gapPx ?? 14) * k;
  const run = (frame.runPx ?? 28) * k;
  const pad = (frame.padPx ?? 16) * k;

  const pickLeft = (it: CalloutInput) =>
    it.anchors.reduce<Point2D | null>((m, p) => (p.x <= MID && (!m || p.x < m.x) ? p : m), null);
  const pickRight = (it: CalloutInput) =>
    it.anchors.reduce<Point2D | null>((m, p) => (p.x >= MID && (!m || p.x > m.x) ? p : m), null);

  const sorted = [...items].sort(
    (a, b) => Math.min(...a.anchors.map((p) => p.y)) - Math.min(...b.anchors.map((p) => p.y)),
  );
  const cols: Record<Side, { it: CalloutInput; from: Point2D }[]> = { left: [], right: [] };
  let last: Side = "right";
  for (const it of sorted) {
    const l = pickLeft(it);
    const r = pickRight(it);
    let side: Side;
    if (l && !r) side = "left";
    else if (r && !l) side = "right";
    else if (!l && !r) continue;
    else if (cols.left.length !== cols.right.length) side = cols.left.length < cols.right.length ? "left" : "right";
    else side = last === "left" ? "right" : "left";
    last = side;
    cols[side].push({ it, from: side === "left" ? l! : r! });
  }

  const out: Callout[] = [];
  for (const side of ["left", "right"] as const) {
    const col = cols[side].sort((a, b) => a.from.y - b.from.y);
    if (col.length === 0) continue;
    const dir = side === "left" ? -1 : 1;
    const edge =
      side === "left"
        ? Math.min(figure.l, ...col.map((c) => c.from.x))
        : Math.max(figure.r, ...col.map((c) => c.from.x));
    const bendX = edge + dir * gap;
    const toX = bendX + dir * run;
    const widest = Math.max(...col.map((c) => c.it.widthPx)) * k;
    const outer = toX + dir * (4 * k + widest);
    if (side === "left" ? outer < view.l + pad : outer > view.r - pad) return null;
    const ys = spread(
      col.map((c) => c.from.y),
      row,
      view.t + pad + size,
      view.b - pad,
    );
    if (ys[ys.length - 1]! > view.b - pad + 0.5) return null;
    col.forEach((c, i) => {
      const y = ys[i]!;
      const w = c.it.widthPx * k;
      const textX = toX + dir * 4 * k;
      const l = side === "left" ? textX - w : textX;
      out.push({
        key: c.it.key,
        text: c.it.text,
        side,
        from: c.from,
        bend: { x: bendX, y: c.from.y },
        to: { x: toX, y },
        box: { l, r: l + w, t: y - size * 0.8, b: y + size * 0.25 },
      });
    });
  }
  return out;
}
```

`tests/callouts.test.ts` (en verde con el seed real):

```ts
import { describe, expect, it } from "vitest";
import { loadAcupoints } from "@/data";
import { instancesOnView } from "@/atlas/mapCoords";
import { estimateLabelPx, layoutMarginCallouts, type Callout, type CalloutInput } from "@/atlas/callouts";
import { unitsPerPx, visibleRect } from "@/atlas/screen";
import type { AtlasView } from "@/types";

const FIGURE = { l: 97.6, r: 702.4 };

function inputs(view: AtlasView): CalloutInput[] {
  const byId = new Map<string, CalloutInput>();
  for (const p of loadAcupoints()) {
    for (const inst of instancesOnView(p, view, true)) {
      const text = `${p.code} ${p.names.zh}`;
      const row = byId.get(p.id) ?? { key: p.id, text, anchors: [], widthPx: estimateLabelPx(text, 12) };
      row.anchors.push(inst.position);
      byId.set(p.id, row);
    }
  }
  return [...byId.values()];
}

function frame(w: number, h: number) {
  const k = unitsPerPx(800, 1600, { w, h });
  return { view: visibleRect({ x: 400, y: 800 }, k, { w, h }), figure: FIGURE, k };
}

type Seg = [number, number, number, number];
function segs(c: Callout): Seg[] {
  return [
    [c.from.x, c.from.y, c.bend.x, c.bend.y],
    [c.bend.x, c.bend.y, c.to.x, c.to.y],
  ];
}
function cross(a: Seg, b: Seg): boolean {
  const o = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) =>
    Math.sign((bx - ax) * (cy - ay) - (by - ay) * (cx - ax));
  return (
    o(a[0], a[1], a[2], a[3], b[0], b[1]) * o(a[0], a[1], a[2], a[3], b[2], b[3]) < 0 &&
    o(b[0], b[1], b[2], b[3], a[0], a[1]) * o(b[0], b[1], b[2], b[3], a[2], a[3]) < 0
  );
}

describe("margin callouts", () => {
  for (const view of ["anterior", "posterior"] as const) {
    it(`${view}: every star point gets one label, no overlap, no crossing, desktop 1358×690`, () => {
      const items = inputs(view);
      const laid = layoutMarginCallouts(items, frame(1358, 690));
      expect(laid).not.toBeNull();
      expect(laid!.map((c) => c.key).sort()).toEqual(items.map((i) => i.key).sort());
      for (let i = 0; i < laid!.length; i += 1) {
        for (let j = i + 1; j < laid!.length; j += 1) {
          const a = laid![i]!;
          const b = laid![j]!;
          const apart = a.box.r <= b.box.l || b.box.r <= a.box.l || a.box.b <= b.box.t || b.box.b <= a.box.t;
          expect(apart, `${a.key} vs ${b.key}`).toBe(true);
          for (const sa of segs(a)) for (const sb of segs(b)) expect(cross(sa, sb), `${a.key} x ${b.key}`).toBe(false);
        }
      }
      const f = frame(1358, 690);
      for (const c of laid!) {
        expect(c.box.l).toBeGreaterThanOrEqual(f.view.l);
        expect(c.box.r).toBeLessThanOrEqual(f.view.r);
        expect(c.side === "left" ? c.box.r < FIGURE.l : c.box.l > FIGURE.r).toBe(true);
      }
    });
  }

  it("falls back to hover labels when the margin is too narrow (phone 350×500)", () => {
    expect(layoutMarginCallouts(inputs("anterior"), frame(350, 500))).toBeNull();
  });
});
```

Render en `Points2D` (esqueleto de lo que ya se probó en el prototipo):

```tsx
const k = useUnitsPerPx();
const box = usePlateBox();
const margin = useMemo(() => {
  if (region !== "body" || zoom > 1.6) return null;
  const byId = new Map<string, CalloutInput>();
  for (const it of items) {
    const text = `${it.point.code} ${it.point.names.zh}`;
    const row = byId.get(it.point.id) ?? { key: it.point.id, text, anchors: [], widthPx: estimateLabelPx(text, 12) };
    row.anchors.push(it.position);
    byId.set(it.point.id, row);
  }
  return layoutMarginCallouts([...byId.values()], { view: visibleRect(pan, k, box), figure: { l: 97.6, r: 702.4 }, k });
}, [items, region, zoom, pan, k, box]);
// por callout:
// <polyline points={`${c.from.x},${c.from.y} ${c.bend.x},${c.bend.y} ${c.to.x},${c.to.y}`}
//           fill="none" stroke={INK} strokeOpacity={0.55} strokeWidth={0.75 * k} />
// <circle cx={c.to.x} cy={c.to.y} r={1.3 * k} fill={INK} />
// <text x={c.to.x + (c.side === "left" ? -5 : 5) * k} y={c.to.y + 4 * k}
//       textAnchor={c.side === "left" ? "end" : "start"} fontSize={12 * k}>
//   <tspan className="code">{code}</tspan><tspan className="hanzi" dx={4 * k}>{zh}</tspan>
// </text>
```

### 8.4 `samplePath` + `pathLength` (A3, se agregan al final de `src/atlas/catmullRom.ts`) y test de piel

```ts
export interface PathSample {
  x: number;
  y: number;
  /** Tangent angle in degrees, 0 = +x, clockwise on screen. */
  angle: number;
  /** Arc length from the first anchor, viewBox units. */
  s: number;
}

/**
 * Samples the same curve catmullRomPath draws, analytically (no DOM).
 * Used for flow chevrons, route labels, Qi timing and the skin test.
 */
export function samplePath(pts: Point2D[], step: number): PathSample[] {
  const d = catmullRomPath(pts, false);
  const nums = d.replace(/[MC,]/g, " ").trim().split(/\s+/).map(Number);
  if (nums.length < 8) return [];
  const fine: PathSample[] = [];
  let x0 = nums[0]!;
  let y0 = nums[1]!;
  let s = 0;
  let px = x0;
  let py = y0;
  for (let i = 2; i + 5 < nums.length; i += 6) {
    const [c1x, c1y, c2x, c2y, x3, y3] = nums.slice(i, i + 6) as [number, number, number, number, number, number];
    for (let j = i === 2 ? 0 : 1; j <= 32; j += 1) {
      const t = j / 32;
      const u = 1 - t;
      const x = u * u * u * x0 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x3;
      const y = u * u * u * y0 + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * y3;
      const dx = 3 * u * u * (c1x - x0) + 6 * u * t * (c2x - c1x) + 3 * t * t * (x3 - c2x);
      const dy = 3 * u * u * (c1y - y0) + 6 * u * t * (c2y - c1y) + 3 * t * t * (y3 - c2y);
      s += Math.hypot(x - px, y - py);
      px = x;
      py = y;
      fine.push({ x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI, s });
    }
    x0 = x3;
    y0 = y3;
  }
  if (step <= 0) return fine;
  const out: PathSample[] = [];
  let next = 0;
  for (const p of fine) {
    if (p.s >= next) {
      out.push(p);
      next += step;
    }
  }
  return out;
}

/** Total arc length of the drawn curve, viewBox units. */
export function pathLength(pts: Point2D[]): number {
  const all = samplePath(pts, 0);
  return all.length ? all[all.length - 1]!.s : 0;
}
```

`tests/meridianSkin.test.ts`: **hoy falla a propósito**. A3 lo pone en verde y agrega el invariante de flujo.

```ts
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadAcupoints, loadMeridians } from "@/data";
import { samplePath } from "@/atlas/catmullRom";
import { decodePngAlpha } from "./pngAlpha";

/** Same rects as src/atlas/figure/Figure.tsx and tests/skin.test.ts. */
const PLATES = {
  anterior: { x: 97.61, y: 40, w: 604.79, h: 1440, file: "public/atlas/body-anterior.png" },
  posterior: { x: 97.47, y: 40, w: 605.06, h: 1440, file: "public/atlas/body-posterior.png" },
} as const;
const OFF = 4;
const MAX_OFF = 6;
const root = join(__dirname, "..");

function skinDistance(view: keyof typeof PLATES) {
  const p = PLATES[view];
  const img = decodePngAlpha(join(root, p.file));
  const s = Math.min(p.w / img.width, p.h / img.height);
  const ox = p.x + (p.w - img.width * s) / 2;
  const oy = p.y + (p.h - img.height * s) / 2;
  const on = (x: number, y: number) => {
    const px = Math.round((x - ox) / s);
    const py = Math.round((y - oy) / s);
    if (px < 0 || py < 0 || px >= img.width || py >= img.height) return false;
    return (img.alpha[py * img.width + px] ?? 0) > 16;
  };
  return (x: number, y: number) => {
    if (on(x, y)) return 0;
    for (let r = 1; r <= 60; r += 1) {
      for (let a = 0; a < 32; a += 1) {
        const t = (a / 32) * Math.PI * 2;
        if (on(x + r * Math.cos(t), y + r * Math.sin(t))) return r;
      }
    }
    return 99;
  };
}

describe("meridian traces stay on the skin", () => {
  const meridians = loadMeridians();
  for (const view of ["anterior", "posterior"] as const) {
    it(`${view}: ≤0.5% of samples more than ${OFF}u off skin, none past ${MAX_OFF}u`, () => {
      const dist = skinDistance(view);
      let total = 0;
      const off: string[] = [];
      for (const m of meridians) {
        const anchors = m.anchors2d?.[view];
        if (!anchors || anchors.length < 2) continue;
        for (const p of samplePath(anchors, 4)) {
          total += 1;
          const d = dist(p.x, p.y);
          if (d > OFF) off.push(`${m.id}@${p.x.toFixed(0)},${p.y.toFixed(0)}=${d}u`);
          expect(d, `${m.id} ${view} at ${p.x.toFixed(0)},${p.y.toFixed(0)}`).toBeLessThanOrEqual(MAX_OFF);
        }
      }
      expect(off.length / total, off.slice(0, 12).join(" ")).toBeLessThanOrEqual(0.005);
    });
  }

  it("every seed point sits on its own meridian trace (≤ 8u) where that trace is drawn", () => {
    const misses: string[] = [];
    for (const pt of loadAcupoints()) {
      const m = meridians.find((row) => row.id === pt.meridianId);
      for (const view of pt.views ?? []) {
        const anchors = m?.anchors2d?.[view];
        const pos = pt.position2d?.[view];
        if (!anchors || anchors.length < 2 || !pos) continue;
        const near = Math.min(...samplePath(anchors, 1).map((s) => Math.hypot(s.x - pos.x, s.y - pos.y)));
        if (near > 8) misses.push(`${pt.code}/${view}=${near.toFixed(1)}u`);
      }
    }
    expect(misses).toEqual([]);
  });
});
```

### 8.5 Qi en CSS (B2): `src/atlas/qi.css`

```css
@layer components {
  .qi-comet {
    fill: none;
    stroke-linecap: round;
    animation-duration: var(--qi-dur, 6s);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .qi-comet.is-paused { animation-play-state: paused; }
  .qi-head { stroke-dasharray: 0.04 0.96; animation-name: qi-head; }
  .qi-mid  { stroke-dasharray: 0.08 0.92; animation-name: qi-mid;  stroke-opacity: 0.5; }
  .qi-tail { stroke-dasharray: 0.16 0.84; animation-name: qi-tail; stroke-opacity: 0.22; }
}
/* Offsets literales: Chromium ignora var() dentro de @keyframes para stroke-dashoffset. */
/* lag = largo de la capa − largo de la cabeza, así las tres cabezas coinciden. */
@keyframes qi-head { from { stroke-dashoffset: 1; }    to { stroke-dashoffset: 0; } }
@keyframes qi-mid  { from { stroke-dashoffset: 1.04; } to { stroke-dashoffset: 0.04; } }
@keyframes qi-tail { from { stroke-dashoffset: 1.12; } to { stroke-dashoffset: 0.12; } }
@media (prefers-reduced-motion: reduce) { .qi-comet { display: none; } }
```

```tsx
import type { CSSProperties } from "react";
import "./qi.css";

type QiStyle = CSSProperties & { "--qi-dur": string };

// por stream (d = path, len = pathLength(anchors) en u, k = useUnitsPerPx())
const style: QiStyle = { "--qi-dur": `${(len / (160 * speed)).toFixed(2)}s` };
const paused = playing ? "" : " is-paused";
<g pointerEvents="none" mask="url(#region-focus)" style={style}>
  <path className={`qi-comet qi-tail${paused}`} pathLength={1} d={d} stroke={pigment} strokeWidth={2 * k} />
  <path className={`qi-comet qi-mid${paused}`} pathLength={1} d={d} stroke={pigment} strokeWidth={2.6 * k} />
  <path className={`qi-comet qi-head${paused}`} pathLength={1} d={d} stroke={pigment} strokeWidth={3.5 * k} />
</g>
```

(Tipado verificado con `tsc` strict: `QiStyle` evita `any` y casts.)

### 8.6 `scripts/shots.mjs` (OX en W0, Q3 en W3): la misma secuencia de teclas sirve para la UI vieja y la nueva

```js
// Usage: node scripts/shots.mjs <outDir> [baseUrl]
// Same key sequence works on the old UI (search input) and the new one (command palette).
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const out = process.argv[2] ?? "docs/T1_2909/shots/after";
const base = process.argv[3] ?? "http://localhost:4173/";
mkdirSync(out, { recursive: true });

const VIEWPORTS = {
  d1440: { width: 1440, height: 900 },
  d1280: { width: 1280, height: 800 },
  t768: { width: 768, height: 1024 },
  m390: { width: 390, height: 844 },
};

const enter = async (p) => {
  await p.keyboard.press("Enter");
  await p.waitForTimeout(250);
};
const find = async (p, query) => {
  await p.keyboard.press("/");
  await p.keyboard.type(query, { delay: 20 });
  await p.keyboard.press("Enter");
  await p.keyboard.press("Escape").catch(() => {});
};
const clickFirst = async (p, selectors) => {
  for (const s of selectors) {
    const el = p.locator(s).first();
    if ((await el.count()) && (await el.isVisible())) return el.click();
  }
};

const STATES = {
  "00-legal": async () => {},
  "01-anterior": async (p) => enter(p),
  "02-posterior": async (p) => { await enter(p); await p.keyboard.press("p"); },
  "03-st36": async (p) => { await enter(p); await p.keyboard.press("/"); await p.keyboard.type("ST36", { delay: 20 }); await p.keyboard.press("Enter"); },
  "04-face": async (p) => { await enter(p); await p.keyboard.press("2"); },
  "05-hand": async (p) => { await enter(p); await p.keyboard.press("3"); },
  "06-foot": async (p) => { await enter(p); await p.keyboard.press("4"); },
  "07-dantian": async (p) => { await enter(p); await p.keyboard.press("/"); await p.keyboard.type("dantian medio", { delay: 20 }); await p.keyboard.press("Enter"); },
  "08-index": async (p) => { await enter(p); await clickFirst(p, ['[data-testid="index-toggle"]', 'button:has-text("Índice")', 'button:has-text("Meridianos")']); },
  "09-palette": async (p) => { await enter(p); await p.keyboard.press("/"); await p.keyboard.type("zu", { delay: 20 }); },
  "10-help": async (p) => { await enter(p); await p.keyboard.press("?"); },
  "11-zoom": async (p) => { await enter(p); for (let i = 0; i < 4; i++) await p.keyboard.press("+"); },
};

const browser = await chromium.launch();
for (const [vp, size] of Object.entries(VIEWPORTS)) {
  for (const [name, run] of Object.entries(STATES)) {
    const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await run(page);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${vp}-${name}.jpg`, type: "jpeg", quality: 80 });
    await ctx.close();
  }
}
await browser.close();
console.log(`shots: ${Object.keys(VIEWPORTS).length * Object.keys(STATES).length} → ${out}`);
```

---

## 9. Gates de calidad (todo en 0 antes de firmar W5)

### 9.1 Comandos

```bash
npm ci
npm run typecheck
npm test            # 29 originales + tokens, camera, callouts, meridianSkin, search, text, sheet, clock, i18n
npm run build
npm run budget      # dist < 8 MB · JS gzip ≤ 130 KB · CSS gzip ≤ 14 KB
npm run e2e         # 3 veces seguidas en verde antes de firmar
```

### 9.2 Greps de muerte (todos deben dar 0 resultados)

```bash
rg -n "rounded-(full|xl|2xl)" src
rg -n "<Canvas|@react-three|from ['\"]three['\"]|getContext\(['\"]webgl" src
rg -n "#8B5CF6|#E23B3B|#2B6CB0|#F59E0B|#C4A35A|#3D8B40|#C0C8D0|#C45C26" src data
rg -n "text-\[(8|9|10)px\]" src
rg -n "TODO|FIXME|@ts-ignore|@ts-expect-error|eslint-disable|: any\b|as any\b" src tests e2e
rg -n 'fontFamily="Cormorant' src      # texto SVG con fuente fija: usar clases code / hanzi / pinyin
rg -n "中腔" src data tests
rg -n "\"three\"|@react-three" package.json
```

(Los hex de la tercera línea son los Tailwind viejos de `meridians.json`. Tras A3 no pueden quedar.)

### 9.3 Métricas que van en SIGN_OFF

| Métrica | Antes | Meta |
|---|---|---|
| Muestras de meridiano > 4 u fuera de la piel | 91/1632 (5.6 %) · máx. 54 u | ≤ 0.5 % · máx. 6 u |
| Punto más lejos de su trazo | HT7 16.8 u | ≤ 8 u |
| Diámetro de marca a zoom 1 (1440×900) | ≈ 2 px | 12 ± 1 px |
| Trazo de meridiano en reposo | ≈ 0.55 px | 1.25 ± 0.2 px |
| Área de clic de un punto | ≈ 14 px | ≥ 24 px (44 px coarse) |
| Rótulos visibles a zoom 1 (anterior/posterior) | 0 / 0 | 15 / 6 |
| Cruces entre guías | Mano: sí | 0 |
| Altura de cabecera a 390 px | 180 px | ≤ 104 px |
| Textos < 11 px | 15 | 0 |
| Hanzi en Noto Serif SC | no | sí |
| JS gzip | 82.9 KB | ≤ 130 KB |
| Tests | 29 | ≥ 60 + e2e |

---

## 10. Commits sugeridos (atómicos, en este orden aproximado)

```
docs: baseline T1 29.09 y capturas antes
feat(ui): tokens, capas CSS, tipografia e iconos T1
feat(atlas): escala en pantalla y camara que vuela
fix(atlas): meridianos sobre la piel y pigmentos
feat(atlas): lamina con mobiliario y foco regional
feat(atlas): tinta cartografica y cometa de Qi
feat(atlas): marcas de registro y rotulos de margen
feat(ui): cabecera y paleta de busqueda
feat(ui): ficha editorial y bottom sheet
feat(ui): grilla, portada y ayuda
feat(ui): indice y reloj de organos
test: e2e, axe y capturas despues
ci: job e2e y presupuesto
perf: memo de lamina y precarga
docs: sign-off T1 29.09
```

---

## 11. Anti-patrones (si aparece uno, se revierte)

- Resolver la escala subiendo números en unidades del viewBox en vez de multiplicar por `k`.
- Esconder trazos fuera de la piel con una máscara en lugar de corregir las anclas.
- Mover un punto del seed para que calce con un trazo.
- Rótulos con `position: absolute` en HTML sobre la lámina: se desalinean con el zoom. Van en el SVG y en px × k.
- Animar con `setInterval` o con React state a 60 fps. La cámara usa rAF → store; el Qi, CSS.
- Colores sueltos en componentes. Todo sale de tokens.
- Un modal por encima de otro modal.
- Una «pantalla de carga» decorativa.
- Tocar `main`, hacer force-push o mergear el PR.
- Preguntarle al humano.

---

## 12. Recordatorio final (reléelo antes de cada merge)

SVG 2D sin canvas ni three · 20 puntos, ni uno más · CV12 = 中脘 · aviso legal siempre visible · Goran CC BY-SA con atribución · tamaños en px × k · tokens y nada más · `@layer` en todo CSS propio · tests y strings bloqueados intactos · un escritor por archivo · firmas completas · rama `feat/t1-2909` + PR, sin merge.

**Arranca ahora:** W0 → spawn W1 (A1, A2, A3) → merge → spawn W2 (B1, B2, B3, C1, C2, C3, C4) → merge → W3 (Q1–Q4) → W4 (H1, H2) → bucles si hacen falta → W5. No te detengas hasta tener SIGN_OFF con H1 y H2 en PASS o 2 bucles agotados con el estado honesto.

=== FIN ===
