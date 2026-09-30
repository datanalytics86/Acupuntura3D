# MegapromptQAQC30.09 — Análisis completo, debug, QA/QC, todos los botones y usabilidad (Grok 4.7 · multiagente · sin detenerse)

**Para:** Grok 4.7 en Grok Build / Grok Terminal (modo agente, con escritura, git y red para `npm`).
**Cuándo:** **después** de que termine el MegaPrompt 30.09 (existe `docs/T1_3009/SIGN_OFF.md` en `main` o en `feat/t1-3009`). Si lo lanzas antes, igual funciona: audita lo que haya en `main`.
**Repo:** `datanalytics86/Acupuntura3D`.
**Resultado:** rama `qa/qaqc-3009`, un PR con todas las correcciones probadas, un informe en `docs/QAQC_3009/REPORT.md` y, si todo pasa y `MERGE_A_MAIN = sí`, merge y verificación en producción.

## Qué hace

Este ciclo no rediseña. **Busca, prueba, corrige y demuestra.**

1. **Análisis completo:** código (tipos, código muerto, limpieza de efectos, listeners, dependencias), datos, rendimiento, memoria, red, accesibilidad y usabilidad.
2. **Todos los botones:** un censo automático encuentra **cada** control de la interfaz en 10+ contextos y 2 dispositivos. Le verifica nombre accesible, tamaño, que nada lo tape, que al pulsarlo pase algo observable y que no haya errores de consola.
3. **Debug:** cada defecto entra como ticket con severidad y pasos de reproducción, se escribe **primero** un test que falla, después el arreglo, y el test pasa.
4. **Amigable:** 12 tareas reales con tope de acciones, evaluación heurística (Nielsen + reglas del atlas), microcopy ES/EN, estados vacíos y de error, y ayuda inicial.
5. **QC final:** jueces independientes (UX y QA lead) y una lista de salida a producción.

## Cómo usarlo

1. Espera a que Grok cierre el 30.09 (o lánzalo igual; el prompt detecta la base).
2. Revisa `MERGE_A_MAIN` (primera línea del bloque; viene en `sí`: mergea solo si todo pasa y revierte solo si producción falla).
3. Pega en Grok 4.7 (opción recomendada, el bloque es largo):

   ```
   Ejecuta el MegapromptQAQC30.09 sin detenerte. Léelo completo con:
   git fetch origin && git show "origin/main:docs/MegapromptQAQC30.09.md"
   (si todavía no está en main, usa origin/claude/cool-allen-v4o0gq en lugar de origin/main).
   Sigue todo lo que va entre "=== PEGAR DESDE AQUÍ ===" y "=== FIN ===". MERGE_A_MAIN = sí.
   Ese bloque es tu aprobación: no preguntes y no entres en Plan mode.
   ```

   O copia todo lo que va entre `=== PEGAR DESDE AQUÍ ===` y `=== FIN ===`.
4. Si se corta: `Continúa el MegapromptQAQC30.09 desde la última firma en docs/QAQC_3009/SIGN_OFF.md. No repitas fases cerradas.`

## De dónde sale (evidencia)

Las tres herramientas de §8 se escribieron y se corrieron sobre `main` @ `3e29ca2` (antes del 30.09) en Chromium, a 1440×900 y 390×844:

| Herramienta | Resultado sobre `main` @ `3e29ca2` |
|---|---|
| **Censo de controles** (`census.mjs`) | 159 controles en 10 contextos × 2 dispositivos. 0 sin nombre, 0 errores de consola, 0 fallos de clic, 0 overflow. Fallan: **3 muertos** (sectores HT y GB del reloj en desktop, CV17 en móvil), **9 tapados** (2 sectores del reloj y 7 puntos o clusters en móvil cubiertos por el área de toque de un vecino) y **12 targets chicos** (rótulos de margen de 15 px de alto, badge de cluster de 7×14 px, sellos de dantian de 30 px en móvil). |
| **Salud** (`health.mjs`, 18 gates) | 14/18, igual en dos corridas seguidas. Fallan: pedido a `fonts.googleapis.com`, **tareas largas de 380–420 ms** al cambiar de región y hacer zoom, **el aviso legal deja escapar el foco** (25 de 25 Tabs) y **toque impreciso en móvil**. Pasan: 0 errores propios, CLS de carga 0.015, LCP ≈ 0.7–0.8 s, DOM estable, reflujo a 320 px, zoom al 200 %, inglés sin fugas y app funcional con `localStorage` bloqueado. |
| **Accesibilidad** (`axe-all.mjs`) | 0 violaciones WCAG 2.2 AA en 20 escaneos. Lo que falla está justo donde axe no mira: trampa de foco, precisión del toque y tamaño real del target. |

**Confirmado a mano en móvil:** tocar **ST36 abre la ficha de GB34**, tocar **GV20 abre EX-HN3** y tocar **CV17 no abre nada**. Las áreas de toque se pisan.

El 30.09 cambia la interfaz, así que estos hallazgos se **re-verifican** sobre la base nueva: los que sigan, se corrigen, y los nuevos se suman.

*Nota:* al preparar este QAQC se corrigió el MegaPrompt 30.09 (commit `7d3ef07`). El `<link>` de Google Fonts **sí** está en el build y en producción. La auditoría anterior no tenía acceso a Google Fonts. Auto-alojar la fuente sigue siendo el arreglo correcto.

---

=== PEGAR DESDE AQUÍ ===

MERGE_A_MAIN = sí

# MegapromptQAQC30.09 — Acupuntura3D · análisis, debug, QA/QC y usabilidad · enjambre Grok 4.7 · sin detenerse

## 0. Identidad, autoridad y modo

Eres **Grok 4.7** (Grok Build / Grok Terminal) y actúas como **QX, el orquestador de calidad** de un enjambre de 13 agentes hijos.

- **Este bloque ES la aprobación.** No entres en Plan mode, no pidas confirmación y no le preguntes nada al humano. Ante una ambigüedad aplica §0.4 y anótala en `docs/QAQC_3009/DECISIONES.md`.
- **No te detengas.** Encadena las fases F0 → F6 sin esperar respuesta. Después de cada fase escribe como máximo 5 líneas en `docs/QAQC_3009/LOG.md` y sigue. Terminas cuando se cumple §1 (terminado) o se agotan 3 bucles, y en ese caso entregas el estado honesto.
- **Este ciclo no rediseña.** No cambies la dirección de arte del 30.09. Todo cambio visible tiene que venir de un ticket de usabilidad, accesibilidad o bug, y los gates de `scripts/probe-plate.mjs` tienen que seguir en verde (si el archivo existe).
- **Código completo:** nada de `TODO`, `FIXME`, stubs, `any`, `as unknown as`, `@ts-ignore`, `@ts-expect-error` ni `eslint-disable`.
- **Test primero:** ningún arreglo se commitea sin un test (unit, e2e, censo o salud) que fallaba antes y pasa después.
- Docs en español; código en inglés.

### 0.1 Base (detección automática)

```bash
git fetch origin --prune
if git show origin/main:docs/T1_3009/SIGN_OFF.md >/dev/null 2>&1; then BASE=origin/main; TARGET=main
elif git rev-parse -q --verify origin/feat/t1-3009 >/dev/null; then BASE=origin/feat/t1-3009; TARGET=feat/t1-3009
else BASE=origin/main; TARGET=main; echo "30.09 no encontrado: se audita main tal cual" >> docs/QAQC_3009/DECISIONES.md
fi
git checkout -B qa/qaqc-3009 "$BASE"
mkdir -p docs/QAQC_3009/{baseline,after,shots}
```

La PR va de `qa/qaqc-3009` a `$TARGET`. Nada de force-push ni de reescribir ramas ajenas.

### 0.2 Invariantes (romper uno = FAIL)

1. **Atlas 2D en `<svg>`.** Sin `three`, `@react-three/*`, `<canvas>` WebGL ni Canvas para la lámina.
2. **Solo los 20 puntos del seed.** No se mueven ni se inventan puntos, coordenadas ni hanzi.
3. **Datos intocables:** 14 meridianos en orden OMS; **CV12 = 中脘**; ST36 = 足三里; LI4 y SP6 con precaución de embarazo; `unmapped.json = []`; landmarks 800×1600.
4. **Nada de claims clínicos.** El aviso legal queda visible siempre. Goran (CC BY-SA) y Noto (OFL) con atribución.
5. Sin backend, sin secretos, sin variables de entorno. Stack fijo: Vite 8 + React 19.2.x (pin) + TS strict + Tailwind 4 + Zustand 5. Las únicas dependencias nuevas permitidas son devDependencies de test, con versión exacta.
6. **No regresar nada:** siguen verdes todos los tests existentes, el e2e, el budget, `probe-plate` (18/18 si existe) y los `data-testid` y strings bloqueados por tests.

### 0.3 Severidad

| Sev | Definición | Regla |
|---|---|---|
| **S1** | Crash, dato erróneo, control que abre otra cosa (por ejemplo ST36 → GB34), tarea imposible, pérdida del aviso legal, falla WCAG A | Se corrige en este ciclo, sin excepción |
| **S2** | Tarea que cuesta más acciones de las que debe, control muerto o tapado, target chico, falla WCAG AA, tirón > 200 ms, fuga de memoria, texto sin traducir | Se corrige en este ciclo |
| **S3** | Pulido: microcopy, alineación, consistencia menor | Se corrige si el arreglo es local y seguro; si no, queda documentado con motivo |

### 0.4 Desempate

Lo que el usuario logra > lo que se ve. Lo medido > la opinión. El arreglo más pequeño que cierra el ticket > la refactorización. Nunca se relaja un umbral para pasar.

---

## 1. Definición de terminado (todos a la vez)

| # | Gate | Herramienta | Umbral |
|---|---|---|---|
| G1 | **Censo de controles** | `scripts/qa/census.mjs` (§8.1) | `dead = clickFailed = errors = unnamed = covered = smallTarget = overflowAfter = 0` en desktop y móvil |
| G2 | **Salud de ejecución** | `scripts/qa/health.mjs` (§8.2) | 18/18 gates |
| G3 | **Accesibilidad automática** | `scripts/qa/axe-all.mjs` (§8.3) | 0 violaciones serious/critical en 20 escaneos |
| G4 | **Accesibilidad manual** | A3 (§6) | 12 tareas solo con teclado; nombres, roles y estados correctos; `aria-live` útil; orden de encabezados; foco visible; zoom 400 % usable |
| G5 | **Usabilidad** | A4 y J1 (§4) | 12 tareas dentro del tope de acciones en desktop y móvil; heurísticas ≥ 4/5 cada una; 0 callejones sin salida |
| G6 | **Debug estático** | A1 | `tsc` 0; `knip` sin exports, archivos ni dependencias muertas (o justificados); `npm audit --omit=dev` sin high/critical; limpieza de efectos verificada |
| G7 | **Suite del repo** | Q1 | typecheck, test, build, budget en 0; e2e ×3 seguidas en verde; `probe-plate` 18/18 (si existe) |
| G8 | **Sin regresión visual no intencional** | V2 | 48 capturas comparadas con las del 30.09: cada diferencia tiene ticket |
| G9 | **Producción** | QX en F6 | health (sin fugas) y census ligero contra https://acupuntura3d.vercel.app en verde después del merge |

---

## 2. Hallazgos conocidos (línea base en `main` @ `3e29ca2`, antes del 30.09): re-verificar primero

Estos salen de correr §8 sobre `main`. El 30.09 pudo resolver o mover algunos: **QX los re-verifica en F0** y los que sigan entran como tickets con el ID que ya tienen.

| ID | Sev | Hallazgo | Evidencia | Arreglo sugerido |
|---|---|---|---|---|
| Q01 | S1 | **Tocar un punto abre otro en móvil**: ST36 → GB34, GV20 → EX-HN3, CV17 → nada | `health.tapWrong`, reproducido a mano con `touchscreen.tap` en el centro de cada marca | En `(pointer: coarse)`, hit-testing por **punto más cercano**: una capa transparente única que en `pointerup` elige la marca más cercana dentro de 22 px. Si dos marcas quedan a menos de 24 px, cluster obligatorio. Los sellos de dantian nunca capturan el toque de un punto. Test: e2e que toca el centro de cada marca y exige que abra ese mismo código |
| Q02 | S1 | **El aviso legal no atrapa el foco**: Tab sale del modal 25 de 25 veces y el fondo sigue enfocable | `health.focusLeakLegal = 25` | Atributo `inert` en la raíz de la app mientras `#legal-gate` está abierto (React 19 lo acepta) + foco inicial en el CTA + ciclo Tab/Shift+Tab. Mismo patrón en todo modal |
| Q03 | S2 | **Sectores del reloj muertos**: a la hora de la auditoría, los sectores HT (11–13) y GB (23–01) no respondían al clic en su centro porque otro `svg` del dial los tapaba. Son el sector de la hora y su opuesto, así que casi seguro es la aguja y su cola: **los sectores tapados cambian con la hora** | censo: `dead` + `covered by svg` | `pointer-events: none` en toda capa decorativa del dial (aguja, anillo, marcas). Test: los 12 sectores se pueden clickear en su centro y fijan su hora |
| Q04 | S2 | **Tirones de 330–420 ms** al cambiar de región (tecla 3) y al hacer zoom (+/−) | `health.longTaskSteps` | Medir con CDP Tracing. Durante el vuelo de cámara, animar un `transform` sobre el grupo en vez de reescribir el `viewBox` en cada frame, y fijar el `viewBox` al final; `will-change` en la capa de figura; memo de lo que no depende del zoom. Gate `longestTaskMs ≤ 200` |
| Q05 | S2 | **Targets chicos**: rótulos de margen de 15 px de alto en desktop (< 24), badge de cluster «4 puntos juntos» de 7×14 en desktop, botones de dantian de 29–30 px en móvil (< 44) | `census.smallTarget` | Rect transparente de hit de 24 px (fine) / 44 px (coarse) alrededor de cada rótulo, badge y sello, sin cambiar lo que se ve |
| Q06 | S2 | **Dependencia de terceros**: pedido a `fonts.googleapis.com` | `health.thirdPartyHosts` | Debe quedar en 0 tras el F1 del 30.09 (fuente auto-alojada). Si no, arreglarlo aquí |
| Q07 | S2 | **Falso positivo del e2e de fuente** (`document.fonts.check`) | lectura de `e2e/atlas.spec.ts` | Comprobar la FontFace cargada y la fuente de plataforma por CDP (como `probe-plate`) |
| Q08 | S3 | **Memoria**: el heap crece 9–10 % en 25 ciclos (umbral 20 %) | `health.heapGrowth` | Heap snapshots (CDP) antes y después; buscar listeners, rAF, ResizeObserver o closures retenidos. Meta ≤ 5 % |
| Q09 | S3 | **Scrim del índice móvil** es un botón «Cerrar» de 390×844 que se anuncia como botón | censo | `aria-hidden="true"` y `tabIndex={-1}` en el scrim (el cierre accesible es el botón visible y Esc) |

Lo que **ya pasa** en `main` y no puede romperse: 0 errores de consola propios, 0 fallos de red propios, CLS de carga 0.015, LCP ≈ 0.7–0.8 s, DOM estable en 25 ciclos, sin overflow a 320 px ni con zoom al 200 %, inglés sin fugas de español, `lang` sincronizado, la app funciona con `localStorage` bloqueado, trampa de foco correcta en la paleta y la ayuda, y axe con 0 violaciones en 20 escaneos.

---

## 3. Método (el mismo para todo ticket)

1. **Reproducir:** pasos exactos, viewport, contexto y evidencia (JSON, captura o traza).
2. **Registrar** en `docs/QAQC_3009/ISSUES.md` con esta plantilla:

   ```
   ### Q12 · S2 · <título en una línea>
   Dónde: <archivo:línea o componente> · Viewport: desktop|móvil · Contexto: <home|point|…>
   Pasos: 1… 2… 3…
   Esperado: …
   Obtenido: …
   Evidencia: docs/QAQC_3009/baseline/<archivo>
   Dueño: <ID del fixer> · Test que lo prueba: <ruta::nombre>
   Estado: abierto | corregido (<sha>) | documentado (motivo)
   ```

3. **Test que falla** (unit en `tests/`, e2e en `e2e/`, o un gate de census/health).
4. **Arreglo mínimo.**
5. **El test pasa**, y la suite completa también.
6. **Commit** `fix(<área>): <qué> (Qnn)`.

---

## 4. Usabilidad (A4 y J1)

### 4.1 Doce tareas con tope de acciones

Una **acción** es un clic, un toque, una tecla o un gesto (escribir una palabra cuenta 1). Se miden en desktop 1440 y móvil 390, partiendo de la portada ya aceptada. Hay que pasar **dentro del tope**, sin ayuda externa y sin callejones sin salida.

| # | Tarea | Tope desktop | Tope móvil |
|---|---|---|---|
| U1 | Abrir la ficha de ST36 | 3 | 3 |
| U2 | Leer la precaución de LI4 | 4 | 4 |
| U3 | Ver la vista posterior y abrir BL23 | 3 | 3 |
| U4 | Ir a la mano y abrir LI4 tocando la lámina | 3 | 3 |
| U5 | Pausar el Qi y fijar el reloj a las 07:00 | 3 | 4 |
| U6 | Averiguar qué meridiano rige a las 15:00 | 2 | 3 |
| U7 | Cambiar a inglés y volver a español | 2 | 2 |
| U8 | Cerrar todo y volver a la vista inicial | 2 | 2 |
| U9 | Descubrir los atajos de teclado | 1 | — |
| U10 | Abrir ST36 **tocando el cuerpo**, sin buscar | 2 | 3 (zoom + toque correcto, Q01) |
| U11 | Recorrer los puntos del meridiano ST | 2 por paso | 2 por paso |
| U12 | Encontrar la fuente y la confianza de un punto | 2 | 3 |

Cada tarea que se pase del tope o se atasque es un ticket **S2**. Si no se puede completar, **S1**. Graba cada tarea como e2e en `e2e/tasks.spec.ts`, con un contador de acciones.

### 4.2 Heurísticas (J1 puntúa de 1 a 5 cada una, con evidencia; PASS ≥ 4 en todas)

1. **Estado visible:**
   - Qué vista, región, punto y hora están activos.
   - Qi en marcha o pausado.
   - Carga de la lámina con un placeholder, no un hueco.
   - Selección anunciada por `aria-live`.
2. **Lenguaje del usuario:** Anterior/Posterior con ayuda («de frente», «de espalda») en el `title`. Cun, dantian, yin/yang y Wu Xing explicados en la Ayuda (glosario breve, texto original).
3. **Control y libertad:**
   - Esc cierra la capa más alta primero (paleta → ayuda → sheet/ficha → índice).
   - En móvil, el gesto «atrás» cierra la ficha: `history.pushState` al abrir y `popstate` al cerrar, sin romper la navegación.
   - ⟲ siempre vuelve al inicio.
4. **Consistencia:** el mismo icono y lugar para cerrar en todo panel. Los mismos estilos de botón primario y secundario. Los mismos términos en ES y EN.
5. **Prevención de errores:** búsqueda sin resultados → «Ningún punto coincide» + 3 sugerencias cercanas (distancia de edición sobre código y pinyin). Nada destructivo sin retorno.
6. **Reconocer antes que recordar:** los atajos se ven en tooltips (`title="Vista posterior · P"`) y en la Ayuda. La paleta muestra recientes.
7. **Flexibilidad:** teclado, paleta, clic/toque, pinch, doble toque para acercar y flechas para recorrer.
8. **Minimalismo:** no se agrega chrome. Si una ayuda nueva es necesaria, va en la Ayuda o como pista contextual efímera.
9. **Recuperación de errores:** ErrorBoundary con reintento. Fallo de la imagen de la lámina → mensaje claro + reintentar. Almacenamiento bloqueado → funciona igual (ya pasa).
10. **Ayuda y primer uso:** al cerrar la portada, una sola pista efímera sobre la lámina: «Toca un punto · / para buscar · ? ayuda». Desaparece con la primera interacción y no vuelve (`acu3d.hint.v1` en `localStorage`, en try/catch).

### 4.3 Microcopy (A4)

Revisar **cada** string de `src/i18n/messages.ts` y de la UI:
- Español neutro, sin voseo mezclado. Mayúsculas iniciales consistentes. Verbos en infinitivo en botones.
- Nada de jerga sin explicar. Inglés natural, no traducción literal.
- Botones de ícono con `aria-label` en los dos idiomas.
- Textos de estado vacío y de error presentes.

La lista va en `docs/QAQC_3009/MICROCOPY.md` (antes → después) y los cambios en `messages.ts`, respetando la paridad ES/EN (test existente).

---

## 5. Protocolo multiagente Grok 4.7 (sin detenerse)

- **Spawn** con `Task`, como en los enjambres anteriores del repo:

  ```
  Task(subagent_type: "generalPurpose" | "explore" | "bash",
       description: "<ID> <≤6 palabras>",
       prompt: "<tarjeta del rol (§6) + §0.2 + §0.3 + §3 + los tickets o secciones que le tocan + DoD + firma + 'no preguntes, no te detengas, reporta a QX'>")
  ```

- Máximo 8 hijos en vuelo, profundidad 1. Los hijos empiezan en frío: QX les pega todo lo necesario.
- **Worktree por escritor:** `git worktree add ../wt-<ID> -b qa/<ID> qa/qaqc-3009`. QX integra con `git merge --no-ff` y corre `npm run typecheck && npm test` entre merges.
- **Un escritor por archivo por fase.** QX reparte los tickets por dueño de archivo (§6, F2).
- **Reintentos:** un hijo que falla se relanza una vez con el log. Si vuelve a fallar, QX lo resuelve o documenta el motivo. Tope de 45 min de reloj por hijo.
- **Fallback:** sin `Task`, QX ejecuta los roles en serie con las mismas firmas.
- **Navegador:** `npx playwright install chromium`; si falla, un Chromium del sistema vía `executablePath`. Si no hay ninguno, las herramientas corren en CI y QX espera ese resultado.

**Firma** (últimas líneas de cada hijo; QX las copia a `docs/QAQC_3009/SIGN_OFF.md`):

```
ID: FX-UI
STATUS: PASS | FAIL
TICKETS: Q01 Q05 Q14 (cerrados) · Q20 (documentado: motivo)
CHANGED: <paths>
TESTS: <tests nuevos que fallaban antes>
CHECKS: typecheck=0 test=0 (N) build=0 census=<resumen> health=<n/18>
NOTE: ≤ 2 frases
```

---

## 6. Roster (13 hijos + QX) y fases

| Fase | ID | Rol | Tipo | En vuelo |
|---|---|---|---|---|
| F0 | QX | Base, build, suite completa de línea base, re-verificación de Q01–Q09 | tú | — |
| F1 | A1 | CÓDIGO: debug estático | explore + bash | 5 |
| F1 | A2 | BOTONES: censo ampliado | bash + generalPurpose | |
| F1 | A3 | ACCESIBILIDAD: auto + manual | generalPurpose | |
| F1 | A4 | USABILIDAD: tareas, heurísticas, microcopy | generalPurpose | |
| F1 | A5 | RENDIMIENTO Y ROBUSTEZ | bash + generalPurpose | |
| F2 | FX-ATLAS | Arreglos en `src/atlas/**` | generalPurpose + worktree | 5 |
| F2 | FX-UI | Arreglos en `src/ui/**` | generalPurpose + worktree | |
| F2 | FX-APP | Arreglos en `src/app/**`, `src/state/**`, `src/i18n/**`, `src/lib/**` | generalPurpose + worktree | |
| F2 | FX-PERF | Arreglos de rendimiento y memoria (archivos cedidos por QX) | generalPurpose + worktree | |
| F2 | FX-TEST | `e2e/**`, `tests/**`, `scripts/qa/**`, CI | generalPurpose + worktree | |
| F3 | V1 | VERIFICACIÓN: suite completa ×3 | bash | 2 |
| F3 | V2 | REGRESIÓN VISUAL: 48 capturas vs 30.09 | generalPurpose | |
| F4 | J1 | JUEZ UX (independiente) | explore + bash | 2 |
| F4 | J2 | JUEZ QA LEAD (independiente) | explore + bash | |
| F5 | QX | Bucles (máx. 3) | tú | — |
| F6 | QX | Merge, producción, informe | tú | — |

---

## 7. Tarjetas de rol (QX pega la tarjeta entera al crear cada hijo)

### F0 · QX — Línea base

1. §0.1. Después `npm ci && npm run typecheck && npm test && npm run build`.
2. Crea `scripts/qa/census.mjs`, `scripts/qa/health.mjs` y `scripts/qa/axe-all.mjs` **tal cual** (§8). Suma a `package.json`: `"qa:census"`, `"qa:health"`, `"qa:axe"` y `"qa": "npm run qa:health && npm run qa:axe && npm run qa:census"`, que aceptan `[baseUrl] [out.json]`.
3. Con `npx vite preview --port 4173` levantado, corre las tres herramientas → `docs/QAQC_3009/baseline/{census,health,axe}.json`, más `probe-plate` si existe y `npm run e2e`.
4. Crea `docs/QAQC_3009/{ISSUES,DECISIONES,LOG,SIGN_OFF,MICROCOPY,REPORT}.md`. Re-verifica Q01–Q09 (§2): los que sigan van a ISSUES con su ID; los resueltos se marcan «resuelto por el 30.09» con evidencia.
5. Commit: `docs(qa): línea base QAQC 30.09`.

### F1 · A1 — CÓDIGO (debug estático; no corrige, registra)

- `npx --yes knip@5` (exports, archivos y dependencias sin uso), `npx --yes madge@8 --circular --extensions ts,tsx src` (ciclos) y `npm audit --omit=dev`.
- **Revisión de cada `useEffect`, `requestAnimationFrame`, `ResizeObserver`, `addEventListener` y timer:** ¿se limpia? ¿depende de lo correcto?
- Selectores de Zustand que devuelven objetos nuevos (re-render infinito o innecesario).
- **Handlers de teclado duplicados o en conflicto:** `App`, `LegalModal`, paleta, sheet, índice. Esc tiene que cerrar solo la capa superior. Los atajos no se disparan dentro de inputs.
- **Condiciones de carrera:** `flyTo` pisado por el arrastre, cambio de vista durante un vuelo, cambio de región con la ficha abierta.
- Caminos de error: fallo de carga del PNG, JSON inválido (loaders), `matchMedia` ausente.
- i18n: claves sin uso y strings fuera de `t()`.

Cada hallazgo va a ISSUES con severidad. **DoD:** informe en `docs/QAQC_3009/A1.md` con la lista de hallazgos y la salida de cada herramienta.

### F1 · A2 — BOTONES (censo ampliado)

1. Corre `npm run qa:census` en desktop y móvil.
2. **Amplía `CONTEXTS`** (en `scripts/qa/census.mjs`, sin tocar los umbrales) hasta cubrir todo estado alcanzable:
   - face, foot, english
   - index-open en móvil, sheet-half y sheet-full, clock-popover en móvil
   - clave abierta y cerrada
   - palette con resultados y sin resultados
   - center (dantian inferior), zoom al máximo, reduced motion
3. **Cada fila que no sea PASS es un ticket:** dead, covered, smallTarget, unnamed, errors, clickFailed, overflowAfter.
4. `already-on` (radio ya activo) y `disabled` son válidos solo si el control lo comunica (`aria-checked`, `aria-disabled` o `disabled`).
5. Reporta el total de controles por contexto: ese número es la cobertura.

**DoD:** `docs/QAQC_3009/A2.md` con la tabla completa (control × contexto × viewport × efecto) y los tickets creados.

### F1 · A3 — ACCESIBILIDAD

- **Automático:** `npm run qa:axe` (20 escaneos). Amplíalo a los contextos nuevos de A2.
- **Teclado:** las 12 tareas de §4.1 **solo con teclado**; el orden de Tab es lógico, no hay trampas y Esc funciona por capas.
- **Lector de pantalla (semántica):**
  - Landmarks: `header`, `main#plate`, `nav` o `aside`, `footer`.
  - Encabezados en orden: un solo `h1`.
  - Cada control con rol, nombre y estado (`aria-pressed`, `aria-checked`, `aria-expanded`).
  - Puntos con nombre completo. `aria-live` anuncia la selección y el cambio de vista/región, sin spam durante el vuelo.
- **Visual:**
  - Foco visible en todo control.
  - `forced-colors: active` (`page.emulateMedia({ forcedColors: "active" })`): puntos, trazos y controles siguen visibles. Captura para revisión.
  - Zoom al 400 % (viewport 360×225 a 4×): nada se pierde.
  - `prefers-reduced-motion`: sin movimiento.
- **Objetivos:** 24 px (fine) y 44 px (coarse), o espaciado equivalente (WCAG 2.5.8).

**DoD:** `docs/QAQC_3009/A3.md` + tickets.

### F1 · A4 — USABILIDAD

- Mide las 12 tareas (§4.1) en desktop y móvil, con el recorrido óptimo y un recorrido «de primera vez» (sin atajos).
- Evalúa las 10 heurísticas (§4.2) con capturas.
- Revisa todo el microcopy (§4.3).
- Revisa estados vacíos, de carga y de error.
- Propón el arreglo mínimo de cada problema (sin rediseñar).

**DoD:** `docs/QAQC_3009/A4.md`, `MICROCOPY.md` y tickets.

### F1 · A5 — RENDIMIENTO Y ROBUSTEZ

- `npm run qa:health` ×2 (tiene que dar lo mismo las dos veces; si no, el gate es inestable: arregla el script, no el umbral).
- **Traza CDP** (`Tracing.start` con las categorías `devtools.timeline` y `blink.user_timing`) de: cambio a región Mano, zoom +, flyTo a ST36 y cambio A/P. Identifica la función o el paint que causa cada long task > 50 ms.
- **Heap snapshots** (CDP `HeapProfiler.takeHeapSnapshot`) antes y después de 25 ciclos: busca detached nodes y listeners retenidos.
- **Red lenta** (CDP `Network.emulateNetworkConditions` Fast 3G): LCP ≤ 4 s y la lámina muestra un placeholder mientras carga el PNG.
- **Offline después de cargar:** la navegación entre vistas ya cargadas no rompe nada.
- **Tormenta de resize:** 30 cambios de viewport seguidos, sin errores y con la cámara estable.
- **Doble clic rápido y toques repetidos:** sin estados inconsistentes.

**DoD:** `docs/QAQC_3009/A5.md` + trazas en `docs/QAQC_3009/baseline/` + tickets.

### F2 · Fixers (FX-ATLAS, FX-UI, FX-APP, FX-PERF, FX-TEST)

QX reparte los tickets abiertos por dueño de archivo. Si un ticket toca archivos de dos fixers, QX lo asigna a uno y le cede los archivos para esa fase.

Cada fixer, **por ticket:** test que falla → arreglo mínimo → test en verde → suite completa en verde → commit `fix(<área>): … (Qnn)` → estado «corregido (sha)» en ISSUES.

Arreglos esperados como mínimo (si siguen abiertos tras F0):
- **FX-ATLAS:** Q01 (hit-testing por el más cercano en coarse), Q05 (hit rects de rótulos y sellos), Q04 junto con FX-PERF.
- **FX-UI:** Q03 (capas decorativas del reloj), Q09 (scrim), los arreglos de microcopy y estados vacíos de la paleta y la ficha.
- **FX-APP:**
  - Q02: `inert` durante los modales.
  - Esc por capas.
  - `history` para cerrar la ficha con «atrás» en móvil.
  - La pista efímera de primer uso (§4.2-10).
  - `aria-live` de vista y región.
- **FX-PERF:** Q04 y Q08 con evidencia de traza antes y después.
- **FX-TEST:**
  - `e2e/tasks.spec.ts` (12 tareas con contador de acciones).
  - El e2e de toque por punto (Q01).
  - El e2e de fuente corregido (Q07).
  - Workflow `.github/workflows/qa.yml`: en cada PR a `main`, `vite preview` + `npm run qa`, subiendo los JSON como artefactos. `timeout-minutes: 30`.

**DoD de cada fixer:** todos sus tickets en «corregido» o «documentado con motivo», los tests nuevos listados en la firma y la suite en verde.

### F3 · V1 — VERIFICACIÓN

Suite completa **3 veces seguidas**: `npm run typecheck`, `npm test`, `npm run build`, `npm run budget`, `npm run e2e`, `npm run qa` y `npm run probe` (si existe). Cada vez tiene que dar lo mismo y estar en verde. Guarda los JSON en `docs/QAQC_3009/after/`. Si algo falla, el ticket vuelve a su fixer (bucle).

### F3 · V2 — REGRESIÓN VISUAL

`node scripts/shots.mjs docs/QAQC_3009/shots` y compara 1 a 1 con `docs/T1_3009/shots/after/` (o `docs/T1_2909/shots/after/` si el 30.09 no está). Toda diferencia visible tiene que corresponder a un ticket cerrado; si no, es una regresión y se abre un ticket S2.

### F4 · J1 — JUEZ UX (independiente: no escribió código en este ciclo)

- Ejecuta las 12 tareas en los dos dispositivos, como alguien que abre el sitio por primera vez.
- Puntúa las 10 heurísticas (1–5) con evidencia.
- Una nota de 0–100 estilo SUS («¿lo usaría de nuevo?», «¿lo entendí sin ayuda?»…) con justificación.

**PASS** = las 12 tareas dentro del tope, heurísticas ≥ 4, nota ≥ 85 y 0 callejones sin salida. Escribe `docs/QAQC_3009/J1.md`. Si da FAIL, deja como máximo 7 vetos accionables.

### F4 · J2 — JUEZ QA LEAD (independiente)

Checklist de salida:
- G1–G8 en verde, con los JSON como evidencia.
- 0 S1 y 0 S2 abiertos.
- Cada S3 abierto tiene motivo.
- Todo test nuevo falla sin su arreglo: prueba 3 al azar con `git stash` del arreglo.
- CI verde.
- Changelog claro en la PR.

**PASS** o FAIL con vetos. Escribe `docs/QAQC_3009/J2.md`.

### F5 · Bucles

Si falla J1, J2 o un gate, QX relanza solo a los fixers de los tickets vetados, después V1 y V2, y después J1 y J2. **Máximo 3 bucles.** Nunca se declara PASS con un gate en rojo.

### F6 · QX — Merge, producción e informe

1. PR `qa/qaqc-3009` → `$TARGET` con:
   - Resumen.
   - Tabla de gates antes → después.
   - Tickets por severidad (cerrados/abiertos).
   - Las 12 tareas con sus costos.
   - Heurísticas.
   - Firmas.
2. Si `MERGE_A_MAIN = sí`, los gates están verdes y J1 y J2 dieron PASS:
   - Merge (`git merge --no-ff` y push, o merge de la PR).
   - Si `TARGET = feat/t1-3009` y su PR ya pasó los gates del 30.09, mergea también esa rama a `main`. Si no, deja constancia.
   - Espera el deploy de Vercel (hasta 10 min, comparando el hash de `assets/index-*.js`).
   - Corre `npm run qa:health -- https://acupuntura3d.vercel.app/ docs/QAQC_3009/prod-health.json` y el censo de los contextos `home` y `point` en producción.
   - **Si falla algo en producción:** `git revert -m 1 <merge-sha>` + push, y un ticket S1 con la evidencia.
3. `docs/QAQC_3009/REPORT.md`:
   - Resumen ejecutivo (5 líneas).
   - Métricas antes/después.
   - Tickets.
   - Tareas y heurísticas.
   - Riesgos que quedan.
   - Recomendaciones para el próximo ciclo.
4. Actualiza `README.md` (sección QA: cómo correr `npm run qa`) y `docs/DEPLOY.md` (job QA).
5. Respuesta final al humano en ≤ 12 líneas: link de la PR, estado del merge y de producción, gates antes → después, S1/S2/S3 cerrados y abiertos, y la nota de J1.

---

## 8. Herramientas (escritas y corridas sobre `main` @ `3e29ca2`)

Cópialas tal cual en `scripts/qa/`. Puedes **ampliar** contextos y casos. **No bajes umbrales.** Usan `@playwright/test` (ya es devDependency del repo) y `@axe-core/playwright` (también).

### 8.1 `scripts/qa/census.mjs` — censo de todos los controles

Encuentra cada control visible (botones, enlaces, inputs, `summary` y todo `role` interactivo, incluidos los `<g role="button">` del SVG) en cada contexto y dispositivo. Cuando hay un modal abierto, solo cuenta lo que está dentro. A cada control le mide nombre accesible, tamaño y si está tapado en su punto de clic. Después lo pulsa **en una página nueva** (en SVG, sobre su texto) y compara una huella del estado antes y después (URL, foco, `aria-*`, diálogos, `viewBox`, tamaño del DOM, `lang`). También captura errores de consola.

Sobre `main`: 159 controles, con `dead` 3, `covered` 9 y `smallTarget` 12; el resto en 0. Tarda unos 6 minutos (una página nueva por control).

```js
// Usage: node scripts/qa/census.mjs [baseUrl] [out.json]
// Control census: finds every interactive control in every context, names it, measures it,
// clicks it in a fresh page and checks that something observable happens, with no console errors.
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4173/";
const outFile = process.argv[3] ?? "";

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, minTarget: 24 },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, minTarget: 44 },
};

const CONTROL = [
  "button", "a[href]", "input", "select", "textarea", "summary",
  '[role="button"]', '[role="tab"]', '[role="radio"]', '[role="switch"]', '[role="checkbox"]',
  '[role="option"]', '[role="slider"]', '[role="menuitem"]', '[role="combobox"]',
].join(",");

const press = (...keys) => async (p) => {
  for (const k of keys) {
    await p.keyboard.press(k);
    await p.waitForTimeout(120);
  }
};
const find = (q) => async (p) => {
  await p.keyboard.press("/");
  await p.keyboard.type(q, { delay: 15 });
  await p.keyboard.press("Enter");
};
const clickFirst = (...sels) => async (p) => {
  for (const s of sels) {
    const el = p.locator(s).first();
    if ((await el.count()) && (await el.isVisible())) return el.click();
  }
};

/** Each context is a way to reach a state. "legal" keeps the first-visit gate. */
const CONTEXTS = {
  legal: { accept: false, steps: [] },
  home: { steps: [] },
  index: { steps: [clickFirst('[data-testid="index-toggle"]', 'button:has-text("Índice")', 'button:has-text("Meridianos")')] },
  point: { steps: [find("ST36")] },
  center: { steps: [find("dantian medio")] },
  palette: { steps: [press("/")] },
  help: { steps: [press("?")] },
  posterior: { steps: [press("p")] },
  hand: { steps: [press("3")] },
  zoom: { steps: [press("+", "+", "+")] },
};

async function openPage(browser, vp, ctxName) {
  const { viewport, isMobile, hasTouch } = VIEWPORTS[vp];
  const context = await browser.newContext({ viewport, isMobile, hasTouch, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 160)}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 160)}`));
  await page.goto(base, { waitUntil: "load" });
  await page.waitForTimeout(350);
  const spec = CONTEXTS[ctxName];
  if (spec.accept !== false) {
    await page.keyboard.press("Enter");
    await page.waitForTimeout(250);
  }
  for (const step of spec.steps) await step(page);
  await page.waitForTimeout(450);
  return { context, page, errors };
}

/** Runs in the page: visible controls with a replayable CSS path. */
function listControls(selector) {
  const cssPath = (el) => {
    if (el.dataset?.testid) return `[data-testid="${el.dataset.testid}"]`;
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && n !== document.documentElement) {
      const tag = n.tagName.toLowerCase();
      const sibs = n.parentElement ? [...n.parentElement.children].filter((c) => c.tagName === n.tagName) : [];
      parts.unshift(sibs.length > 1 ? `${tag}:nth-of-type(${sibs.indexOf(n) + 1})` : tag);
      n = n.parentElement;
    }
    return parts.join(" > ");
  };
  const nameOf = (el) => {
    const byIds = (el.getAttribute("aria-labelledby") ?? "")
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? "")
      .join(" ")
      .trim();
    const label = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent : "";
    return (el.getAttribute("aria-label") || byIds || label || el.textContent || el.getAttribute("title") || el.getAttribute("placeholder") || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
  };
  const out = [];
  const modals = [...document.querySelectorAll('[aria-modal="true"]')].filter((m) => m.getBoundingClientRect().width > 0);
  const scope = modals.length ? modals[modals.length - 1] : document;
  for (const el of scope.querySelectorAll(selector)) {
    const box = el.getBoundingClientRect();
    const label = el instanceof SVGElement ? el.querySelector("text") : null;
    const r = label && label.getBoundingClientRect().width > 0 ? label.getBoundingClientRect() : box;
    const cs = getComputedStyle(el);
    if (r.width < 1 || r.height < 1 || cs.visibility === "hidden" || cs.display === "none") continue;
    if (el.closest('[aria-hidden="true"], [inert]')) continue;
    if (r.bottom < 0 || r.right < 0 || r.top > innerHeight || r.left > innerWidth) continue;
    const cx = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2));
    const cy = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
    const hit = document.elementFromPoint(cx, cy);
    const scrim = box.width >= innerWidth * 0.9 && box.height >= innerHeight * 0.9;
    const covered = !scrim && !(hit && (hit === el || el.contains(hit)));
    out.push({
      path: cssPath(el),
      testid: el.dataset?.testid ?? null,
      role: el.getAttribute("role") ?? el.tagName.toLowerCase(),
      type: el.getAttribute("type") ?? "",
      name: nameOf(el),
      w: Math.round(Math.max(r.width, box.width >= 24 && box.height >= 24 ? box.width : 0)),
      h: Math.round(Math.max(r.height, box.width >= 24 && box.height >= 24 ? box.height : 0)),
      x: Math.round(cx),
      y: Math.round(cy),
      covered,
      coveredBy: covered && hit ? `${hit.tagName.toLowerCase()}.${String(hit.className?.baseVal ?? hit.className).split(" ")[0]}` : "",
      disabled: Boolean(el.disabled) || el.getAttribute("aria-disabled") === "true",
      on: ["aria-pressed", "aria-checked", "aria-selected", "aria-current"].some((a) => el.getAttribute(a) === "true" || el.getAttribute(a) === "page"),
    });
  }
  return out;
}

function fingerprint() {
  const attrs = [...document.querySelectorAll("[aria-pressed],[aria-checked],[aria-expanded],[aria-selected],details,[data-state],[data-on],[data-hour]")]
    .map((e) =>
      [e.getAttribute("aria-pressed"), e.getAttribute("aria-checked"), e.getAttribute("aria-expanded"), e.getAttribute("aria-selected"), e.hasAttribute("open"), e.getAttribute("data-state"), e.getAttribute("data-on"), e.getAttribute("data-hour")].join(","),
    )
    .join("|");
  return {
    url: location.href,
    active: document.activeElement ? document.activeElement.outerHTML.slice(0, 120) : "",
    attrs,
    dialogs: document.querySelectorAll('[role="dialog"], dialog[open]').length,
    viewBox: [...document.querySelectorAll("svg[viewBox]")].map((s) => s.getAttribute("viewBox")).join(";"),
    html: document.body.innerHTML.length,
    lang: document.documentElement.lang,
    overflowX: document.documentElement.scrollWidth > innerWidth + 1,
  };
}

const browser = await chromium.launch();
const rows = [];
for (const vp of Object.keys(VIEWPORTS)) {
  const seen = new Set();
  for (const ctxName of Object.keys(CONTEXTS)) {
    const probe = await openPage(browser, vp, ctxName);
    const controls = await probe.page.evaluate(listControls, CONTROL);
    await probe.context.close();
    for (const c of controls) {
      const key = `${c.testid ?? `${c.role}:${c.name}`}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const run = await openPage(browser, vp, ctxName);
      const before = await run.page.evaluate(fingerprint);
      const errorsBefore = run.errors.length;
      let effect = "none";
      try {
        const loc = run.page.locator(c.path).first();
        if (c.role === "slider" || c.type === "range") {
          await loc.focus();
          await run.page.keyboard.press("ArrowRight");
        } else if (["input", "textarea", "combobox"].includes(c.role) && c.type !== "checkbox") {
          await loc.click({ timeout: 2000 });
          await run.page.keyboard.type("a");
        } else if (c.covered) {
          await loc.click({ timeout: 2000, force: true });
        } else {
          await run.page.mouse.click(c.x, c.y);
        }
        await run.page.waitForTimeout(500);
        const after = await run.page.evaluate(fingerprint);
        const changed = Object.keys(before).filter((k) => k !== "overflowX" && before[k] !== after[k]);
        effect = changed.length ? changed.join("+") : c.disabled ? "disabled" : c.on ? "already-on" : "none";
        c.overflowAfter = after.overflowX;
      } catch (e) {
        effect = `click-failed: ${String(e).split("\n")[0].slice(0, 100)}`;
      }
      const errs = run.errors.slice(errorsBefore);
      rows.push({ vp, ctx: ctxName, ...c, effect, errors: errs });
      await run.context.close();
    }
  }
}
await browser.close();

const minTarget = (r) => VIEWPORTS[r.vp].minTarget;
const issues = {
  dead: rows.filter((r) => r.effect === "none"),
  clickFailed: rows.filter((r) => r.effect.startsWith("click-failed")),
  errors: rows.filter((r) => r.errors.length),
  unnamed: rows.filter((r) => !r.name),
  covered: rows.filter((r) => r.covered),
  smallTarget: rows.filter((r) => Math.min(r.w, r.h) < minTarget(r) && !["input", "textarea"].includes(r.role)),
  overflowAfter: rows.filter((r) => r.overflowAfter),
};
const summary = Object.fromEntries(Object.entries(issues).map(([k, v]) => [k, v.length]));
const report = { base, total: rows.length, summary, pass: Object.values(summary).every((n) => n === 0), issues, rows };
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ total: rows.length, summary, pass: report.pass }, null, 2));
for (const [k, v] of Object.entries(issues)) {
  for (const r of v.slice(0, 12)) console.log(`${k.padEnd(13)} ${r.vp.padEnd(7)} ${r.ctx.padEnd(9)} ${(r.testid ?? r.role).padEnd(22)} «${r.name}» ${r.w}×${r.h} ${r.effect} ${r.coveredBy} ${r.errors.join(" ")}`);
}
process.exitCode = report.pass ? 0 : 1;
```

### 8.2 `scripts/qa/health.mjs` — salud de ejecución (18 gates)

Mide:
- Errores de consola y de red propios, y hosts de terceros.
- LCP, CLS de carga y tareas largas atribuidas al paso que las causó.
- Heap y DOM en 25 ciclos.
- Trampas de foco en los modales.
- Reflujo a 320 px y zoom al 200 %.
- Inglés sin fugas de español.
- Precisión del toque en móvil (tocar un punto abre ese punto).
- La app con almacenamiento bloqueado.

Corrido dos veces seguidas sobre `main`, da el mismo resultado: 14/18, con fallos en `thirdPartyHosts`, `longestTaskMs`, `focusLeakLegal` y `tapAccuracy`.

```js
// Usage: node scripts/qa/health.mjs [baseUrl] [out.json]
// Runtime health: console and network errors, CLS, LCP, long tasks, heap and DOM growth,
// focus traps in modals, reflow at 320 px, English without Spanish leaks, tap accuracy on mobile.
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4173/";
const origin = new URL(base).origin;
const own = (url) => !url || url.startsWith(origin) || url.startsWith("data:") || url.startsWith("blob:");
const outFile = process.argv[3] ?? "";
const m = {};
const wait = (p, ms = 250) => p.waitForTimeout(ms);

const browser = await chromium.launch({ args: ["--js-flags=--expose-gc", "--enable-precise-memory-info"] });

async function fresh(viewport, extra = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, ...extra });
  const page = await context.newPage();
  const log = { errors: [], warnings: [], failed: [], http: [], thirdParty: new Set() };
  page.on("console", (msg) => {
    const where = msg.location()?.url ?? "";
    const text = `${msg.text().slice(0, 160)}${where ? ` @ ${where.slice(0, 80)}` : ""}`;
    if (!own(where)) return;
    if (msg.type() === "error") log.errors.push(text);
    if (msg.type() === "warning") log.warnings.push(text);
  });
  page.on("pageerror", (e) => log.errors.push(`pageerror: ${String(e).slice(0, 200)}`));
  page.on("request", (r) => {
    if (!own(r.url())) log.thirdParty.add(new URL(r.url()).host);
  });
  page.on("requestfailed", (r) => {
    if (own(r.url())) log.failed.push(`${r.url().slice(0, 100)} ${r.failure()?.errorText}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && own(r.url())) log.http.push(`${r.status()} ${r.url().slice(0, 100)}`);
  });
  await page.addInitScript(() => {
    window.__qa = { cls: 0, lcp: 0, longTasks: [] };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__qa.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__qa.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        const marks = performance.getEntriesByType("mark").filter((mk) => mk.startTime <= e.startTime);
        const step = marks.length ? marks[marks.length - 1].name : "load";
        window.__qa.longTasks.push({ ms: Math.round(e.duration), step });
      }
    }).observe({ type: "longtask", buffered: true });
  });
  await page.goto(base, { waitUntil: "load" });
  await wait(page, 500);
  return { context, page, log };
}

const find = async (p, q) => {
  await p.keyboard.press("/");
  await p.keyboard.type(q, { delay: 10 });
  await p.keyboard.press("Enter");
  await wait(p, 500);
};

/* 1 · Journey on desktop: every main control once, errors and vitals. */
{
  const { context, page, log } = await fresh({ width: 1440, height: 900 });
  await wait(page, 2000);
  m.lcpMs = Math.round(await page.evaluate(() => window.__qa.lcp));
  m.clsLoad = Math.round((await page.evaluate(() => window.__qa.cls)) * 1000) / 1000;
  const mark = (name) => page.evaluate((n) => performance.mark(n), name);
  await mark("accept");
  await page.keyboard.press("Enter");
  await wait(page);
  for (const k of ["p", "a", "2", "3", "4", "1", "c", "c", "+", "+", "-", "0"]) {
    await mark(`key ${k}`);
    await page.keyboard.press(k);
    await wait(page, 300);
  }
  await mark("find ST36");
  await find(page, "ST36");
  await page.keyboard.press("ArrowRight");
  await wait(page);
  await page.keyboard.press("Escape");
  await find(page, "dantian medio");
  await page.keyboard.press("Escape");
  await page.keyboard.press("?");
  await wait(page);
  await page.keyboard.press("Escape");
  for (const sel of ['[data-testid="index-toggle"]', '[data-testid="clock-play"]', '[data-testid="clock-play"]']) {
    const el = page.locator(sel).first();
    if (await el.count()) await el.click();
    await wait(page, 300);
  }
  const q = await page.evaluate(() => ({ cls: window.__qa.cls, long: window.__qa.longTasks, nodes: document.getElementsByTagName("*").length }));
  m.clsSession = Math.round(q.cls * 1000) / 1000;
  m.longTasks = q.long.length;
  m.longestTaskMs = q.long.length ? Math.max(...q.long.map((t) => t.ms)) : 0;
  m.longTaskSteps = [...q.long].sort((a, b) => b.ms - a.ms).slice(0, 5).map((t) => `${t.ms}ms @ ${t.step}`);
  m.domNodes = q.nodes;
  m.consoleErrors = log.errors;
  m.consoleWarnings = log.warnings.filter((w) => !/Download the React DevTools/.test(w));
  m.requestFailed = log.failed;
  m.http4xx5xx = log.http;
  m.thirdPartyHosts = [...log.thirdParty];
  await context.close();
}

/* 2 · Leaks: the same 5-step loop 30 times; heap and DOM after GC at loop 5 and 30. */
{
  const { context, page } = await fresh({ width: 1440, height: 900 });
  await page.keyboard.press("Enter");
  const sample = () =>
    page.evaluate(() => {
      window.gc?.();
      return { heap: performance.memory?.usedJSHeapSize ?? 0, nodes: document.getElementsByTagName("*").length };
    });
  let at5 = null;
  for (let i = 1; i <= 30; i += 1) {
    await find(page, "ST36");
    await page.keyboard.press("Escape");
    await page.keyboard.press("p");
    await page.keyboard.press("3");
    await page.keyboard.press("1");
    await page.keyboard.press("a");
    await wait(page, 120);
    if (i === 5) at5 = await sample();
  }
  const at30 = await sample();
  m.heapGrowth = at5?.heap ? Math.round(((at30.heap - at5.heap) / at5.heap) * 1000) / 1000 : null;
  m.domGrowth = at5 ? Math.round(((at30.nodes - at5.nodes) / at5.nodes) * 1000) / 1000 : null;
  await context.close();
}

/* 3 · Focus traps: Tab never leaves an open modal. */
async function trap(openModal) {
  const { context, page } = await fresh({ width: 1440, height: 900 });
  await openModal(page);
  await wait(page, 300);
  let leaks = 0;
  for (let i = 0; i < 25; i += 1) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const modal = [...document.querySelectorAll('[aria-modal="true"]')].pop();
      return Boolean(modal && document.activeElement && modal.contains(document.activeElement));
    });
    if (!inside) leaks += 1;
  }
  await context.close();
  return leaks;
}
m.focusLeakLegal = await trap(async () => {});
m.focusLeakPalette = await trap(async (p) => {
  await p.keyboard.press("Enter");
  await p.keyboard.press("/");
});
m.focusLeakHelp = await trap(async (p) => {
  await p.keyboard.press("Enter");
  await p.keyboard.press("?");
});

/* 4 · Reflow at 320 px (WCAG 1.4.10) and at 200 % zoom (720×450 at 2x). */
for (const [key, vp, dsf] of [["reflow320", { width: 320, height: 640 }, 1], ["zoom200", { width: 720, height: 450 }, 2]]) {
  const { context, page } = await fresh(vp, { deviceScaleFactor: dsf, isMobile: key === "reflow320", hasTouch: key === "reflow320" });
  await page.keyboard.press("Enter");
  await wait(page, 400);
  m[key] = await page.evaluate(() => {
    const over = document.documentElement.scrollWidth > innerWidth + 1;
    const clipped = [...document.querySelectorAll("button, [role=button], a[href], input")].filter((e) => {
      const r = e.getBoundingClientRect();
      if (r.width === 0 || e.closest('[aria-hidden="true"], [inert]')) return false;
      for (let a = e.parentElement; a; a = a.parentElement) {
        const ox = getComputedStyle(a).overflowX;
        if ((ox === "auto" || ox === "scroll") && a.scrollWidth > a.clientWidth) return false;
      }
      return r.right > innerWidth + 1 || r.left < -1;
    });
    return {
      overflowX: over,
      controlsOffscreen: clipped.length,
      which: clipped.slice(0, 5).map((e) => (e.getAttribute("aria-label") || e.textContent || e.tagName).trim().slice(0, 40)),
    };
  });
  await context.close();
}

/* 5 · English: no Spanish UI words outside lang="es" content. */
{
  const { context, page } = await fresh({ width: 1440, height: 900 });
  await page.keyboard.press("Enter");
  const en = page.locator('button:has-text("EN"), [data-testid="locale-en"]').first();
  if (await en.count()) await en.click();
  await wait(page, 400);
  await find(page, "ST36");
  m.langAfterEn = await page.evaluate(() => document.documentElement.lang);
  m.spanishLeaksInEn = await page.evaluate(() => {
    const words = /\b(Buscar|Cerrar|Ayuda|Índice|Cuerpo|Rostro|Mano|Pie|Reproducir|Pausar|Velocidad|Reloj|Capas|Meridianos|Puntos|Centros|Entiendo|Clave|Localización|Funciones|Precauciones|Siguiente|Anterior punto|Seguir el Qi|Elemento|Polaridad|Lateralidad|Fuentes|Confianza)\b/;
    const hits = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      const el = n.parentElement;
      if (!el || el.closest('[lang="es"], [aria-hidden="true"], script, style')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      const t = n.textContent.trim();
      if (words.test(t)) hits.push(t.slice(0, 40));
    }
    return [...new Set(hits)].slice(0, 20);
  });
  await context.close();
}

/* 6 · Tap accuracy on mobile: tapping a point opens that same point. */
{
  const { context, page } = await fresh({ width: 390, height: 844 }, { isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  await page.keyboard.press("Enter");
  await wait(page, 400);
  const codes = await page.evaluate(() => [...document.querySelectorAll('[data-testid^="point-"]')].map((e) => e.getAttribute("data-testid").slice(6)));
  const wrong = [];
  for (const code of codes) {
    const el = page.getByTestId(`point-${code}`);
    const box = await el.boundingBox();
    if (!box) continue;
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await wait(page, 600);
    const opened = await page.evaluate((c) => {
      const panel = document.querySelector('[data-testid="sheet"], [role="dialog"][aria-label]');
      if (!panel) return null;
      const text = `${panel.getAttribute("aria-label") ?? ""} ${panel.innerText}`;
      return text.includes(c) ? c : (text.match(/\b(?:[A-Z]{2}\d+|EX-[A-Z]+\d+)\b/)?.[0] ?? "?");
    }, code);
    if (opened !== code) wrong.push(`${code}→${opened ?? "nada"}`);
    await page.keyboard.press("Escape");
    await wait(page, 300);
    const reset = page.locator('[data-testid="zoom-reset"]').first();
    if (await reset.count()) await reset.click({ force: true });
    await wait(page, 400);
  }
  m.tapPoints = codes.length;
  m.tapWrong = wrong;
  await context.close();
}

/* 7 · Storage denied (strict private mode): the app still opens and the gate still closes. */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    for (const key of ["localStorage", "sessionStorage"]) {
      Object.defineProperty(window, key, {
        get() {
          throw new DOMException("denied", "SecurityError");
        },
      });
    }
  });
  const page = await context.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  await page.goto(base, { waitUntil: "load" });
  await wait(page, 500);
  await page.keyboard.press("Enter");
  await wait(page, 400);
  const state = await page.evaluate(() => ({
    gate: Boolean(document.getElementById("legal-gate")),
    plate: Boolean(document.querySelector('[data-testid="plate"] svg')),
  }));
  m.storageDenied = { pageErrors: errs, gateStillOpen: state.gate, plate: state.plate };
  await context.close();
}

await browser.close();

const gates = {
  consoleErrors: m.consoleErrors.length === 0,
  requestFailed: m.requestFailed.length === 0,
  http4xx5xx: m.http4xx5xx.length === 0,
  thirdPartyHosts: m.thirdPartyHosts.length === 0,
  clsLoad: m.clsLoad <= 0.05,
  lcpMs: m.lcpMs > 0 && m.lcpMs <= 2500,
  longestTaskMs: m.longestTaskMs <= 200,
  heapGrowth: m.heapGrowth === null || m.heapGrowth <= 0.2,
  domGrowth: m.domGrowth === null || m.domGrowth <= 0.05,
  focusLeakLegal: m.focusLeakLegal === 0,
  focusLeakPalette: m.focusLeakPalette === 0,
  focusLeakHelp: m.focusLeakHelp === 0,
  reflow320: !m.reflow320.overflowX && m.reflow320.controlsOffscreen === 0,
  zoom200: !m.zoom200.overflowX && m.zoom200.controlsOffscreen === 0,
  langAfterEn: m.langAfterEn === "en",
  spanishLeaksInEn: m.spanishLeaksInEn.length === 0,
  tapAccuracy: m.tapWrong.length === 0,
  storageDenied: m.storageDenied.pageErrors.length === 0 && !m.storageDenied.gateStillOpen && m.storageDenied.plate,
};
const failed = Object.entries(gates).filter(([, ok]) => !ok).map(([k]) => k);
const report = { base, metrics: m, gates, failed, pass: failed.length === 0 };
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.pass ? 0 : 1;
```

### 8.3 `scripts/qa/axe-all.mjs` — WCAG 2.2 AA en todos los contextos

Sobre `main`: 0 violaciones en 20 escaneos (10 contextos × 2 dispositivos).

```js
// Usage: node scripts/qa/axe-all.mjs [baseUrl] [out.json]
// WCAG 2.2 AA scan (axe-core) in every context of the census, desktop and mobile.
import { writeFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4173/";
const outFile = process.argv[3] ?? "";
const find = (q) => async (p) => {
  await p.keyboard.press("/");
  await p.keyboard.type(q, { delay: 10 });
  await p.keyboard.press("Enter");
};
const keys = (...ks) => async (p) => {
  for (const k of ks) await p.keyboard.press(k);
};
const CONTEXTS = {
  legal: null,
  home: [],
  index: [async (p) => p.locator('[data-testid="index-toggle"]').first().click()],
  point: [find("ST36")],
  center: [find("dantian medio")],
  palette: [keys("/"), async (p) => p.keyboard.type("zu")],
  help: [keys("?")],
  posterior: [keys("p")],
  hand: [keys("3")],
  english: [async (p) => p.locator('button:has-text("EN")').first().click(), find("ST36")],
};
const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
};

const browser = await chromium.launch();
const violations = [];
for (const [vp, opts] of Object.entries(VIEWPORTS)) {
  for (const [ctx, steps] of Object.entries(CONTEXTS)) {
    const context = await browser.newContext({ ...opts, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: "load" });
    await page.waitForTimeout(400);
    if (steps) {
      await page.keyboard.press("Enter");
      for (const s of steps) await s(page);
    }
    await page.waitForTimeout(600);
    const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    for (const v of res.violations) {
      violations.push({ vp, ctx, id: v.id, impact: v.impact, nodes: v.nodes.length, target: v.nodes[0]?.target?.join(" ").slice(0, 80), help: v.help });
    }
    await context.close();
  }
}
await browser.close();
const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
const report = { base, total: violations.length, serious: serious.length, pass: serious.length === 0, violations };
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ total: report.total, serious: report.serious, pass: report.pass }, null, 2));
for (const v of violations) console.log(`${v.impact.padEnd(9)} ${v.vp.padEnd(7)} ${v.ctx.padEnd(9)} ${v.id} ×${v.nodes} ${v.target} — ${v.help}`);
process.exitCode = report.pass ? 0 : 1;
```

---

## 9. Anti-patrones (si aparece uno, se revierte)

- Bajar un umbral, saltar un test, marcar `skip` o `only`, o poner `force: true` en un e2e para que «pase».
- Arreglar sin un test que fallara antes.
- Rediseñar en vez de corregir.
- Tocar datos del seed.
- Ocultar un control problemático en vez de arreglarlo.
- `aria-hidden` sobre algo enfocable.
- `outline: none` sin foco alternativo.
- Silenciar errores de consola con try/catch vacío.
- Declarar PASS con un gate rojo. Detenerse a preguntar.

## 10. Recordatorio final

Encontrar → registrar → test que falla → arreglo mínimo → verde → firmar. Cada botón se prueba. Cada toque abre lo que dice. Cada modal atrapa el foco. Cada tarea cabe en su tope. Cero S1 y S2 abiertos. Sin detenerse.

**Arranca ahora:** F0 → F1 (A1–A5) → F2 (fixers) → F3 (V1, V2) → F4 (J1, J2) → F5 → F6.

=== FIN ===
