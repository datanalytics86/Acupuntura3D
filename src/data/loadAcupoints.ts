import seedJson from "@data/acupoints.seed.json";
import type { Acupoint } from "@/types";
import { STAR_CODES } from "./ids";

export function loadAcupoints(): Acupoint[] {
  const rows = seedJson as Acupoint[];
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
