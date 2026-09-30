import type { Acupoint } from "@/types";

/** Next or previous catalogue point. A one-point channel steps into the neighbouring entry. */
export function stepPoint(points: readonly Acupoint[], selectedId: string, dir: 1 | -1): Acupoint | null {
  const current = points.find((pt) => pt.id === selectedId);
  if (!current) return null;
  const meridian = points.filter((pt) => pt.meridianId === current.meridianId);
  const pool = meridian.length > 1 ? meridian : points;
  const idx = pool.findIndex((pt) => pt.id === selectedId);
  if (idx < 0 || pool.length === 0) return null;
  return pool[(idx + dir + pool.length) % pool.length] ?? null;
}
