# DECISIONES — QAQC 30.09

### D00 · Base
`origin/main` contiene `docs/T1_3009/SIGN_OFF.md`. BASE = `origin/main`, TARGET = `main`. Rama `qa/qaqc-3009` en `7142b97`.

### D01 · `npm ci` no se repitió
`node_modules` ya estaba instalado y el lockfile no cambia en este ciclo. La suite de la base (typecheck, 89 tests, build) pasó antes de los arreglos.

### D02 · La preview de la base es el build de producción
`vite preview` en el puerto 4173 sirve `assets/index-DycVfQG7.js`, el mismo hash que https://acupuntura3d.vercel.app en el momento de la medición. No se levantó un segundo servidor.

### D03 · Axe de la base
`baseline/axe.json` tiene 10 violaciones `serious`, todas `target-size` en `.qi-speeds > button` (desktop, 10 contextos). Cero `critical`. El proceso salió en 1 porque el gate es rojo, no porque faltara el JSON.

### D04 · Q08 no se persigue por debajo del gate
El heap crece 11,1 % con umbral 20 %. A1 no encontró un listener retenido. Bajar el umbral o reescribir el vuelo no cierra un S1/S2.

### D05 · Knip
12 exports y 14 tipos sin uso externo. Cero archivos muertos, cero dependencias muertas, cero ciclos (madge), `npm audit --omit=dev` en 0. No se borran tipos de dominio ni helpers que son API del módulo.
