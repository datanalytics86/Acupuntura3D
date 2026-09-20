# MEGAPROMPT ENCARTA — figura 2D de alta gama

Copia desde `=== PEGAR DESDE AQUÍ ===` hasta `=== FIN ===`.
Trabaja en la rama `feat/atlas-2d` (el atlas 2D ya existe; `main` sigue con el 3D viejo).

=== PEGAR DESDE AQUÍ ===

# Acupuntura3D — FIGURA ENCARTA (2D alta gama) — orquestación autónoma

Eres el ORQUESTADOR de Grok Build en `datanalytics86/Acupuntura3D`.
Rama de trabajo: **`feat/atlas-2d`**. Si estás en `main`, `git checkout feat/atlas-2d` ahora.
Capacidad máxima: 8 subagentes, depth=1, worktrees, verify loop.

## 0. Feedback del dueño (literal)

> «se ve muy mal el cuerpo»
> «dije que quiero 2D no 3D, pero de alta gama el 2D, tipo enciclopedia encarta»
> megaprompt multiagente para solucionarlo en Grok Terminal, sin parar

El pivot 2D YA ESTÁ. El fallo es sólo la **figura**. No reconstruyas el atlas. No vuelvas a Three.js.

## 1. MODO: IMPLEMENTA SIN PARAR

1. NO esperes «aprueba». NO uses Plan mode como gate. Plan interno 45s y ejecuta.
2. NO preguntes 2D vs 3D. Es 2D Encarta.
3. NO toques `src/_legacy/**`. NO reinstales `three` / R3F.
4. Conserva: loaders, seed, meridians, drawer, rail, search, QiClock, Zustand, Vercel.
5. Sí puedes mover puntos 2D si la silueta nueva cambia el bbox; landmarks Y deben seguir siendo un cuerpo de 8 cabezas.
6. Para sólo si `npm run typecheck` y `npm run build` fallan 2 veces seguidas.
7. Commit por oleada. No force-push a main. Push a `feat/atlas-2d`.

## 2. Diagnóstico (leer YA)

Lee: `src/atlas/figure/Figure.tsx`, `anteriorSilhouette.ts`, `posteriorSilhouette.ts`, `interiorShading.ts`, `landmarks.ts`, `src/app/index.css`, `src/app/App.tsx`, `src/atlas/AtlasRoot.tsx`, `src/atlas/Points2D.tsx`.

Por qué se ve mal:
- `anteriorSilhouette.ts` es un Catmull-Rom de ~35 puntos + 2 brazos = **blob / muñeco de nieve / salchicha**.
- Cabeza casi oval, ojos = 2 elipses, nariz = 1 línea.
- Manos sin dedos. Pies en bloque.
- Fondo `#07090d` + viñeta negra: la figura se pierde. Encarta era página de enciclopedia, no cueva.
- Un solo `skinWash` plano. No hay airbrush / gouache.

Si al terminar el cuerpo sigue siendo 1–3 paths Catmull, el ciclo FALLÓ. Itera la figura otra vez antes de declarar done.

## 3. Norte estético: Encarta / DK Visual Encyclopedia

Piensa en **Microsoft Encarta 98–2005 → El cuerpo humano** y en **DK Human Body a Visual Encyclopedia**:

- Página de libro: papel crema `#f3ead8` → `#e7dcc4`, no negro.
- Figura humana ADULTA, de pie, grande (ocupa ≥70% del alto útil).
- Pintada: piel durazno con volumen (luz 11 en punto, sombra bajo pectoral, axila, pliegue inguinal, hueco del codo, hueco poplíteo).
- Contorno nítido marrón oscuro 1.1–1.4px, no doodle.
- Cara leíble a 200px: frente, cejas, ojos con párpado, nariz con plano, boca, oreja, mentón. No caricatura, no emoji.
- Manos: palma + pulgar separado + 4 dedos. Pies: empeine, talón, punta.
- Anterior ≠ posterior volteada. Posterior tiene occipital, omóplatos, pliegue glúteo, Aquiles.
- Meridianos y puntos ENCIMA, como overlays de atlas, no al revés.
- UI puede seguir oscura alrededor; la LÁMINA (el plate) es clara.

Prohibido copiar screenshots de Encarta, Kenhub, Netter, Deadman, Complete Anatomy, Visible Body. Copyright.

## 4. Dos tracks (elige A si es limpio)

### Track A — lámina de dominio público (preferido si pasa licencia)
AX busca UN par anterior+posterior de cuerpo humano de pie, piel, no disección sangrienta:
- NIH BioArt (dominio público gobierno USA)
- Wikimedia Commons **Public Domain / CC0** (no CC-BY-SA si no vas a atribuir; si es CC-BY, atribuye en `public/atlas/ATTRIBUTION.md`)
- Gray's Anatomy sólo si es placa de superficie (no vísceras abiertas)

Si encuentras 2 imágenes usables (frente y espalda), descárgalas a:
```
public/atlas/body-anterior.png
public/atlas/body-posterior.png
```
Alinealas al viewBox `0 0 800 1600` (vértice y≈40, planta y≈1480, midline x=400) con `<image>` dentro del SVG. Recorta fondo blanco si hace falta (feBlend / mask).
Encima: meridianos + puntos ya existentes.

Si la licencia es dudosa: NO las uses. Track B.

### Track B — figura vectorial de alta densidad (obligatorio si no hay A)
Reescribe la figura como **volúmenes regionales**, no 1 path.
Mínimo 22 shapes anteriores y 20 posteriores, cada uno closed path + radialGradient propio.

Anterior, piezas:
1 cráneo  2 cara/mandíbula  3 cuello  4 tórax  5 abdomen  6 pelvis
7 deltoides L/R  8 brazo L/R  9 antebrazo L/R  10 palma L/R
11 pulgar L/R  12 dedos L/R (pueden ser 1 grupo de 4 lóbulos, no un rect)
13 muslo L/R  14 rodilla L/R  15 pierna L/R  16 pie L/R

Cada pieza:
- fill `url(#skin-*)` radial: highlight `#f4ddc4` → base `#e0b48e` → sombra `#c08a68`
- overlay de oclusión (axila, subpectoral, ingle, poplíteo) opacity 0.16–0.28
- stroke `#4a3224`

PROHIBIDO en Track B:
- un solo `TRUNK_OUTER` de 35 puntos como única piel
- `<circle>` como cabeza
- `<ellipse>` gigante como torso
- brazos que no se insertan en el deltoides
- manos mitón sin pulgar

Densidad: el path del contorno exterior izquierdo debe tener ≥ 80 nodos reales (no 35).

## 5. Plate Encarta (A5)

Nuevo contenedor visual en `AtlasRoot` / `Viewport`:

```
.encarta-plate {
  background:
    radial-gradient(ellipse at 50% 30%, #fff8ec 0%, #f0e4cc 55%, #e2d3b3 100%);
  border: 1px solid #c4b089;
  box-shadow: 0 24px 60px rgba(0,0,0,.45), inset 0 0 0 8px #f7f0e0;
}
```

- Título de lámina tipo enciclopedia: «Cuerpo humano — vista anterior» / posterior, serif.
- El stage alrededor puede quedar `#1a1712`. La figura vive DENTRO del papel.
- Reduce la viñeta negra que tapa el cuerpo (`.vignette` no debe oscurecer el plate).
- Puntos: cinabrio sobre piel clara se leen mejor. Halo un poco más oscuro.
- Meridianos: respeta colores Wu Xing; sobre papel claro baja un poco la opacidad del inactivo a 0.35 (no 0.22 sobre negro).

## 6. Archivos que SÍ se reescriben

```
src/atlas/figure/Figure.tsx              A2
src/atlas/figure/anteriorSilhouette.ts   A2   o reemplazar por partsAnterior.ts
src/atlas/figure/posteriorSilhouette.ts  A2
src/atlas/figure/interiorShading.ts      A2
src/atlas/figure/skinGradients.tsx       A2  nuevo
src/atlas/figure/parts/*.ts              A2  si Track B
public/atlas/**                          A2  si Track A
public/atlas/ATTRIBUTION.md              A2  si hay asset externo
src/atlas/AtlasRoot.tsx                  A5  plate
src/app/index.css                        A5  .encarta-plate, vignette más suave
src/atlas/mapCoords.ts                   A1  sólo si landmarks se desplazan >12px
data/acupoints.seed.json                 A1  sólo position2d, no textos
```

No reescribas PointDrawer, QiClock, loaders, vercel.json.

## 7. Agentes

### AX EXPLORE — explore / read-only
1) Confirmar rama feat/atlas-2d.
2) Buscar asset PD/CC0 de cuerpo de pie frente+espalda. Memo: URL, licencia, sí/no Track A.
3) Listar files de figure/. Cero edits.

### A2 FIGURE — general-purpose / worktree  (**crítico**)
Track A o B. DoD = test visual §9. Si falla, A2 itera ANTES de merge.

### A2S SHADE — general-purpose / worktree
Gradientes, oclusiones, pelo, orejas, clavículas, omóplatos. No toques coords de puntos.

### A5 PLATE — general-purpose / worktree
Papel Encarta, título de lámina, vignette que no mate la figura. Toggle Anterior|Posterior ya existe: no lo rompas.

### A1 FIT — general-purpose / worktree
Si la silueta nueva no coincide con position2d, ajusta los 20 seed ± landmarks. confidence=low. No inventes 361.

### A7 QA — general-purpose / worktree
`npm run typecheck && npm test && npm run build`.
README: una línea «vista 2D estilo lámina Encarta».

## 8. Oleadas

W0 AX (licencia + inventario). No pares.
W1 A2 figura anterior PASS del test.
W2 A2 posterior distinta + A2S shade.
W3 A5 plate Encarta + vignette.
W4 A1 fit puntos si hace falta. Click ST36 sigue abriendo ficha.
W5 A7 build verde. Push `feat/atlas-2d`.

Commits:
- `feat(atlas): figura Encarta anterior`
- `feat(atlas): figura Encarta posterior y volumen`
- `feat(atlas): lamina de papel enciclopedia`
- `fix(atlas): reanclar seed 2D a la figura nueva`
- `chore: build figura Encarta`

## 9. Test visual — si uno falla, NO es done

FAIL si:
- [ ] se ve un blob / galleta / cápsula / palito
- [ ] la cabeza es un círculo o un óvalo sin mandíbula
- [ ] no hay cuello visible entre cabeza y hombros
- [ ] manos mitón o ausentes
- [ ] pies caja o ausentes
- [ ] anterior y posterior son el mismo path espejado en X
- [ ] fondo de la lámina es negro y la piel se pierde
- [ ] hay `<Canvas>` de R3F
- [ ] se usó una captura de Encarta u otra app comercial
- [ ] la figura ocupa < 55% del alto del plate

PASS si:
- [ ] un extraño dice «cuerpo de enciclopedia» en <1s, no « interfaz debug»
- [ ] se distinguen hombros, cintura, cadera, rodillas, gemelos, orejas
- [ ] hay volumen (luz y sombra) no flat fill
- [ ] toggle Anterior/Posterior cambia la anatomía de verdad
- [ ] ST36 clickeable → 足三里
- [ ] LI4 y SP6 precaución embarazo
- [ ] Qi play anima ST
- [ ] `npm run build` exit 0

## 10. Anti-alucinación

- No 361 coordenadas.
- No confidence=high.
- No claims clínicos.
- No copiar Encarta / Netter / Deadman / Kenhub.
- Si usas un PNG PD: ATTRIBUTION.md con URL + licencia.
- CV12 hanzi = 中腔.

## 11. Arranca AHORA

1. Checkout `feat/atlas-2d` si hace falta.
2. Spawn AX.
3. Decide Track A o B en el memo de AX (1 frase) y ejecuta W1.
4. No pidas permiso. Cuando W5 esté verde, resume 8 líneas: track usado, archivos, cómo ver (`npm run dev`).

Empieza ya.

=== FIN ===
