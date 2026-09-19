export const MERIDIAN_IDS = [
  "LU",
  "LI",
  "ST",
  "SP",
  "HT",
  "SI",
  "BL",
  "KI",
  "PC",
  "TE",
  "GB",
  "LR",
  "GV",
  "CV",
] as const;

export type MeridianId = (typeof MERIDIAN_IDS)[number];

export const STAR_CODES = [
  "LI4",
  "LU7",
  "ST36",
  "SP6",
  "HT7",
  "PC6",
  "LR3",
  "GB34",
  "GB20",
  "BL23",
  "BL40",
  "KI3",
  "CV12",
  "CV17",
  "GV20",
  "GV14",
  "TE5",
  "SI3",
  "EX-HN3",
  "EX-B1",
] as const;

export function seriesCodes(id: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${id}${i + 1}`);
}
