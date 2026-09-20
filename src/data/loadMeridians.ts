import meridiansJson from "@data/meridians.json";
import type { Meridian } from "@/types";
import { MERIDIAN_ANCHORS_2D } from "@/atlas/meridianAnchors";
import { MERIDIAN_IDS, seriesCodes } from "./ids";

export function loadMeridians(): Meridian[] {
  const rows = meridiansJson as Meridian[];
  if (rows.length !== 14) {
    throw new Error(`meridians.json must have 14 rows, got ${rows.length}`);
  }
  const ids = rows.map((m) => m.id);
  for (let i = 0; i < MERIDIAN_IDS.length; i += 1) {
    if (ids[i] !== MERIDIAN_IDS[i]) {
      throw new Error(`meridian id mismatch at ${i}: expected ${MERIDIAN_IDS[i]}, got ${ids[i]}`);
    }
  }
  return rows.map((m) => ({
    ...m,
    pointCodes: m.pointCodes.length === m.pointCount ? m.pointCodes : seriesCodes(m.id, m.pointCount),
    anchors2d: m.anchors2d ?? MERIDIAN_ANCHORS_2D[m.id],
  }));
}
