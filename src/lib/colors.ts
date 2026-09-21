import type { Elemento } from "@/types";

export const ELEMENT_COLORS: Record<Elemento, string> = {
  wood: "#3D8B40",
  fire: "#E23B3B",
  earth: "#C4A35A",
  metal: "#C0C8D0",
  water: "#2B6CB0",
};

export const MERIDIAN_COLORS: Record<string, string> = {
  LU: "#C0C8D0",
  LI: "#C0C8D0",
  ST: "#C4A35A",
  SP: "#C4A35A",
  HT: "#E23B3B",
  SI: "#E23B3B",
  BL: "#2B6CB0",
  KI: "#2B6CB0",
  PC: "#E23B3B",
  TE: "#C45C26",
  GB: "#3D8B40",
  LR: "#3D8B40",
  GV: "#3F3428",
  CV: "#F59E0B",
  EX: "#94A3B8",
};

export function getMeridianColor(id: string): string {
  if (id.startsWith("EX")) return MERIDIAN_COLORS.EX ?? "#94A3B8";
  return MERIDIAN_COLORS[id] ?? "#94A3B8";
}
