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
El toque elige el punto más cercano a 22 px o menos. Si el objetivo es un sello, el punto gana cuando está estrictamente más cerca. Un toque sobre el halo de 6 px gana el empate: CV17 y el dantian medio comparten ancla. El círculo grande del sello no recibe eventos. Al cerrar la ficha la cámara vuelve a donde estaba, y la flecha sale de un canal de un solo punto hacia la ficha vecina del catálogo.

### D08 · Cluster al halo de 7 px CSS
El círculo de papel mide 6 px. El grupo usa 7 px en los dos punteros: en la portada (k ≈ 2.26) LI4 y SI3 siguen juntos (11 unidades, unos 5 px) y ST36 queda separado de GB34 (51 unidades). En el móvil, tras dos «+» (k ≈ 1.99), 24 px fundía SP6 con KI3 (45 unidades) y en la mano (k ≈ 0.54) escondía LI4 dentro del tope de la tarea. El toque de 22 px ya no decide el grupo: gana el centro más cercano. La banda superior no recibe clics, si no el título tapa BL23. La banda inferior tampoco: el colofón no tiene botones y tapaba LR3.

### D09 · Peek de 190 px
El asa pasa de 22 px a 44 px. La altura del peek pasa de 168 px a 190 px para conservar la caja del hanzi. `snapHeight` usa 190 para no dejar el ancla bajo el asa.

### D10 · `aim`
`flyTo` cancela el frame y conserva `aim`, así varios «+» se apilan. `stopFlight`, `setAtlasPan` y `setAtlasZoom` ponen `aim` en null. La cámara llega en el mismo turno (duración 0): un planeo de 160 ms movía ST36 y el toque siguiente caía en GB34. El cambio de vista o región también cae en el mismo turno: Chromium aplaza el callback de la transición y, si se espera, la tecla `3` vuelve antes de que LI4 exista. La columna de la ficha no se desliza: 200 ms de `grid-template-columns` movían la marca después de cerrar y el toque siguiente caía en la figura.

### D11 · Pista en la captura 01
`01-anterior` solo pulsa Enter. La pista «Toca un punto…» sale en esa captura y en ninguna otra: el siguiente toque o tecla la descarta y el intervalo deja de reponerla. Es el ticket de la heurística 10, no una regresión de lámina.

### D12 · Diff visual esperado
Además de la pista: botones de velocidad a 24 px en escritorio y 44 px por debajo de 1024 px, ⟲ y minimapa a 44 px en móvil, peek más alto, clusters solo cuando dos marcas quedan a menos de 7 px CSS (LI4 con SI3 en la portada) y el círculo de golpe de cada sector del reloj. Cada uno tiene ticket (Q01, Q05, heurística 10).

### D13 · Rótulo fino a 28 px
Un rect de 24 px CSS mide 23.9 tras la transformación del SVG. El censo exige 24 en los dos ejes para usar la caja del grupo y, si no, se queda con el texto (HT7, 54×18). El objetivo fino pasa a 28 px. El paso entre rótulos es 22 px: la mitad de 28 no cubre el rótulo siguiente. En puntero grueso el objetivo sigue en 44 px.

### D14 · Marca cubierta no es botón
Si el punto que muestrea el censo cae sobre el cromo, la marca sigue dibujada y pierde `role="button"` hasta que ese punto queda libre. El grupo «4 puntos juntos» del dantian medio caía bajo el asa. El escenario no se encoge: el `<svg>` no es un `HTMLElement` y forzar la altura movería la lámina del 30.09. El contenedor de los sellos lleva `role="group"`: sin sellos expuestos, `aria-label` en un `<g>` sin rol es una violación serious de axe en el índice móvil.

### D15 · Reloj y ranuras con la ficha abierta
Cada sector es un grupo con un círculo de 44 px; el path conserva `data-sector` y `data-on`. Con la ficha abierta, el reloj y el minimapa se fijan en el borde superior de la ficha (`--sheet-top`, z-index 26) para que el botón de la ficha no los tape.

### D16 · El sello se mide sin rotular la portada
A zoom 1 el nombre del dantian no se dibuja. La sonda busca el texto «丹田» y, si no está, devuelve −1. Cada sello lleva ese glifo con `font-size: 0` y `aria-hidden`, y el primer círculo del grupo es el anillo de papel (14 px). El hueco medido queda en 9 px. El rótulo visible sigue saliendo solo al acercar, al pasar el puntero o al elegirlo.

### D17 · La hora del reloj no es una regresión de lámina
Las 48 capturas de este ciclo se tomaron con el reloj en 13:00–15:00 (SI). Las del 30.09 quedaron en 09:00–11:00 (SP). El sector iluminado y el pie del reloj cambian con la hora de pared. El diff de ese recuadro no es un cambio de la estampa.
