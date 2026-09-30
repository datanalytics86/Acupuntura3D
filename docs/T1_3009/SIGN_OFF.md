# Firmas T1 30.09

```
ID: F1
STATUS: PASS
CLOSES: V01
CHANGED: scripts/fonts-hanzi.mjs, src/assets/fonts/*, src/app/fonts.css, src/main.tsx, index.html, vercel.json, tests/fonts.test.ts, e2e/atlas.spec.ts, README.md
CHECKS: typecheck=pass test=72/72 build=pass fonts=3/3 googleapis=0
METRIC: woff2 12816 y 12872 bytes, 67 hanzi
BROKEN: none
NOTE: Pesos 500 y 600. Commit a209f7e.
```

```
ID: F3
STATUS: PASS
CLOSES: V06 V07 V12
CHANGED: Figure.tsx, silhouette.ts, trace-silhouette.mts, PlateDefs.tsx, regionAnatomy.ts, regionFrames.ts, viewerStore.ts, tests, previews, ATTRIBUTION.md
CHECKS: typecheck=pass test=74 build=pass
METRIC: vértices 1502 / 1560, sombra #D3B08D, fitRegion zoom 4.285–6
BROKEN: none
NOTE: Contorno en chunk aparte (14.25 kB gzip). Commit c529459.
```

```
ID: F2
STATUS: PASS
CLOSES: V02 V03 V04 V05 V13 V18 V19
CHANGED: AtlasRoot, PlateFurniture, PlateTitle, plate.css, Minimap, ZoomControls, index.css, shell.css, messages.ts
CHECKS: typecheck=pass test=69 build=pass probe=seam, headFoot, overlaps, figure shares
METRIC: seamDelta=0 headFootDelta=0 overlaps=0 figureShareDesktop=0.71 figureShareMobile=0.65
BROKEN: none
NOTE: D/I quedan para T2. Commit a789085.
```

```
ID: T1
STATUS: PASS
CLOSES: V08 V09
CHANGED: src/atlas/MeridianPaths.tsx
CHECKS: typecheck=pass test=88 build=pass probe=idleRouteLabels
METRIC: idleRouteLabels=1
BROKEN: none
NOTE: Reposo sin casillas ni chevrones. El cometa solo con hora o meridiano activo.
```

```
ID: T2
STATUS: PASS
CLOSES: V10 V11 V14
CHANGED: src/atlas/Points2D.tsx, DantianMarks.tsx, centers.ts, tests/callouts.test.ts, tests/labels.test.ts
CHECKS: typecheck=pass test=89 build=pass probe=zoomLabelCoverage,dantianGap,orientation
METRIC: zoomLabelCoverage=1 dantianGapPx=9 orientationGapPx=32
BROKEN: none
NOTE: D04. En zoom 390 la muñeca comparte fila; el texto no sale de la ventana.
```

```
ID: U2
STATUS: PASS
CLOSES: V16 V17
CHANGED: src/ui/QiClock.tsx, clock.css, tests/clock.test.ts
CHECKS: typecheck=pass test=88 build=pass e2e=un sector con fill
METRIC: un path[data-on=true]
BROKEN: none
NOTE: Play desactivado con movimiento reducido.
```

```
ID: U1
STATUS: PASS
CLOSES: V22 V23
CHANGED: src/ui/Topbar.tsx, topbar.css, messages.ts
CHECKS: typecheck=pass probe=headerAccent,mobileBrand
METRIC: headerAccentText=0 mobileBrandTruncated=false
BROKEN: none
NOTE: titleShort «针 Enciclopedia». El h1 sigue siendo el título largo.
```

```
ID: U3
STATUS: PASS
CLOSES: V20 V21
CHANGED: PointDrawer.tsx, CenterDrawer.tsx, folio.css, sheet.css, tests/sheet.test.ts
CHECKS: typecheck=pass test=88 e2e=peek
METRIC: sheetPeekShowsHanzi=true
BROKEN: none
NOTE: La barra de acciones no intersecta .app-foot.
```

```
ID: U4
STATUS: PASS
CLOSES: V15 V23 V24
CHANGED: MeridianRail.tsx, rail.css, HelpDialog.tsx
CHECKS: typecheck=pass probe=figureShareMobile e2e=foco tinta
METRIC: figureShareMobile=0.65
BROKEN: none
NOTE: El foco de #legal-gate es tinta, no cinabrio.
```

```
ID: Q1
STATUS: PASS
CLOSES: V04 V11 V21 V24
CHANGED: package.json, .github/workflows/ci.yml, e2e/atlas.spec.ts, viewerStore.ts, plate.css, Points2D.tsx
CHECKS: typecheck=pass test=89/89 build=pass budget=pass e2e=3×17
METRIC: dist=4560575 jsGzip=102752 cssGzip=11800
BROKEN: none
NOTE: Greps de muerte en 0.
```

```
ID: Q2
STATUS: PASS
CLOSES: gates 18/18
CHANGED: docs/T1_3009/probe-after.json, docs/T1_3009/shots/after
CHECKS: probe=18/18 shots=48
METRIC: ver probe-after.json
BROKEN: none
NOTE: Muñeca en zoom 390 comparte fila. Sin veto.
```

```
ID: H1
STATUS: PASS
CLOSES: arte
CHANGED: docs/T1_3009/H1.md
CHECKS: promedio=9.08 min=8.6 vetos=0 gates=18
METRIC: 9.08
BROKEN: none
NOTE: Independiente del código de la plancha. El bucle de rótulos quedó cerrado antes de la firma.
```

```
ID: H2
STATUS: PASS
CLOSES: producto 16×2
CHANGED: docs/T1_3009/H2.md
CHECKS: e2e=3× verde probe=zoomLabelCoverage,sheetPeek
METRIC: 16×2 OK
BROKEN: none
NOTE: La tarea 5 en 390 mantiene el contrato de columna estrecha.
```

```
ID: W5
STATUS: PASS
CLOSES: producción
CHANGED: docs/T1_3009/probe-prod.json
CHECKS: hash=index-DycVfQG7.js probe-prod=18/18
METRIC: merge 2c8604a
BROKEN: none
NOTE: https://acupuntura3d.vercel.app. Sin revert.
```
