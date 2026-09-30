import seedJson from "@data/acupoints.seed.json";
import type { Acupoint } from "@/types";
import { STAR_CODES } from "./ids";

export function assertAcupointRow(row: unknown, index: number): asserts row is Acupoint {
  if (!row || typeof row !== "object") throw new Error(`acupoint row ${index} is not an object`);
  const point = row as Acupoint;
  if (typeof point.id !== "string" || typeof point.code !== "string") {
    throw new Error(`acupoint row ${index} is missing id or code`);
  }
  if (!point.names || typeof point.names.zh !== "string" || typeof point.names.pinyin !== "string") {
    throw new Error(`acupoint ${point.code} is missing names`);
  }
  if (!point.location || typeof point.location.anatomicEs !== "string") {
    throw new Error(`acupoint ${point.code} is missing location`);
  }
}

export function loadAcupoints(): Acupoint[] {
  if (!Array.isArray(seedJson)) throw new Error("acupoints.seed.json must be an array");
  const rows = seedJson as Acupoint[];
  rows.forEach((row, index) => assertAcupointRow(row, index));
  if (rows.length < 20) {
    throw new Error(`acupoints.seed.json must have at least 20 rows, got ${rows.length}`);
  }
  const codes = new Set(rows.map((p) => p.code));
  for (const star of STAR_CODES) {
    if (!codes.has(star)) {
      throw new Error(`missing star acupoint ${star}`);
    }
  }
  return rows;
}
