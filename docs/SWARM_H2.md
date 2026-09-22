# SWARM H2 — holístico funcional

Resultado: PASS

¿Un extraño entiende y usa el atlas en 30 segundos? Sí. Acepta el aviso, ve la lámina, abre LI4 (合谷, Hégǔ y la precaución de embarazo), busca ST36 / zusanli / 足三里 y cae en ST36, filtra LU/ST/GV, pausa el Qi, mueve el reloj, cierra con Esc y cambia ES/EN sin textos rotos.

Prueba: `npm.cmd run dev -- --host 127.0.0.1 --port 5195` y Edge headless (CDP, 1440×900, perfil limpio). El HTML tras cargar trae `#legal-gate` y «Entiendo, entrar al atlas». Tras el click el nodo desaparece (`LegalModal` hace `return null`).

1. legal accept y `return null` — OK
2. `setAtlasView` (Anterior/Posterior) — OK
3. click punto → PointDrawer — OK (LI4: hanzi, pinyin, embarazo)
4. click dantian → CenterDrawer — OK (下丹田)
5. search ST36 / zusanli / 足三里 — OK, los tres abren ST36
6. rail LU / ST / GV — OK, la fila `is-on` sigue al click
7. play y slider `qiSpeed` — OK (Pausar Qi → Reproducir Qi; velocidad 2.5)
8. reloj cambia `clockHour` y QiFlow pone `acc = 0` al cambiar la hora — OK (`QiFlow.tsx` useOrganClock)
9. teclas 1–4 en App, bloqueadas si `#legal-gate` — OK (Mano no cambia con el aviso; después 2/3/4 sí)
10. Esc cierra selección — OK
11. `setLocale` ES/EN — OK (`lang`, título y placeholder; sin `undefined`)
12. topbar y play con min 44px — OK (header del topbar y «Pausar Qi» miden 44)

ST36 no tiene fila de precaución: `precautions` viene vacío en el seed. LI4 sí la muestra. No es un control roto.
