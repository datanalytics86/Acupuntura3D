# MEGAPROMPT ENCARTA TIER1 — Grok 4.7 multiagente

Copia desde `=== PEGAR DESDE AQUÍ ===` hasta `=== FIN ===`.
Pégalo en Grok 4.7 Terminal / Grok Build **en la raíz** de `datanalytics86/Acupuntura3D`.
Este bloque **es la aprobación**. Implementa sin parar. No pidas confirmación.

Los ciclos 2D_ATLAS / 2D_MAX / ENCARTA / ENCARTA_FIGURA YA CORRIERON.
HEAD esperado: `feat/atlas-2d` @ `959679a` o posterior.
La figura ya es un adulto leíble (placas Goran tek-en). El fallo ahora es **premium**:
sigue siendo wiki 3d-shaded sobre un chrome de pills `rounded-2xl`.

Este ciclo NO busca otro blob. NO vuelve a Three. NO reescribe seed de 361.
Eleva la lámina + el chrome hasta que un screenshot de 3s sobreviva Signature Test.

=== PEGAR DESDE AQUÍ ===

# Acupuntura3D — ENCARTA TIER1 (Grok 4.7 · máxima capacidad · no parar)

Eres el ORQUESTADOR de un sistema multiagente de élite en `datanalytics86/Acupuntura3D`.
Modelo: Grok 4.7. Usa **toda** la capacidad: 5 roles, worktrees, verify loop, critique rounds.
Rama: **feat/atlas-2d**. Si estás en `main`: `git checkout feat/atlas-2d` ahora.

## 0. Feedback del dueño (literal)

> «ha mejorado bastante, pero falta»
> «quiero que sea muy premium»
> «no se detenga hasta que esté todo tier 1»
> Norte histórico: 2D Encarta, no 3D. Cuerpo de enciclopedia, no demo.

Traducción operativa: el cuerpo ya no es cápsula. Todavía no genera deseo.
«Todo Tier1» = lámina + figura + chrome visible del atlas 2D.
NO = reescribir backend de datos, no 361 puntos, no merge a main, no prod.

## 1. MODO

1. NO esperes «aprueba». Plan interno 60s y ejecuta.
2. NO preguntes 2D vs 3D. Es 2D Encarta paper-plate.
3. NO toques `src/scene/**`, `src/_legacy/**`. NO instales three / R3F.
4. Conserva loaders, seed textos, Zustand, Vercel, click ST36 → 足三里, LI4/SP6 precaución.
5. 3 CICLOS EN SERIE. Entre ciclos: critique gate (§8). Si un ciclo FAIL, reescribe ESE ciclo. No saltes.
6. Máximo 2 critique rounds por ciclo. Después del 2º, aplica el veto y sigue. No loop infinito.
7. Para sólo si typecheck+build fallan 2 veces seguidas, o si agotaste 2 critiques del ciclo 3 y el DoD visual §9 sigue en FAIL duro (entonces resume qué falta; no declares Tier1).
8. Commit por oleada. No force-push. No merge `main`. Push `feat/atlas-2d`.
9. Build verde + Goran tal cual = NO DONE.

## 2. Roles (máxima capacidad — no colapses en un solo agente)

Spawn estos 5. Si el runtime limita agentes, serializa el rol, no lo borres.

1. **Aesthetic Director** — emoción, veto, 3s test. Dueño de la dirección elegida.
2. **Design Systems & Tokens Architect** — tokens OKLCH, type, space, radius, elevation.
3. **Interaction & Motion Designer** — motion language, reduced-motion, view change.
4. **Frontend Aesthetic Engineer** — código. CSS 2026 + Tailwind hybrid. Naming semántico.
5. **Critique & Differentiation Agent** — mínimo 2 rounds por ciclo. Preguntas obligatorias:
   - ¿Sin logo, se confunde con Linear / Vercel / Stripe / un atlas SaaS?
   - ¿Sobrevive screenshot en el papel crema?
   - ¿Es memorable en 3 segundos?
   - ¿El PNG Goran se ve «pegado» o vive en el papel?
   - ¿El chrome parece pills de dashboard?

Director tiene veto. Critique no escribe features nuevas: solo mata lo genérico.

## 3. Estado real — lee YA (no inventes el árbol)

```
src/atlas/figure/Figure.tsx          ← <image> /atlas/body-anterior.png + posterior
src/atlas/figure/PlateTitle.tsx      ← título serif + tabs Cuerpo/Rostro/Mano/Pie = ZOOM
src/atlas/figure/parts/anterior.ts   ← arrays vacíos (Track A cumplido)
src/atlas/figure/parts/palette.ts
src/atlas/AtlasRoot.tsx              ← plate #F3EBD8, radio 2/14/2/14
src/atlas/Viewport.tsx               ← grain feTurbulence 0.055
src/atlas/Points2D.tsx               ← tooltip Outfit + rect rx=10 + stroke navy
src/atlas/MeridianPaths.tsx
src/atlas/QiFlow.tsx
src/app/App.tsx
src/app/index.css                    ← Outfit + Cormorant, .panel rounded via class
src/ui/Topbar.tsx                    ← panel rounded-2xl + pills rounded-full + quality 3D
src/ui/MeridianRail.tsx              ← rounded-2xl / rounded-xl / rounded-full
src/ui/PointDrawer.tsx               ← rounded-2xl + rose-50
src/ui/QiClock.tsx                   ← barra rounded-2xl + chips rounded-full
src/ui/SearchBox.tsx                 ← input rounded-full
public/atlas/body-anterior.png       ← Goran tek-en, ~1.6MB, fondo negro o alpha-on-black
public/atlas/body-posterior.png
public/atlas/ATTRIBUTION.md
public/atlas/preview-anterior.svg    ← stub que solo referencia el PNG
```

Diagnóstico (corrígelo, no lo discutas):

FIGURA
- Placa wiki 3d-shaded, piel casi plana, calvo, genitales explícitos.
- No hay oclusión local Encarta (axila, subpectoral, ingle, cubital, poplíteo).
- PNG puede manchar el papel con losa negra.
- Zoom 4.4–6× a cara/mano/pie revela píxeles, no una lámina.

CHROME
- Radio uniforme de producto SaaS: `rounded-2xl` + `rounded-full` en Topbar, Rail, Drawer, Clock, Search.
- Leftover 3D: botones quality high/medium/low.
- Tooltip de punto: Outfit + pill + `#1E3A5F` (fuera de paleta papel).
- Precaución: `rose-50` genérico.
- Pills de capa / idioma / elemento = dashboard, no enciclopedia.

## 4. Dirección estética — NO elijas otra

Las 3 se evaluaron. Queda UNA. No gastes oleada en moodboards.

**Dirección A — PAPER CABINET / lámina Encarta (MANDATORIA)**

Emoción primaria: asombro controlado. Quiet luxury de papel impreso.
Referencia de NIVEL (no de copia): Encarta 98–2005 *El cuerpo humano*, DK Visual Encyclopedia, plancha de atlas académico, Aesop packaging (material, no logo).
Anti-referencia: Linear, Vercel dashboard, Kenhub UI, Complete Anatomy, glassmorphism, dark SaaS.

Signature:
- La página es el producto. El chrome es instrumento de archivo, no card flotante.
- Figura adulta de superficie, académica, memorable como plancha impresa.
- Meridianos = tinta de atlas, no neon tubes.
- Puntos = sellos de lámina, no chips Material.

Rechazada B (Celestial Laboratory / OKLCH dark): es otro producto (AstroEngine).
Rechazada C (SaaS jade + gold pills): es el estado actual.

## 5. Tokens (Architect los escribe en CSS, Engineer los usa)

OKLCH. No hex sueltos nuevos fuera de estos nombres.
Si un hex histórico debe quedarse por seed/meridian color, no lo retocas.

```css
--paper-0: oklch(0.93 0.025 85);   /* #F7F0E0 page highlight */
--paper-1: oklch(0.91 0.032 82);   /* #F3EBD8 plate */
--paper-2: oklch(0.88 0.038 80);   /* #E7DCC4 desk */
--ink-0:   oklch(0.28 0.028 55);   /* #2A2118 */
--ink-1:   oklch(0.36 0.04 50);    /* #3a2a1c title */
--rule:    oklch(0.78 0.045 80);   /* #c4b089 */
--gold:    oklch(0.55 0.06 75);    /* #8A6A3B */
--jade:    oklch(0.66 0.05 145);   /* #7d9b78 point core */
--skin-hi: oklch(0.90 0.04 55);
--skin-mid:oklch(0.78 0.06 50);
--skin-lo: oklch(0.62 0.07 45);
--radius-plate: 2px 14px 2px 14px;
--radius-panel: 2px 10px 2px 10px;
--radius-chip:  2px;               /* NUNCA 999px en chrome de lámina */
```

Type:
- Display / título de lámina / hanzi de punto: Cormorant Garamond + Noto Serif SC.
- UI compacta (rail codes, search): Outfit 11–13px. Nunca Outfit en el título de la plancha.
- Tracking de labels de archivo: 0.16–0.22em.

Space: ritmo 4/8/12/20/32. Plate inset 9–10px. Desk margin 20px.

Motion language:
- Anterior ↔ posterior: crossfade 240–320ms `ease` o View Transition. NUNCA flip 3D.
- Drawer open: spring ~0.9 / 0.22, 18–24px desde el eje del panel.
- Point select: anillo 0→1 opacity 160ms. No bounce.
- Qi: pulso orgánico 2.2–2.8s (dash-offset suave). No bounce. Conservar `.qi-dash` si lo retocas.
- `@media (prefers-reduced-motion: reduce)` corta TODO.

## 6. Tres ciclos (en serie, no en paralelo)

### CICLO 1 — LÁMINA (figura + papel + material)  ← el dueño mira esto primero

Objetivo: Goran deja de verse «PNG wiki pegado». La plancha se siente impresa.

W1.1 Knockout
- Confirma alpha del PNG. Si el fondo es negro opaco: remueve fondo, guarda PNG con transparencia real.
- Composite: `mix-blend-mode: multiply` suave sobre `--paper-1` O mask de silueta + paper showing through.
- FAIL si queda losa negra alrededor de hombros / entre piernas / halo pixel.

W1.2 Volumen Encarta (Track C de verdad)
- SVG overlays locales encima del raster, clippeados a la silueta:
  axila L/R, fosa subpectoral, surco abdominal, ingle, cubital, hueco del codo,
  poplíteo, gemelo medial, pliegue glúteo, occipital.
- Cada overlay = radialGradient opacity 0.12–0.28, color `--skin-lo`.
- Highlight 11h muy suave en frente, pectoral, dorso de antebrazo, muslo anterior.
- Contorno nítido 1.1–1.4px `--ink-1` si el PNG no trae borde de plancha.

W1.3 Convención académica del pubis
- No pornográfico. No infantil. Adulto anatómico de enciclopedia.
- Overlay discreto (sombra + simplificación) que lea «plancha educativa», no desnudo de stock.
- Conserva que es figura adulta. No inventes ropa contemporánea.

W1.4 Cabeza
- Si el calvo wiki rompe Encarta: overlay de pelo corto académico (SVG), helix de oreja, plano nasal.
- Cara leíble a 200px y a zoom 4×.

W1.5 Plate material
- Grain solo en papel, no en piel.
- Título serif ya existe: afínalo (tamaño, tracking, filete de archivo bajo el título).
- Crédito Goran visible, tipografía de pie de plancha, no badge SaaS.
- Regenera `public/atlas/preview-anterior.svg` y `preview-posterior.svg` con figura+papel+título, SIN chrome UI.

DoD ciclo 1 (§9 A). Si FAIL → critique + reescribe W1. No abras ciclo 2.

### CICLO 2 — CHROME DE ARCHIVO

Objetivo: la UI parece instrumento de lámina, no dashboard 2023.

W2.1 Matar pills
- Elimina `rounded-2xl` / `rounded-full` / `rounded-xl` del chrome visible (Topbar, Rail, Drawer, Clock, Search, tooltip).
- Usa `--radius-panel` y `--radius-chip`. Filetes `--rule`, no sombras suaves genéricas.
- Search: campo de archivo, no pill.
- Quality high/medium/low: OCULTA o elimina. Es leftover 3D. No tiene sentido en atlas 2D.

W2.2 Topbar
- Una sola barra de archivo sobre el desk, no dos cards flotantes `rounded-2xl`.
- Toggle Anterior/Posterior = filete de plancha, no pill gold.
- Capas Cuerpo/Meridianos/Puntos/Qi = text buttons con filete inferior activo.

W2.3 Rail + Drawer
- Rail: lista tipográfica de meridians, acento = hilo de color 2px a la izquierda, no dot circular + card.
- Drawer: papel sobre papel. Hanzi display enorme. Precaución en tinta `--gold` oscura + filete, NUNCA `rose-50`.
- Empty state del drawer (nada seleccionado): una línea de archivo, no hueco muerto. Opcional leyenda «Selecciona un punto en la lámina».

W2.4 Puntos y meridianos
- Punto idle: núcleo jade 3.6–4.2 + anillo papel. Hover: anillo tinta. Selected: anillo gold + label serif.
- Label de punto: Cormorant/hanzi, rect radio 2px, stroke `--rule`. Fuera Outfit + navy.
- Meridianos: stroke 1.6–2.2, opacity 0.7 idle, 0.95 activos. No tubes 3D.

W2.5 Motion
- Implementa el language del §5.
- Focus-visible ring 2px `--gold` en controles. Hit area ≥ 44px en mobile.

DoD ciclo 2 (§9 B). Si FAIL → critique + reescribe W2.

### CICLO 3 — REGIONES COMO LÁMINAS (no zoom)

Objetivo: Rostro / Mano / Pie son planchas, no una lupa sobre un PNG de 1.5MB.

W3.1 Si el zoom 4–6× del PNG se ve pixelado o plano (va a verse): reemplaza tabs de PlateTitle.
- `FacePlate` / `HandPlate` / `FootPlate` en SVG de alta densidad, mismo lenguaje de piel que ciclo 1.
- Rostro: frente, órbita, párpado, plano nasal, labio, helix, mentón. Puntos faciales anclados.
- Mano: palma, pulgar en oposición, 4 dedos con nudillo, primer espacio interóseo (LI4).
- Pie: empeine, maléolos, talón, arco, 5 dedos (SP6 / LR3 visibles).
- PROHIBIDO `fingerD` / `capsuleD` / `ellipseD` como carne.

W3.2 Transición Cuerpo → región: View Transition o fade 200ms + recuadro de archivo.
W3.3 Previews: `public/atlas/preview-face.svg`, `preview-hand.svg`, `preview-foot.svg`.

DoD ciclo 3 (§9 C). Si FAIL de figura regional: itera W3, no toques ciclo 1 de nuevo salvo halo negro.

## 7. Bans mecánicos (grep ANTES de cada «done» de ciclo)

```
rg -n "fingerD\\(|capsuleD\\(|ellipseD\\(" src/atlas/figure
rg -n "rounded-2xl|rounded-full|rounded-xl" src/ui src/app src/atlas
rg -n "rose-50|rose-800|#1E3A5F" src
rg -n "<Canvas|@react-three|from [\"']three" src
```

FAIL si:
- fingerD/capsuleD/ellipseD generan carne
- chrome visible sigue lleno de `rounded-full` / `rounded-2xl` (ciclo 2+)
- quality high/medium/low visible en Topbar (ciclo 2+)
- `<Canvas` R3F
- foto Encarta / Netter / Kenhub / Deadman / Visible Body / Complete Anatomy
- foto fotoreal de persona (Häggström incluido)
- merge a main
- se reintroducen 361 puntos
- CV12 hanzi ≠ 中腔
- meridians con violeta Tailwind (`#8B5CF6` / `#8b5cf6`) visibles en la lámina — retintar a tinta de archivo

Excepción radio: un `rounded` de 2px o el radio asimétrico del plate no es FAIL.

## 8. Critique gate (obligatorio, 2 rounds por ciclo)

Round 1 — al terminar la oleada de implementación del ciclo.
Round 2 — después de aplicar el veto del round 1.

El Critique escribe 8–12 líneas en el commit message o en `docs/CRITIQUE_CICLO{n}.md`:
- qué sobrevivió Signature Test
- qué se veía genérico
- qué se cambió en el round 2

Si el Director veta «sigue siendo Goran wiki» en ciclo 1: no abras ciclo 2.

## 9. Definition of Done visual

### A. Ciclo 1 — lámina
PASS:
- [ ] extraño dice «enciclopedia» en <1.5s, no «PNG de Wikipedia»
- [ ] cero losa negra / halo sobre el papel
- [ ] volumen local visible (axila, poplíteo, subpectoral)
- [ ] anterior ≠ posterior
- [ ] pubis lee académico, no stock nude
- [ ] preview-anterior.svg y preview-posterior.svg existen y se ven como plancha
- [ ] ATTRIBUTION.md intacto (Goran tek-en · CC BY-SA 4.0 · URLs)
- [ ] ST36 clickeable → 足三里

FAIL:
- [ ] Goran crudo sin composite
- [ ] fondo negro
- [ ] build verde usado como prueba de belleza

### B. Ciclo 2 — chrome
PASS:
- [ ] screenshot del producto NO parece Linear/Vercel/Stripe
- [ ] cero pills `rounded-full` en Topbar/Rail/Drawer/Clock/Search
- [ ] quality 3D no visible
- [ ] drawer precaución sin rose-50
- [ ] label de punto en serif/hanzi sobre papel
- [ ] prefers-reduced-motion corta qi y springs
- [ ] focus-visible real

### C. Ciclo 3 — regiones
PASS:
- [ ] Rostro / Mano / Pie NO son el PNG al 500%
- [ ] LI4 visible en mano, SP6/LR3 en pie
- [ ] misma piel / misma tinta que el cuerpo
- [ ] grep fingerD limpio

### D. Global para declarar TIER1
- [ ] A+B+C PASS
- [ ] `npm run typecheck` y `npm run build` exit 0
- [ ] 2 critique rounds por ciclo escritos
- [ ] push a `feat/atlas-2d`
- [ ] NO merge main, NO redeploy prod

Si A+B PASS y C no llega a plancha ilustrada: NO declares Tier1. Resume «C pendiente». No bajes C a zoom.

## 10. Archivos

SÍ (ciclos 1–3):
```
src/atlas/figure/**
src/atlas/AtlasRoot.tsx
src/atlas/Viewport.tsx
src/atlas/Points2D.tsx
src/atlas/MeridianPaths.tsx
src/atlas/QiFlow.tsx
src/app/index.css
src/app/App.tsx
src/ui/Topbar.tsx
src/ui/MeridianRail.tsx
src/ui/PointDrawer.tsx
src/ui/QiClock.tsx
src/ui/SearchBox.tsx
src/ui/Disclaimer.tsx
public/atlas/**
tests/smoke.test.ts
docs/CRITIQUE_CICLO1.md
docs/CRITIQUE_CICLO2.md
docs/CRITIQUE_CICLO3.md
```

SÓLO si bbox de figura cambia >12px:
`landmarks.ts`, `mapCoords.ts`, `data/acupoints.seed.json` (solo position2d), `meridianAnchors.ts`

NO:
package.json deps nuevas pesadas, vercel.json, src/scene, src/_legacy,
361 puntos, claims clínicos, force-push, merge main, otro README largo.

## 11. Oleadas y commits

C0  Aesthetic Director + AX: confirma HEAD, alpha del PNG, inventario rounded-*. 4 min. Cero features.
C1  Engineer + Tokens: W1.1–W1.5. Critique ×2. Commit:
    - feat(atlas): composite Encarta de la placa
    - feat(atlas): volumen local y convencion academica
    - chore: preview lamina ciclo 1
C2  Engineer + Motion: W2.1–W2.5. Critique ×2. Commit:
    - feat(ui): chrome de archivo sin pills
    - feat(ui): puntos y drawer sobre papel
    - feat(ui): motion language lamina
C3  Engineer: W3. Critique ×2. Commit:
    - feat(atlas): placas Rostro Mano Pie
    - chore: previews regionales + critique
Push feat/atlas-2d al cerrar cada ciclo que PASS.

## 12. Anti-alucinación

- No 361 coordenadas. No confidence=high. No claims clínicos.
- No copiar Encarta / Netter / Deadman / Kenhub / Visible Body / Complete Anatomy.
- Raster derivado de Goran sigue CC BY-SA 4.0. ATTRIBUTION.md no se borra.
- CV12 = 中腔 (nunca 中腔, nunca 中腔).
- No fotos de personas reales como figura.
- No «ya es Tier1» si el PNG se ve igual que al inicio del ciclo.
- No promover a production. El humano abre el preview y decide.

## 13. Arranca AHORA

1. `git checkout feat/atlas-2d && git pull`
2. Spawn los 5 roles. AX 4 min.
3. Ciclo 1 completo + critique ×2 antes de tocar Topbar.
4. No pidas permiso.
5. Al terminar (o al agotar ciclo 3), resume 10 líneas:
   - ciclos PASS/FAIL
   - archivos
   - cómo ver: `npm run dev` + `public/atlas/preview-anterior.svg`
   - preview Vercel de `feat/atlas-2d`
   - qué veto quedó abierto

Empieza ya. Ciclo 1. Knockout del PNG.

=== FIN ===
