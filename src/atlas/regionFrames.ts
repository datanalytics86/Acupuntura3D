import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { loadAcupoints } from "@/data";
import { STAR_CODES } from "@/data/ids";
import type { AtlasRegion, AtlasView, Point2D } from "@/types";

/** Locked camera for a detail plate. Zoom stays under the atlas cap of 6. */
export function regionFrame(region: AtlasRegion, view: AtlasView): { pan: Point2D; zoom: number } {
  if (region === "face") {
    return { pan: { x: view === "posterior" ? 392 : 400, y: 156 }, zoom: 4.4 };
  }
  if (region === "hand") {
    return { pan: { x: view === "posterior" ? 198 : 172, y: 800 }, zoom: 4.5 };
  }
  if (region === "foot") {
    return { pan: { x: view === "posterior" ? 372 : 356, y: 1408 }, zoom: 5.6 };
  }
  return { pan: { x: 400, y: 800 }, zoom: 1 };
}

const FOCUS_MARGIN = 16;

/** ViewBox of a region frame: 800/zoom × 1600/zoom centred on its pan. */
function frameHolds(region: AtlasRegion, view: AtlasView, pos: Point2D): boolean {
  const frame = regionFrame(region, view);
  const hw = VIEW_W / frame.zoom / 2;
  const hh = VIEW_H / frame.zoom / 2;
  return Math.abs(pos.x - frame.pan.x) <= hw && Math.abs(pos.y - frame.pan.y) <= hh;
}

/**
 * Ellipse around every star point whose position2d falls inside the region frame
 * on either view. Radii include ≥ 16u so the point sits at least that far from the edge.
 */
function focusFor(region: "face" | "hand" | "foot"): { cx: number; cy: number; rx: number; ry: number } {
  const stars = new Set<string>(STAR_CODES);
  const pts: Point2D[] = [];
  for (const point of loadAcupoints()) {
    if (!stars.has(point.code)) continue;
    for (const view of ["anterior", "posterior"] as const) {
      const pos = point.position2d?.[view];
      if (pos && frameHolds(region, view, pos)) pts.push(pos);
    }
  }
  if (pts.length === 0) {
    const frame = regionFrame(region, "anterior");
    const pad = FOCUS_MARGIN * Math.SQRT2;
    return { cx: frame.pan.x, cy: frame.pan.y, rx: pad, ry: pad };
  }
  let minX = pts[0]!.x;
  let maxX = minX;
  let minY = pts[0]!.y;
  let maxY = minY;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const rx = ((maxX - minX) / 2 + FOCUS_MARGIN) * Math.SQRT2;
  const ry = ((maxY - minY) / 2 + FOCUS_MARGIN) * Math.SQRT2;
  return { cx, cy, rx, ry };
}

export const REGION_FOCUS: Record<AtlasRegion, { cx: number; cy: number; rx: number; ry: number } | null> = {
  body: null,
  face: focusFor("face"),
  hand: focusFor("hand"),
  foot: focusFor("foot"),
};
