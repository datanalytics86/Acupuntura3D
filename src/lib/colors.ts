/** Plate ink. Cinnabar is the only accent, for the active meridian and the active or hovered point. */
export const INK = "#1C1915";
export const CINNABAR = "#8B1E1E";

/** Idle color of every channel, including GV. Active paint is CINNABAR, not a second hue. */
export const MERIDIAN_COLORS: Record<string, string> = {
  LU: INK,
  LI: INK,
  ST: INK,
  SP: INK,
  HT: INK,
  SI: INK,
  BL: INK,
  KI: INK,
  PC: INK,
  TE: INK,
  GB: INK,
  LR: INK,
  GV: INK,
  CV: INK,
  EX: INK,
};

export function getMeridianColor(id: string): string {
  if (id.startsWith("EX")) return MERIDIAN_COLORS.EX ?? INK;
  return MERIDIAN_COLORS[id] ?? INK;
}
