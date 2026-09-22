# SWARM H1 — portfolio T1, segundo pase

Resultado: PASS

El único FAIL previo era el rostro posterior: GV14 大椎 y EX-B1 定喘 se pisaban y se leían `EX-B1V定喘椎`. Eso entra en un portfolio de producto T1. Commit 76992e7.

`layoutCallouts` ordena de fuera hacia la línea media. Descarta una caja si invade otra con 4px de aire o si tapa la cabeza (`HEAD`, del vértex a la barbilla). Si ninguna candidata vale, se queda en el sitio; en este encuadre ninguna caja cae a ese fallback.

`tests/labels.test.ts` pasa (vitest, 1 test). Las semillas son las coordenadas reales tras `placeLabel`, no un caso inventado: EX-B1 a (364, 260.8) y (436, 260.8), anclas end/start; GV14 a (400, 248), ancla middle. Las tres cajas quedan a ≥4px y en orden izquierda, centro, derecha.

En la lámina (posterior, región face, pan 392×156, zoom 4.4, ambos lados) también entran GB20 风池 y GV20 百会. Seis cajas. Hueco mínimo medido: 8.6px, entre el borde derecho de EX-B1 izquierdo (x=364) y el borde izquierdo de GV14 (x=372.6). El texto ya no comparte eje.

No queda rótulo ilegible. No hay pill de radio 999 ni gradiente: el chrome usa radio 0 o 2px. El único acento es cinabrio `#8B1E1E`; el resto de canales es tinta `#1C1915`. No hay viñeta negra: el rect del viewport es papel y `body-posterior.png` es RGBA, espalda reconocible, no blob ni posterior volteado.

Papel `#F4EFE4`, radio 2px y Cormorant + Outfit siguen como en el pase anterior. No se reabre esa lista.

Prueba: `npm.cmd test -- tests/labels.test.ts` en verde. `http://127.0.0.1:5180/` respondió 200; no se relanzó el servidor.
