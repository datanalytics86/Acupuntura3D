# MEGAPROMPT 2D MAX — Acupuntura3D

Copia desde `=== PEGAR DESDE AQUÍ ===` hasta `=== FIN ===` y pégalo en Grok Terminal / Grok Build, en la raíz del repo.

El humano ya aprobó: el 3D procedural es inaceptable. Implementa el atlas 2D **sin parar**.

=== PEGAR DESDE AQUÍ ===

# Acupuntura3D — PIVOT 2D ESTÉTICO — orquestación multiagente AUTÓNOMA

Eres el ORQUESTADOR de Grok Build en `datanalytics86/Acupuntura3D`.
Capacidad máxima: hasta 8 subagentes, depth=1, worktrees, verify loop.
No eres autocomplete. Eres el director de arte + ingeniero de un atlas de meridianos.

## 0. MODO: IMPLEMENTAR SIN PARAR

El humano YA decidió. Feedback literal:
> «no me gustó la implementación del 3D» «quizás 2D pero muy bonito estéticamente» «el proyecto es decepcionante estéticamente (para nada se parece a un cuerpo humano)» «implemente sin parar»

REGLAS DE AUTONOMÍA:
1. NO uses Plan mode para esperar aprobación. Planifica 60 segundos internamente y ejecuta.
2. NO preguntes «¿sigo?», «aprueba F0», «¿3D o 2D?». Ya está decidido: 2D bello.
3. NO dejes el maniquí de cápsulas. Si al final el cuerpo no se lee como humano adulto, el trabajo está incompleto: itera el SVG hasta que pase el test visual.
4. Si un subagente falla: reintenta 1 vez, continúa, no te detengas.
5. Criterio de parada ÚNICO: `npm run typecheck` + `npm test` + `npm run build` verdes Y el test visual de la sección 12 en verde.
6. Commits atómicos por oleada. No force-push a main.
7. Máx. 8 subagentes. Depth=1. isolation=worktree para código. explore read-only primero.
8. No instales librerías 3D nuevas. No backend. No API keys. No 361 XYZ inventados.

## 1. Diagnóstico (leer antes de tocar)

Lee ahora: `README.md`, `AGENTS.md`, `package.json`, `src/app/App.tsx`, `src/scene/body/ProceduralBody.tsx`, `src/scene/CanvasRoot.tsx`, `data/acupoints.seed.json`, `data/meridians.json`, `src/state/viewerStore.ts`, `src/ui/*`.

El fallo no es el stack de fichas. El fallo es `ProceduralBody`: cápsulas + esfera + cajas = robot de prototipo. `CanvasRoot` todavía muestra Grid y axesHelper. Eso es lo que el humano vio y rechazó.

LO QUE SÍ FUNCIONA Y SE CONSERVA:
- Vite + React 19.2 + TS strict + Tailwind 4 + Zustand
- `data/*` (14 meridianos + 20 seed + schemas)
- contratos `src/types/acupuncture.ts`
- drawer, rail, search, clock, disclaimer, i18n ES/EN
- `vercel.json`

LO QUE SALE DEL RUNTIME (no dejes imports muertos):
- `@react-three/fiber`, `@react-three/drei`, `three` como vista
- `src/scene/body/ProceduralBody.tsx`
- Grid, axesHelper, OrbitControls, ContactShadows, Starfield 3D, TubeGeometry, InstancedMesh 3D
Puedes dejar las deps en package.json una oleada si el build se complica; la UI principal NO debe montar `<Canvas>` de R3F. Preferible desinstalar al final de la última oleada si `npm run build` sigue verde.

## 2. Misión visual (norte estético)

Construir un **atlas 2D de museo contemporáneo de MTC**, no un visor 3D, no un juego, no un debug.

Al abrir, el usuario debe ver:
- una figura humana ADULTA de pie, de canones reales (8 cabezas), llenando el alto del viewport
- piel marfil cálida con sombreado interno suave (deltoides, pectoral, recto abdominal sugerido, vastos, gemelos) — no gore, no desnudo explícito (silueta clásica de lámina, pubis/pecho estilizados)
- dos vistas: **Anterior** y **Posterior** (toggle). Lateral opcional si sobra tiempo
- 14 meridianos como trazos de seda/tinta sobre la piel, color Wu Xing de la tabla
- Qi = pulso luminoso recorriendo el path SVG (stroke-dash + partículas 2D)
- 20 puntos estrella = núcleo jade + anillo oro + halo al hover/select
- click → misma ficha (PointDrawer). Rail y search siguen iguales
- fondo tinta `#07090d`, grain existente, marco hairline oro, título 針 / Acupuntura3D
- pinch/zoom + pan sobre la figura; double-tap reset

Referencia de género: lámina de acupuntura editorial (frente/espalda), no Anatomium 3D, no muñeco de cápsulas.

Disclaimer permanente:
«Herramienta educativa. No es un dispositivo médico y no sustituye a un profesional de Medicina Tradicional China.»

## 3. No-goals

- Volver a R3F / GLB / cápsulas / esferas-cabeza
- Stick figure, gingerbread, blob, rectángulo con circulito
- Backend, auth, CMS, AR/VR
- Diagnóstico, recetas, claims clínicos
- Copiar Deadman u otros manuales comerciales
- Inventar 361 coordenadas
- Mostrar 361 labels a la vez
- Pornografía o desnudo fotoreal; es una lámina didáctica

## 4. Stack lock

```
Vite + React 19.2 + TypeScript strict + Tailwind 4 + Zustand
Vista: SVG inline + React (NO R3F)
Pan/zoom: implementación propia sobre viewBox (pointer events). Prohibido añadir d3 si no hace falta.
Qi: SVG path getTotalLength / getPointAtLength + requestAnimationFrame o CSS stroke-dashoffset
Datos: JSON en /data. Cero puntos hardcodeados en JSX salvo landmarks del maniquí.
Deploy: Vite static → Vercel (ya hay proyecto acupuntura3d)
Gestor: npm
```

Si necesitas una sola dep nueva: sólo si es imprescindible y liviana. Preferible cero deps nuevas.

## 5. Sistema de figura (A2 NO improvisar esto)

ViewBox canónico: `0 0 800 1600`. Origen arriba-izquierda. Figura centrada en x=400.

Canon de 8 cabezas (y en unidades SVG):

| landmark | y |
|---|---:|
| vértice | 40 |
| mentón | 140 |
| hueco supraesternal | 190 |
| hombros (acromion) | 210 |
| pezón / 4º EIC | 320 |
| apéndice xifoides | 380 |
| ombligo | 470 |
| espina iliaca / cresta | 560 |
| pubis / periné estilizado | 620 |
| punta de los dedos (brazos a lo largo) | 640 |
| mid-thigh | 820 |
| rodilla (interlínea) | 980 |
| mid-calf | 1140 |
| maléolo | 1320 |
| planta | 1480 |

Anchos (anterior, mitad izquierda del sujeto = x < 400 en pantalla):
- cabeza: radio craneal ~52, no círculo perfecto (ovale, mentón, orejas)
- hombros: x = 400 ± 148
- cintura: x = 400 ± 78
- cadera: x = 400 ± 118
- rodilla: x = 400 ± 58
- tobillo: x = 400 ± 38
- muñeca colgante: ~ (400 ± 210, 600)

Obligatorio en el path de silueta:
cuello, trapecio, deltoides, hueco antecubital, muñeca, bloque de mano con pulgar separado (no palito), cintura, gran trocánter, muslo que estrecha a rodilla, gemelo, maléolo, pie con empeine (no caja). Cabeza con frente, nariz sugerida, oreja. Posterior: occipital, trapecios, omoplatos sugeridos, pliegue glúteo estilizado, hueco poplíteo, tendón de Aquiles.

Capas SVG (z-order atras→adelante):
1. glow ambiente detras de la figura
2. fill piel (`#cbb7a0` → `#8f7a66` sombreado)
3. músculo interior a 8–14% opacity (`#6a5344`)
4. contour hairline `#1a140f` 1.2px
5. meridianos (stroke 2.2 / 3.4 si activo)
6. Qi beads
7. puntos
8. label del seleccionado (código + hanzi)

Archivos:
- `src/atlas/figure/landmarks.ts` — tabla numérica
- `src/atlas/figure/anteriorSilhouette.ts` — path `d` original
- `src/atlas/figure/posteriorSilhouette.ts` — path `d` original
- `src/atlas/figure/interiorShading.ts` — paths de grupos musculares suaves

PROHIBIDO: `<circle>` como cabeza única, `<rect>` como torso, `<capsule>` mental exportado a ellipse. Si dudas, itera el path cubic-bezier, no bajes el estándar.

## 6. Coordenadas 2D

Extiende el contrato (no rompas campos viejos):

```ts
export type AtlasView = "anterior" | "posterior";

export interface Point2D { x: number; y: number } // unidades viewBox 800×1600

export interface Acupoint {
  // ...campos existentes...
  position?: { x: number; y: number; z: number }; // legado 3D, no borrar
  position2d?: {
    anterior?: Point2D;
    posterior?: Point2D;
  };
  views?: AtlasView[];
}
```

ViewerState añade:
`atlasView: AtlasView`
`atlasZoom: number` // 1–6
`atlasPan: Point2D`

Mapeo de seed legado → 2D (usar sólo como fallback si falta position2d):

```
function legacyTo2d(p, view):
  // p.x metros, 0=midline, +x = izquierda del sujeto
  // p.y +0.90 vértice, −0.92 planta
  // p.z + frente, − espalda
  const x = view === "anterior" ? 400 + p.x * 380 : 400 - p.x * 380
  const y = 40 + (0.92 - p.y) / 1.84 * 1440
```

A1 debe escribir `position2d` REALES para los 20 seed usando landmarks (no el fallback crudo). confidence sigue `low`.
Regla de vista:
- z >= 0.02 → anterior
- z <= −0.02 → posterior
- |z| < 0.02 (vértice, costados) → las dos vistas si es plausible (GV20 anterior+posterior, SI3/LI4 sólo la vista de la mano que corresponda; mano anterior muestra palma/dorso según punto)

Colocación semántica mínima (A1+A2, anterior unless noted):
- GV20: (400, 48) ambas
- EX-HN3: (400, 108) anterior
- CV17: (400, 320) anterior
- CV12: (400, 430) anterior
- GV14: (400, 205) posterior
- EX-B1: (400±18, 205) posterior
- BL23: (400±28, 500) posterior
- GB20: (400±36, 168) posterior
- LI4: mano dorso, ~ (188, 628) anterior-ish / ajustar al bloque de mano
- SI3: borde cubital mano
- LU7 / HT7 / PC6 / TE5: muñeca-antebrazo L
- ST36: 3 cun bajo rodilla, lateral tibia ~ (400+52, 1080)
- GB34: cabeza del peroné ~ (400+70, 1005)
- SP6: 3 cun sobre maléolo medial ~ (400+32, 1248)
- KI3: entre maléolo medial y Aquiles ~ (400+44, 1320)
- LR3: dorso pie I–II ~ (400+48, 1428)
- BL40: poplíteo posterior ~ (400+48, 980)

Bilateral: dibuja L y R espejo sólo si laterality no es C. Seed tiene L; espeja a R con x' = 800-x cuando el toggle «ambos lados» esté on (default on).

## 7. Meridianos 2D + Qi

`data/meridians.json`: añade `path2d: { anterior?: string; posterior?: string }` con `d` SVG (o `anchors2d` y construyes Catmull-Rom 2D → path). Preferible anchors2d[] para no hardcodear Bézier a ciegas.

```ts
anchors2d?: { anterior?: Point2D[]; posterior?: Point2D[] }
```

A4 construye path con Catmull-Rom 2D (centripetal) a partir de anchors que RECORREN la silueta, no el vacío. Si un anchor queda fuera del fill de piel, corrígelo.

Qi:
```
L = path.getTotalLength()
s = (t * speed * L + i * L / N) % L
pt = path.getPointAtLength(s)
```
N=10 high / 5 medium / 0 low (sólo dashflow).
Play/pause/velocidad del store actual. Boost circadiano: stroke-width * 1.25 y opacity * 1.2 si clockHour ∈ bloque del meridiano.
No simules patología.

Colores (igual tabla OMS):
LU/LI #C0C8D0 · ST/SP #C4A35A · HT/SI/PC #E23B3B · BL/KI #2B6CB0 · TE #C45C26 · GB/LR #3D8B40 · GV #8B5CF6 · CV #F59E0B

## 8. Árbol objetivo + ownership

```
src/atlas/AtlasRoot.tsx              A2
src/atlas/Viewport.tsx               A2   pan/zoom/touch
src/atlas/Figure.tsx                 A2
src/atlas/figure/**                  A2
src/atlas/MeridianPaths.tsx          A4
src/atlas/QiFlow.tsx                 A4
src/atlas/Points2D.tsx               A3
src/atlas/mapCoords.ts               A1+A2
src/app/App.tsx                      A0  monta AtlasRoot, NO CanvasRoot
src/scene/**                         A0  dejar de importar; borrar o mover a src/_legacy/
data/meridians.json                  A1  + anchors2d
data/acupoints.seed.json             A1  + position2d
src/state/viewerStore.ts             A6  + atlasView/zoom/pan
src/ui/**                            A5  toggle Anterior|Posterior; quitar señales 3D
```

## 9. Agentes

### AX EXPLORE — explore / read-only
Inventario de imports R3F, store, seed. Memo 15 líneas. Cero edits.

### A0 INTEGRATOR — general-purpose / worktree
App.tsx monta AtlasRoot. Quita Canvas R3F. index.html fuentes ya están (Outfit, Cormorant, Noto Serif SC): verifícalas; si faltan, añádelas. `npm run build` es tu verify.

### A1 DATA — general-purpose / worktree
position2d de 20 seed + anchors2d de 14 meridianos. No inventes 361. confidence=low. CV12 hanzi = 中腔 (ya correcto en seed; no lo rompas).

### A2 FIGURE — general-purpose / worktree
Silueta anterior+posterior + sombreado + Viewport. Esta es la oleada CRÍTICA. DoD visual sección 12. Si falla, A2 itera antes de que A3/A4 pinten encima.

### A3 POINTS — general-purpose / worktree
20 nodos. Hit area ≥ 24px táctil. Hover halo. Click → selectedPointId. Label sólo selected/hover.

### A4 QI — general-purpose / worktree
14 paths + animación. Toggle capa meridians/qi del store. Meridiano activo full; otros opacity 0.22.

### A5 UI — general-purpose / worktree
Toggle Anterior | Posterior en Topbar. Quita quality bloom 3D labels si sobran. Drawer intacto. Bottom sheet <768px.

### A6 STATE — general-purpose / worktree
atlasView, atlasZoom, atlasPan. Persistencia no requerida.

### A7 QA — general-purpose / worktree
Actualiza tests smoke (ya no esperan three). README: «atlas 2D». `npm run build`. No rompas vercel.json.

## 10. Oleadas (ejecutar todas ahora)

Wave 0 (5 min): AX explore + A2 bosqueja landmarks.ts. No pares.
Wave 1: A2 figura anterior sólida (sin meridianos). Verify visual humano.
Wave 2: A2 posterior + Viewport pan/zoom + A6 store view.
Wave 3: A1 position2d/anchors2d + A4 paths.
Wave 4: A3 puntos + A5 toggle + drawer hookup.
Wave 5: A4 Qi + clock boost + A0 desmontar R3F + A7 tests/build.

Commits:
- `feat(atlas): silueta humana 2D anterior-posterior`
- `feat(atlas): meridianos y puntos 2D`
- `feat(atlas): flujo de Qi 2D`
- `refactor: retirar R3F del runtime`
- `chore: smoke tests y readme atlas 2D`

## 11. UX ficha (no improvisar)

Orden igual que ahora:
code + hanzi + pinyin + ES · meridiano/elemento · localización · funciones · indicaciones (badge educativo) · precauciones · combinaciones · sources + confidence · botón «Seguir el Qi».

Teclado: `/` search, Esc cierra, ← → recorre puntos del meridiano, `A`/`P` cambia vista.

## 12. Test visual — OBLIGATORIO (si falla, no es done)

FAIL automático si ocurre CUALQUIERA:
- [ ] la cabeza es un círculo sobre un rectángulo o cápsula
- [ ] no se distinguen cuello, hombros, cintura, rodillas, pies con empeine
- [ ] las manos son líneas o círculos
- [ ] la figura ocupa < 55% del alto del viewport en zoom 1
- [ ] hay Grid, ejes, fps cube o fondo «three default»
- [ ] meridianos cruzan el vacío fuera del cuerpo más de 8px de forma sistemática
- [ ] se monta `<Canvas>` de @react-three/fiber en App
- [ ] aspecto de prototipo / debug / juguete de cápsulas

PASS si:
- [ ] un extraño reconoce «cuerpo humano de pie, lámina médica» en < 1 segundo
- [ ] toggle Anterior/Posterior cambia de verdad la silueta (no un flip X barato de la misma path frontal)
- [ ] ST36 clickeable → ficha 足三里
- [ ] LI4 y SP6 muestran precaución embarazo
- [ ] play Qi anima al menos el meridiano ST
- [ ] search «zusanli» o «ST36» selecciona el punto y hace zoom suave
- [ ] disclaimer visible
- [ ] `npm run build` exit 0

## 13. Anti-alucinación

- Prohibido 361 `{x,y}` de memoria.
- Prohibido confidence=high.
- Prohibido «según estudios cura X».
- Prohibido copiar láminas con copyright (Netter, Deadman charts, apps comerciales) como SVG.
- Dibuja paths ORIGINALES a partir del canon de la sección 5.
- Si un punto no ancla bien: ficha ok + `unmapped.json` + aparece sólo en rail.

## 14. Primera acción tuya, ahora

1. Spawn AX explore.
2. Spawn A2 para landmarks + silueta anterior.
3. Sigue las oleadas hasta el test visual PASS y build verde.
4. Resume al final en 8 líneas: archivos tocados, cómo abrir, qué se retiró de 3D.

Empieza ya. No esperes al humano.

=== FIN ===
