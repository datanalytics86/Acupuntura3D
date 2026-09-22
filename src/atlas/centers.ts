import type { Point2D } from "@/types";
import { CX, Y } from "@/atlas/figure/landmarks";

export type CenterId = "lower" | "middle" | "upper";

/**
 * Three didactic dantian of qigong / neidan.
 * Anchors are approximate plate marks, not OMS points and not clinical locations.
 */
export interface EnergyCenter {
  id: CenterId;
  zh: string;
  pinyin: string;
  es: string;
  en: string;
  anchorEs: string;
  anchorEn: string;
  noteEs: string;
  noteEn: string;
  relatedPointId?: string;
  anterior?: Point2D;
  posterior?: Point2D;
  aliases: string[];
}

const cun = (Y.pubis - Y.navel) / 5;

export const CENTERS: EnergyCenter[] = [
  {
    id: "upper",
    zh: "上丹田",
    pinyin: "Shàng Dāntián",
    es: "Dantian superior",
    en: "Upper dantian",
    anchorEs:
      "En la vista anterior, entre las cejas (región de EX-HN3 印堂). En la posterior, la lectura del vertex junto a GV20 百会. Son dos anclas didácticas del mismo centro, no una medición.",
    anchorEn:
      "On the anterior plate, between the brows (the region of EX-HN3). On the posterior plate, the crown reading near GV20. Two didactic anchors for one center, not a measurement.",
    noteEs:
      "Centro superior de la tradición de qigong y neidan. No es un punto de la nomenclatura OMS y no describe una acción terapéutica. Confianza del ancla: baja.",
    noteEn:
      "Upper center in the qigong and neidan teaching tradition. Not a WHO nomenclature point and not a therapeutic claim. Anchor confidence: low.",
    relatedPointId: "EX-HN3",
    anterior: { x: CX, y: 108 },
    posterior: { x: CX, y: 64 },
    aliases: ["dantian superior", "shang dantian", "shangdantian", "shang", "upper dantian", "上丹田"],
  },
  {
    id: "middle",
    zh: "中丹田",
    pinyin: "Zhōng Dāntián",
    es: "Dantian medio",
    en: "Middle dantian",
    anchorEs:
      "Línea media del tórax, a la altura de CV17 膻中. Ancla de lámina, no una profundidad clínica.",
    anchorEn: "Midline of the chest, at the level of CV17. A plate anchor, not a clinical depth.",
    noteEs:
      "Centro medio de la tradición de qigong y neidan. No es un punto OMS y no sustituye la ficha de CV17. Confianza del ancla: baja.",
    noteEn:
      "Middle center in the qigong and neidan teaching tradition. Not a WHO point and not a substitute for the CV17 entry. Anchor confidence: low.",
    relatedPointId: "CV17",
    anterior: { x: CX, y: Y.nipple },
    aliases: ["dantian medio", "zhong dantian", "zhongdantian", "middle dantian", "中丹田"],
  },
  {
    id: "lower",
    zh: "下丹田",
    pinyin: "Xià Dāntián",
    es: "Dantian inferior",
    en: "Lower dantian",
    anchorEs:
      "Línea media, entre 1,5 y 3 cun bajo el ombligo. Cerca de la nomenclatura CV6–CV4, sin ser ninguno de esos puntos.",
    anchorEn:
      "Midline, between 1.5 and 3 cun below the navel. Near the CV6–CV4 nomenclature, and not either point.",
    noteEs:
      "Centro inferior, el que suele nombrarse cuando se dice «el dantian». Tradición didáctica de qigong y neidan. No es un punto OMS y no describe una indicación. Confianza del ancla: baja.",
    noteEn:
      "Lower center, the one usually meant by “the dantian”. Qigong and neidan teaching tradition. Not a WHO point and not an indication. Anchor confidence: low.",
    anterior: { x: CX, y: Math.round(Y.navel + 2.5 * cun) },
    aliases: [
      "dantian",
      "dan tien",
      "dan tian",
      "dantien",
      "dantian inferior",
      "xia dantian",
      "xiadantian",
      "lower dantian",
      "下丹田",
    ],
  },
];

export function centerById(id: string | null): EnergyCenter | undefined {
  return CENTERS.find((c) => c.id === id);
}

export function positionOnView(center: EnergyCenter, view: "anterior" | "posterior"): Point2D | undefined {
  return view === "posterior" ? center.posterior : center.anterior;
}

export function matchCenter(query: string): EnergyCenter | undefined {
  const q = query.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
  if (!q) return undefined;
  return CENTERS.find((c) => c.aliases.some((a) => a.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase() === q));
}
