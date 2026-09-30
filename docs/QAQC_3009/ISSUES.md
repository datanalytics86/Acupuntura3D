# ISSUES — QAQC 30.09

Línea base medida contra `http://127.0.0.1:4173/` (build de producción `index-DycVfQG7.js`, `main` @ `7142b97`). Evidencia en `docs/QAQC_3009/baseline/`.

### Q01 · S1 · En móvil, tocar un punto abre otro
Dónde: hit de `Points2D` · Viewport: móvil · Contexto: home
Pasos: 1. Aceptar el aviso. 2. En 390×844, tocar el centro de cada `point-*`.
Esperado: la ficha de ese código.
Obtenido: `ST36→GB34`, `SP6→KI3`, `LR3→KI3`, `CV12→nada` (`tapPoints` 9).
Evidencia: `baseline/health.json` (`tapWrong`)
Dueño: FX-ATLAS · Test que lo prueba: `tests/coarseHit.test.ts` · `e2e/tap.spec.ts`
Estado: corregido (447c74b, 1cbd5b0)

### Q02 · S1 · El aviso legal no atrapa el foco
Dónde: `#legal-gate` · Viewport: desktop · Contexto: legal
Pasos: 1. Abrir la portada. 2. Pulsar Tab 25 veces.
Esperado: el foco permanece en el modal.
Obtenido: `focusLeakLegal = 25`.
Evidencia: `baseline/health.json`
Dueño: FX-APP · Test que lo prueba: `scripts/qa/health.mjs` (gate `focusLeakLegal`)
Estado: corregido (447c74b)

### Q03 · S2 · Sectores del reloj tapados
Dónde: dial de `QiClock` · Viewport: desktop y móvil
Pasos: censo de home, point y posterior.
Esperado: cada sector responde en su centro.
Obtenido: ningún sector en `dead` ni `covered`. Las capas decorativas ya tienen `pointer-events: none`.
Evidencia: `baseline/census.json`
Dueño: — · Test: censo
Estado: resuelto por el 30.09

### Q04 · S2 · Tirones al cambiar de región o al hacer zoom
Dónde: vuelo de cámara · Viewport: desktop
Esperado: `longestTaskMs ≤ 200`.
Obtenido: `longestTaskMs = 72`.
Evidencia: `baseline/health.json`
Dueño: — · Test: health
Estado: resuelto por el 30.09

### Q05 · S2 · Objetivos por debajo de 24 px (fino) o 44 px (grueso)
Dónde: velocidades del reloj, ⟲, minimapa, sellos, asa del peek · Viewport: ambos
Pasos: censo.
Esperado: 0 `smallTarget`.
Obtenido: 10. Velocidades ~14–16 px; ⟲ móvil 40×40; sellos de alto 32; minimapa; asa 390×22.
Evidencia: `baseline/census.json` (`summary.smallTarget`)
Dueño: FX-UI · Test: censo (`smallTarget`)
Estado: corregido (447c74b, 14c8a3d, 1cbd5b0)

### Q06 · S2 · Petición a fonts.googleapis.com
Esperado: `thirdPartyHosts` vacío.
Obtenido: `[]`.
Evidencia: `baseline/health.json`
Estado: resuelto por el 30.09

### Q07 · S2 · Falso positivo de `document.fonts.check`
Dónde: `e2e/atlas.spec.ts`
Obtenido: el e2e espera `document.fonts` con familia `Noto Serif SC` y `status === "loaded"`. No llama a `fonts.check`.
Evidencia: `e2e/atlas.spec.ts`
Estado: resuelto por el 30.09

### Q08 · S3 · El heap crece un 11 % en el ciclo de salud
Dónde: health, 25 ciclos · Umbral del gate: 20 %. Meta de estiramiento: 5 %.
Obtenido: `heapGrowth = 0.111`. El gate pasa. No aparece un listener, rAF o ResizeObserver sin limpieza en A1.
Evidencia: `baseline/health.json` · `A1.md`
Dueño: FX-PERF
Estado: documentado (por debajo del gate; no hay un retenido que cerrar sin reescribir el vuelo)

### Q09 · S3 · El scrim del índice se anuncia como botón
Dónde: `MeridianRail` scrim · Viewport: móvil
Esperado: `aria-hidden="true"` y `tabIndex={-1}`; el cierre es el botón visible y Esc.
Obtenido en la base: el scrim era un botón «Cerrar» de pantalla completa.
Evidencia: censo previo al 30.09; el patrón se aplica en este ciclo.
Dueño: FX-UI · Test: revisión de `MeridianRail.tsx`
Estado: corregido (447c74b)

### A1-01 · S1 · Escape cierra una capa que está debajo
Dónde: `App`, `MeridianRail`, `QiClock`, `PlateKey` · Viewport: estrecho
Esperado: paleta, luego ayuda, luego ficha, luego índice.
Obtenido: el índice o el reloj consumían Escape encima de la paleta o la ayuda.
Evidencia: `A1.md`
Dueño: FX-APP · Test: `e2e/tasks.spec.ts` (U9 y cierre por capas)
Estado: corregido (447c74b)

### A1-02 · S1 · La ficha estrecha pisa el vuelo de región y de reset
Dónde: `Sheet.tsx` `useLayoutEffect` · Viewport: estrecho
Esperado: si el ancla ya está encuadrada, no cancelar el `flyTo` de la región, la vista o `0`.
Evidencia: `A1.md`
Dueño: FX-UI · Test: el efecto sale antes de `flyTo` cuando `framed.current === anchorKey`
Estado: corregido (447c74b)

### A1-03 · S1 · `matchMedia` ausente tira el arranque
Dónde: `src/lib/quality.ts` · el store lo llama al crearse
Esperado: sin `matchMedia`, movimiento reducido es falso y la portada monta.
Evidencia: `A1.md`
Dueño: FX-APP · Test: `tests/paperTransition.test.ts`
Estado: corregido (447c74b)

### A1-04 · S1 · El error de render se lleva el aviso legal
Dónde: `ErrorBoundary` · Viewport: cualquiera
Esperado: el fallback incluye el aviso y un reintento, por `t()`.
Evidencia: `A1.md`
Dueño: FX-APP
Estado: corregido (447c74b)

### A1-05 · S2 · El zoom siguiente olvida el arrastre
Dónde: `viewerStore` `aim` · Viewport: cualquiera
Esperado: `stopFlight`, `setAtlasPan` y `setAtlasZoom` anulan `aim`. `flyTo` no lo anula a mitad de un zoom apilado.
Evidencia: `A1.md`
Dueño: FX-APP · Test: `tests/controls.test.ts` («drops the stacked zoom aim after a pan»)
Estado: corregido (447c74b, 1cbd5b0)

### A1-06 · S2 · El PNG de la lámina falla en silencio
Dónde: `Figure.tsx` · Viewport: cualquiera
Esperado: mensaje y botón de reintento, sin cambiar el `href`.
Evidencia: `A1.md`
Dueño: FX-ATLAS
Estado: corregido (447c74b)

### A1-07 · S2 · Los loaders no rechazan un JSON de forma inválida
Dónde: `loadAcupoints.ts`, `loadMeridians.ts`
Esperado: `Array.isArray` y campos que la ficha lee. El semillero actual pasa.
Evidencia: `A1.md`
Dueño: FX-APP · Test: `tests/schema.test.ts`
Estado: corregido (447c74b)

### A1-08 · S2 · Texto visible fuera de `t()`
Dónde: letras D/I, `Viewport` `aria-label`, título anterior
Esperado: R/L en inglés, `atlasLabel`, `plateAnterior` vía `t()`.
Evidencia: `A1.md`
Dueño: FX-ATLAS · Test: `tests/smoke.test.ts` (la frase vive en `messages.ts`)
Estado: corregido (447c74b)

### A1-09 · S2 · La clave estrecha no se cierra con Escape
Dónde: `PlateKey` · Viewport: &lt; 1100 px
Esperado: Escape cierra la clave si no hay una capa más alta.
Evidencia: `A1.md`
Dueño: FX-ATLAS
Estado: corregido (447c74b)

### A1-10 · S3 · Exports de knip y claves i18n sin uso
Dónde: 12 exports y 14 tipos; claves `search`, `stars`, `followQi`, `traditional`, `indications`, `mapped`, `omsPoints`, `choosePoint`, `plateFace`, `plateHand`, `plateFoot`, `plateSubtitle`
Esperado: no borrar tipos de dominio. `noMatches` vuelve a usarse en la paleta vacía.
Evidencia: `A1.md`
Dueño: FX-APP
Estado: documentado (los tipos son API de módulo; las claves sobrantes no las ve knip y borrarlas no cierra un gate)

### UX-01 · S2 · Doce tareas y heurísticas de §4
Dónde: paleta, ayuda, historial, pista, `aria-live`, glosario
Esperado: topes de U1–U12, Esc por capas, atrás en móvil, pista `acu3d.hint.v1`, sugerencias a distancia 3, glosario en la ayuda.
Evidencia: `A4` pendiente de la corrida posterior
Dueño: FX-APP · Test: `e2e/tasks.spec.ts` · `tests/search.test.ts`
Estado: corregido (447c74b, 1cbd5b0)
