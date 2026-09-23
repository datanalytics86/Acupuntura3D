# AESTHETIC-8 — cuerpo impreso y escritorio

Veredicto: **PASS**. Lámina de archivo. No hace falta un segundo loop.

Base `6f40344`. Goran se queda (`body-anterior.png`, `body-posterior.png`), mismo encuadre (vértice 40, planta 1480, midline 400). Sin Canvas, sin R3F, sin 361 puntos nuevos, sin blob.

## Qué cambió la lectura

Cuerpo
- El PNG ya no va en `multiply` a placa entera. `fig-grade` lleva la luz hacia `#F3D7C0` y la sombra hacia oliva cálido. Un segundo pase, `fig-shade`, multiplica solo los oscuros.
- Washes: 8 anteriores y 8 posteriores (deltoides, pectoral, recto, vastos, gemelos, y el dorso equivalente). Salieron axila, ingle y ceja. No se leen como moretones.
- Plano púbico académico, con borde desvanecido. No es un parche recortado.
- Sombra de contacto bajo los pies: elipse `#6B4A36`, opacidad 0.17, `multiply`, solo en la región cuerpo. En rostro, mano y pie no se amplía con el zoom.
- Filete de alpha `#6B4A36` al 32%, radio 0.75. Calva de la placa: no hay peluca.

Fondo
- Desk `#E7DCC6`. Papel `#FBF7EE`. No son el mismo plano.
- Grano de escritorio al 5% (`baseFrequency` 0.75) y viñeta cálida. Grano de hoja al 4% (`baseFrequency` 1.15), dentro de la hoja.
- Hoja con margen, filete 1px y una sombra `rgba(28, 25, 21, 0.10)`.
- Running-head y reloj sobre el desk.

Tinta
- Meridianos idle 1.28px / hot 1.5px. Idle, hover y activo siguen siendo tinta y cinabrio `#8B1E1E`.
- Los rótulos no cubren la cara. ST36 abre 足三里.

## Qué se vio en el navegador

Escritorio 1440 y móvil 390, anterior, posterior, rostro, mano y pie. El desk se lee como mesa. La hoja es otra superficie. La figura ya no es un estampado sucio sobre crema plana. Regiones 1–4 siguen abriendo la misma placa.

## Límite

El dibujo sigue siendo la lámina sombreada de Goran tek-en. El encargo no era redibujar anatomía. El grade y el escritorio cambian cómo se apoya esa lámina, no el trazo de origen.

## QA

`npm.cmd run typecheck`, `npm.cmd test` (29, incluye `tests/skin.test.ts`) y `npm.cmd run build`: 0. `package.json` no trae `three`.
