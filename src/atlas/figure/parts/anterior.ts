import type { Point2D } from "@/types";
import { CX, Y } from "../landmarks";
import { closedD, loopD } from "./body";
import { footShapes } from "./feet";
import { X, ellipseD } from "./geom";
import { handShapes } from "./hands";
import { FEATURE, FILL, SKIN } from "./palette";
import type { FillShape, StrokeShape } from "./types";

const L: 1 = 1;
const R: -1 = -1;

/** Head + neck + torso + legs + feet (toes in the outline). 80+ pts closed. */
const TRUNK_OUTER: Point2D[] = [
  { x: CX, y: 40 },
  { x: 378, y: 44 },
  { x: 360, y: 54 },
  { x: 346, y: 72 },
  { x: 338, y: 94 },
  { x: 336, y: 118 },
  { x: 340, y: 144 },
  { x: 348, y: 172 },
  { x: 358, y: 198 },
  { x: 366, y: 216 },
  { x: 370, y: 228 },
  { x: 368, y: 242 },
  { x: 358, y: 248 },
  { x: 320, y: 262 },
  { x: 278, y: 274 },
  { x: 244, y: 288 },
  { x: 226, y: 308 },
  { x: 228, y: 332 },
  { x: 244, y: 352 },
  { x: 258, y: 380 },
  { x: 266, y: 420 },
  { x: 272, y: 470 },
  { x: 274, y: 520 },
  { x: 270, y: 570 },
  { x: 262, y: 620 },
  { x: 256, y: 670 },
  { x: 254, y: 720 },
  { x: 258, y: 770 },
  { x: 268, y: 820 },
  { x: 274, y: 880 },
  { x: 276, y: 940 },
  { x: 280, y: 1000 },
  { x: 292, y: 1060 },
  { x: 312, y: 1105 },
  { x: 328, y: 1120 },
  { x: 334, y: 1165 },
  { x: 330, y: 1220 },
  { x: 328, y: 1280 },
  { x: 334, y: 1340 },
  { x: 346, y: 1390 },
  { x: 356, y: 1412 },
  { x: 348, y: 1440 },
  { x: 334, y: 1462 },
  { x: 324, y: 1476 },
  { x: 322, y: 1488 },
  { x: 330, y: 1496 },
  { x: 340, y: 1498 },
  { x: 350, y: 1498 },
  { x: 360, y: 1496 },
  { x: 370, y: 1492 },
  { x: 378, y: 1484 },
];

const TRUNK_INNER: Point2D[] = [
  { x: 384, y: 1476 },
  { x: 388, y: 1460 },
  { x: 390, y: 1435 },
  { x: 392, y: 1410 },
  { x: 390, y: 1340 },
  { x: 386, y: 1260 },
  { x: 380, y: 1180 },
  { x: 372, y: 1120 },
  { x: 366, y: 1040 },
  { x: 368, y: 960 },
  { x: 374, y: 880 },
  { x: 382, y: 810 },
  { x: 390, y: 776 },
  { x: CX, y: 762 },
];

const ARM_LEFT: Point2D[] = [
  { x: 250, y: 282 },
  { x: 226, y: 298 },
  { x: 212, y: 322 },
  { x: 208, y: 355 },
  { x: 214, y: 410 },
  { x: 224, y: 475 },
  { x: 232, y: 535 },
  { x: 236, y: 575 },
  { x: 228, y: 630 },
  { x: 214, y: 690 },
  { x: 198, y: 745 },
  { x: 182, y: 780 },
  { x: 168, y: 798 },
  { x: 154, y: 818 },
  { x: 148, y: 836 },
  { x: 160, y: 848 },
  { x: 178, y: 850 },
  { x: 194, y: 838 },
  { x: 206, y: 816 },
  { x: 216, y: 786 },
  { x: 230, y: 740 },
  { x: 238, y: 730 },
  { x: 250, y: 670 },
  { x: 262, y: 600 },
  { x: 270, y: 530 },
  { x: 274, y: 460 },
  { x: 276, y: 400 },
  { x: 278, y: 350 },
  { x: 288, y: 318 },
  { x: 304, y: 298 },
  { x: 292, y: 290 },
  { x: 274, y: 286 },
];

const ARM_L_D = loopD(ARM_LEFT);
const ARM_R_D = loopD(ARM_LEFT.map((p) => ({ x: 800 - p.x, y: p.y })));
export const TRUNK_D = closedD(TRUNK_OUTER, TRUNK_INNER);

function pec(side: 1 | -1): FillShape {
  const x = (v: number) => X(v, side);
  return {
    id: side === 1 ? "pecL" : "pecR",
    d: [
      `M ${CX} 328`,
      `C ${x(372)} 322, ${x(342)} 338, ${x(334)} 372`,
      `C ${x(336)} 408, ${x(360)} 424, ${CX} 412`,
      "Z",
    ].join(" "),
    fill: FILL.muscle,
    opacity: 0.28,
  };
}

function deltoidShade(side: 1 | -1): FillShape {
  const x = (v: number) => X(v, side);
  return {
    id: side === 1 ? "deltoidShadeL" : "deltoidShadeR",
    d: ellipseD(x(252), 318, 34, 40),
    fill: FILL.muscle,
    opacity: 0.35,
  };
}

function vastus(side: 1 | -1): FillShape {
  const x = (v: number) => X(v, side);
  return {
    id: side === 1 ? "vastusL" : "vastusR",
    d: ellipseD(x(318), 955, 32, 88),
    fill: FILL.muscle,
    opacity: 0.32,
  };
}

function calfShade(side: 1 | -1): FillShape {
  const x = (v: number) => X(v, side);
  return {
    id: side === 1 ? "calfShadeL" : "calfShadeR",
    d: ellipseD(x(336), 1260, 22, 70),
    fill: FILL.muscle,
    opacity: 0.3,
  };
}

function trap(side: 1 | -1): FillShape {
  const x = (v: number) => X(v, side);
  return {
    id: side === 1 ? "trapL" : "trapR",
    d: [
      `M ${CX} 236`,
      `C ${x(360)} 244, ${x(310)} 262, ${x(270)} 282`,
      `C ${x(262)} 290, ${x(278)} 298, ${x(300)} 290`,
      `C ${x(344)} 270, ${x(378)} 248, ${CX} 244`,
      "Z",
    ].join(" "),
    fill: FILL.muscle,
    opacity: 0.28,
  };
}

const HAIR = [
  `M 336 152`,
  `C 326 92, 348 38, ${CX} 32`,
  `C 452 38, 474 92, 464 152`,
  `L 454 150`,
  `C 450 112, 430 78, ${CX} 74`,
  `C 370 78, 350 112, 346 150`,
  "Z",
].join(" ");

function ear(side: 1 | -1): string {
  const x = (v: number) => X(v, side);
  return [
    `M ${x(340)} 120`,
    `C ${x(328)} 124, ${x(324)} 138, ${x(330)} 152`,
    `C ${x(338)} 158, ${x(348)} 146, ${x(348)} 130`,
    "Z",
  ].join(" ");
}

function brow(side: 1 | -1): string {
  const x = (v: number) => X(v, side);
  return `M ${x(354)} 108 Q ${x(368)} 104 ${x(380)} 108`;
}

function eye(side: 1 | -1): string {
  const x = (v: number) => X(v, side);
  return [
    `M ${x(356)} 118`,
    `C ${x(362)} 115, ${x(374)} 115, ${x(380)} 118`,
    `C ${x(374)} 121, ${x(362)} 121, ${x(356)} 118`,
    "Z",
  ].join(" ");
}

const NOSE = `M ${CX} 128 C ${CX + 1.5} 140, ${CX + 4} 150, ${CX + 3} 155 Q ${CX} 158 ${CX - 3} 155 C ${CX - 4} 150, ${CX - 1.5} 140, ${CX} 128 Z`;

const LIPS = [
  `M ${CX - 10} 188`,
  `Q ${CX} 192 ${CX + 10} 188`,
  `Q ${CX} 190 ${CX - 10} 188`,
  "Z",
].join(" ");

const ABS = ellipseD(CX, 548, 28, 70);

function limbOverlays(side: 1 | -1): FillShape[] {
  const s = side === 1 ? "L" : "R";
  return [
    deltoidShade(side),
    ...handShapes(side, s),
    ...footShapes(side, s),
    vastus(side),
    calfShade(side),
  ];
}

export const ANTERIOR_FILLS: FillShape[] = [
  { id: "trunk", d: TRUNK_D, fill: FILL.skin },
  { id: "armL", d: ARM_L_D, fill: FILL.skinL },
  { id: "armR", d: ARM_R_D, fill: FILL.skinR },
  trap(L),
  trap(R),
  pec(L),
  pec(R),
  { id: "abs", d: ABS, fill: FILL.muscle, opacity: 0.28 },
  { id: "abdomenShade", d: ellipseD(CX, 620, 70, 50), fill: FILL.muscle, opacity: 0.12 },
  { id: "pelvisShade", d: ellipseD(CX, 780, 90, 40), fill: FILL.muscle, opacity: 0.14 },
  ...limbOverlays(L),
  ...limbOverlays(R),
  { id: "hair", d: HAIR, fill: FILL.hair },
  { id: "earL", d: ear(L), fill: FILL.skinL },
  { id: "earR", d: ear(R), fill: FILL.skinR },
  { id: "eyeL", d: eye(L), fill: FEATURE.eye, opacity: 0.78 },
  { id: "eyeR", d: eye(R), fill: FEATURE.eye, opacity: 0.78 },
  { id: "nose", d: NOSE, fill: FEATURE.nose, opacity: 0.45 },
  { id: "lips", d: LIPS, fill: FEATURE.lip, opacity: 0.65 },
];

export const ANTERIOR_STROKES: StrokeShape[] = [
  { id: "browL", d: brow(L), stroke: FEATURE.brow, strokeWidth: 1.8, linecap: "round", opacity: 0.7 },
  { id: "browR", d: brow(R), stroke: FEATURE.brow, strokeWidth: 1.8, linecap: "round", opacity: 0.7 },
  {
    id: "sternal",
    d: `M ${CX} ${Y.sternalNotch} L ${CX} ${Y.navel}`,
    stroke: SKIN.outline,
    strokeWidth: 0.8,
    opacity: 0.22,
  },
  {
    id: "clavicle",
    d: `M 308 274 Q ${CX} 256 492 274`,
    stroke: SKIN.outline,
    strokeWidth: 0.95,
    opacity: 0.28,
    linecap: "round",
  },
];

export const ANTERIOR_CONTOURS: string[] = [TRUNK_D, ARM_L_D, ARM_R_D];
