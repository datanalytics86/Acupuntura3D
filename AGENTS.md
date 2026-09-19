# AGENTS.md — Acupuntura3D

Eres Grok Build / Grok Terminal trabajando en un atlas 3D educativo de acupuntura.

## Misión
Visualizador web del cuerpo humano con meridianos, puntos OMS e interacción.
Click en un punto abre ficha. El Qi se ve circulando por los meridianos.
Español primero. No es un dispositivo médico.

## Antes de codear
1. Lee README.md, docs/ARQUITECTURA.md y docs/MEGAPROMPT_GROK_TERMINAL.md.
2. Entra en Plan mode. No implementes F4 (361 puntos) en el primer ciclo.
3. Commits atómicos por fase. TypeScript estricto.

## Stack
Vite + React + TypeScript + Tailwind + Zustand
@react-three/fiber + @react-three/drei + three
Datos en JSON bajo data/. Sin backend en MVP.
Deploy estático a Vercel.

## Subagentes recomendados
- A1 scaffold/UI shell
- A2 data schema + seed
- A3 body viewer R3F
- A4 interacción + drawer
- A5 Qi VFX
- A6 QA + Vercel

Máximo 4–6 subagentes en paralelo. Worktrees si hay solapamiento de archivos.

## Reglas
- No inventar coordenadas 3D de los 361 puntos. Si no hay ancla confiable, va a unmapped[].
- No copiar texto de manuales con copyright. Nomenclatura OMS + resúmenes originales + fuente.
- No afirmar eficacia clínica. Disclaimer visible.
- No secretos ni API keys.
- `npm run dev` debe funcionar al cerrar cada fase.

## Definition of done por fase
F0: canvas + grid + schema compilando
F1: GLB o maniquí + 14 curvas
F2: 20 puntos estrella + ficha al click
F3: Qi animado con play/pause
F4: dataset expandido con confidence por punto
F5: search/filtros/móvil
F6: deploy Vercel + README de uso
