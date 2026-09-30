# Arquitectura — Acupuntura3D

## Principio
Atlas 2D educativo. Cero backend. La lámina es SVG. Toda la verdad de puntos y meridianos vive en JSON versionado.

## Stack

- Vite + React + TypeScript (strict)
- Tailwind
- Zustand (punto seleccionado, capas, meridiano activo, vista, región, reloj Qi, idioma)
- Vista: SVG inline en `src/atlas/`
- Deploy: Vercel static (`npm run build` → `dist`)

SPA estática. La lámina no necesita SSR ni un servidor de aplicación.

## Carpetas

```
src/
  app/                 # shell
  atlas/               # Viewport SVG, lámina, meridianos, puntos, Qi
  ui/                  # topbar, drawer, search, rail, reloj, aviso legal
  state/               # zustand
  data/                # loaders tipados
  lib/
  i18n/
  types/
public/atlas/          # PNG anterior / posterior y previews
data/
  meridians.json
  acupoints.seed.json
  unmapped.json
  schema/
```

## Módulos del rediseño Tier 1

- `src/atlas/screen.ts` — pasa unidades del viewBox a píxeles de pantalla (`k`). Trazo, marca y rótulo se multiplican por `k`, así el tamaño en px no depende del zoom.
- `src/atlas/camera.ts` y `cameraKeys.ts` — zoom hacia el cursor, `flyTo`, teclas + − 0 y doble clic para resetear.
- `src/atlas/callouts.ts` — rótulos de margen. Si no caben, devuelve null (en una lámina de 350×500 no hay rótulos).
- `src/atlas/figure/PlateDefs.tsx` — filtro duotono `fig-duo` y defs de la lámina. `PlateFurniture.tsx` es el mobiliario de margen (folio, título, reloj, zoom, clave, minimapa, colofón).
- `src/atlas/figure/silhouette.ts` — contorno vectorial (anterior 1502 vértices, posterior 1560). El trazo va en px de pantalla (`1.1 × k`), no en unidades del viewBox. Lo regenera `npm run trace`.
- `src/atlas/regionAnatomy.ts` — encuadre de rostro, mano y pie por la anatomía visible, no por un rectángulo nominal que corte la cara o deje un pie fuera.
- `src/app/fonts.css` — Noto Serif SC 500 y 600, autoalojado (`npm run fonts`). Se importa en `main.tsx` antes de `index.css`.
- `src/lib/tokens.ts` — espejo de los tokens de `src/app/index.css` (papel, tinta, cinabrio).
- `src/ui/Sheet.tsx` — bottom sheet en menos de 1024 px (peek, half, full). El alto del pie se reserva para que la acción no quede bajo el reloj.
- `src/ui/CommandPalette.tsx` — paleta con `/` o Ctrl/Meta+K. El índice ya no filtra la búsqueda.
- `src/ui/QiClock.tsx` — reloj de órganos. En móvil es un chip; Esc cierra el dial.

## Lámina

La plancha es una grilla. La ventana (`data-testid="plate-window"`) recorta el SVG. El papel interior `#FBF7EE` continúa 12 px más allá del borde, así la sonda de costura (8 px fuera, 4 px dentro) lee el mismo tono. El papel exterior es `#F4EDDF`. Hay un grano por superficie. La viñeta no pinta la cabecera ni el pie.

- Un `<svg>` con viewBox. La figura (anterior / posterior) va dentro de ese SVG, como una imagen a dos tintas más el contorno.
- Meridianos: trazos. Qi: pulso sobre el trazo (play/pause/velocidad), color Wu Xing.
- Puntos: marcas 2D del seed. Son 20 puntos estrella, no 361. Click abre la ficha.
- Misma lámina en regiones: cuerpo, rostro, mano, pie.
- Pan y zoom mueven el viewBox.

## Interacción

- Hover y click sobre los puntos del SVG
- Click → ficha
- Anterior / Posterior cambia la lámina
- Búsqueda y filtro no desmontan la lámina

## Datos

Anclas 2D solo del seed, `confidence: low`. No hay 361 coordenadas. Lo que no está anclado no se inventa.

## Fuentes de datos (prioridad)

1. Nomenclatura OMS (Standard Acupuncture Nomenclature)
2. WHO Standard Acupuncture Point Locations (Western Pacific, 2008)
3. GB/T 12346 (nombres y localización)
4. Textos educativos originales en ES, con `source` y `confidence`

La figura de la lámina es la de Goran (CC BY-SA 4.0), adaptada. Ver `public/atlas/ATTRIBUTION.md`. No copiar láminas de manuales comerciales.
