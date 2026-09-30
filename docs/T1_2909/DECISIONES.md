# Decisiones T1 29.09

- OX: el mensaje de ejecución ordena dejar `main` pusheado al terminar. El §0.1 pide no mergear; gana la orden explícita de este turno. Se abre el PR y, al cierre con gates, se mergea `feat/t1-2909` en `main` y se pushea.
- OX: `@playwright/test` se fija en 1.63.0 (última exacta al 29-09-2026). `@axe-core/playwright` queda para Q3 en 4.13.0.
- OX: el botón `data-testid="index-toggle"` vive en Topbar (C1) y llama a `setRailOpen`. C4 no dibuja otro botón.
- OX: en W2 nadie edita `src/app/index.css`. El CSS de cada feature va en un archivo propio, dentro de `@layer components`.
- OX: `/` y Ctrl/Meta+K abren la paleta con `setPaletteOpen(true)` (C3). C1 no depende de `input[type="search"]`.
- OX: W1 integrada en `feat/t1-2909` con 43 tests en verde (A1→A2→A3).
- Q2: aria-live="polite" anuncia «ST36 Zúsānlǐ seleccionado» desde un nodo persistente en el pie de App; PointDrawer se desmonta al cerrar y no anunciaría el cambio.
- Q2: se borran --color-brass, --color-brass-line y --color-jade-ink; no había usos en src. Los botones de src/ui ya tenían min-height ≥ 44px.
- Q3: Esc en la ficha devuelve el foco al control que la abrió. PointDrawer se desmonta y, sin este retorno, el foco caía en el body.
- Q3: cada trazo de MeridianPaths lleva `data-meridian` y `data-hour` para comprobar que el reloj resalta LR en la lámina.
- Q3: el svg de la lámina es `role="group"` porque contiene botones. `role="img"` hacía que axe marcara nested-interactive. La clave, el scroller de regiones y el cuerpo de la ficha reciben tabIndex 0 para poder desplazarse con teclado.
- Q3: el sheet reserva la altura de `.app-foot` en `--foot-cover`. El pie sigue encima para el chip del reloj, y el botón de la ficha queda por encima de ese pie.
- Q3: `.atlas-stage` empieza bajo el título (4.5 rem en desktop, 8 rem en móvil) para que GV20 no se siente sobre «Cuerpo humano».
- Q3: el proyecto Playwright `reduced` solo corre `reduced.spec.ts`. Un `test.skip` en el otro proyecto marcaba el cometa como skipped en la suite completa.
