# MEGAPROMPT 2D ATLAS — Acupuntura3D

Copia desde `=== PEGAR DESDE AQUÍ ===` hasta `=== FIN ===`.
Pégalo en Grok Terminal / Grok Build en la raíz de `datanalytics86/Acupuntura3D`.
Este prompt **es la aprobación humana**. Implementa sin parar.

=== PEGAR DESDE AQUÍ ===

# Acupuntura3D — Atlas 2D editorial (ejecución autónoma multiagente)

Eres el ORQUESTADOR de Grok Build en el repo `datanalytics86/Acupuntura3D`.
Trabajas a máxima capacidad: hasta 8 subagentes, depth=1, worktrees, verify loop.
No eres un autocomplete. Eres el director de arte + ingeniero de un atlas de acupuntura que debe verse como lámina de museo, no como demo de Three.js.

## 0. Por qué existe este ciclo (lee esto primero)

El humano **probó** https://acupuntura3d.vercel.app y rechazó la implementación 3D.
Causa: `src/scene/body/ProceduralBody.tsx` es un maniquí de cápsulas + esferas + cajas. No se parece a un cuerpo humano. Es decepcionante estéticamente.

Decisión del humano (no la discutas, no la suavices, no «mejores las cápsulas»):

- Abandonar R3F / Three.js como **vista principal**.
- Rehacer la escena como **atlas 2D** (SVG React) muy bello.
- Conservar datos, fichas, rail, search, Qi, disclaimer, deploy.
- Implementar **SIN PARAR**.

## 1. Protocolo SIN PARAR (sobreescribe MEGAPROMPT_MAX y Plan mode)

Este bloque **es la aprobación**. No esperes «aprueba F0».

1. Lee ahora: `README.md`, `AGENTS.md`, `src/app/App.tsx`, `src/scene/body/ProceduralBody.tsx`, `src/types/acupuncture.ts`, `data/acupoints.seed.json`, `data/meridians.json`, `src/ui/*`.
2. Plan interno ≤ 90 segundos. Si el TUI te mete en `/plan`, escribe un plan de 12 líneas y **ejecuta de inmediato** como si estuviera aprobado.
3. Prohibido preguntar estética, stack o ¿2D o 3D?. Ya está decidido.
4. Pregunta al humano SOLO si hay bloqueo legal (licencia de imagen) o el working tree está sucio sin forma de commitear. Si está sucio: stash o commit WIP y sigue.
5. Subagentes: máximo 8 en paralelo. Depth = 1. `explore` + read-only para investigar. `general-purpose` + `isolation=worktree` para código. No Arena.
6. Un subagente solo toca sus paths. Si necesita un archivo ajeno: reporta, no lo edites.
7. Después de cada oleada: merge worktrees, `npm run typecheck` o `npm run build`, commit atómico.
8. No instales paquetes nuevos salvo que `npm run build` lo exija. Preferir SVG + CSS. Prohibido añadir Next, Three extra, Cannon, physics, backend.
9. No pares hasta cumplir la sección 13 (Definition of Done visual + build verde).
10. Al terminar: `npm run build` exit 0, commit final, resume de 15 líneas. No redeploy Vercel a menos que el build ya estuviera cableado y un push a `main` lo dispare solo.

## 2. Misión de este ciclo

Sustituir la escena 3D fea por un **atlas 2D de lámina médica contemporánea**:

- Figura humana reconocible (canon 8 cabezas), vista **anterior** y **posterior**.
- Zoom de región: rostro / mano / pie (placas secundarias) para puntos que no caben bien en el cuerpo entero.
- 14 meridianos como trazos de tinta/seda sobre la figura.
- 20 puntos estrella ya existentes, remapeados a 2D, clickables.
- Qi = brillo que recorre el path 2D (stroke-dashoffset + puntos de luz). Play/pause/velocidad se quedan.
- UI existente se queda: Topbar, MeridianRail, PointDrawer, QiClock, Disclaimer, search, ES/EN.
- App.tsx **deja de montar** `CanvasRoot`.

Disclaimer permanente:
«Herramienta educativa. No es un dispositivo médico y no sustituye a un profesional de Medicina Tradicional China.»

## 3. No-goals

- No «arreglar» ProceduralBody, no GLB, no órbita 3D, no bloom Three.
- No 361 coordenadas nuevas. No F4.
- No backend, auth, CMS, AR/VR.
- No copiar manuales comerciales ni atlas con copyright (Deadman, apps pagas, fotos stock de cuerpos).
- No claims clínicos.
- No instalar `@react-three/*` extra. Puedes dejar las deps actuales para no romper lockfile; simplemente no las uses en runtime.
- No dos sexos / morphs / BMI.

## 4. Stack lock (este ciclo)

```
Vite 8 + React 19.2 + TypeScript strict + Tailwind 4 + Zustand
Vista: SVG React (src/atlas/**)
Animación Qi: CSS + SMIL o requestAnimationFrame sobre pathLength
Pan/zoom 2D: pointer events propios (rueda + pinch + drag). Sin librería nueva si se puede.
Datos: JSON en /data
Deploy: Vite static → Vercel (ya existe vercel.json)
```

React sigue pinneado a 19.2.x. No subas a 19.3.

## 5. Estética — brief de dirección de arte (A2 no improvisa)

Referencia verbal (no descargues imágenes con copyright):

lámina de acupuntura de estudio contemporáneo + manuscrito MTC + editorial de museo.
Papel de noche, figura de marfil, trazos de tinta, acentos oro / cinabrio / jade.

Paleta:

```
--ink:        #0b0d10
--paper:      #12141a
--skin-hi:    #f0ddc8
--skin-mid:   #d7b89a
--skin-lo:    #b8896a
--line:       #6a4e3a
--gold:       #e8c98a
--cinnabar:   #b83b3b
--jade:       #7d9b78
--mist:       rgba(243,239,230,0.08)
```

Fondos: radial cálido detrás de la figura + grain ya existente (`.grain`) + vignette.
Tipografía: ya hay Outfit + Cormorant Garamond + Noto Serif SC. Úsalas. Títulos display serif.

Figura:

- Androgina, académica, no sexualizada.
- Contorno cerrado de piel con gradiente sutil (luz arriba-izquierda).
- Cuello visible. Hombros en pendiente. Cintura marcada. Cadera. Muslos y pantorrillas separados.
- Manos con indicación de pulgar. Pies con empeine, no rectángulos.
- Rostro: óvalo, cejas suaves, nariz de tres trazos, labios mínimos. Sin emoji, sin ojos grandes anime.
- Interior: líneas de construcción oro a 12% opacity (esternón, crestas ilíacas, tibia, clavículas). Nunca un esqueleto completo terrorífico.
- Cabello: mancha de tinta simple, no spikes.

FAIL instantáneo (si ocurre, rehacer el SVG antes del merge):

- hombre de jengibre / palito / cápsulas / esferas = torso
- robot, maniquí de tienda abstracto, emoji 🧑
- torso cilíndrico sin cintura
- brazos pegados al cuerpo sin axila
- pies caja, manos mitón sin pulgar
- cabeza círculo perfecto sin cuello
- foto recortada, silueta stock, calco de app comercial

Test de 3 segundos: una persona no médica debe decir «eso es un cuerpo humano de frente / de espalda», no «eso es un experimento 3D».

## 6. Sistema de coordenadas 2D (obligatorio)

```
viewBox = "0 0 800 1600"
midline x = 400
unidades: píxeles de viewBox, Y crece hacia abajo (SVG)
```

Landmarks ANTERIOR (clávalos; la silueta pasa por aquí):

```
vertex          400, 70
hairline        400, 95
glabela         400, 130
nariz           400, 155
barbilla        400, 195
cuello L/R      372 / 428, 228
hombros L/R     250 / 550, 270
axila L/R       292 / 508, 318
pezón L/R       348 / 452, 400     (sólo como landmark interno, no dibujar pezones)
xifoides        400, 455
cintura L/R     332 / 468, 530
ombligo         400, 580
ASIS L/R        348 / 452, 640
pubis           400, 700
trocánter L/R   330 / 470, 710
muñeca L/R      168 / 632, 640
mano L/R        130 / 670, 730
mid thigh L/R   348 / 452, 880
rodilla L/R     352 / 448, 1040
mid calf L/R    356 / 444, 1220
tobillo L/R     360 / 440, 1400
planta L/R      360 / 440, 1525
```

Landmarks POSTERIOR: misma caja. Occipucio 400,115. C7 400,250. Omóplatos 340/460, 360. Pliegue glúteo 400, 760. Hueco poplíteo 352/448, 1040.

Tipos a añadir (no rompas los existentes):

```ts
export type AtlasView = "anterior" | "posterior";
export type AtlasRegion = "body" | "face" | "hand" | "foot";

export interface Point2D { x: number; y: number }

export interface Acupoint {
  // ...campos actuales
  position?: { x: number; y: number; z: number }; // legado 3D, no usar en UI
  position2d?: {
    anterior?: Point2D;
    posterior?: Point2D;
    region?: AtlasRegion;
  };
}

export interface Meridian {
  // ...campos actuales
  pathAnchors: { x: number; y: number; z: number }[]; // legado
  path2d?: {
    anterior?: Point2D[];
    posterior?: Point2D[];
  };
}
```

Zustand: añade `atlasView: AtlasView` y `atlasRegion: AtlasRegion` + setters.
Default: anterior / body.

## 7. Árbol objetivo y ownership

```
src/atlas/AtlasRoot.tsx              A0 + A2   # reemplaza CanvasRoot en App
src/atlas/AtlasStage.tsx             A2        # pan/zoom, viewBox
src/atlas/figure/AnteriorFigure.tsx  A2        # SILUETA CRÍTICA
src/atlas/figure/PosteriorFigure.tsx A3
src/atlas/figure/landmarks.ts        A2
src/atlas/figure/FacePlate.tsx       A3
src/atlas/figure/HandPlate.tsx       A3
src/atlas/figure/FootPlate.tsx       A3
src/atlas/meridians/MeridianPaths.tsx A4
src/atlas/qi/QiStroke.tsx            A4
src/atlas/points/AcupointNodes.tsx   A5
src/atlas/points/hitTest.ts          A5
src/ui/ViewToggle.tsx                A6        # Anterior | Posterior
src/ui/RegionToggle.tsx              A6        # Cuerpo | Rostro | Mano | Pie
src/app/App.tsx                      A0        # monta AtlasRoot, NO CanvasRoot
src/state/viewerStore.ts             A6
src/types/acupuncture.ts             A1
data/acupoints.seed.json             A1
data/meridians.json                  A1
data/README.md                       A1
tests/atlas-smoke.test.ts            A7
```

`src/scene/**` queda huérfano. No lo borres en este ciclo si arriesga el compile; sí desconéctalo de App. Un commit posterior puede eliminarlo.

## 8. Seed 20 — dónde cae cada punto (A1 + A5)

Remapea `position2d` aprox. sobre los landmarks. confidence permanece `low`. No inventes 361.

| code | vista | región | ancla 2D (aprox) |
|---|---|---|---|
| EX-HN3 | anterior | face/body | glabela 400,130 |
| GV20 | posterior (y punto en vértice anterior) | body | vertex 400,70 |
| GB20 | posterior | body | nuca 368, 200 |
| GV14 | posterior | body | C7 400,250 |
| EX-B1 | posterior | body | 418, 250 |
| CV17 | anterior | body | 400, 400 |
| CV12 | anterior | body | 400, 500 |
| BL23 | posterior | body | 428, 560 |
| LI4 | anterior | hand | dorso mano L ~145, 710 |
| SI3 | posterior | hand | borde cubital L ~155, 720 |
| LU7 | anterior | body | antebrazo radial L ~190, 600 |
| HT7 | anterior | body | muñeca cubital palmar L ~175, 640 |
| PC6 | anterior | body | antebrazo palmar L ~200, 610 |
| TE5 | posterior | body | antebrazo dorsal L ~200, 610 |
| ST36 | anterior | body |  392, 1120 (lateral a tibia L; x~392 si L está a 352) espera: rodilla L 352,1040 → ST36 ~ 372, 1140 |
| GB34 | anterior | body |  390, 1085 |
| SP6 | anterior | body |  340, 1320 (medial, 3 cun sobre maléolo) |
| KI3 | posterior/anterior | foot |  348, 1400 (entre maléolo medial y Aquiles) |
| LR3 | anterior | foot |  350, 1495 (dorso pie L) |
| BL40 | posterior | body |  352, 1040 |

Bilateral: dibuja L y R si laterality no es C. El seed hoy sólo tiene L; replica R por simetría `x' = 800 - x` salvo midline.

CV12 hanzi correcto: 中腔. No 中腓.

## 9. Matriz de agentes

### AX EXPLORE — explore / read-only (primero, 2 min)
Memo de 15 líneas: qué monta App hoy, qué store existe, cuántos puntos hay. Cero edits.

### A0 ORQUESTADOR — general-purpose / isolation=none
- Reescribe `App.tsx` para montar `AtlasRoot`.
- Conecta toggles.
- Merge final de worktrees.
- DoD: no hay `<Canvas>` en el árbol renderizado.

### A1 DATA — general-purpose / worktree
- Owns: types, data/*, loaders.
- Añade position2d / path2d. Llena 20 puntos + 14 paths con 6–12 anclas cada uno.
- path2d sigue landmarks y `flow` clásico. No inviertas dirección.
- DoD: TypeScript limpio; seed.length===20; meridians.length===14.

### A2 FIGURA ANTERIOR — general-purpose / worktree  **CRÍTICO**
- Owns: AtlasStage, AnteriorFigure, landmarks.ts.
- Un solo `<path>` (o group de paths) de contorno cerrado, más group de construcción.
- Fill url(#skinGrad). Stroke 1.2 oro-tinta.
- Pan/zoom: wheel, pinch, drag fondo. Doble click reset.
- DoD visual: pasa el test de 3 segundos. Si no, reescribe el path antes de merge.

### A3 FIGURA POSTERIOR + PLACAS — general-purpose / worktree
- Owns: PosteriorFigure, FacePlate, HandPlate, FootPlate.
- Misma calidad que A2. Espalda con surco vertebral suave, omóplatos, pliegue glúteo, hueco poplíteo.
- Placas: recortes elegantes del mismo estilo, no otro dibujo infantil.
- DoD: toggle Posterior muestra una espalda humana.

### A4 MERIDIANOS + QI — general-purpose / worktree
- Owns: MeridianPaths, QiStroke.
- Polyline/path suavizado (Catmull-Rom 2D implementado en `src/lib/curves.ts` o cubic).
- stroke Wu Xing de la tabla ya existente. width 1.6; activo 2.4 + glow.
- Qi: `stroke-dasharray` + offset animado Y círculos que recorren `getPointAtLength`.
- Respeta qiPlaying, qiSpeed, clockHour boost (×1.35).
- Dimmed si hay activeMeridianId distinto.
- DoD: play en ST se ve fluir de cabeza hacia pie.

### A5 PUNTOS — general-purpose / worktree
- Owns: AcupointNodes, hitTest.
- Nodo: círculo 5 px oro, anillo jade al hover, anillo cinabrio + label code al selected.
- Hit area 18 px. Click → store.selectedPointId. Hover → hoveredPointId.
- Label sólo hover+selected. Nunca 20 labels a la vez.
- DoD: click ST36 abre la ficha 足三里. LI4 muestra precaución embarazo.

### A6 UI / STATE — general-purpose / worktree
- Owns: viewerStore extras, ViewToggle, RegionToggle, i18n keys nuevas (frente, espalda, rostro, mano, pie).
- Integra toggles en Topbar o bajo la figura, estilo `.panel` existente.
- DoD: Anterior/Posterior y región cambian el SVG sin remount de toda la app.

### A7 QA — general-purpose / worktree
- Owns: tests/atlas-smoke.test.ts, README alcance MVP 2D.
- Smoke: meridians 14, seed 20, todos los seed tienen position2d en al menos una vista.
- `npm run build` green.
- Actualiza README: «el MVP visible es atlas 2D; el 3D procedural quedó fuera de runtime».

## 10. Oleadas (ejecuta todas; no pares entre ellas)

**Wave 0** AX explore (2 min) + plan interno.
**Wave 1** paralelo: A1 data + A2 figura anterior + A6 store/toggles.
Merge. Verify: App muestra figura anterior + UI vieja. `tsc` ok.
Commit `feat(atlas): figura anterior 2D y coords`.

**Wave 2** paralelo: A3 posterior/placas + A4 paths (sin Qi aún).
Commit `feat(atlas): posterior y 14 trazos`.

**Wave 3** paralelo: A5 puntos + A4 Qi + A0 desconectar CanvasRoot.
Commit `feat(atlas): puntos, Qi 2D y retiro del canvas 3D`.

**Wave 4** A7 tests + README + polish CSS (halo selected, transiciones 180ms).
Commit `feat(atlas): qa y pulido editorial`.

Si A2 falla el test de 3 segundos después de Wave 1, **no sigas a Wave 2**. Reescribe la silueta.

## 11. UX que no se toca (salvo integración)

Ficha (PointDrawer) orden actual se mantiene.
Teclado: `/` search, Esc cierra, ← → recorre puntos del meridiano activo.
Touch: pinch zoom de AtlasStage, tap selecciona nodo.
Disclaimer visible siempre.

Nuevo control:

```
[ Anterior | Posterior ]     [ Cuerpo | Rostro | Mano | Pie ]
```

Al seleccionar un punto de `region !== body`, cambia la placa automáticamente.
Botón de ficha «Seguir el Qi de este meridiano»: activeMeridianId + qiPlaying + atlasView coherente (CV anterior, GV/BL posterior).

## 12. Qi 2D (A4 no improvisa)

```
path = spline2d(meridian.path2d[atlasView])
L = path.getTotalLength()
for i in 0..N-1:
  d = ( (now * qiSpeed * 40 + i * L / N) % L )
  pt = path.getPointAtLength(d)
```

N = 10 en quality high, 5 medium, 0 low (sólo dash).
Color = meridian.color. Glow gold si clockHour ∈ bloque del órgano.
No simules estancamiento ni patología.

## 13. Definition of Done (no pares antes)

- [ ] `App.tsx` no monta `CanvasRoot` ni `<Canvas>`.
- [ ] Vista anterior: cuerpo humano reconocible, no cápsulas.
- [ ] Vista posterior: espalda humana reconocible.
- [ ] 14 trazos toggleables desde el rail.
- [ ] 20 puntos accesibles; ST36 → 足三里; LI4 y SP6 precaución embarazo.
- [ ] Qi play/pause visible en al menos ST y CV.
- [ ] Search, drawer, disclaimer, ES/EN siguen vivos.
- [ ] `npm run typecheck` exit 0.
- [ ] `npm run build` exit 0.
- [ ] README declara atlas 2D como vista MVP.
- [ ] Cero 361 xyz nuevos. Cero texto copiado de manuales.

## 14. Git

conventional commits `feat(atlas):` / `fix(atlas):` / `docs:` / `chore:`.
No dist/, no node_modules.
No force-push a main.
Un commit por oleada mergeada.

## 15. Primera acción, ahora

No imprimas un plan largo para el humano.
Lanza AX explore, escribe el plan interno, arranca Wave 1.
Cuando Wave 4 cierre, resume en 15 líneas: archivos tocados, cómo verlo (`npm run dev`), qué quedó fuera (361, GLB, ZH).

Empieza.

=== FIN ===
