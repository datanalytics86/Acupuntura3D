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

### D06 · Un commit de arreglo
Q01, Q02, Q05, Q09 y A1-01…A1-09 comparten `Points2D`, `messages.ts` y `App`. Van en un solo commit, con el test que cubre cada uno. Partir el diff dejaría la suite rota entre commits.

### D07 · Radio de 22 px y sello
El toque elige el punto más cercano a 22 px o menos. Si el objetivo es un sello, el punto gana solo cuando está estrictamente más cerca. El círculo grande del sello no recibe eventos: así no tapa el centro del punto. El anillo sí recibe el clic del sello.

### D08 · Cluster solo en puntero grueso
Por debajo de 24 px CSS los puntos se agrupan. En puntero fino no hay cluster: el e2e de `point-ST36` a zoom 2.4 sigue viendo la marca.

### D09 · Peek de 190 px
El asa pasa de 22 px a 44 px. La altura del peek pasa de 168 px a 190 px para conservar la caja del hanzi. `snapHeight` usa 190 para no dejar el ancla bajo el asa.

### D10 · `aim`
`flyTo` cancela el frame y conserva `aim`, así varios «+» se apilan. `stopFlight`, `setAtlasPan` y `setAtlasZoom` ponen `aim` en null.

### D11 · Pista en la captura 01
`01-anterior` solo pulsa Enter. La pista «Toca un punto…» sale en esa captura y en ninguna otra: el siguiente teclado la descarta. Es el ticket de la heurística 10, no una regresión de lámina.

### D12 · Diff visual esperado
Además de la pista: botones de velocidad a 24 px, ⟲ y minimapa a 44 px en móvil, peek más alto, y clusters en móvil cuando dos marcas quedan a menos de 24 px. Cada uno tiene ticket (Q01, Q05, heurística 10).
