import { catmullRomPath } from "@/atlas/catmullRom";
import type { AtlasView, Point2D } from "@/types";
import { CX, Y, mirrorX } from "./landmarks";

function blob(left: Point2D[]): { left: string; right: string } {
  return {
    left: catmullRomPath(left, true),
    right: catmullRomPath(left.map(mirrorX), true),
  };
}

const pec = blob([
  { x: 400, y: 310 },
  { x: 368, y: 308 },
  { x: 338, y: 330 },
  { x: 328, y: 375 },
  { x: 340, y: 418 },
  { x: 372, y: 428 },
  { x: 400, y: 412 },
]);

const deltoid = blob([
  { x: 268, y: 292 },
  { x: 238, y: 310 },
  { x: 226, y: 345 },
  { x: 236, y: 385 },
  { x: 262, y: 372 },
  { x: 282, y: 328 },
]);

const abs = catmullRomPath(
  [
    { x: 376, y: 455 },
    { x: 400, y: 452 },
    { x: 424, y: 455 },
    { x: 430, y: 520 },
    { x: 426, y: 575 },
    { x: 400, y: 588 },
    { x: 374, y: 575 },
    { x: 370, y: 520 },
  ],
  true,
);

const obliques = blob([
  { x: 348, y: 500 },
  { x: 328, y: 545 },
  { x: 318, y: 610 },
  { x: 328, y: 665 },
  { x: 350, y: 640 },
  { x: 358, y: 560 },
]);

const vastus = blob([
  { x: 330, y: 790 },
  { x: 292, y: 840 },
  { x: 276, y: 930 },
  { x: 288, y: 1040 },
  { x: 318, y: 1095 },
  { x: 340, y: 1040 },
  { x: 342, y: 900 },
]);

const calf = blob([
  { x: 328, y: 1155 },
  { x: 318, y: 1220 },
  { x: 322, y: 1305 },
  { x: 336, y: 1375 },
  { x: 352, y: 1340 },
  { x: 350, y: 1220 },
]);

const trap = blob([
  { x: 400, y: 230 },
  { x: 350, y: 248 },
  { x: 280, y: 278 },
  { x: 250, y: 300 },
  { x: 290, y: 305 },
  { x: 360, y: 268 },
]);

const scapula = blob([
  { x: 355, y: 310 },
  { x: 318, y: 325 },
  { x: 298, y: 375 },
  { x: 310, y: 430 },
  { x: 348, y: 418 },
  { x: 366, y: 360 },
]);

const glute = blob([
  { x: 400, y: 720 },
  { x: 355, y: 728 },
  { x: 305, y: 755 },
  { x: 288, y: 810 },
  { x: 318, y: 845 },
  { x: 365, y: 820 },
  { x: 400, y: 800 },
]);

export function interiorPaths(view: AtlasView): string[] {
  if (view === "anterior") {
    return [
      pec.left,
      pec.right,
      deltoid.left,
      deltoid.right,
      abs,
      obliques.left,
      obliques.right,
      vastus.left,
      vastus.right,
      calf.left,
      calf.right,
    ];
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

export const STERNAL_LINE = `M ${CX} ${Y.sternalNotch} L ${CX} ${Y.pubis - 20}`;
export const SPINE_LINE = `M ${CX} 210 L ${CX} ${Y.pubis - 10}`;
export const GLUTEAL_FOLD = `M 300 812 Q ${CX} 838 500 812`;
export const POPLITEAL = (x: number) => `M ${x - 22} 1116 Q ${x} 1128 ${x + 22} 1116`;

export const HAIR_CAP = `M 348 78 C 352 52, 372 40, 400 40 C 428 40, 448 52, 452 78 C 448 70, 428 62, 400 60 C 372 62, 352 70, 348 78 Z`;
export const EAR_L = `M 342 118 C 334 122, 330 132, 334 144 C 340 148, 348 140, 350 128 Z`;
export const EAR_R = `M 458 118 C 466 122, 470 132, 466 144 C 460 148, 452 140, 450 128 Z`;
