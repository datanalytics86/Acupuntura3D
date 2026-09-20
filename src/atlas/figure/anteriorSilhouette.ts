import type { Point2D } from "@/types";
import { catmullRomPath } from "@/atlas/catmullRom";
import { CX, mirrorX } from "./landmarks";

const OUTER_LEFT: Point2D[] = [
  { x: CX, y: 48 },
  { x: 376, y: 52 },
  { x: 354, y: 68 },
  { x: 346, y: 92 },
  { x: 350, y: 116 },
  { x: 362, y: 134 },
  { x: 372, y: 146 },
  { x: 378, y: 168 },
  { x: 382, y: 188 },
  { x: 350, y: 200 },
  { x: 300, y: 208 },
  { x: 262, y: 218 },
  { x: 246, y: 238 },
  { x: 244, y: 268 },
  { x: 250, y: 318 },
  { x: 258, y: 378 },
  { x: 262, y: 430 },
  { x: 258, y: 490 },
  { x: 248, y: 545 },
  { x: 228, y: 585 },
  { x: 206, y: 608 },
  { x: 186, y: 620 },
  { x: 170, y: 632 },
  { x: 162, y: 648 },
  { x: 174, y: 662 },
  { x: 196, y: 668 },
  { x: 218, y: 660 },
  { x: 232, y: 642 },
  { x: 242, y: 618 },
  { x: 254, y: 568 },
  { x: 266, y: 510 },
  { x: 274, y: 450 },
  { x: 280, y: 385 },
  { x: 292, y: 320 },
  { x: 314, y: 278 },
  { x: 338, y: 286 },
  { x: 352, y: 330 },
  { x: 350, y: 390 },
  { x: 340, y: 450 },
  { x: 326, y: 510 },
  { x: 304, y: 555 },
  { x: 288, y: 595 },
  { x: 278, y: 655 },
  { x: 276, y: 740 },
  { x: 282, y: 840 },
  { x: 298, y: 930 },
  { x: 322, y: 978 },
  { x: 334, y: 1060 },
  { x: 340, y: 1140 },
  { x: 344, y: 1240 },
  { x: 350, y: 1320 },
  { x: 338, y: 1370 },
  { x: 324, y: 1430 },
  { x: 332, y: 1474 },
  { x: 360, y: 1492 },
];

const INNER_LEFT: Point2D[] = [
  { x: 390, y: 1488 },
  { x: 394, y: 1458 },
  { x: 396, y: 1405 },
  { x: 394, y: 1345 },
  { x: 392, y: 1260 },
  { x: 390, y: 1170 },
  { x: 388, y: 1080 },
  { x: 386, y: 1000 },
  { x: 384, y: 980 },
  { x: 382, y: 900 },
  { x: 384, y: 800 },
  { x: 388, y: 700 },
  { x: 394, y: 650 },
  { x: CX, y: 622 },
];

function closedAdult(outerLeft: Point2D[], innerLeft: Point2D[]): Point2D[] {
  const innerRight = innerLeft
    .slice(0, -1)
    .reverse()
    .map(mirrorX);
  const outerRight = outerLeft
    .slice(1)
    .reverse()
    .map(mirrorX);
  return [...outerLeft, ...innerLeft, ...innerRight, ...outerRight];
}

export const ANTERIOR_POINTS = closedAdult(OUTER_LEFT, INNER_LEFT);
export const ANTERIOR_D = catmullRomPath(ANTERIOR_POINTS, true);
