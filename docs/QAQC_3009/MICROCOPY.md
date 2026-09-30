# MICROCOPY — QAQC 30.09

Revisión de `src/i18n/messages.ts` sobre la base. Los cambios de este ciclo se anotan en el commit de arreglo. Paridad ES/EN: el test de i18n exige las mismas claves.

| Clave | Antes | Después | Motivo |
|---|---|---|---|
| `noMatches` | sin uso en la paleta | «Ningún punto coincide» / «No point matches» | Búsqueda vacía, sin punto final |
| `paletteEmpty` | frase distinta | la misma frase | Un solo texto de vacío |
| `firstHint` | — | «Toca un punto · / para buscar · ? ayuda» | Pista única de primer uso |
| `viewAnteriorTip` / `viewPosteriorTip` | — | «Vista anterior · de frente · A» / «Vista posterior · de espalda · P» | `title` del control |
| `regionBodyTip` y región | — | nombre de región + tecla | `title` |
| `atlasLabel` | texto fijo en el SVG | «Atlas corporal de meridianos» | El nombre accesible pasa por `t()` |
| `plateFailed` / `plateRetry` | — | la lámina no cargó + Reintentar | Error del PNG |
| `errorBody` / `errorRetry` | «Recargá la página» fuera de `t()` | infinitivo, las dos lenguas | ErrorBoundary |
| `glossaryTitle` y cuatro entradas | — | cun, dantian, yin/yang, Wu Xing | Glosario en la Ayuda |
| `liveView*` / `liveRegion*` | — | frases cortas para `aria-live` | Vista y región, sin spam de vuelo |

Criterio: español neutro, infinitivo en botones, inglés no literal, iconos con `aria-label` en las dos lenguas. No se reescribe la voz de la lámina del 30.09.
