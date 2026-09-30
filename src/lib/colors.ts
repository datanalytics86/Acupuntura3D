import type { Elemento } from "@/types";
import { INK, meridianPigment } from "./tokens";

export { CINNABAR, INK } from "./tokens";

const ELEMENT_OF: Record<string, Elemento> = {
  LU: "metal",
  LI: "metal",
  ST: "earth",
  SP: "earth",
  HT: "fire",
  SI: "fire",
  BL: "water",
  KI: "water",
  PC: "fire",
  TE: "fire",
  GB: "wood",
  LR: "wood",
};

/** Channel pigment. Extra points stay ink; GV and CV resolve to vessel. */
export function getMeridianColor(id: string): string {
  if (id.startsWith("EX")) return INK;
  return meridianPigment({ id, element: ELEMENT_OF[id] });
}
