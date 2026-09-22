# MEGAPROMPT SHIP — brechas reales post-swarm

Pegá en Grok 4.7 Terminal desde `=== PEGAR DESDE AQUÍ ===` hasta `=== FIN ===`.

=== PEGAR DESDE AQUÍ ===

# Acupuntura3D — SHIP multidisciplinario. Grok 4.7 Terminal. Sin parar.

Sos OX en Grok 4.7 Terminal / Grok Build. Repo `datanalytics86/Acupuntura3D`.
Rama de código bueno: **feat/atlas-2d** @ `4e023b4` o más nueva.
Rama rota para el usuario: **main** @ `f08ea05` (MVP 3D de cápsulas + docs).

Este bloque ES la aprobación. No preguntes. No Plan-wait. No reescribas la figura.

## 0. Hallazgos (ya verificados — no los debates)

1. El swarm G47 T1 CORRIÓ y dejó `feat/atlas-2d` con lámina 2D, 18 tests, H1/H2 PASS internos.
2. **Producción Vercel `https://acupuntura3d.vercel.app` apunta a `main` `f08ea05`.** Eso es el visor 3D de cápsulas. El usuario que abre el link oficial no ve el atlas 2D.
3. Los deploys de `feat/atlas-2d` @ `4e023b4` son PREVIEW (`target: null`) y el preview está SSO-protegido.
4. No existe PR `feat/atlas-2d` → `main`. PR #1 `chore/prod-readiness` es hardening del 3D: CERRARLA, no mergearla.
5. `AGENTS.md` y `docs/ARQUITECTURA.md` siguen describiendo R3F / Three.
6. Topbar usa i18n key `"tubes"` para la capa meridianos (resto 3D).
7. `public/models/` es leftover 3D vacío.
8. 361 puntos NO están. No los inventes. Seed = 20 + 3 dantian. `unmapped.json` = [].

## 1. Ley

- Cero Three / R3F / Canvas WebGL.
- Cero 361 coordenadas nuevas.
- Cero force-push.
- No rehacer Goran / washes / Encarta. El arte de feat/atlas-2d se SHIPEA, no se rediseña.
- Auto-approve tools. Effort xhigh.
- Máx 6 hijos. Depth=1. Worktrees si hay writers.

## 2. Roster

```
OX   padre
REL  release engineer     generalPurpose   git + gh + vercel
DOC  docs / copy          generalPurpose   AGENTS.md README ARQUITECTURA DEPLOY
HYG  higiene código       generalPurpose   i18n tubes, public/models, descripción
QA   verificación prod    bash+explore     typecheck test build + smoke URL
PM   cierre               explore          docs/SHIP_STATUS.md
```

## 3. Oleadas

W0 OX (2 min): `git checkout feat/atlas-2d && git pull`. Confirma HEAD ≥ `4e023b4`. Grep `three` en src y package.json = 0.

W1 paralelo:
- HYG: cambia LAYER_LABEL meridianos para no usar `"tubes"` (usa key `meridians` o agrega label limpio). Borra `public/models/` si no se referencia. Actualiza strings 3D residuales en UI (`coordenadas 3D`, quality, WebGL).
- DOC: reescribe `AGENTS.md` como atlas 2D (Vite/React/SVG/Zustand, rama feat/atlas-2d, no Plan-gate 3D). Parchea `docs/ARQUITECTURA.md` (stack 2D). README ya dice lámina 2D: sólo añade «main debe ser el atlas 2D». `docs/DEPLOY.md`: production branch = main DESPUÉS del merge; comando `npx vercel deploy --prod --yes` desde feat/atlas-2d si main aún no absorbió.

W2 REL (crítico, después de W1 mergeado):
1. Cierra PR #1 con comentario: «superseded by 2D atlas on feat/atlas-2d; do not merge 3D hardening».
2. Abre PR `feat/atlas-2d` → `main` título `feat: atlas 2D Encarta / paper cabinet` body con bullet: reemplaza el MVP 3D; 14 meridianos; 20 seed; sin R3F.
3. Mergea el PR a main (squash o merge commit, no rebase destructivo).
4. `npx vercel deploy --prod --yes` desde el commit mergeado O `vercel promote` del preview `4e023b4+` a production.
5. Confirma que un GET a `https://acupuntura3d.vercel.app` ya no carga three / WebGL y el HTML habla de lámina / Anterior / Entiendo.
6. Si Vercel Production Branch está en main, el merge basta + wait deploy. Si el alias sigue en el commit 3D, forzar promote.

W3 QA:
- `npm run typecheck && npm test && npm run build` en feat/atlas-2d (o main post-merge) exit 0.
- Grep: no `@react-three`, no `from "three"`, no WebGLGate.
- Lista invariantes: CV12=中腔, LI4/SP6 precaución, legal-gate se desmonta, 14 meridianos, 20 seed.
- Escribe evidencia en `docs/SHIP_STATUS.md`.

W4 PM: 9 líneas. URL prod. SHA de main. PR número. Qué NO se hizo (361, rediseño figura).

## 4. Commits

- `fix(ui): capa meridianos sin key tubes`
- `docs: AGENTS y arquitectura atlas 2D`
- `chore: cierra leftover public/models`
- `docs: SHIP_STATUS`

Luego el merge PR a main (mensaje del PR).

## 5. Anti-patrones

- Redeclarar T1 estético y reabrir Figure.tsx
- Mergear PR #1
- Inventar position2d de 361 puntos
- Dejar prod en main 3D
- Preview SSO como «solución» (el humano usa acupuntura3d.vercel.app)

## 6. Arrancá

Checkout feat/atlas-2d. Spawn HYG+DOC. Luego REL. Luego QA. No pares hasta que acupuntura3d.vercel.app sirva el atlas 2D.

=== FIN ===
