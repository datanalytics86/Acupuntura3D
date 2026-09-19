# MEGAPROMPT — Acupuntura3D para Grok Terminal

Pega esto en Grok Terminal / Grok Build después de `cd` a la raíz del repo.
Usa `/plan` primero. No escribas código hasta aprobar el plan.

---

Primero ejecuta Plan mode y NO escribas código hasta que el plan esté aprobado.

## Misión

Construir un visualizador web 3D educativo del cuerpo humano con:

- 14 meridianos: LU LI ST SP HT SI BL KI PC TE GB LR GV CV
- 361 puntos clásicos OMS + 48 extra (EX-HN / EX-CA / EX-B / EX-UE / EX-LE) en fases posteriores
- Click o tap → ficha: código WHO, pinyin, hanzi, nombre ES/EN, localización, función tradicional, indicaciones educativas, precauciones
- Flujo de Qi visible (tubos + partículas/shaders a lo largo de curvas)
- Español primero; i18n EN/ZH después
- Deploy estático a Vercel

NO es un dispositivo médico. Disclaimer visible siempre. No diagnosticar. No afirmar eficacia clínica.

## Stack obligatorio

Vite + React + TypeScript + Tailwind + Zustand
React Three Fiber + @react-three/drei + three
Datos en JSON versionado (nunca hardcodear 361 puntos en componentes)
Modelo: GLB maniquí de acupuntura con licencia libre, o figura estilizada procedural si no hay GLB libre de calidad
Coordenadas: Y-up, metros, origen pelvis/sacro

## Agentes (divide-and-conquer)

Lanza subagentes en worktrees si tocan los mismos paths. Máximo 4–6 en paralelo.

- A0 ARCHITECT — scaffold Vite, carpetas, contratos TS, performance budget (60 fps desktop / 30 mobile, bundle JS gzip < 3 MB sin GLB)
- A1 DATA — types + JSON schema + meridians.json + seed de 20 puntos estrella
- A2 BODY — loader GLB, luces, orbit controls, material semitransparente, x-ray suave
- A3 POINTS — instanced spheres, raycast, highlight, camera focus
- A4 QI — CatmullRomCurve3, Tube + GPU points, color Wu Xing, dirección clásica, speed UI
- A5 UI — layout, drawer detalle, search, filtros meridian/elemento/región, sheet móvil
- A6 CONTENT — textos ES originales; campos `source` y `confidence`; nunca inventar contraindicaciones graves
- A7 QA-DEPLOY — scripts, README de uso, vercel.json, disclaimer, chequeo fps básico

Fases 0–2 se pueden paralelizar (A0+A1+A2). A3 depende de A2. A4 depende de A1+A2. A5 depende de A3.

## Fases

- F0 Scaffold + schema + hello canvas (grid + ejes). `npm run dev` debe verse.
- F1 Cuerpo + cámara + 14 curvas de meridiano sin exigir 361 puntos
- F2 20 puntos estrella clickables + panel:
  LI4, LU7, ST36, SP6, HT7, PC6, LR3, GB34, GB20, BL23, BL40, KI3, CV12, CV17, GV20, GV14, TE5, SI3, EX-HN3 (Yintang), EX-B1 (Dingchuan)
- F3 Qi flow animado + play/pause + velocidad + toggle por meridiano
- F4 Expandir dataset a 361. Mapping aproximado por región. Lo no confiable va a `unmapped[]`
- F5 Search, filtros, móvil, i18n EN
- F6 Deploy Vercel

## Contratos de datos

```ts
type Laterality = "L" | "R" | "C";
type Confidence = "low" | "medium" | "high";

interface Acupoint {
  id: string;
  code: string;           // LI4
  meridianId: string;     // LI
  index: number;
  names: { zh: string; pinyin: string; es: string; en: string };
  location: { anatomicEs: string; cunNote?: string };
  functions: string[];
  indications: string[];
  precautions: string[];
  element?: string;
  polaridad?: "yin" | "yang";
  laterality: Laterality;
  region: string;
  position?: { x: number; y: number; z: number };
  sources: string[];
  confidence: Confidence;
}

interface Meridian {
  id: string;
  code: string;
  names: { zh: string; pinyin: string; es: string; en: string };
  element?: string;
  polaridad?: "yin" | "yang";
  clockHour?: number;
  pointCodes: string[];
  pathAnchors: { x: number; y: number; z: number }[];
  color: string;
}
```

## UX obligatoria

- Canvas full-bleed + topbar (búsqueda, capas, idioma) + rail de meridianos + drawer de ficha + clock TCM inferior
- Hover: halo + tooltip (código + pinyin)
- Click/tap: selecciona, encuadra cámara, abre ficha
- Click en tubo de meridiano: resalta canal + lista de puntos
- Teclado: `/` busca, Esc cierra, flechas recorren puntos del meridiano activo
- Móvil: pinch-zoom, pan 2 dedos, drawer como bottom sheet
- Ficha: código, pinyin, hanzi, nombre ES, meridiano, elemento, localización, funciones, indicaciones educativas, precauciones, puntos combinados, botón “seguir el Qi”

## Qi (especificación VFX)

- Polyline ordenada de acupoints + waypoints de superficie
- `THREE.CatmullRomCurve3(points, false, "centripetal")`
- TubeGeometry radio 0.004–0.008 + glow aditivo
- Partículas: instanced mesh o Points + shader; `t = fract(uTime * speed + i / N)`
- Dirección: yin mano pecho→mano; yang mano mano→cabeza; yang pie cabeza→pie; yin pie pie→pecho; Ren y Du ascendentes según recorrido clásico
- Color Wu Xing: Madera #3D8B40, Fuego #E23B3B, Tierra #C4A35A, Metal #C0C8D0, Agua #2B6CB0
- Boost de intensidad en la hora circadiana del órgano
- Quality tiers: high = partículas GPU + bloom suave; medium = tubos animados; low = líneas
- No simular diagnóstico de Qi. Solo recorrido educativo.

## Reglas duras

- TypeScript estricto, componentes pequeños, commits atómicos por fase
- Sin secretos y sin backend en MVP
- Sin modelos o textos con licencia restrictiva o copyright comercial
- Si un punto no tiene coords confiables: `unmapped[]`. Prohibido inventar posición y marcarla `high`
- Nunca generar de memoria los 361 puntos en un solo dump
- Al terminar F0: `npm run dev` muestra canvas con grid
- Al terminar F2: un click en ST36 abre ficha real
- Al terminar F3: se ve Qi recorriendo al menos 1 meridiano
- Al terminar F6: URL de Vercel + disclaimer en pantalla

## Empieza

Empieza por F0. Propón el plan detallado de archivos, luego implementa sólo F0.

---
