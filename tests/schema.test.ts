import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AnySchema } from "ajv";
import Ajv from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function readJson(rel: string): unknown {
  return JSON.parse(readFileSync(join(root, rel), "utf8"));
}

describe("json schemas", () => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const meridianSchema = readJson("data/schema/meridian.schema.json") as AnySchema;
  const acupointSchema = readJson("data/schema/acupoint.schema.json") as AnySchema;
  const validateMeridian = ajv.compile(meridianSchema);
  const validateAcupoint = ajv.compile(acupointSchema);

  it("validates every meridian row", () => {
    const rows = readJson("data/meridians.json") as unknown[];
    expect(rows).toHaveLength(14);
    for (const row of rows) {
      const ok = validateMeridian(row);
      expect(ok, JSON.stringify(validateMeridian.errors)).toBe(true);
    }
  });

  it("validates every seed acupoint row", () => {
    const rows = readJson("data/acupoints.seed.json") as unknown[];
    expect(rows.length).toBeGreaterThanOrEqual(20);
    for (const row of rows) {
      const ok = validateAcupoint(row);
      expect(ok, JSON.stringify(validateAcupoint.errors)).toBe(true);
    }
  });
});
