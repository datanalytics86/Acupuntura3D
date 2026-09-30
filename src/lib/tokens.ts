import type { Elemento } from "@/types";

export const INK = "#1C1915";
export const INK_2 = "#4A4238";
export const INK_3 = "#5E554A";
export const PAPER = "#FBF7EE";
export const PAPER_INSET = "#F3EBDD";
export const CINNABAR = "#8B1E1E";
export const RULE = "rgba(28,25,21,.18)";

export const PIGMENT: Record<Elemento | "vessel", string> = {
  wood: "#1B5139",
  fire: "#8A231D",
  earth: "#5F3D0C",
  metal: "#3D4A54",
  water: "#1F3F6E",
  vessel: "#1C1915",
};

export const ELEMENT_HANZI: Record<Elemento, string> = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

export function meridianPigment(m: { id: string; element?: Elemento }): string {
  if (m.id === "GV" || m.id === "CV") return PIGMENT.vessel;
  return m.element ? PIGMENT[m.element] : PIGMENT.vessel;
}
