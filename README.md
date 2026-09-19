# Acupuntura3D

Atlas 3D interactivo del cuerpo humano con meridianos, puntos de acupuntura (estándar OMS) y visualización educativa del flujo de Qi.

**Repositorio:** https://github.com/datanalytics86/Acupuntura3D

> Herramienta educativa. No es un dispositivo médico y no sustituye el criterio de un profesional de Medicina Tradicional China.

## Alcance

- Cuerpo humano 3D navegable (órbita, zoom, pan, táctil)
- 14 meridianos principales (12 regulares + Ren Mai + Du Mai)
- 361 puntos clásicos OMS + extras en fases posteriores
- Click/tap en un punto → ficha: código, pinyin, hanzi, significado, localización, funciones, precauciones
- Flujo de Qi animado a lo largo de cada meridiano
- Búsqueda y filtros por meridiano, elemento y región
- Interfaz en español primero; EN/ZH después

## Stack previsto

- Vite + React + TypeScript + Tailwind
- React Three Fiber + drei + Three.js
- Zustand para estado
- Datos en JSON versionado (`data/`)
- Deploy estático en Vercel

## Cómo arrancar el megaproyecto con Grok Terminal

1. Clona este repo.
2. Abre Grok Terminal / Grok Build en la raíz.
3. Entra a **Plan mode** (`/plan`).
4. Pega el bloque de [`docs/MEGAPROMPT_MAX.md`](docs/MEGAPROMPT_MAX.md) (desde `=== PEGAR DESDE AQUÍ ===` hasta `=== FIN ===`).
5. Aprueba solo F0. No implementes los 361 puntos en el primer paso.

## Documentación

- [Megaprompt MAX (pegar esto)](docs/MEGAPROMPT_MAX.md)
- [Megaprompt compacto](docs/MEGAPROMPT_GROK_TERMINAL.md)
- [Arquitectura](docs/ARQUITECTURA.md)
- [Estimación de esfuerzo](docs/ESTIMACION_HH.md)
- [AGENTS.md](AGENTS.md)

## Fases

| Fase | Entregable |
|------|------------|
| F0 | Scaffold + canvas + schema |
| F1 | Cuerpo 3D + 14 meridianos |
| F2 | ~20 puntos estrella clickables + ficha |
| F3 | Flujo de Qi |
| F4 | Dataset 361 + extras (mapping revisado) |
| F5 | Búsqueda, móvil, i18n |
| F6 | Deploy Vercel + QA |

## Licencia

Código: MIT. Textos educativos originales. Nomenclatura según estándares OMS. No copiar obras con copyright (p. ej. manuales comerciales de acupuntura).
