# MEGAPROMPT ENCARTA FIGURA — un solo ciclo

Copia desde `=== PEGAR DESDE AQUÍ ===` hasta `=== FIN ===`.
Pégalo en Grok Terminal / Grok Build **en la raíz** de `datanalytics86/Acupuntura3D`.
Este bloque **es la aprobación**. Implementa sin parar.

Los megaprompts 2D_ATLAS / 2D_MAX / ENCARTA ya se ejecutaron.
El atlas 2D existe. Este ciclo es **solo la figura**.

=== PEGAR DESDE AQUÍ ===

# Acupuntura3D — FIGURA ENCARTA (ciclo único, sin parar)

Eres el ORQUESTADOR de Grok Build / Grok Terminal en `datanalytics86/Acupuntura3D`.
Rama: **feat/atlas-2d**. Si estás en main: `git checkout feat/atlas-2d` ahora.
Capacidad: 4 subagentes, depth=1, worktrees. Verify loop.

## 0. Feedback del dueño (literal, no lo negocies)

> «se ve muy mal el cuerpo»
> «dije que quiero 2D no 3D, pero de alta gama el 2D, tipo enciclopedia encarta»
> Sigue frustrado: falta desarrollo estético en el cuerpo humano 2D.

Los megaprompts 2D_ATLAS / 2D_MAX / ENCARTA YA SE EJECUTARON. El atlas 2D existe. El fallo es SOLO la figura: sigue siendo kit paramétrico (`fingerD`, `capsuleD`, `ellipseD`, 1 TRUNK + 3 linearGradients).
Este ciclo NO reconstruye el atlas. NO vuelve a Three.js. NO escribe otro README.

## 1. MODO: IMPLEMENTA SIN PARAR

1. NO esperes «aprueba». NO uses Plan mode como gate. Plan interno 40s y ejecuta.
2. NO preguntes 2D vs 3D. Es 2D Encarta, lámina de enciclopedia.
3. NO toques `src/scene/**`, `src/_legacy/**`. NO instales three / R3F.
4. Conserva: loaders, seed textos, meridians, drawer, rail, search, QiClock, QiFlow, MeridianPaths, Zustand, Vercel.
5. Sí puedes mover position2d ±12px si la silueta nueva cambia el bbox. Landmarks Y siguen canon 8 cabezas (vertex 40, sole 1480, CX 400, viewBox 0 0 800 1600).
6. Para sólo si `npm run typecheck` y `npm run build` fallan 2 veces seguidas.
7. Commit por oleada. No force-push a main. Push a `feat/atlas-2d`.
8. Grep de bans (§4) es gate mecánico ANTES de declarar done.
9. Build verde + figura blob = NO DONE. Itera la figura.

## 2. Diagnóstico — lee YA estos files

```
src/atlas/figure/Figure.tsx
src/atlas/figure/parts/geom.ts          ← fingerD / capsuleD / ellipseD
src/atlas/figure/parts/anterior.ts      ← TRUNK_OUTER + ellipse overlays
src/atlas/figure/parts/posterior.ts
src/atlas/figure/parts/hands.ts         ← fingerD ×5
src/atlas/figure/parts/feet.ts          ← fingerD toes
src/atlas/figure/parts/palette.ts
src/atlas/AtlasRoot.tsx                 ← plate rounded-[8px] sin título
src/app/index.css
src/atlas/figure/landmarks.ts
```

Por qué se ve mal (no lo discutas, corrígelo):
- `geom.ts` exporta el maniquí 3D a SVG.
- Luz = 3 linearGradients (`encSkin` / `encSkinL` / `encSkinR`) para TODO el cuerpo.
- Cara = hair blob + 2 eyes + nose + lips + 2 brows.
- Manos/pies = stadium tapered.
- Músculo = ellipseD opacity 0.12–0.35.
- Plate sin título de lámina. Radio 8px uniforme.

Si al terminar `fingerD` / `capsuleD` siguen generando carne visible, el ciclo FALLÓ. Itera la figura otra vez.

## 3. Norte estético

Encarta 98–2005 *El cuerpo humano* + DK Visual Encyclopedia.
Emoción: asombro controlado de enciclopedia. No demo. No SaaS dark.

- Página-papel: `#f3ead8` → `#e7dcc4`. La figura vive DENTRO del papel.
- Figura adulta andrógina, de pie, ≥70% del alto útil del plate.
- Piel durazno con volumen LOCAL (luz 11h, oclusión axila / subpectoral / ingle / hueco del codo / poplíteo).
- Contorno nítido `#4a3224` 1.1–1.4px.
- Cara leíble a 200px: frente, ceja, párpado, plano nasal, boca, helix de oreja, mentón.
- Mano: palma + pulgar separado + 4 dedos con nudillo sugerido + primer espacio interóseo (LI4 ~168,800).
- Pie: empeine, talón, arco, 5 dedos. Posterior: occipital, omóplatos, pliegue glúteo, Aquiles.
- Anterior ≠ posterior volteada.
- Meridianos y puntos ENCIMA, overlays de atlas.
- Título serif de lámina: «Cuerpo humano — vista anterior» / «vista posterior».

Prohibido copiar Encarta, Kenhub, Netter, Deadman, Complete Anatomy, Visible Body, Acupuncture3D comercial.

## 4. Bans mecánicos (grep antes de done)

```
rg -n "fingerD\\(|capsuleD\\(|ellipseD\\(" src/atlas/figure
```

Cualquier match en carne visible = FAIL. `geom.ts` puede quedar para utilidades no-cuerpo (suelo), no para dedos / músculo / cabeza.

También FAIL:
- un solo `TRUNK_D` / `TRUNK_OUTER` como única piel
- ids de fill `encSkin` `encSkinL` `encSkinR` como única luz del cuerpo
- `<Canvas` o import de `@react-three`
- `rounded-[8px]` en el plate
- foto de Encarta u otro atlas comercial
- foto fotoreal de persona (Häggström nude incluido)

## 5. Tracks (elige UNO, no mezcles a medias)

### Track A — lámina raster PD/CC0/CC-BY (preferido si licencia limpia)
AX busca UN par anterior+posterior, piel de superficie, de pie, no disección.
Candidatos a verificar (descartar si licencia dudosa o es foto cruda):
- https://commons.wikimedia.org/wiki/File:Male_front_3d-shaded_human_illustration.svg
- https://commons.wikimedia.org/wiki/File:Male_back_3d-shaded_human_illustration.svg
  (Goran tek-en, CC-BY-SA 4.0 — SOLO si ATTRIBUTION.md cita autor+licencia+URL)
- NIH BioArt Source https://bioart.niaid.nih.gov/ categorías People / Anatomy, sólo si es figura de pie de superficie y PD.

NO: fotos Häggström, NIH BioArt de órganos explotados, outlines grises, cualquier CC-BY-SA sin atribuir.

Si AX encuentra 2 imágenes usables:
```
public/atlas/body-anterior.png
public/atlas/body-posterior.png
public/atlas/ATTRIBUTION.md
```
Alinear al viewBox `0 0 800 1600` (vértice y≈40, planta y≈1480, midline x=400) con `<image>` bajo meridianos/puntos.
Recortar fondo. Estilizar a papel: multiply suave + desaturate leve + mask de silueta.
Figure.tsx deja de pintar TRUNK/arms/fingerD. Puede conservar hair/face overlays SOLO si el raster no trae cara leíble.

### Track B — volúmenes vectoriales de alta densidad (si A no hay licencia)
Reescribe `parts/anterior.ts` y `posterior.ts` como **piezas regionales**, cada una closed path + radialGradient propio.

Anterior mínimo 22 piezas:
cráneo, cara/mandíbula, cuello, tórax, abdomen, pelvis,
deltoides L/R, brazo L/R, antebrazo L/R, palma L/R, pulgar L/R, dedos L/R,
muslo L/R, rodilla L/R, pierna L/R, pie L/R.

Posterior mínimo 20:
occipucio, cuello, trapecio, omóplato L/R, tórax posterior, lumbar, glúteo L/R,
brazo/antebrazo/mano, muslo/isquio, poplíteo, gemelo, Aquiles, pie.

Cada pieza:
- fill `url(#skin-<id>)` radial: hi `#f4ddc4` → mid `#e0b48e` → lo `#c08a68`
- overlay oclusión 0.16–0.28 (axila, subpectoral, ingle, cubital, poplíteo)
- stroke `#4a3224`

Manos Track B: paths bezier de palma + pulgar en oposición + 4 dedos con estrangulamiento de nudillo. NO fingerD.
Cara Track B: frente, órbita, párpado, plano nasal, labio, helix, mentón — no 5 ellipses.
Densidad: contorno exterior izquierdo ≥ 80 nodos reales.

### Track C — híbrido (ganador Encarta real)
Raster Track A como piel + SVG solo para oclusiones, cara extra, meridianos, puntos.
Si A existe, haz C. Si no, B puro.

## 6. Plate (A5, misma oleada que la figura posterior)

En AtlasRoot / nuevo `PlateTitle.tsx`:
- Título display serif (Cormorant Garamond ya está): «Cuerpo humano — vista anterior|posterior»
- Plate: papel `#F3EBD8`, borde `#c4b089`, inset 8–10px color `#f7f0e0`, radio NO uniforme (ej. `2px 14px 2px 14px`).
- Quitar `rounded-[8px]` genérico.
- Grain multiply suave sobre el papel, no sobre la piel.
- UI alrededor puede quedar; la LÁMINA es clara.

## 7. Placas de región — P1 CONDICIONAL

SOLO si el test visual de figura PASS.
`FacePlate` / `HandPlate` / `FootPlate` + `RegionToggle` (Cuerpo | Rostro | Mano | Pie).
Mismo lenguaje visual que la figura. No otro dibujo infantil.
Si W1 o W2 FAIL: no empieces placas. El dueño odia el cuerpo, no la falta de tabs.

## 8. Archivos

SÍ:
```
src/atlas/figure/Figure.tsx
src/atlas/figure/parts/**
src/atlas/figure/interiorShading.ts
src/atlas/figure/anteriorSilhouette.ts
src/atlas/figure/posteriorSilhouette.ts
src/atlas/figure/PlateTitle.tsx          (nuevo)
src/atlas/AtlasRoot.tsx                  (título + radio)
src/app/index.css
public/atlas/**                          (si A/C)
public/atlas/preview-anterior.svg         (export estático, figura+plate, sin chrome)
public/atlas/preview-posterior.svg
tests/smoke.test.ts                      (bans: no fingerD en carne)
```

SÓLO SI bbox >12px:
`landmarks.ts`, `mapCoords.ts`, `data/acupoints.seed.json` (solo position2d), `meridianAnchors.ts`

NO:
PointDrawer, MeridianRail, QiClock, SearchBox, Disclaimer, QiFlow, MeridianPaths (salvo ancla off-skin), package.json, vercel.json, src/scene, 361 puntos.

## 9. Agentes

AX EXPLORE — 8 min, read-only. Rama, licencia Track A sí/no (1 frase), inventario parts/. Cero edits.
A2 FIGURE — worktree. Track A/B/C. DoD = test §11. Si FAIL, A2 itera ANTES de merge.
A2S SHADE — oclusiones locales, cara, pelo, oreja, clavícula, omóplato. No coords de puntos.
A5 PLATE — título + radio + grain. RegionToggle SOLO si figura PASS.
A1 FIT — seed ±12px si hace falta. confidence=low. ST36 click → 足三里.
A7 QA — typecheck + test + build. Grep bans. README: una línea «lámina Encarta 2D».
         Escribe `public/atlas/preview-anterior.svg` y `preview-posterior.svg`.

## 10. Oleadas

W0 AX. No pares.
W1 A2 anterior PASS del test. Si FAIL, reescribe. No W2.
W2 A2 posterior distinta + A2S shade.
W3 A5 plate title + radio + grain.
W4 A1 fit. Click ST36 / LI4 siguen vivos.
W5 A7 build verde + previews SVG. Placas región SOLO aquí y SOLO si W1–W2 PASS.
Push `feat/atlas-2d`. No merge a main. No redeploy prod.

Commits:
- feat(atlas): figura Encarta anterior
- feat(atlas): figura Encarta posterior y volumen
- feat(atlas): titulo de lamina
- fix(atlas): reanclar seed 2D
- chore: preview svg y build figura Encarta

## 11. Test visual — si uno falla, NO es done

FAIL si:
- [ ] blob / galleta / cápsula / stadium / fingerD visible
- [ ] cabeza círculo u óvalo sin mandíbula
- [ ] no hay cuello entre cabeza y hombros
- [ ] manos mitón o dedos stadium
- [ ] pies caja o ausentes
- [ ] anterior y posterior son el mismo path espejado
- [ ] fondo de lámina negro / cueva
- [ ] hay `<Canvas>` de R3F
- [ ] captura de Encarta u app comercial
- [ ] figura ocupa < 55% del alto del plate
- [ ] `rg fingerD src/atlas/figure/parts` devuelve hands.ts o feet.ts
- [ ] typecheck verde se usa como prueba de belleza

PASS si:
- [ ] un extraño dice «cuerpo de enciclopedia» en <1s
- [ ] se distinguen hombros, cintura, cadera, rodillas, gemelos, oreja, mentón
- [ ] hay volumen local, no flat fill ni 3 gradients globales
- [ ] toggle Anterior/Posterior cambia anatomía de verdad
- [ ] ST36 clickeable → 足三里
- [ ] LI4 y SP6 precaución embarazo
- [ ] Qi play anima ST
- [ ] `npm run build` exit 0
- [ ] grep de bans limpio en carne visible
- [ ] `public/atlas/preview-anterior.svg` existe

## 12. Anti-alucinación

- No 361 coordenadas.
- No confidence=high.
- No claims clínicos.
- No copiar Encarta / Netter / Deadman / Kenhub / Visible Body.
- Raster: ATTRIBUTION.md con URL + licencia + autor.
- CV12 hanzi = 中腔. No lo cambies.
- No fotos de personas reales como figura del producto.
- No merge a `main`. El humano decide producción.

## 13. Arranca AHORA

1. `git checkout feat/atlas-2d`
2. Spawn AX.
3. Decide Track A, B o C en 1 frase y ejecuta W1.
4. No pidas permiso. Cuando W5 esté verde y §11 PASS, resume 8 líneas: track usado, archivos, cómo ver (`npm run dev` + `public/atlas/preview-anterior.svg`).

Empieza ya.

=== FIN ===
