# MEGAPROMPT ART8 — cuerpo + fondo

Pegá en Grok 4.7 Terminal desde `=== PEGAR DESDE AQUÍ ===` hasta `=== FIN ===`.
Rama: `main` (atlas 2D ya mergeado).

=== PEGAR DESDE AQUÍ ===

# Acupuntura3D — ARTE cuerpo + fondo. 8 agentes. Grok 4.7. Sin parar.

Sos OX (agente 1/8) en Grok Terminal 4.7. Repo `datanalytics86/Acupuntura3D`, rama **main** @ `6f40344` o más nueva.
`--no-plan`. `--always-approve`. Effort xhigh. Depth=1. Máx 7 hijos en vuelo (vos no contás).

Este bloque ES la aprobación. No preguntes. No reescribas arquitectura. No 361 puntos. No R3F.

## 0. Qué el humano pidió

> busca mejoras esteticas del cuerpo humano y de fondo del proyecto, y lanza prompt para 8 multiagente adaptado para grok terminal 4.7

Traducción: la app ya funciona y está en prod. Lo que falta es que la **figura** y el **escritorio de papel** se sientan lámina impresa, no PNG wiki sobre crema plano.

## 1. Diagnóstico (no lo debates — lo corregís)

CUERPO (`src/atlas/figure/Figure.tsx` + `interiorShading.ts` + `public/atlas/body-*.png`)
- Placa Goran 3d-shaded (CC BY-SA) + multiply + feColorMatrix naranja. Se lee humano. También se lee render wiki.
- Washes = elipses. Varias se leen como monedas (abd-l/r, brow, vast-hi).
- Plano púbico `#C89661` plano: parche, no piel graduada.
- Calvo a propósito (casquete vetado como peluca). A 400px de alto la cabeza sigue inacabada.
- Grain feTurbulence ESTÁ sobre la piel. Mal: el grano es del PAPEL, no de la carne.
- Sin filete de plancha en el borde de la silueta.

FONDO (`index.css`, `App.tsx`, `AtlasRoot`, `Viewport`)
- `html/body` = `#f4efe4` plano. Cero fibra, cero margen de escritorio.
- La hoja (`atlas-frame`) casi no se separa del desk (sombra 6%).
- Viewport pinta un rect `var(--color-paper)` — correcto — pero el desk alrededor no tiene materia.
- No volver al vacío negro `#07090d` ni a viñeta gamer.

## 2. Norte (una sola estética)

Lámina de enciclopedia impresa, quiet luxury.
Papel laid crema. Figura = Goran **impreso en el papel**, no sticker 3D.
Referencia de NIVEL: Encarta 2000 *Cuerpo humano*, DK plate, atlas escolar.
Anti: Linear, glass, neon, cápsulas, flip-X, foto de persona, Netter scan, Encarta ISO.

Paleta (no inventes hex sueltos):
```
desk:     #E8E0D0    /* margen más frío que la hoja */
paper:    #FBF7EE    /* la lámina */
ink:      #1C1915
cinnabar: #8B1E1E    /* único acento, ya en UI */
skin-lo:  #8A5740
contour:  #5A4030 @ 0.32
```
Goran se QUEDA. Landmarks 800×1600 se QUEDAN. ATTRIBUTION.md se QUEDA y se actualiza con los cambios de composite.

## 3. Roster — 8 exactamente

```
OX     1  orquestador padre          (vos)
SKIN   2  generalPurpose+worktree    Figure.tsx grade/multiply/contour/grain
WASH   3  generalPurpose+worktree    interiorShading.ts — paths no elipses-moneda
CROWN  4  generalPurpose+worktree    pelo corto + oreja/plano nasal en vista cuerpo
DESK   5  generalPurpose+worktree    index.css + App fondo laid-paper
SHEET  6  generalPurpose+worktree    AtlasRoot / Viewport / PlateTitle — la hoja
FIT    7  generalPurpose             skin.test + anchors si el composite corre >8px
CRIT   8  explore                    docs/ART8_SIGN.md — 2 rounds, veta lo genérico
```

Spawn Grok 4.7:
```
Task(subagent_type: generalPurpose, description: "SKIN grade placa",
prompt: "<role card + files + DoD + no preguntes>")
```
Un path = un writer por oleada. CRIT no codea features.

## 4. Contratos por agente

### SKIN
- Recalibrá `fig-grade`: menos naranja plástico, midtones arriba, saturación −. La piel debe parecer tinta de offset, no CGI.
- Sacá `plate-grain` de encima de la carne. El grano vive en el desk/hoja, no en el PNG.
- Filete de silueta: 0.9–1.1px `contour` clippeado al mask `fig-skin`, opacity 0.28–0.38. No outline cómic.
- Sombra de contacto pies: elipse y≈1494, opacity 0.10, multiply. Ya existe; afiná para que no flote.
- Pubis: el fill debe tomar `skin-lo` graduado + opacity baja, no bloque `#C89661`.
DoD: preview-anterior.svg actualizado. Cero losa negra entre piernas.

### WASH
- Prohibido dejar elipses que se lean monedas. Reemplazá abd/brow/vast-hi por paths anatómicos bajos (opacity ≤ 0.16) o eliminalos.
- Conservá axila, subpec, ingle, scap, poplíteo/gemelo como volumen local.
- Clip siempre a `fig-skin`.
DoD: a zoom 1 no se ven manchas circulares.

### CROWN
- Pelo = trazos cortos de tinta en sien + occipital (vista post), no casco, no radial bruise, no peluca.
- Helix de oreja y plano nasal con 1 path cada uno, opacity 0.25–0.4, color contour.
- Si el resultado lee postizo: BORRALO y dejá calva + oreja. El veto de peluca sigue vigente.
DoD: a 200px de alto la cabeza tiene intención; a 4× no es un sticker.

### DESK
- `html,body,#root` fondo `#E8E0D0`.
- Fibra laid: overlay `pointer-events:none` fixed, feTurbulence o PNG 4% opacity, mix-blend multiply, SOLO en el desk (z bajo el atlas-frame).
- Nada de viñeta negra. Si hay viñeta, tono desk 6% en los 24px del borde de viewport.
- Tokens: `--color-desk: #E8E0D0`. Paper de la hoja no cambia de familia.
DoD: screenshot del margen ≠ flat fill.

### SHEET
- `atlas-frame`: paper `#FBF7EE`, filete 1px rule, UNA sombra `0 18px 40px rgba(28,25,21,.08)`.
- Viewport rect interior = paper, no desk.
- PlateTitle puede llevar «LÁM. I» / «LÁM. II» tipográfico pequeño; no badge SaaS.
- El pie Goran se queda.
DoD: la hoja se lee objeto sobre un escritorio.

### FIT
- Correr `npm test` (skin + labels + controls). Si un seed queda a >8px fuera de alpha, nudge ≤12 como Q1 anterior. No inventes puntos.
- Meridianos/puntos deben contrastar sobre la piel nueva (cinabrio ya existe).
DoD: typecheck + test + build = 0.

### CRIT
Round 1 al cerrar W1. Round 2 tras vetos.
Preguntas: ¿wiki sticker o plancha? ¿fondo de app o escritorio de archivo? ¿monedas? ¿peluca?
PASS sólo si un extraño dice «lámina» en 1s.
Escribí `docs/ART8_SIGN.md`.

## 5. Oleadas

W0 OX 90s: lee Figure.tsx, interiorShading, index.css, AtlasRoot. Grep rounded-full / three = 0.
W1 paralelo: SKIN + WASH + DESK.
W2 paralelo: CROWN + SHEET.
W3: FIT.
W4: CRIT. Si FAIL, respawn sólo el culpable. Máx 2 loops.

Commits:
- `feat(figure): grade y filete de plancha`
- `feat(figure): washes anatomicos`
- `feat(ui): escritorio laid-paper`
- `feat(figure): corona y hoja`
- `docs: ART8_SIGN`

Push `main` o rama `feat/art-plate` + PR. Preferí `feat/art-plate` si tocás PNG grandes; si sólo SVG/CSS, `main` ok. No force-push.

## 6. Anti-patrones

- Reemplazar Goran por otro body
- Volver al fondo negro
- Casco de pelo / moretón radial
- Elipses-moneda nuevas
- Grain encima de la piel
- Three.js «para que se vea premium»
- 361 puntos
- Preguntar al humano

## 7. Arrancá

`git checkout main && git pull`. W0. Spawn SKIN WASH DESK. No pares hasta ART8_SIGN PASS.

=== FIN ===
