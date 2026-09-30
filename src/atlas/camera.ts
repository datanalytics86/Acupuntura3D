import type { Point2D } from "@/types";

export interface Camera {
  pan: Point2D;
  zoom: number;
}

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 6;

export function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}

export function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

/** Pan eases linearly in space, zoom in log space, so a fly reads as one steady move. */
export function lerpCamera(a: Camera, b: Camera, t: number): Camera {
  const e = easeOutQuint(Math.min(1, Math.max(0, t)));
  const za = Math.log(a.zoom);
  const zb = Math.log(b.zoom);
  return {
    pan: { x: a.pan.x + (b.pan.x - a.pan.x) * e, y: a.pan.y + (b.pan.y - a.pan.y) * e },
    zoom: Math.exp(za + (zb - za) * e),
  };
}

/** Zoom by `factor` about `anchor` (viewBox units). The anchor stays under the cursor. */
export function zoomAbout(cam: Camera, factor: number, anchor: Point2D): Camera {
  const zoom = clampZoom(cam.zoom * factor);
  const s = cam.zoom / zoom;
  return {
    zoom,
    pan: { x: anchor.x + (cam.pan.x - anchor.x) * s, y: anchor.y + (cam.pan.y - anchor.y) * s },
  };
}

/** Client pixel → viewBox units for a `meet` svg centred on `pan`. */
export function clientToUnits(
  client: Point2D,
  rect: { left: number; top: number; width: number; height: number },
  pan: Point2D,
  k: number,
): Point2D {
  return {
    x: pan.x + (client.x - (rect.left + rect.width / 2)) * k,
    y: pan.y + (client.y - (rect.top + rect.height / 2)) * k,
  };
}

/** viewBox units → client pixel. Inverse of clientToUnits. */
export function unitsToClient(
  p: Point2D,
  rect: { left: number; top: number; width: number; height: number },
  pan: Point2D,
  k: number,
): Point2D {
  return {
    x: rect.left + rect.width / 2 + (p.x - pan.x) / k,
    y: rect.top + rect.height / 2 + (p.y - pan.y) / k,
  };
}
