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

describe("Encarta figure", () => {
  it("keeps the 800×1600 landmark contract", async () => {
    const { VIEW_W, VIEW_H, Y } = await import("../src/atlas/figure/landmarks");
    expect(VIEW_W).toBe(800);
    expect(VIEW_H).toBe(1600);
    expect(Y.vertex).toBe(40);
    expect(Y.sole).toBe(1480);
  });

  it("paints licensed surface plates instead of the parametric kit", () => {
    const figure = readFileSync(join(root, "src/atlas/figure/Figure.tsx"), "utf8");
    expect(figure).toMatch(/body-anterior\.png/);
    expect(figure).toMatch(/body-posterior\.png/);
    expect(figure).not.toMatch(/fingerD\(|capsuleD\(|ellipseD\(|encSkin|@react-three|<Canvas/);
    for (const file of ["anterior.ts", "posterior.ts", "palette.ts"]) {
      const text = readFileSync(join(root, "src/atlas/figure/parts", file), "utf8");
      expect(text).not.toMatch(/fingerD\(|capsuleD\(|ellipseD\(|TRUNK_OUTER|encSkin/);
    }
    expect(readFileSync(join(root, "src/atlas/AtlasRoot.tsx"), "utf8")).not.toMatch(/rounded-\[8px\]/);
    expect(readFileSync(join(root, "src/atlas/figure/PlateTitle.tsx"), "utf8")).toMatch(
      /Cuerpo humano — vista anterior/,
    );
  });

  it("attributes Goran tek-en and does not scan a commercial atlas", () => {
    const attr = readFileSync(join(root, "public/atlas/ATTRIBUTION.md"), "utf8");
    expect(attr).toMatch(/Goran tek-en/);
    expect(attr).toMatch(/CC BY-SA 4\.0/);
    expect(attr).toMatch(/commons\.wikimedia\.org\/wiki\/File:Male_front_3d-shaded_human_illustration\.svg/);
    expect(attr).toMatch(/commons\.wikimedia\.org\/wiki\/File:Male_back_3d-shaded_human_illustration\.svg/);
    expect(attr.toLowerCase()).toMatch(/not scans/);
  });

  it("marks three didactic dantian without clinical claims", async () => {
    const { CENTERS, matchCenter } = await import("../src/atlas/centers");
    expect(CENTERS.map((c) => c.zh)).toEqual(["上丹田", "中丹田", "下丹田"]);
    expect(matchCenter("dan tien")?.id).toBe("lower");
    expect(matchCenter("上丹田")?.id).toBe("upper");
    for (const center of CENTERS) {
      expect(`${center.noteEs} ${center.noteEn}`.toLowerCase()).toMatch(/baja|low/);
      expect(`${center.noteEs} ${center.anchorEs}`.toLowerCase()).not.toMatch(/cura|trata|diagnos/);
    }
  });

  it("ships plate previews", () => {
    expect(readFileSync(join(root, "public/atlas/preview-anterior.svg"), "utf8")).toMatch(
      /body-anterior\.png/,
    );
    expect(readFileSync(join(root, "public/atlas/preview-posterior.svg"), "utf8")).toMatch(
      /body-posterior\.png/,
    );
  });

  it("paints the atlas on encyclopedia paper", () => {
    const css = readFileSync(join(root, "src/app/index.css"), "utf8");
    const viewport = readFileSync(join(root, "src/atlas/Viewport.tsx"), "utf8");
    expect(css).toMatch(/--color-paper/);
    expect(css).not.toMatch(/background: #07090d/);
    expect(viewport).toMatch(/var\(--color-paper\)/);
    expect(viewport).not.toMatch(/#07090d/);
  });
});
