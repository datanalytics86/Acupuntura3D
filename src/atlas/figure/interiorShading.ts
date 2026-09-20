import { catmullRomPath } from "@/atlas/catmullRom";
import type { AtlasView, Point2D } from "@/types";
import { CX, mirrorX } from "./landmarks";

function pair(left: Point2D[]): { left: string; right: string } {
  return {
    left: catmullRomPath(left, true),
    right: catmullRomPath(left.map(mirrorX), true),
  };
}

const pec = pair([
  { x: 400, y: 250 },
  { x: 372, y: 248 },
  { x: 348, y: 268 },
  { x: 338, y: 300 },
  { x: 348, y: 338 },
  { x: 372, y: 348 },
  { x: 400, y: 340 },
]);

const deltoid = pair([
  { x: 268, y: 220 },
  { x: 244, y: 236 },
  { x: 238, y: 268 },
  { x: 248, y: 300 },
  { x: 272, y: 292 },
  { x: 286, y: 250 },
]);

const abs = catmullRomPath(
  [
    { x: 378, y: 360 },
    { x: 400, y: 358 },
    { x: 422, y: 360 },
    { x: 428, y: 420 },
    { x: 424, y: 490 },
    { x: 400, y: 500 },
    { x: 376, y: 490 },
    { x: 372, y: 420 },
  ],
  true,
);

const vastus = pair([
  { x: 318, y: 680 },
  { x: 292, y: 740 },
  { x: 296, y: 840 },
  { x: 318, y: 920 },
  { x: 340, y: 900 },
  { x: 338, y: 760 },
]);

const calf = pair([
  { x: 336, y: 1020 },
  { x: 348, y: 1100 },
  { x: 352, y: 1180 },
  { x: 348, y: 1260 },
  { x: 368, y: 1240 },
  { x: 366, y: 1100 },
]);

const trap = pair([
  { x: 400, y: 175 },
  { x: 360, y: 188 },
  { x: 300, y: 210 },
  { x: 280, y: 230 },
  { x: 320, y: 228 },
  { x: 370, y: 200 },
]);

const scapula = pair([
  { x: 348, y: 240 },
  { x: 318, y: 250 },
  { x: 300, y: 290 },
  { x: 312, y: 340 },
  { x: 348, y: 330 },
  { x: 360, y: 280 },
]);

const glute = pair([
  { x: 400, y: 600 },
  { x: 360, y: 608 },
  { x: 312, y: 630 },
  { x: 300, y: 680 },
  { x: 328, y: 700 },
  { x: 370, y: 680 },
  { x: 400, y: 668 },
]);

export function interiorPaths(view: AtlasView): string[] {
  if (view === "anterior") {
    return [pec.left, pec.right, deltoid.left, deltoid.right, abs, vastus.left, vastus.right, calf.left, calf.right];
  }
  return [
    trap.left,
    trap.right,
    scapula.left,
    scapula.right,
    glute.left,
    glute.right,
    vastus.left,
    vastus.right,
    calf.left,
    calf.right,
  ];
}

export const STERNAL_LINE = `M ${CX} 198 L ${CX} 610`;
export const SPINE_LINE = `M ${CX} 150 L ${CX} 620`;
export const GLUTEAL_FOLD = `M 312 668 Q ${CX} 690 488 668`;
export const POPLITEAL = (x: number) => `M ${x - 18} 978 Q ${x} 988 ${x + 18} 978`;
