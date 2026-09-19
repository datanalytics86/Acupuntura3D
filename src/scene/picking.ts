import type { Acupoint, Meridian } from "@/types";
import { mirrorX } from "@/lib/bodyMetrics";

export interface PointInstance {
  point: Acupoint;
  position: [number, number, number];
  side: "L" | "R" | "C";
}

export function buildPointInstances(
  points: Acupoint[],
  meridians: Meridian[],
): PointInstance[] {
  const byId = new Map(meridians.map((m) => [m.id, m]));
  const out: PointInstance[] = [];
  for (const point of points) {
    if (!point.position) continue;
    const mer = byId.get(point.meridianId);
    const bilateral = mer?.laterality === "bilateral" && point.laterality !== "C";
    out.push({
      point,
      position: [point.position.x, point.position.y, point.position.z],
      side: point.laterality === "C" ? "C" : "L",
    });
    if (bilateral) {
      const r = mirrorX(point.position);
      out.push({
        point,
        position: [r.x, r.y, r.z],
        side: "R",
      });
    }
  }
  return out;
}
