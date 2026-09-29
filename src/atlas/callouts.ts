import type { Point2D } from "@/types";

export type Side = "left" | "right";
type Rect = { l: number; t: number; r: number; b: number };

export interface CalloutInput {
  key: string;
  text: string;
  /** Every marker of this point on the plate, in viewBox units. Bilateral points pass both. */
  anchors: Point2D[];
  /** Label width in CSS px (see estimateLabelPx). */
  widthPx: number;
}

export interface Callout {
  key: string;
  text: string;
  side: Side;
  /** Marker the leader leaves from. */
  from: Point2D;
  /** End of the horizontal run, shared by the whole column. */
  bend: Point2D;
  /** Leader end. The label baseline sits here: text-anchor end on the left, start on the right. */
  to: Point2D;
  box: Rect;
}

export interface ColumnFrame {
  /** Visible plate, viewBox units (screen.visibleRect). */
  view: Rect;
  /** Horizontal extent of the figure, viewBox units. */
  figure: { l: number; r: number };
  /** viewBox units per CSS px. */
  k: number;
  sizePx?: number;
  rowPx?: number;
  gapPx?: number;
  runPx?: number;
  padPx?: number;
}

const MID = 400;

/** Outfit caps and digits ≈ 0.62em, hanzi 1em, space 0.3em. */
export function estimateLabelPx(text: string, sizePx: number): number {
  let em = 0;
  for (const ch of text) {
    if (ch === " ") em += 0.3;
    else if (ch.charCodeAt(0) > 0x2e80) em += 1;
    else em += 0.62;
  }
  return em * sizePx;
}

/** Keep order, stay as close as possible to the wished y: merge overlapping runs and centre them. */
function spread(wish: number[], row: number, top: number, bottom: number): number[] {
  type Run = { first: number; n: number; y: number };
  const runs: Run[] = [];
  const place = (r: Run) => {
    let sum = 0;
    for (let j = 0; j < r.n; j += 1) sum += wish[r.first + j]! - j * row;
    r.y = Math.min(Math.max(sum / r.n, top), Math.max(top, bottom - (r.n - 1) * row));
  };
  wish.forEach((_, i) => {
    const run: Run = { first: i, n: 1, y: 0 };
    place(run);
    runs.push(run);
    while (runs.length > 1) {
      const b = runs[runs.length - 1]!;
      const a = runs[runs.length - 2]!;
      if (a.y + a.n * row <= b.y) break;
      runs.pop();
      a.n += b.n;
      place(a);
    }
  });
  const ys: number[] = [];
  for (const r of runs) for (let j = 0; j < r.n; j += 1) ys.push(r.y + j * row);
  return ys;
}

/**
 * Anatomical-plate callouts: two label columns in the margins, one elbow leader per point.
 * Order is kept per column and every horizontal run ends at one shared bend x, so leaders never cross.
 * Returns null when a margin cannot hold its column: the caller falls back to hover labels.
 */
export function layoutMarginCallouts(items: CalloutInput[], frame: ColumnFrame): Callout[] | null {
  const { view, figure, k } = frame;
  const size = (frame.sizePx ?? 12) * k;
  const row = (frame.rowPx ?? 22) * k;
  const gap = (frame.gapPx ?? 14) * k;
  const run = (frame.runPx ?? 28) * k;
  const pad = (frame.padPx ?? 16) * k;

  const pickLeft = (it: CalloutInput) =>
    it.anchors.reduce<Point2D | null>((m, p) => (p.x <= MID && (!m || p.x < m.x) ? p : m), null);
  const pickRight = (it: CalloutInput) =>
    it.anchors.reduce<Point2D | null>((m, p) => (p.x >= MID && (!m || p.x > m.x) ? p : m), null);

  const sorted = [...items].sort(
    (a, b) => Math.min(...a.anchors.map((p) => p.y)) - Math.min(...b.anchors.map((p) => p.y)),
  );
  const cols: Record<Side, { it: CalloutInput; from: Point2D }[]> = { left: [], right: [] };
  let last: Side = "right";
  for (const it of sorted) {
    const l = pickLeft(it);
    const r = pickRight(it);
    let side: Side;
    if (l && !r) side = "left";
    else if (r && !l) side = "right";
    else if (!l && !r) continue;
    else if (cols.left.length !== cols.right.length) side = cols.left.length < cols.right.length ? "left" : "right";
    else side = last === "left" ? "right" : "left";
    last = side;
    cols[side].push({ it, from: side === "left" ? l! : r! });
  }

  const out: Callout[] = [];
  for (const side of ["left", "right"] as const) {
    const col = cols[side].sort((a, b) => a.from.y - b.from.y);
    if (col.length === 0) continue;
    const dir = side === "left" ? -1 : 1;
    const edge =
      side === "left"
        ? Math.min(figure.l, ...col.map((c) => c.from.x))
        : Math.max(figure.r, ...col.map((c) => c.from.x));
    const bendX = edge + dir * gap;
    const toX = bendX + dir * run;
    const widest = Math.max(...col.map((c) => c.it.widthPx)) * k;
    const outer = toX + dir * (4 * k + widest);
    if (side === "left" ? outer < view.l + pad : outer > view.r - pad) return null;
    const ys = spread(
      col.map((c) => c.from.y),
      row,
      view.t + pad + size,
      view.b - pad,
    );
    if (ys[ys.length - 1]! > view.b - pad + 0.5) return null;
    col.forEach((c, i) => {
      const y = ys[i]!;
      const w = c.it.widthPx * k;
      const textX = toX + dir * 4 * k;
      const l = side === "left" ? textX - w : textX;
      out.push({
        key: c.it.key,
        text: c.it.text,
        side,
        from: c.from,
        bend: { x: bendX, y: c.from.y },
        to: { x: toX, y },
        box: { l, r: l + w, t: y - size * 0.8, b: y + size * 0.25 },
      });
    });
  }
  return out;
}
