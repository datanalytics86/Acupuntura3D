/** Y-up metres, origin at pelvis/sacrum. Educational mannequin, not a clinical atlas. */
export const BODY = {
  headTop: 0.92,
  vertex: 0.9,
  yintang: 0.79,
  nape: 0.7,
  c7: 0.61,
  shoulderY: 0.54,
  shoulderX: 0.18,
  chestY: 0.34,
  solarY: 0.14,
  lumbarY: 0.1,
  hipX: 0.1,
  elbowY: 0.36,
  wristY: 0.2,
  handY: 0.14,
  kneeY: -0.42,
  ankleY: -0.78,
  footY: -0.88,
} as const;

export function mirrorX(p: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
  return { x: -p.x, y: p.y, z: p.z };
}
