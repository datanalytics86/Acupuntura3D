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

## Lámina

- Un `<svg>` con viewBox. La figura (anterior / posterior) va dentro de ese SVG.
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
