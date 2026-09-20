import type { Point2D } from "@/types";

export const VIEW_W = 800;
export const VIEW_H = 1600;
export const CX = 400;

export const Y = {
  vertex: 40,
  chin: 140,
  sternalNotch: 190,
  shoulder: 210,
  nipple: 320,
  xiphoid: 380,
  navel: 470,
  iliac: 560,
  pubis: 620,
  fingertips: 640,
  midThigh: 820,
  knee: 980,
  midCalf: 1140,
  malleolus: 1320,
  sole: 1480,
} as const;

export const HALF = {
  skull: 52,
  shoulder: 148,
  waist: 78,
  hip: 118,
  knee: 58,
  ankle: 38,
  wrist: 210,
} as const;

export function mirrorX(p: Point2D): Point2D {
  return { x: VIEW_W - p.x, y: p.y };
}
