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
