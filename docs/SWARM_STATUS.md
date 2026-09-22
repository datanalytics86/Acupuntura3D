# SWARM STATUS — Grok 4.7, producto T1

Branch: `feat/atlas-2d`. Base de código `8254554`, más el megaprompt `791779e`. main no se tocó.

PASS global: cuerpo ilustrado, página de papel, 12 controles, typecheck + 18 tests + build en 0, H1 T1 estético, H2 T1 funcional.

## Cards

ROL=E1
PASS
CHANGED=public/atlas/preview-anterior.svg, public/atlas/ATTRIBUTION.md
PROOF=Placas distintas. Cuello, cintura, rodillas, empeine y pulgar. Posterior con espalda y gemelos, sin volteo.
BLOCKER=none

ROL=E2
PASS
CHANGED=src/atlas/MeridianPaths.tsx, Points2D.tsx, QiFlow.tsx, DantianMarks.tsx, src/lib/colors.ts
PROOF=Meridiano 1.1–1.6px, acento #8B1E1E, Qi sin disco. Segundo pase: GV14 y EX-B1 separados (≥4px, medido 8.6px).
BLOCKER=none

ROL=E3
PASS
CHANGED=src/app/index.css
PROOF=Fondo #F4EFE4, tinta #1C1915, acento #8B1E1E, radio 2px, una sombra en la hoja, botones de barra a 44px.
BLOCKER=none

ROL=UX
PASS
CHANGED=src/ui/*, src/atlas/Viewport.tsx, src/state/viewerStore.ts
PROOF=Los 12 controles responden. El aviso aceptado desmonta #legal-gate. Búsqueda 足三里 abre ST36.
BLOCKER=none

ROL=Q1
PASS
CHANGED=data/acupoints.seed.json, tests/skin.test.ts, tests/pngAlpha.ts, docs/SWARM_Q1.md
PROOF=21/21 muestras sobre la piel (≤12px). CV12 中脘. LI4 y SP6 con precaución de embarazo. unmapped [].
BLOCKER=none

ROL=Q2
PASS
CHANGED=docs/SWARM_Q2.md
PROOF=typecheck 0, test 0, build 0. Sin three ni src/_legacy. Rebuild tras el pase de rótulos: build 0, 18 tests.
BLOCKER=none

ROL=Q3
PASS
CHANGED=docs/SWARM_Q3.md
PROOF=lang sincronizado, :focus-visible en cinabrio, h2 en los drawers, console.error solo en ErrorBoundary, el aviso no tapa el canvas tras aceptar.
BLOCKER=none

ROL=H1
PASS
CHANGED=docs/SWARM_H1.md
PROOF=Entra en un portfolio T1. El choque del cuello posterior quedó resuelto.
BLOCKER=none

ROL=H2
PASS
CHANGED=docs/SWARM_H2.md
PROOF=Un extraño acepta el aviso, abre LI4 con precaución, busca ST36, pausa el Qi y cierra con Esc.
BLOCKER=none
