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

### D08 · Cluster a 24 px CSS
Los centros a menos de 24 px CSS se agrupan, también con puntero fino. En la portada de escritorio LI4 y SI3 comparten un halo y el círculo de SI3 tapaba a LI4. A zoom 2.4, ST36 y GB34 siguen separados: el e2e de `point-ST36` no pierde el `testid`.

### D09 · Peek de 190 px
El asa pasa de 22 px a 44 px. La altura del peek pasa de 168 px a 190 px para conservar la caja del hanzi. `snapHeight` usa 190 para no dejar el ancla bajo el asa.

### D10 · `aim`
`flyTo` cancela el frame y conserva `aim`, así varios «+» se apilan. `stopFlight`, `setAtlasPan` y `setAtlasZoom` ponen `aim` en null.

### D11 · Pista en la captura 01
`01-anterior` solo pulsa Enter. La pista «Toca un punto…» sale en esa captura y en ninguna otra: el siguiente teclado la descarta. Es el ticket de la heurística 10, no una regresión de lámina.

### D12 · Diff visual esperado
Además de la pista: botones de velocidad a 24 px en escritorio y 44 px por debajo de 1024 px, ⟲ y minimapa a 44 px en móvil, peek más alto, clusters cuando dos marcas quedan a menos de 24 px CSS (también en escritorio) y el círculo de golpe de cada sector del reloj. Cada uno tiene ticket (Q01, Q05, heurística 10).

### D13 · Rótulo fino a 28 px
Un rect de 24 px CSS mide 23.9 tras la transformación del SVG. El censo exige 24 en los dos ejes para usar la caja del grupo y, si no, se queda con el texto (HT7, 54×18). El objetivo fino pasa a 28 px. El paso entre rótulos es 22 px: la mitad de 28 no cubre el rótulo siguiente. En puntero grueso el objetivo sigue en 44 px.

### D14 · Marca cubierta no es botón
Si el punto que muestrea el censo cae sobre el cromo, la marca sigue dibujada y pierde `role="button"` hasta que ese punto queda libre. El grupo «4 puntos juntos» del dantian medio caía bajo el asa. El escenario no se encoge: el `<svg>` no es un `HTMLElement` y forzar la altura movería la lámina del 30.09. El contenedor de los sellos lleva `role="group"`: sin sellos expuestos, `aria-label` en un `<g>` sin rol es una violación serious de axe en el índice móvil.

### D15 · Reloj y ranuras con la ficha abierta
Cada sector es un grupo con un círculo de 44 px; el path conserva `data-sector` y `data-on`. Con la ficha abierta, el reloj y el minimapa se fijan en el borde superior de la ficha (`--sheet-top`, z-index 26) para que el botón de la ficha no los tape.
