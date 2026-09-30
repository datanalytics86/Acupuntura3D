# Decisiones T1 30.09

## D01 — Gates de hanzi en el baseline local

`probe-before` da 14 FAIL, no los 16 del diagnóstico Linux. `hanziFontPlate` y `hanziFontFolio` pasan porque `CSS.getPlatformFontsForNode` devuelve «Noto Serif SC ExtraLight», una fuente del sistema, junto a Outfit o Cormorant. El umbral no se toca. F1 sigue siendo obligatorio: el `<link>` de Google Fonts no llega a `dist/index.html`, y producción no puede depender de esa fuente del sistema. El PASS de entrega exige la familia servida por el `@font-face` autoalojado (pesos 500 y 600).

## D02 — Arranque de `fonts-hanzi.mjs` en Windows

El guard del §8.2 (`import.meta.url === file://${process.argv[1]}`) no dispara con rutas `C:\`. F1 lo sustituye por una comparación con `pathToFileURL`, sin cambiar la salida (dos woff2 y `hanzi-subset.txt`).

## D03 — Zoom acumulado y muestra de papel

Cuatro pulsaciones rápidas de `+` leían el zoom todavía en 1, así que el vuelo de 160 ms se quedaba en 1.15 y los rótulos de proximidad (umbral 1.6) no salían en 390. `zoomBy` acumula sobre un `aim` de módulo y `flyTo` lo conserva con `keepAim`. La rueda hace lo mismo. La franja de papel del e2e se mide en x = 0.18 de la lámina: x = 0.04 cae en el papel exterior `#F4EDDF`, no en `#FBF7EE`. El umbral (desviación ≤ 2, delta medio ≤ 8) no cambia.

## D04 — Minimapa móvil y rótulos dentro de la ventana

En menos de 768 px el anfitrión del minimapa estaba en `display: none`, y el e2e de zoom exige verlo. Cabe en la barra inferior a 20×40 px, fuera de la ventana. Los rótulos de proximidad medían el texto a 12 unidades de viewBox; en pantalla miden `12 × k`. `layoutCallouts` usa ese tamaño, prueba el lado interior si el exterior no cabe y, si hace falta, los desplaza para que la caja quede dentro de la ventana.
