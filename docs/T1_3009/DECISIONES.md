# Decisiones T1 30.09

## D01 — Gates de hanzi en el baseline local

`probe-before` da 14 FAIL, no los 16 del diagnóstico Linux. `hanziFontPlate` y `hanziFontFolio` pasan porque `CSS.getPlatformFontsForNode` devuelve «Noto Serif SC ExtraLight», una fuente del sistema, junto a Outfit o Cormorant. El umbral no se toca. F1 sigue siendo obligatorio: el `<link>` de Google Fonts no llega a `dist/index.html`, y producción no puede depender de esa fuente del sistema. El PASS de entrega exige la familia servida por el `@font-face` autoalojado (pesos 500 y 600).

## D02 — Arranque de `fonts-hanzi.mjs` en Windows

El guard del §8.2 (`import.meta.url === file://${process.argv[1]}`) no dispara con rutas `C:\`. F1 lo sustituye por una comparación con `pathToFileURL`, sin cambiar la salida (dos woff2 y `hanzi-subset.txt`).
