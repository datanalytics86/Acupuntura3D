import type { Point2D } from "@/types";
import { CX, Y } from "../landmarks";
import { closedD, loopD } from "./body";
import { footShapesPosterior } from "./feet";
import { X, ellipseD } from "./geom";
import { handShapes } from "./hands";
import { FILL, SKIN } from "./palette";
import type { FillShape, StrokeShape } from "./types";

const L: 1 = 1;
const R: -1 = -1;

const TRUNK_OUTER: Point2D[] = [
  { x: CX, y: 38 },
  { x: 376, y: 42 },
  { x: 356, y: 54 },
  { x: 342, y: 74 },
  { x: 334, y: 98 },
  { x: 332, y: 124 },
  { x: 338, y: 152 },
  { x: 348, y: 180 },
  { x: 360, y: 206 },
  { x: 366, y: 224 },
  { x: 362, y: 238 },
  { x: 330, y: 254 },
  { x: 286, y: 270 },
  { x: 250, y: 286 },
  { x: 228, y: 308 },
  { x: 230, y: 334 },
  { x: 246, y: 358 },
  { x: 262, y: 410 },
  { x: 270, y: 470 },
  { x: 274, y: 530 },
  { x: 272, y: 590 },
  { x: 264, y: 650 },
  { x: 256, y: 710 },
  { x: 254, y: 760 },
  { x: 262, y: 810 },
  { x: 274, y: 860 },
  { x: 278, y: 930 },
  { x: 282, y: 1000 },
  { x: 294, y: 1065 },
  { x: 314, y: 1108 },
  { x: 330, y: 1122 },
  { x: 336, y: 1170 },
  { x: 332, y: 1230 },
  { x: 330, y: 1290 },
  { x: 336, y: 1350 },
  { x: 348, y: 1395 },
  { x: 358, y: 1414 },
  { x: 350, y: 1444 },
  { x: 338, y: 1468 },
  { x: 330, y: 1484 },
  { x: 332, y: 1494 },
  { x: 342, y: 1498 },
  { x: 354, y: 1498 },
  { x: 366, y: 1494 },
  { x: 376, y: 1486 },
];

const TRUNK_INNER: Point2D[] = [
  { x: 384, y: 1476 },
  { x: 388, y: 1458 },
  { x: 390, y: 1430 },
  { x: 392, y: 1410 },
  { x: 390, y: 1338 },
  { x: 386, y: 1255 },
  { x: 380, y: 1175 },
  { x: 372, y: 1120 },
  { x: 366, y: 1035 },
  { x: 368, y: 950 },
  { x: 376, y: 870 },
  { x: 384, y: 808 },
  { x: 392, y: 778 },
  { x: CX, y: 768 },
];

const ARM_LEFT: Point2D[] = [
  { x: 252, y: 286 },
  { x: 228, y: 302 },
  { x: 214, y: 326 },
  { x: 210, y: 358 },
  { x: 216, y: 412 },
  { x: 226, y: 478 },
  { x: 234, y: 538 },
  { x: 238, y: 578 },
  { x: 230, y: 632 },
  { x: 216, y: 692 },
  { x: 200, y: 746 },
  { x: 184, y: 778 },
  { x: 180, y: 796 },
  { x: 160, y: 818 },
  { x: 152, y: 836 },
  { x: 164, y: 848 },
  { x: 182, y: 850 },
  { x: 198, y: 834 },
  { x: 208, y: 808 },
  { x: 218, y: 778 },
  { x: 232, y: 730 },
  { x: 248, y: 665 },
  { x: 260, y: 595 },
  { x: 268, y: 525 },
  { x: 272, y: 455 },
  { x: 274, y: 395 },
  { x: 276, y: 345 },
  { x: 286, y: 316 },
  { x: 304, y: 300 },
  { x: 288, y: 292 },
];

const ARM_L_D = loopD(ARM_LEFT);
const ARM_R_D = loopD(ARM_LEFT.map((p) => ({ x: 800 - p.x, y: p.y })));
export const TRUNK_D = closedD(TRUNK_OUTER, TRUNK_INNER);

function scapula(side: 1 | -1): FillShape {
  const x = (v: number) => X(v, side);
  return {
    id: side === 1 ? "scapulaL" : "scapulaR",
    d: [
      `M ${x(352)} 320`,
      `C ${x(318)} 332, ${x(300)} 365, ${x(306)} 408`,
      `C ${x(318)} 440, ${x(350)} 428, ${x(364)} 382`,
      `C ${x(368)} 350, ${x(362)} 328, ${x(352)} 320`,
      "Z",
    ].join(" "),
    fill: FILL.muscle,
    opacity: 0.4,
  };
}

function trap(side: 1 | -1): FillShape {
  const x = (v: number) => X(v, side);
  return {
    id: side === 1 ? "trapL" : "trapR",
    d: [
      `M ${CX} 208`,
      `C ${x(348)} 220, ${x(300)} 248, ${x(260)} 280`,
      `C ${x(252)} 290, ${x(270)} 300, ${x(294)} 292`,
      `C ${x(338)} 264, ${x(376)} 224, ${CX} 216`,
      "Z",
    ].join(" "),
    fill: FILL.muscle,
    opacity: 0.3,
  };
}

function glute(side: 1 | -1): FillShape {
  const x = (v: number) => X(v, side);
  return {
    id: side === 1 ? "gluteL" : "gluteR",
    d: ellipseD(x(332), 800, 52, 48),
    fill: FILL.muscle,
    opacity: 0.28,
  };
}

const HAIR = [
  `M 334 154`,
  `C 324 90, 348 36, ${CX} 30`,
  `C 452 36, 476 90, 466 154`,
  `L 456 152`,
  `C 450 114, 430 80, ${CX} 76`,
  `C 370 80, 350 114, 344 152`,
  "Z",
].join(" ");

function ear(side: 1 | -1): string {
  const x = (v: number) => X(v, side);
  return [
    `M ${x(338)} 120`,
    `C ${x(326)} 126, ${x(322)} 140, ${x(330)} 154`,
    `C ${x(338)} 160, ${x(348)} 146, ${x(348)} 130`,
    "Z",
  ].join(" ");
}

function limbOverlays(side: 1 | -1): FillShape[] {
  const s = side === 1 ? "L" : "R";
  const x = (v: number) => X(v, side);
  return [
    { id: `deltoidShade${s}`, d: ellipseD(x(254), 322, 32, 38), fill: FILL.muscle, opacity: 0.32 },
    ...handShapes(side, s),
    ...footShapesPosterior(side, s),
    { id: `hamstring${s}`, d: ellipseD(x(322), 960, 30, 80), fill: FILL.muscle, opacity: 0.28 },
    { id: `calfShade${s}`, d: ellipseD(x(338), 1265, 24, 68), fill: FILL.muscle, opacity: 0.3 },
  ];
}

export const POSTERIOR_FILLS: FillShape[] = [
  { id: "trunk", d: TRUNK_D, fill: FILL.skin },
  { id: "occipital", d: ellipseD(CX, 108, 48, 40), fill: FILL.muscle, opacity: 0.18 },
  { id: "armL", d: ARM_L_D, fill: FILL.skinL },
  { id: "armR", d: ARM_R_D, fill: FILL.skinR },
  trap(L),
  trap(R),
  scapula(L),
  scapula(R),
  glute(L),
  glute(R),
  { id: "lumbarShade", d: ellipseD(CX, 620, 48, 80), fill: FILL.muscle, opacity: 0.14 },
  ...limbOverlays(L),
  ...limbOverlays(R),
  { id: "hair", d: HAIR, fill: FILL.hair },
  { id: "earL", d: ear(L), fill: FILL.skinL },
  { id: "earR", d: ear(R), fill: FILL.skinR },
];

export const POSTERIOR_STROKES: StrokeShape[] = [
  {
    id: "spine",
    d: `M ${CX} 208 L ${CX} ${Y.pubis - 6}`,
    stroke: SKIN.outline,
    strokeWidth: 1.1,
    opacity: 0.3,
  },
  {
    id: "spineL",
    d: `M ${CX - 7} 248 L ${CX - 6} 730`,
    stroke: SKIN.outline,
    strokeWidth: 0.65,
    opacity: 0.14,
  },
  {
    id: "spineR",
    d: `M ${CX + 7} 248 L ${CX + 6} 730`,
    stroke: SKIN.outline,
    strokeWidth: 0.65,
    opacity: 0.14,
  },
  {
    id: "glutealFold",
    d: `M 296 832 Q ${CX} 858 504 832`,
    stroke: SKIN.outline,
    strokeWidth: 1.15,
    opacity: 0.32,
    linecap: "round",
  },
  {
    id: "nuchal",
    d: `M 358 198 Q ${CX} 212 442 198`,
    stroke: SKIN.outline,
    strokeWidth: 0.85,
    opacity: 0.26,
    linecap: "round",
  },
  {
    id: "poplitealL",
    d: `M 308 1114 Q 330 1128 352 1114`,
    stroke: SKIN.outline,
    strokeWidth: 0.95,
    opacity: 0.28,
    linecap: "round",
  },
  {
    id: "poplitealR",
    d: `M 448 1114 Q 470 1128 492 1114`,
    stroke: SKIN.outline,
    strokeWidth: 0.95,
    opacity: 0.28,
    linecap: "round",
  },
];

export const POSTERIOR_CONTOURS: string[] = [TRUNK_D, ARM_L_D, ARM_R_D];
