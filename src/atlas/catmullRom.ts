import type { Point2D } from "@/types";

function dist(a: Point2D, b: Point2D): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function pointAt(pts: Point2D[], i: number, closed: boolean): Point2D {
  const n = pts.length;
  if (closed) return pts[((i % n) + n) % n]!;
  if (i < 0) return pts[0]!;
  if (i >= n) return pts[n - 1]!;
  return pts[i]!;
}

/** Centripetal Catmull–Rom → cubic Bézier SVG path. */
export function catmullRomPath(pts: Point2D[], closed = false): string {
  if (pts.length < 2) return "";
  const n = pts.length;
  const segs = closed ? n : n - 1;
  let d = `M ${pts[0]!.x.toFixed(1)} ${pts[0]!.y.toFixed(1)}`;
  for (let i = 0; i < segs; i += 1) {
    const p0 = pointAt(pts, i - 1, closed);
    const p1 = pointAt(pts, i, closed);
    const p2 = pointAt(pts, i + 1, closed);
    const p3 = pointAt(pts, i + 2, closed);
    const d1 = Math.max(dist(p0, p1), 1e-3);
    const d2 = Math.max(dist(p1, p2), 1e-3);
    const d3 = Math.max(dist(p2, p3), 1e-3);
    const t1 = Math.sqrt(d1);
    const t2 = Math.sqrt(d2);
    const t3 = Math.sqrt(d3);
    const c1x = p1.x + ((p2.x - p0.x) * t2) / (3 * (t1 + t2));
    const c1y = p1.y + ((p2.y - p0.y) * t2) / (3 * (t1 + t2));
    const c2x = p2.x - ((p3.x - p1.x) * t2) / (3 * (t2 + t3));
    const c2y = p2.y - ((p3.y - p1.y) * t2) / (3 * (t2 + t3));
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  if (closed) d += " Z";
  return d;
}

export function anchorsToPath(pts: Point2D[]): string {
  return catmullRomPath(pts, false);
}
