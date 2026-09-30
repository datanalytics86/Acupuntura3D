import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { ZOOM_MAX, ZOOM_MIN } from "@/atlas/camera";
import type { PlateBox } from "@/atlas/screen";
import type { AtlasRegion, AtlasView, Point2D } from "@/types";

export interface Box {
  l: number;
  t: number;
  r: number;
  b: number;
}

/**
 * Anatomy each detail plate must show whole, measured on the plate alpha (> 127),
 * viewBox 800×1600. Face includes the neck down to GV14; foot includes the ankle up to SP6.
 */
export const REGION_ANATOMY: Record<Exclude<AtlasRegion, "body">, Record<AtlasView, Box>> = {
  face: {
    anterior: { l: 326, t: 40, r: 476, b: 282 },
    posterior: { l: 320, t: 40, r: 470, b: 282 },
  },
  hand: {
    anterior: { l: 98, t: 680, r: 260, b: 893 },
    posterior: { l: 98, t: 680, r: 260, b: 893 },
  },
  foot: {
    anterior: { l: 308, t: 1340, r: 492, b: 1480 },
    posterior: { l: 306, t: 1340, r: 490, b: 1480 },
  },
};

/** Share of the anatomy box added as air on every side. */
const AIR = 0.12;

/**
 * Camera that shows the whole anatomy box inside the drawing window (meet), with air.
 * Replaces the fixed zooms of regionFrame(): the window size decides the zoom.
 */
export function fitRegion(region: AtlasRegion, view: AtlasView, box: PlateBox): { pan: Point2D; zoom: number } {
  if (region === "body" || box.w <= 0 || box.h <= 0) return { pan: { x: VIEW_W / 2, y: VIEW_H / 2 }, zoom: 1 };
  const a = REGION_ANATOMY[region][view];
  const needW = (a.r - a.l) * (1 + 2 * AIR);
  const needH = (a.b - a.t) * (1 + 2 * AIR);
  const c = Math.max(VIEW_W / box.w, VIEW_H / box.h);
  const zoom = c / Math.max(needW / box.w, needH / box.h);
  return {
    pan: { x: (a.l + a.r) / 2, y: (a.t + a.b) / 2 },
    zoom: Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom)),
  };
}

/**
 * Solid part of the regional loupe: the smallest ellipse with the box's aspect that holds its four corners,
 * plus 8 u. The drawn ellipse is this divided by the solid stop of the gradient (PlateDefs).
 */
export function focusEllipse(region: Exclude<AtlasRegion, "body">, view: AtlasView): { cx: number; cy: number; rx: number; ry: number } {
  const a = REGION_ANATOMY[region][view];
  return {
    cx: (a.l + a.r) / 2,
    cy: (a.t + a.b) / 2,
    rx: ((a.r - a.l) / 2) * Math.SQRT2 + 8,
    ry: ((a.b - a.t) / 2) * Math.SQRT2 + 8,
  };
}
