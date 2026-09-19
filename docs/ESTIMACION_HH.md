# Estimación de esfuerzo — Acupuntura3D

Estimación en horas-hombre (HH) de un perfil full-stack + 3D web, con Grok Terminal acelerando código pero **no** el curado anatómico.

## Resumen

| Entregable | HH | Calendario 1 persona + Grok Terminal |
|---|---:|---|
| Repo + docs (hecho) | 2–4 | hecho |
| Deploy vacío / hello-world Vercel | 4–8 | medio día |
| Solo publicar un MVP que ya compile | 2–6 | horas |
| **MVP usable** (cuerpo + 14 meridianos + ~20–80 puntos + click + Qi básico + Vercel) | **80–120** | **2–3 semanas** |
| **v1 completa** (361 + extras + textos + Qi pulido + search + i18n + móvil) | **280–420** | **2–3 meses** |
| v2 (2 cuerpos, AR, validación clínica, performance nativa) | 700–1000 | 6+ meses |

## Desglose MVP (80–120 HH)

| Módulo | HH |
|---|---:|
| Scaffold Vite/React/TS/Tailwind + CI mínimo | 4–8 |
| Viewer 3D (cámara, luces, maniquí/GLB, materials) | 12–20 |
| Schema + seed meridianos + 20 puntos estrella | 8–14 |
| Raycast, selección, cámara focus, drawer ficha | 12–18 |
| Qi flow (curvas + tubos + partículas + UI velocidad) | 16–28 |
| UI search/filtros/capas (versión MVP) | 10–16 |
| Disclaimer, i18n base ES, pulido móvil | 8–12 |
| QA + deploy Vercel | 4–8 |
| Buffer integración / regresiones 3D | 6–10 |

## Por qué no es un fin de semana

El cuello de botella **no** es Three.js. Es:

1. Anclar cada punto al mesh con lógica *cun* / landmarks (OMS 2008 / GB/T 12346).
2. Escribir textos educativos sin copiar obras protegidas y sin inventar contraindicaciones.
3. Que 361 esferas + 14 sistemas de partículas corran a 30–60 fps en móvil.
4. UX táctil (hit areas, drawer, cámara) sobre un cuerpo denso de puntos.

Grok Terminal puede recortar 50–70% del tiempo de boilerplate y shaders. No recorta la revisión anatómica.

## Deploy

Cuando el build estático exista:

- Conectar repo a Vercel: ~30–60 min
- Ajustar headers, asset GLB, fallback SPA: 1–3 HH
- QA producción (WebGL, móvil Safari, peso del modelo): 1–2 HH

**Total deploy puro: 2–6 HH.**

## Aceleración realista con Grok Terminal

- F0–F3 (producto demo convincente): 25–45 HH de calendario humano de revisión + agentes
- F4 (361 puntos): sigue siendo 80–150 HH si se quiere confianza media/alta
- No prometer 361 puntos clínicamente anclados en 48 horas
