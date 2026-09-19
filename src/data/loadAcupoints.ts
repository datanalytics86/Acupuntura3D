import seedJson from "@data/acupoints.seed.json";
import type { Acupoint } from "@/types";
import { STAR_CODES } from "./ids";

export function loadAcupoints(): Acupoint[] {
  const rows = seedJson as Acupoint[];
  if (rows.length !== 20) {
    throw new Error(`acupoints.seed.json must have 20 rows, got ${rows.length}`);
  }
  const codes = rows.map((p) => p.code);
  for (let i = 0; i < STAR_CODES.length; i += 1) {
    if (codes[i] !== STAR_CODES[i]) {
      throw new Error(`star code mismatch at ${i}: expected ${STAR_CODES[i]}, got ${codes[i]}`);
    }
  }
  return rows;
}
