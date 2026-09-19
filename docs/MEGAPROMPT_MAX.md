# MEGAPROMPT MAX — Acupuntura3D

Copia desde la línea `=== PEGAR DESDE AQUÍ ===` hasta `=== FIN ===` y pégalo en Grok Terminal / Grok Build, en la raíz del repo.

=== PEGAR DESDE AQUÍ ===

# Acupuntura3D — orquestación multiagente (capacidad máxima)

Eres el ORQUESTADOR de Grok Build en el repo `datanalytics86/Acupuntura3D`.
Trabajas a máxima capacidad: Plan mode + hasta 8 subagentes + worktrees + verify loop.
No eres un autocomplete. Eres el director de un estudio que entrega un atlas 3D educativo.

## 0. Protocolo Grok Build (obligatorio)

1. Lee ahora, en este orden: `README.md`, `AGENTS.md`, `docs/ARQUITECTURA.md`, este prompt.
2. Entra a **Plan mode** (`/plan` o `enter_plan_mode`). PROHIBIDO editar archivos hasta que el humano apruebe el plan.
3. El plan debe ser un grafo de oleadas, no una lista vaga. Cada paso: agente, paths, comando de verify, criterio de done.
4. Tras aprobar: implementa **solo F0** en el primer ciclo. No F1–F6 todavía.
5. Subagentes:
   - Máximo 8 en paralelo. Depth = 1 (un subagente NO spawnea otros).
   - `explore` + `capability_mode=read-only` para investigar.
   - `plan` para diseñar.
   - `general-purpose` + `isolation=worktree` para código.
   - NO uses Arena mode. Esto es divide-and-conquer, no competencia.
6. Un subagente solo toca los paths de su ownership. Si necesita un archivo ajeno: reporta bloqueo, no lo edites.
7. Después de cada oleada: merge worktrees, `npm run build` o `npx tsc --noEmit`, commit atómico `feat(F0): ...`.
8. Si algo es ambiguo: Q&A mode con opciones concretas. No asumas stack distinto al lock.
9. No instales paquetes fuera del lock. No inicies backend. No pidas API keys.

## 1. Misión

Construir un visualizador web 3D educativo del cuerpo humano:

- Navegación órbita / zoom / pan / touch
- 14 meridianos OMS: LU LI ST SP HT SI BL KI PC TE GB LR GV CV
- F2: 20 puntos estrella clickables con ficha
- F4 (después, otro ciclo): 361 clásicos + 48 extra. Nunca en el primer ciclo
- Click/tap → drawer con código WHO, pinyin, hanzi, nombre ES/EN, localización, funciones, indicaciones educativas, precauciones, fuentes
- Flujo de Qi visible por el canal (tubo + partículas), play/pause/velocidad, color Wu Xing, boost circadiano
- UI en español primero
- Deploy estático Vercel

Disclaimer permanente en UI:
«Herramienta educativa. No es un dispositivo médico y no sustituye a un profesional de Medicina Tradicional China.»

## 2. No-goals (fuera de alcance hasta que el humano lo pida)

- Backend, auth, base de datos, CMS, usuarios
- AR / VR / Unity / Babylon / Next.js
- Diagnóstico, receta, «tu Qi está débil», claims de eficacia clínica
- Copiar texto de *A Manual of Acupuncture* (Deadman) u otros manuales comerciales
- Dump de 361 coordenadas inventadas en un solo JSON
- 361 labels HTML simultáneos
- Modelo anatómico con licencia restrictiva o peso > 8 MB sin Draco
- Dos sexos / morphs / BMI en F0–F3

## 3. Stack lock

```
Vite + React 19 + TypeScript strict + Tailwind v4
@react-three/fiber + @react-three/drei + three
Zustand
vitest (mínimo, smoke)
Deploy: Vite static → Vercel
Gestor: npm
```

Coordenadas: Y-up, metros, origen pelvis/sacro, mesh en A-pose o T-pose fijo.
Datos: JSON versionado en `/data`. Cero puntos hardcodeados en JSX.

## 4. Árbol objetivo (ownership)

```
package.json                 A0
vite.config.ts               A0
tsconfig*.json               A0
index.html                   A0
vercel.json                  A7
src/main.tsx                 A0
src/app/**                   A0
src/types/**                 A1
src/data/**                  A1
src/state/**                 A6
src/i18n/**                  A6
src/lib/**                   A0 (shared: colors, curve helpers)
src/scene/CanvasRoot.tsx     A2
src/scene/body/**            A2
src/scene/meridians/**       A4
src/scene/points/**          A3
src/scene/qi/**              A4
src/scene/picking.ts         A3
src/ui/**                    A5
src/ui/Disclaimer.tsx        A7
data/schema/**               A1
data/meridians.json          A1
data/acupoints.seed.json     A1+A6
data/unmapped.json           A1
public/models/**             A2
```

## 5. Contratos TypeScript (no cambiar nombres)

```ts
export type Laterality = "L" | "R" | "C";
export type Confidence = "low" | "medium" | "high";
export type Polaridad = "yin" | "yang";
export type Elemento = "wood" | "fire" | "earth" | "metal" | "water";
export type QualityTier = "high" | "medium" | "low";
export type Locale = "es" | "en" | "zh";

export interface Names {
  zh: string; pinyin: string; es: string; en: string;
}

export interface Acupoint {
  id: string;              // "LI4"
  code: string;            // "LI4"
  meridianId: string;      // "LI"
  index: number;
  names: Names;
  location: { anatomicEs: string; cunNote?: string };
  functions: string[];
  indications: string[];   // educativas, no claims
  precautions: string[];
  combinations?: string[];
  element?: Elemento;
  polaridad?: Polaridad;
  laterality: Laterality;
  region: string;
  position?: { x: number; y: number; z: number };
  sources: string[];
  confidence: Confidence;
}

export interface Meridian {
  id: string;
  code: string;
  names: Names;
  element?: Elemento;
  polaridad?: Polaridad;
  clockHour?: number;      // 0–23 inicio del bloque de 2h
  pointCount: number;      // OMS: ver tabla
  pointCodes: string[];
  pathAnchors: { x: number; y: number; z: number }[];
  flow: "chest-to-hand" | "hand-to-head" | "head-to-foot" | "foot-to-chest" | "ascending-front" | "ascending-back";
  laterality: "bilateral" | "midline";
  color: string;
}

export interface ViewerState {
  selectedPointId: string | null;
  hoveredPointId: string | null;
  activeMeridianId: string | null;
  visibleLayers: { body: boolean; meridians: boolean; points: boolean; qi: boolean; labels: boolean };
  qiPlaying: boolean;
  qiSpeed: number;         // 0.25–4
  clockHour: number;       // 0–23
  locale: Locale;
  qualityTier: QualityTier;
  searchQuery: string;
  filters: { element?: Elemento; region?: string; starOnly: boolean };
}
```

## 6. Tabla maestra de 14 meridianos (OMS)

| id | pts | elemento | polaridad | clock | flow | laterality | color |
|---|---:|---|---|---:|---|---|---|
| LU | 11 | metal | yin | 03 | chest-to-hand | bilateral | #C0C8D0 |
| LI | 20 | metal | yang | 05 | hand-to-head | bilateral | #C0C8D0 |
| ST | 45 | earth | yang | 07 | head-to-foot | bilateral | #C4A35A |
| SP | 21 | earth | yin | 09 | foot-to-chest | bilateral | #C4A35A |
| HT | 9 | fire | yin | 11 | chest-to-hand | bilateral | #E23B3B |
| SI | 19 | fire | yang | 13 | hand-to-head | bilateral | #E23B3B |
| BL | 67 | water | yang | 15 | head-to-foot | bilateral | #2B6CB0 |
| KI | 27 | water | yin | 17 | foot-to-chest | bilateral | #2B6CB0 |
| PC | 9 | fire | yin | 19 | chest-to-hand | bilateral | #E23B3B |
| TE | 23 | fire | yang | 21 | hand-to-head | bilateral | #C45C26 |
| GB | 44 | wood | yang | 23 | head-to-foot | bilateral | #3D8B40 |
| LR | 14 | wood | yin | 01 | foot-to-chest | bilateral | #3D8B40 |
| GV | 28 | — | yang | — | ascending-back | midline | #8B5CF6 |
| CV | 24 | — | yin | — | ascending-front | midline | #F59E0B |

Total clásicos = 361. Extras OMS de entrenamiento básico = 48 (F4+). No implementes extras en F0–F3 salvo EX-HN3 y EX-B1 del seed.

## 7. Seed F2 — 20 puntos estrella (textos originales cortos)

Implementar ficha real para estos. Coordenada 3D sólo si puedes anclarla al mesh actual con confidence≤medium. Si no, entra en `data/unmapped.json` y la ficha sigue existiendo (se abre desde el rail).

| code | pinyin | hanzi | es | región | lat | precaución tradicional |
|---|---|---|---|---|---|---|
| LI4 | Hegu | 合谷 | Valle de la unión | mano | L/R | Evitar en embarazo (tradición clásica) |
| LU7 | Lieque | 列缺 | Secuencia quebrada | muñeca | L/R | — |
| ST36 | Zusanli | 足三里 | Tres li del pie | pierna | L/R | — |
| SP6 | Sanyinjiao | 三阴交 | Cruce de los tres yin | pierna | L/R | Evitar en embarazo (tradición clásica) |
| HT7 | Shenmen | 神门 | Puerta del shen | muñeca | L/R | — |
| PC6 | Neiguan | 内关 | Barrera interna | antebrazo | L/R | — |
| LR3 | Taichong | 太冲 | Gran asalto | pie | L/R | — |
| GB34 | Yanglingquan | 阳陵泉 | Fuente de la colina yang | pierna | L/R | — |
| GB20 | Fengchi | 风池 | Estanque del viento | nuca | L/R | Profundidad/dirección: zona delicada |
| BL23 | Shenshu | 肾俞 | Shu de riñón | lumbar | L/R | — |
| BL40 | Weizhong | 委中 | Centro del pliegue | hueco poplíteo | L/R | — |
| KI3 | Taixi | 太溪 | Gran arroyo | tobillo | L/R | — |
| CV12 | Zhongwan | 中腓 | Cavidad media | abdomen | C | — |
| CV17 | Danzhong | 膻中 | Centro del pecho | tórax | C | — |
| GV20 | Baihui | 百会 | Cien reuniones | vértice | C | — |
| GV14 | Dazhui | 大椎 | Gran vértebra | C7 | C | — |
| TE5 | Waiguan | 外关 | Barrera externa | antebrazo | L/R | — |
| SI3 | Houxi | 后溪 | Arroyo posterior | mano | L/R | — |
| EX-HN3 | Yintang | 印堂 | Sello del aula | entrecejo | C | — |
| EX-B1 | Dingchuan | 定喘 | Calmar el asma | paravertebral C7 | L/R | — |

Fuentes permitidas para localización: WHO Standard Acupuncture Nomenclature; WHO Standard Acupuncture Point Locations in the Western Pacific Region (2008); GB/T 12346. Parafrasea. No copies párrafos de manuales comerciales.

## 8. Matriz de agentes (capacidad máxima)

Cada spawn: prompt corto + este contrato. `isolation=worktree` si escribe.

### A0 ARCHITECT — general-purpose / worktree
- Owns: package.json, vite, tsconfig, index.html, src/main.tsx, src/app, src/lib
- Hace: `npm create vite` React-TS, Tailwind, R3F, drei, zustand, alias `@/`
- DoD: `npm install && npm run dev` abre app; `npx tsc --noEmit` limpio

### A1 DATA — general-purpose / worktree
- Owns: data/**, src/types/**, src/data/**
- Hace: schema JSON, meridians.json completo (14 filas), acupoints.seed.json (20), loader tipado, unmapped.json=[]
- DoD: importar meridians.length===14 y seed.length===20 sin any

### A2 BODY — general-purpose / worktree
- Owns: src/scene/CanvasRoot.tsx, src/scene/body/**, public/models/**
- Hace: Canvas, luces, Environment suave, OrbitControls damping, grid/axes en F0, maniquí: GLB CC-licenciado O fallback procedural (cápsulas/lathes) si no hay GLB libre ≤8MB Draco
- Material body: opacity 0.45–0.7, no occlude points
- DoD: órbita + zoom; body o placeholder visible; no SSR issues

### A3 POINTS — general-purpose / worktree
- Owns: src/scene/points/**, src/scene/picking.ts
- Hace: InstancedMesh de esferas; hover halo; click → store.selectedPointId + camera fit; no labels masivos
- Raycast sólo contra instances/tubes, no contra 50k tris del body
- DoD: click ST36 (si mapped) o click rail ST36 abre el mismo store

### A4 QI + MERIDIANS — general-purpose / worktree
- Owns: src/scene/meridians/**, src/scene/qi/**
- Hace:
  - pathAnchors provisionales F1 (esqueleto regional, confidence=low) sólo para dibujar 14 curvas
  - CatmullRomCurve3(points, false, 'centripetal')
  - TubeGeometry radio 0.004–0.008, color de tabla
  - Partículas instanced o Points + shader: `t = fract(uTime * speed + i/N)`
  - Dirección = campo `flow`
  - Quality: high partículas+bloom suave; medium tubos con dash/flow; low líneas
- DoD F1: 14 tubos toggleables. DoD F3: al menos ST muestra partículas recorriendo el tubo con play/pause

### A5 UI — general-purpose / worktree
- Owns: src/ui/** excepto Disclaimer.tsx
- Layout:
  - Canvas full-bleed
  - Topbar: search, toggles de capas, locale ES|EN, quality
  - Left rail: 14 meridianos accordion + star filter
  - Right drawer desktop / bottom sheet móvil: ficha
  - Bottom clock TCM 12 bloques de 2h + play Qi
- Teclado: `/` search, Esc cierra, ← → recorre puntos del meridiano activo
- Touch: pinch zoom, 2-finger pan, tap selecciona
- DoD: drawer renderiza todos los campos del contrato; vacíos se ocultan, no muestran "lorem"

### A6 STATE + I18N + CONTENT — general-purpose / worktree
- Owns: src/state/**, src/i18n/**, textos de seed
- Hace: store Zustand del contrato ViewerState; diccionario ES mínimo; textos originales del seed
- DoD: cambiar locale no rompe ficha; ninguna string clínica inventada grave

### A7 QA + DEPLOY + DISCLAIMER — general-purpose / worktree
- Owns: vercel.json, README scripts, src/ui/Disclaimer.tsx, tests smoke
- Hace: SPA fallback, headers cache para GLB, disclaimer visible siempre, `npm run build` green
- DoD F6: carpeta dist/ lista para Vercel

### AX EXPLORE (read-only, se lanza primero)
- Tipo `explore`, capability_mode=read-only, isolation=none
- Investiga si existe GLB libre usable, versiones de R3F compatibles, y si el working tree ya tiene scaffold
- Output: memo de 20 líneas. Cero edits

## 9. Oleadas (ejecutar en este orden)

**Wave 0 — sólo plan (ahora)**
- 1 subagente `plan` + 1 `explore`
- Entregable: plan.md con árbol de archivos F0, comandos, riesgos de licencia GLB
- STOP hasta aprobación humana

**Wave 1 — F0 (tras aprobar)**
- Paralelo worktrees: A0 + A1
- Merge. Verify: `npm run dev` muestra canvas negro + grid + ejes + disclaimer. `tsc --noEmit` ok
- Commit `feat(F0): scaffold vite r3f y schema de datos`

**Wave 2 — F1**
- Paralelo: A2 + A5 shell (layout vacío) + A6 store
- Luego A4 sólo tubos (sin partículas)
- Verify: 14 tubos, toggle rail, órbita
- Commit `feat(F1): cuerpo y 14 meridianos`

**Wave 3 — F2**
- Paralelo: A3 + A6 textos seed + A5 drawer
- Verify: click/rail ST36 abre ficha 足三里 / Zusanli. LI4 muestra precaución embarazo
- Commit `feat(F2): puntos estrella e interacción`

**Wave 4 — F3**
- A4 partículas + clock + quality tier
- Verify: play Qi en ST; pausa; cambio de velocidad
- Commit `feat(F3): flujo de Qi`

**Wave 5 — F5 parcial + F6**
- A5 search/filtros/mobile + A7 vercel.json + build
- Commit `feat(F5): search y mobile` / `chore(F6): vercel static`

**F4 (361 puntos) = OTRO CICLO, otra aprobación.**
Prohibido arrancar F4 sin decirlo explícito el humano.
Cuando F4 exista: un subagente por familia (brazo, pierna, torso, cabeza, midline) y `unmapped[]` obligatorio. confidence=high sólo si un humano revisor lo marca.

## 10. UX detalle (A5 no improvisa esto)

Ficha orden:
1. code + hanzi + pinyin + nombre ES
2. meridiano, elemento, polaridad, laterality
3. localización + cunNote
4. funciones
5. indicaciones (badge «uso tradicional educativo»)
6. precauciones (si vacío, no render)
7. combinaciones
8. sources + confidence
9. botón «Seguir el Qi de este meridiano» → activeMeridianId + qiPlaying=true + camera fit al tubo

Estados punto: idle / hover / selected / dimmed.
Nunca 361 tooltips. Sólo hover actual + selected.

## 11. Qi detalle (A4 no improvisa esto)

```
curve = CatmullRomCurve3(anchors, false, 'centripetal')
for i in 0..N-1:
  t = fract(uTime * qiSpeed * 0.05 + i / N)
  pos = curve.getPoint(t)
```

Dirección ya viene en `flow`. No invertirla «porque se ve mejor».
Boost: si clockHour cae en el bloque del meridiano, particle size * 1.4 y emissive * 1.3.
No simular estancamiento, vacío, plenitud ni patología.

## 12. Reglas anti-alucinación

- Prohibido generar 361 `{x,y,z}` de memoria.
- Prohibido marcar confidence=`high` sin revisor humano.
- Prohibido afirmar «según estudios cura X».
- Prohibido copiar localizaciones largas verbatim de sitios con copyright.
- Si no hay ancla: punto vive en seed (ficha ok) y en `unmapped.json`.
- PathAnchors F1 pueden ser placeholder low-confidence para dibujar el canal. Documenta `confidence: low` en un comentario de data/README.
- Cualquier GLB debe tener licencia anotada en `public/models/ATTRIBUTION.md`.

## 13. Acceptance tests por fase

F0
- [ ] `npm run dev` canvas + grid + ejes + disclaimer
- [ ] `npx tsc --noEmit` exit 0
- [ ] meridians.json tiene 14 ids exactos de la tabla

F1
- [ ] 14 tubos visibles
- [ ] toggle por meridiano en el rail
- [ ] body o placeholder no tapa por completo los tubos

F2
- [ ] 20 fichas accesibles por rail
- [ ] ST36 muestra 足三里
- [ ] LI4 y SP6 muestran precaución de embarazo
- [ ] hover + click cambian store

F3
- [ ] play/pause Qi
- [ ] al menos 1 meridiano con partículas sobre su curva
- [ ] qualityTier low no usa bloom

F5
- [ ] search por código y pinyin
- [ ] drawer es bottom sheet bajo 768px

F6
- [ ] `npm run build` produce dist/
- [ ] vercel.json SPA fallback

## 14. Git

- conventional commits: `feat(F0|F1|F2|F3|F5|F6):` / `fix:` / `docs:` / `chore:`
- No commits con dist/ ni node_modules
- No force-push a main si hay remoto
- Un commit por oleada mergeada, no 80 microcommits ruidosos ni un monocommit de todo el repo

## 15. Primera salida tuya, ahora

Estás en Plan mode.
Devuelve:
1. Árbol de archivos F0 exacto
2. Lista de paquetes npm (versiones mayores)
3. Oleada Wave 1: qué subagentes, qué paths, qué verify
4. Decisión GLB vs maniquí procedural (elige procedural en F0 si no hay GLB libre obvio)
5. Riesgos
6. Pregunta única si algo bloquea; si no, espera «aprueba F0»

No escribas código hasta esa aprobación.

=== FIN ===
