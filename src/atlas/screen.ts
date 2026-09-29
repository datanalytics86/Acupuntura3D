import { createContext, useContext } from "react";
import type { Point2D } from "@/types";

/** CSS size of the plate <svg>, measured by Viewport with a ResizeObserver. */
export interface PlateBox {
  w: number;
  h: number;
}

/**
 * viewBox units per CSS pixel for a `meet` viewBox of (vbW × vbH) drawn into (box.w × box.h).
 * Multiply a pixel size by k to draw it at a constant size on screen.
 */
export function unitsPerPx(vbW: number, vbH: number, box: PlateBox): number {
  if (box.w <= 0 || box.h <= 0) return 1;
  return Math.max(vbW / box.w, vbH / box.h);
}

/** What the viewer actually sees, in viewBox units. `meet` shows more than the viewBox on one axis. */
export function visibleRect(
  pan: Point2D,
  k: number,
  box: PlateBox,
): { l: number; t: number; r: number; b: number } {
  const w = box.w * k;
  const h = box.h * k;
  return { l: pan.x - w / 2, t: pan.y - h / 2, r: pan.x + w / 2, b: pan.y + h / 2 };
}

export const ScreenContext = createContext<{ k: number; box: PlateBox }>({ k: 1, box: { w: 800, h: 1600 } });

/** viewBox units per CSS px inside the plate. */
export function useUnitsPerPx(): number {
  return useContext(ScreenContext).k;
}

export function usePlateBox(): PlateBox {
  return useContext(ScreenContext).box;
}
