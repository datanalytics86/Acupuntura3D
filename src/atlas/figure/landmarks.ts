import type { Point2D } from "@/types";

export const VIEW_W = 800;
export const VIEW_H = 1600;
export const CX = 400;

/** True 8-head adult canon. Vertex 40 → sole 1480 (head ≈ 180). */
export const Y = {
  vertex: 40,
  hairline: 62,
  eyes: 118,
  nose: 155,
  mouth: 188,
  chin: 220,
  sternalNotch: 255,
  shoulder: 285,
  nipple: 400,
  xiphoid: 470,
  navel: 580,
  iliac: 700,
  pubis: 760,
  fingertips: 800,
  midThigh: 940,
  knee: 1120,
  midCalf: 1300,
  malleolus: 1410,
  sole: 1480,
} as const;

export const HALF = {
  skull: 58,
  neck: 32,
  shoulder: 168,
  chest: 128,
  waist: 102,
  hip: 138,
  thigh: 118,
  knee: 72,
  calf: 68,
  ankle: 42,
  wrist: 210,
} as const;

export function mirrorX(p: Point2D): Point2D {
  return { x: VIEW_W - p.x, y: p.y };
}

export function closedAdult(outerLeft: Point2D[], innerLeft: Point2D[]): Point2D[] {
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
