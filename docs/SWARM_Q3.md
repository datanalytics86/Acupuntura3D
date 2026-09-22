# SWARM Q3 — QAQC a11y / regresión

Resultado: PASS. Branch `swarm/q3`. Sin cambios de código: los seis ítems ya cumplían.

## lang
PASS. `index.html` abre con `lang="es"` (locale inicial del store). `src/app/App.tsx` (useEffect sobre `locale`) y `src/state/viewerStore.ts` (`setLocale`) asignan `document.documentElement.lang` con la misma regla `zh ? "en" : locale`, alineada con `t()` en `src/i18n/messages.ts`. No se duplicó lógica.

## focus
PASS. `src/app/index.css` conserva `:focus-visible { outline: 1px solid var(--color-cinnabar); outline-offset: 2px }` (y el mismo anillo en `input[type="range"]:focus-visible`). Ningún `<button>` pone `outline: none`. `outline-none` está solo en el `<aside>` de `PointDrawer.tsx` y `CenterDrawer.tsx` (`tabIndex={-1}`, foco programático), no en botones.

## heading
PASS. `src/ui/PointDrawer.tsx`: `<h2 className="hanzi">` renderiza `point.names.zh`. `src/ui/CenterDrawer.tsx`: `<h2 className="hanzi">` renderiza `center.zh`.

## console
PASS. Grep de `console.error` en `src/`: una sola coincidencia, `src/app/ErrorBoundary.tsx` dentro de `componentDidCatch` (solo tras un error). `src/main.tsx` y el módulo `App` no llaman `console.error` al importar ni al arrancar.

## legal-gate
PASS. `src/ui/LegalModal.tsx`: `disclaimerAccepted()` es true si `localStorage["acu3d.disclaimer.v1"] === "1"`. Entonces `open` nace en false y el componente hace `return null` (el overlay no queda montado). `accept()` escribe `"1"` y `setOpen(false)`, que desmonta `#legal-gate`.

## teclas
PASS. En `src/app/App.tsx` el listener de `keydown` retorna de inmediato si `document.getElementById("legal-gate")` existe, así que no corre atajos. Escape/Enter del aviso los atiende `LegalModal` y cierran el gate.

## estética
No tocada. Tokens en `index.css`: fondo `#f4efe4`, tinta `#1c1915`, acento `#8b1e1e`, radio 2px. `--color-brass` sigue pintado como tinta.
