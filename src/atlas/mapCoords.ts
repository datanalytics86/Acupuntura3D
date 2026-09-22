import type { Acupoint, AtlasView, Point2D } from "@/types";

export function legacyTo2d(
  p: { x: number; y: number; z: number },
  view: AtlasView,
): Point2D {
  const x = view === "anterior" ? 400 + p.x * 380 : 400 - p.x * 380;
  const y = 40 + ((0.92 - p.y) / 1.84) * 1440;
  return { x, y };
}

export function pointOnView(point: Acupoint, view: AtlasView): Point2D | null {
  const mapped = point.position2d?.[view];
  if (mapped) return mapped;
  if (point.views && !point.views.includes(view)) return null;
  if (point.position) {
    const z = point.position.z;
    if (view === "anterior" && z < -0.02) return null;
    if (view === "posterior" && z > 0.02) return null;
    return legacyTo2d(point.position, view);
  }
  return null;
}

export function instancesOnView(
  point: Acupoint,
  view: AtlasView,
  bothSides: boolean,
): { point: Acupoint; position: Point2D; side: "L" | "R" | "C" }[] {
  const pos = pointOnView(point, view);
  if (!pos) return [];
  const midline = point.laterality === "C";
  const out: { point: Acupoint; position: Point2D; side: "L" | "R" | "C" }[] = [
    { point, position: pos, side: midline ? "C" : "L" },
  ];
  if (!midline && bothSides) {
    out.push({ point, position: { x: 800 - pos.x, y: pos.y }, side: "R" });
  }
  return out;
}
