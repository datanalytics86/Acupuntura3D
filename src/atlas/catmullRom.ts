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

export interface PathSample {
  x: number;
  y: number;
  /** Tangent angle in degrees, 0 = +x, clockwise on screen. */
  angle: number;
  /** Arc length from the first anchor, viewBox units. */
  s: number;
}

/**
 * Samples the same curve catmullRomPath draws, analytically (no DOM).
 * Used for flow chevrons, route labels, Qi timing and the skin test.
 */
export function samplePath(pts: Point2D[], step: number): PathSample[] {
  const d = catmullRomPath(pts, false);
  const nums = d.replace(/[MC,]/g, " ").trim().split(/\s+/).map(Number);
  if (nums.length < 8) return [];
  const fine: PathSample[] = [];
  let x0 = nums[0]!;
  let y0 = nums[1]!;
  let s = 0;
  let px = x0;
  let py = y0;
  for (let i = 2; i + 5 < nums.length; i += 6) {
    const [c1x, c1y, c2x, c2y, x3, y3] = nums.slice(i, i + 6) as [number, number, number, number, number, number];
    for (let j = i === 2 ? 0 : 1; j <= 32; j += 1) {
      const t = j / 32;
      const u = 1 - t;
      const x = u * u * u * x0 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x3;
      const y = u * u * u * y0 + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * y3;
      const dx = 3 * u * u * (c1x - x0) + 6 * u * t * (c2x - c1x) + 3 * t * t * (x3 - c2x);
      const dy = 3 * u * u * (c1y - y0) + 6 * u * t * (c2y - c1y) + 3 * t * t * (y3 - c2y);
      s += Math.hypot(x - px, y - py);
      px = x;
      py = y;
      fine.push({ x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI, s });
    }
    x0 = x3;
    y0 = y3;
  }
  if (step <= 0) return fine;
  const out: PathSample[] = [];
  let next = 0;
  for (const p of fine) {
    if (p.s >= next) {
      out.push(p);
      next += step;
    }
  }
  return out;
}

/** Total arc length of the drawn curve, viewBox units. */
export function pathLength(pts: Point2D[]): number {
  const all = samplePath(pts, 0);
  return all.length ? all[all.length - 1]!.s : 0;
}
