import { CatmullRomCurve3, Vector3 } from "three";

export function anchorsToCurve(
  anchors: { x: number; y: number; z: number }[],
): CatmullRomCurve3 | null {
  if (anchors.length < 2) return null;
  const pts = anchors.map((a) => new Vector3(a.x, a.y, a.z));
  return new CatmullRomCurve3(pts, false, "centripetal");
}
