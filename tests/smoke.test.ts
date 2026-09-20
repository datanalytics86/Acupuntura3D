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
      position2d?: { anterior?: { x: number; y: number } };
    }[];
    const codes = seed.map((p) => p.code);
    expect(seed.length).toBeGreaterThanOrEqual(20);
    for (const star of STAR_CODES) {
      expect(codes).toContain(star);
    }
    const st36 = seed.find((p) => p.code === "ST36");
    expect(st36?.names.zh).toBe("足三里");
    const li4 = seed.find((p) => p.code === "LI4");
    const sp6 = seed.find((p) => p.code === "SP6");
    expect(li4?.precautions.some((x) => x.toLowerCase().includes("embarazo"))).toBe(true);
    expect(sp6?.precautions.some((x) => x.toLowerCase().includes("embarazo"))).toBe(true);
    const cv12 = seed.find((p) => p.code === "CV12");
    expect(cv12?.names.zh).toBe("中脘");
    expect(st36?.position2d?.anterior).toBeTruthy();
  });

  it("OMS classic pointCounts sum to 361 and GV/CV have no clockHour", () => {
    const meridians = JSON.parse(readFileSync(join(root, "data/meridians.json"), "utf8")) as {
      id: string;
      pointCount: number;
      clockHour?: number;
      pointCodes: string[];
    }[];
    expect(meridians.reduce((sum, m) => sum + m.pointCount, 0)).toBe(361);
    const gv = meridians.find((m) => m.id === "GV");
    const cv = meridians.find((m) => m.id === "CV");
    expect(gv?.clockHour).toBeUndefined();
    expect(cv?.clockHour).toBeUndefined();
    expect(gv?.pointCodes).toHaveLength(28);
    expect(cv?.pointCodes).toHaveLength(24);
  });

  it("does not mount R3F Canvas in App", () => {
    const app = readFileSync(join(root, "src/app/App.tsx"), "utf8");
    expect(app).not.toMatch(/@react-three\/fiber/);
    expect(app).toMatch(/AtlasRoot/);
  });
});
