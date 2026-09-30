# SIGN_OFF — QAQC 30.09

```
ID: A1
STATUS: PASS
TICKETS: A1-01…A1-09 cerrados · A1-10 documentado
CHANGED: docs/QAQC_3009/A1.md
TESTS: tests/paperTransition.test.ts tests/schema.test.ts tests/controls.test.ts
CHECKS: knip=exports de dominio madge=0 audit=0
NOTE: Los cuatro S1 de código quedaron cerrados en 447c74b.
```

```
ID: A2
STATUS: PASS
TICKETS: ninguno
CHANGED: docs/QAQC_3009/A2.md docs/QAQC_3009/after/census.json
TESTS: scripts/qa/census.mjs
CHECKS: dead=0 clickFailed=0 errors=0 unnamed=0 covered=0 smallTarget=0 overflowAfter=0 total=214
NOTE: El control se anota en el primer contexto que lo muestra.
```

```
ID: A3
STATUS: PASS
TICKETS: ninguno nuevo
CHANGED: docs/QAQC_3009/A3.md
TESTS: e2e/tasks.spec.ts scripts/qa/axe-all.mjs
CHECKS: axe serious=0 zoom400 sin overflow
NOTE: Un solo h1 expuesto.
```

```
ID: A4
STATUS: PASS
TICKETS: UX-01 cerrado
CHANGED: docs/QAQC_3009/A4.md
TESTS: e2e/tasks.spec.ts
CHECKS: doce tareas dentro del tope
NOTE: La nota la confirma J1.
```

```
ID: A5
STATUS: PASS
TICKETS: Q08 documentado
CHANGED: docs/QAQC_3009/A5.md
TESTS: scripts/qa/health.mjs
CHECKS: health=18/18 dos veces
NOTE: Los gates coinciden. El heap se mueve bajo el 20 %.
```

```
ID: V1
STATUS: PASS
TICKETS: —
CHANGED: docs/QAQC_3009/after/
TESTS: typecheck vitest build budget e2e×3 health×2 axe census probe
CHECKS: 105/105 e2e 21+2 probe 18/18
NOTE: Bundle index-CTIhc3pc.js.
```

```
ID: V2
STATUS: PASS
TICKETS: D11 D17 UX-01 Q05 D09 D15
CHANGED: docs/QAQC_3009/shots/
TESTS: comparación de 48 JPG contra docs/T1_3009/shots/after
CHECKS: cada diff tiene ticket
NOTE: La figura y el color de la estampa no cambian. El reloj sigue la hora de pared.
```

```
ID: J1
STATUS: PASS
TICKETS: —
CHANGED: docs/QAQC_3009/J1.md
TESTS: e2e/tasks.spec.ts
CHECKS: nota=94 heurísticas=4
NOTE: Doce tareas dentro del tope y cero callejones.
```

```
ID: J2
STATUS: PASS
TICKETS: —
CHANGED: docs/QAQC_3009/J2.md
TESTS: paperTransition pointStep coarseHit
CHECKS: G1–G8
NOTE: Los tres tests fallan sin el arreglo y pasan al restaurar.
```
