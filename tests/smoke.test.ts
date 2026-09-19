import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const MERIDIAN_IDS = [
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
];

const STAR_CODES = [
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
];

describe("seed data", () => {
  it("has 14 meridians in OMS order", () => {
    const meridians = JSON.parse(readFileSync(join(root, "data/meridians.json"), "utf8")) as {
      id: string;
    }[];
    expect(meridians.map((m) => m.id)).toEqual(MERIDIAN_IDS);
    expect(meridians).toHaveLength(14);
  });

  it("has 20 star acupoints", () => {
    const seed = JSON.parse(readFileSync(join(root, "data/acupoints.seed.json"), "utf8")) as {
      code: string;
      names: { zh: string };
      precautions: string[];
    }[];
    expect(seed.map((p) => p.code)).toEqual(STAR_CODES);
    expect(seed).toHaveLength(20);
    const st36 = seed.find((p) => p.code === "ST36");
    expect(st36?.names.zh).toBe("足三里");
    const li4 = seed.find((p) => p.code === "LI4");
    const sp6 = seed.find((p) => p.code === "SP6");
    expect(li4?.precautions.some((x) => x.toLowerCase().includes("embarazo"))).toBe(true);
    expect(sp6?.precautions.some((x) => x.toLowerCase().includes("embarazo"))).toBe(true);
    const cv12 = seed.find((p) => p.code === "CV12");
    expect(cv12?.names.zh).toBe("中脘");
  });
});
