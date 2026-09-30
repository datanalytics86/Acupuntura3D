import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { fitRegion, REGION_ANATOMY, type Box } from "@/atlas/regionAnatomy";
import { unitsPerPx, visibleRect, type PlateBox } from "@/atlas/screen";
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

/** Same air as fitRegion. A limb and its mirror stay two islands. */
const AIR = 0.12;

/** Desktop drawing window until Viewport measures the plate. */
const FALLBACK_PLATE: PlateBox = { w: 1072, h: 709 };

let measuredPlate: PlateBox = { w: 0, h: 0 };

export function noteRegionPlate(box: PlateBox): void {
  measuredPlate = box;
}

function plateWindow(): PlateBox {
  return measuredPlate.w > 0 && measuredPlate.h > 0 ? measuredPlate : FALLBACK_PLATE;
}

function grow(box: Box, air: number): Box {
  const dx = (box.r - box.l) * air;
  const dy = (box.b - box.t) * air;
  return { l: box.l - dx, t: box.t - dy, r: box.r + dx, b: box.b + dy };
}

function mirrorBox(box: Box): Box {
  return { l: VIEW_W - box.r, t: box.t, r: VIEW_W - box.l, b: box.b };
}

function holds(box: Box, pos: Point2D): boolean {
  return pos.x >= box.l && pos.x <= box.r && pos.y >= box.t && pos.y <= box.b;
}

/**
 * Detail plates are a portrait frame inside a wide stage. Membership is the
 * visible window of the fitted camera (meet), so both feet stay on the foot
 * plate. A limb and its mirror are separate islands: the gulf between them
 * is not the plate, which keeps the lower dantian off the hand.
 */
export function inRegionFrame(region: AtlasRegion, view: AtlasView, pos: Point2D): boolean {
  if (region === "body") return true;
  const box = plateWindow();
  const cam = fitRegion(region, view, box);
  const k = unitsPerPx(VIEW_W / cam.zoom, VIEW_H / cam.zoom, box);
  const vis = visibleRect(cam.pan, k, box);
  if (pos.x < vis.l || pos.x > vis.r || pos.y < vis.t || pos.y > vis.b) return false;
  const anatomy = REGION_ANATOMY[region][view];
  return holds(grow(anatomy, AIR), pos) || holds(grow(mirrorBox(anatomy), AIR), pos);
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
