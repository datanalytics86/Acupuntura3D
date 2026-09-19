# Arquitectura — Acupuntura3D

## Principio
SPA 3D educativa. Cero backend en MVP. Toda la verdad vive en JSON versionado.

## Stack

- Vite + React + TypeScript (strict)
- Tailwind + componentes livianos (shadcn opcional)
- React Three Fiber + drei
- Zustand (punto seleccionado, capas, meridiano activo, reloj Qi, idioma)
- Deploy: Vercel static (`npm run build` → `dist`)

Por qué no Next.js en MVP: el canvas WebGL no necesita SSR y evita hidratación dolorosa. Se puede migrar después si hace falta SEO.

## Carpetas objetivo

```
src/
  app/                 # shell, providers
  scene/               # Canvas, lights, camera, body, points, meridians, qi
  ui/                  # topbar, drawer, search, filters, clock
  state/               # zustand stores
  data/                # loaders tipados
  lib/                 # curve, cun, color, i18n
public/
  models/body.glb
data/
  meridians.json
  acupoints.json
  extras.json
  schema/
```

## Sistema de coordenadas

- Y-up, unidades en metros, origen en pelvis/sacro
- Puntos: `{ x, y, z }` en espacio del mesh T-pose / A-pose fijo
- Laterality: L / R / C (línea media Ren/Du)
- Si el modelo cambia, los puntos se reanclan; no se hardcodean a un GLB accidental

## Capas visuales

1. Body (opacidad 0.35–0.7, x-ray suave)
2. Meridian tubes
3. Acupoint instances
4. Qi particles
5. Labels HTML/drei sólo para hover/selected (nunca 361 labels a la vez)

## Interacción

- Raycast sólo contra instanced points + tubes (no contra 50k triángulos del body si se puede evitar)
- Hover → halo + tooltip
- Click → select + fit camera + abrir drawer
- Filtro → dimmed del resto, no unmount masivo

## Qi

- CatmullRomCurve3 por meridiano (centripetal)
- Dirección clásica del canal, no física de fluidos
- Color Wu Xing; boost en hora circadiana del órgano
- Tiers: high / medium / low según devicePixelRatio y GPU

## Performance budget

- 60 fps desktop, 30 fps mobile sostenible
- Bundle JS gzip < 3 MB sin GLB
- GLB maniquí objetivo < 8 MB draco
- Instancing obligatorio para puntos
- No bloom caro en low tier

## Fuentes de datos (prioridad)

1. Nomenclatura OMS (Standard Acupuncture Nomenclature)
2. WHO Standard Acupuncture Point Locations (Western Pacific, 2008)
3. GB/T 12346 (nombres y localización)
4. Textos educativos originales en ES, con `source` y `confidence`

Proyectos de referencia técnica (no copiar assets con licencia dudosa):
- acu-master (Three.js)
- HBot / modelos Blender + GLTF
- BodyParts3D / Somakine (anatomía CC-BY, distinta de acupuntura)
