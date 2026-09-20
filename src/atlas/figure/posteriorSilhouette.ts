import type { Point2D } from "@/types";
import { catmullRomPath } from "@/atlas/catmullRom";
import { CX, mirrorX } from "./landmarks";

const OUTER_LEFT: Point2D[] = [
  { x: CX, y: 46 },
  { x: 374, y: 50 },
  { x: 352, y: 64 },
  { x: 344, y: 90 },
  { x: 348, y: 118 },
  { x: 360, y: 138 },
  { x: 370, y: 154 },
  { x: 376, y: 176 },
  { x: 380, y: 192 },
  { x: 342, y: 202 },
  { x: 292, y: 212 },
  { x: 256, y: 224 },
  { x: 242, y: 248 },
  { x: 242, y: 280 },
  { x: 250, y: 336 },
  { x: 258, y: 400 },
  { x: 262, y: 460 },
  { x: 256, y: 520 },
  { x: 244, y: 568 },
  { x: 224, y: 598 },
  { x: 202, y: 616 },
  { x: 182, y: 626 },
  { x: 166, y: 640 },
  { x: 162, y: 654 },
  { x: 176, y: 666 },
  { x: 198, y: 670 },
  { x: 220, y: 660 },
  { x: 234, y: 642 },
  { x: 244, y: 616 },
  { x: 256, y: 566 },
  { x: 268, y: 508 },
  { x: 276, y: 448 },
  { x: 282, y: 380 },
  { x: 294, y: 318 },
  { x: 316, y: 278 },
  { x: 340, y: 272 },
  { x: 356, y: 310 },
  { x: 358, y: 370 },
  { x: 350, y: 440 },
  { x: 336, y: 510 },
  { x: 316, y: 558 },
  { x: 298, y: 598 },
  { x: 288, y: 648 },
  { x: 286, y: 730 },
  { x: 290, y: 830 },
  { x: 304, y: 925 },
  { x: 324, y: 978 },
  { x: 336, y: 1060 },
  { x: 342, y: 1140 },
  { x: 346, y: 1240 },
  { x: 350, y: 1320 },
  { x: 338, y: 1368 },
  { x: 326, y: 1428 },
  { x: 334, y: 1472 },
  { x: 360, y: 1492 },
];

const INNER_LEFT: Point2D[] = [
  { x: 390, y: 1488 },
  { x: 394, y: 1455 },
  { x: 396, y: 1400 },
  { x: 394, y: 1340 },
  { x: 392, y: 1240 },
  { x: 390, y: 1140 },
  { x: 388, y: 1040 },
  { x: 384, y: 980 },
  { x: 382, y: 880 },
  { x: 384, y: 760 },
  { x: 388, y: 680 },
  { x: 394, y: 640 },
  { x: CX, y: 618 },
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

export const POSTERIOR_POINTS = closedAdult(OUTER_LEFT, INNER_LEFT);
export const POSTERIOR_D = catmullRomPath(POSTERIOR_POINTS, true);
