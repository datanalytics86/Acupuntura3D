import { catmullRomPath } from "@/atlas/catmullRom";
import type { Point2D } from "@/types";
import { closedAdult } from "../landmarks";

export function closedD(outerLeft: Point2D[], innerLeft: Point2D[]): string {
  return catmullRomPath(closedAdult(outerLeft, innerLeft), true);
}

export function loopD(pts: Point2D[]): string {
  return catmullRomPath(pts, true);
}
