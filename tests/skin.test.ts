import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { decodePngAlpha, type PngAlpha } from "./pngAlpha";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Same rects as src/atlas/figure/Figure.tsx. Image uses xMidYMid meet. */
const PLATES = {
  anterior: {
    x: 97.61,
    y: 40,
    width: 604.79,
    height: 1440,
    file: "public/atlas/body-anterior.png",
  },
  posterior: {
    x: 97.47,
    y: 40,
    width: 605.06,
    height: 1440,
    file: "public/atlas/body-posterior.png",
  },
} as const;

const TOLERANCE = 12;
const ALPHA_SKIN = 16;

type ViewName = keyof typeof PLATES;

interface SeedPoint {
  code: string;
  names: { zh: string };
  precautions: string[];
  views?: ViewName[];
  position2d?: Partial<Record<ViewName, { x: number; y: number }>>;
}

function readJson(rel: string): unknown {
  return JSON.parse(readFileSync(join(root, rel), "utf8"));
}

function meetMap(plate: { x: number; y: number; width: number; height: number }, img: PngAlpha) {
  const scale = Math.min(plate.width / img.width, plate.height / img.height);
  return {
    scale,
    ox: plate.x + (plate.width - img.width * scale) / 2,
    oy: plate.y + (plate.height - img.height * scale) / 2,
  };
}

/** Distance in viewBox units from (vx,vy) to the nearest pixel with alpha > 16. */
function nearestSkin(
  img: PngAlpha,
  map: { ox: number; oy: number; scale: number },
  vx: number,
  vy: number,
): number {
  const px = (vx - map.ox) / map.scale;
  const py = (vy - map.oy) / map.scale;
  const rad = Math.ceil(TOLERANCE / map.scale) + 2;
  const x0 = Math.max(0, Math.floor(px - rad));
  const x1 = Math.min(img.width - 1, Math.ceil(px + rad));
  const y0 = Math.max(0, Math.floor(py - rad));
  const y1 = Math.min(img.height - 1, Math.ceil(py + rad));
  let best = Number.POSITIVE_INFINITY;
  for (let y = y0; y <= y1; y++) {
    const row = y * img.width;
    for (let x = x0; x <= x1; x++) {
      if ((img.alpha[row + x] ?? 0) <= ALPHA_SKIN) continue;
      const left = map.ox + x * map.scale;
      const top = map.oy + y * map.scale;
      const cx = Math.max(left, Math.min(vx, left + map.scale));
      const cy = Math.max(top, Math.min(vy, top + map.scale));
      const dist = Math.hypot(vx - cx, vy - cy);
      if (dist < best) best = dist;
      if (best === 0) return 0;
    }
  }
  return best;
}

describe("seed on skin", () => {
  const seed = readJson("data/acupoints.seed.json") as SeedPoint[];
  const images = {
    anterior: decodePngAlpha(join(root, PLATES.anterior.file)),
    posterior: decodePngAlpha(join(root, PLATES.posterior.file)),
  } as const;

  it("decodes real alpha on both plates", () => {
    for (const view of ["anterior", "posterior"] as const) {
      const img = images[view];
      expect(img.width).toBe(1874);
      expect(img.alpha.length).toBe(img.width * img.height);
      let clear = 0;
      let opaque = 0;
      for (let i = 0; i < img.alpha.length; i++) {
        const a = img.alpha[i] ?? 0;
        if (a === 0) clear += 1;
        else if (a > ALPHA_SKIN) opaque += 1;
      }
      expect(clear).toBeGreaterThan(0);
      expect(opaque).toBeGreaterThan(0);
      const map = meetMap(PLATES[view], img);
      expect(nearestSkin(img, map, 8, 8)).toBeGreaterThan(TOLERANCE);
    }
  });

  it("keeps every declared position2d within 12 viewBox units of skin", () => {
    expect(seed).toHaveLength(20);
    const hits: string[] = [];
    for (const row of seed) {
      const views = row.views ?? [];
      expect(views.length, row.code).toBeGreaterThan(0);
      for (const view of views) {
        const pos = row.position2d?.[view];
        expect(pos, `${row.code} ${view}`).toBeTruthy();
        if (!pos) continue;
        const img = images[view];
        const dist = nearestSkin(img, meetMap(PLATES[view], img), pos.x, pos.y);
        expect(dist, `${row.code} ${view} dist=${dist}`).toBeLessThanOrEqual(TOLERANCE);
        hits.push(`${row.code}:${view}`);
      }
    }
    expect(hits).toHaveLength(21);
    expect(hits).toContain("GV20:anterior");
    expect(hits).toContain("GV20:posterior");
  });

  it("uses precautions for pregnancy and keeps the WHO hanzi", () => {
    const schema = readFileSync(join(root, "data/schema/acupoint.schema.json"), "utf8");
    expect(schema).toMatch(/"precautions"/);
    expect(schema).not.toMatch(/pregnancyCaution/);
    for (const code of ["LI4", "SP6"] as const) {
      const row = seed.find((p) => p.code === code);
      expect(row?.precautions.some((item) => item.toLowerCase().includes("embarazo"))).toBe(true);
      expect(row && "pregnancyCaution" in row).toBe(false);
    }
    expect(seed.find((p) => p.code === "CV12")?.names.zh).toBe("中脘");
    expect(seed.find((p) => p.code === "ST36")?.names.zh).toBe("足三里");
  });

  it("leaves unmapped empty because every seed view has position2d", () => {
    const unmapped = readJson("data/unmapped.json") as unknown[];
    const missing = seed
      .filter((row) => {
        const views = row.views ?? [];
        if (views.length === 0) return true;
        return views.some((view) => {
          const pos = row.position2d?.[view];
          return !pos || !Number.isFinite(pos.x) || !Number.isFinite(pos.y);
        });
      })
      .map((row) => row.code);
    expect(missing).toEqual([]);
    expect(unmapped).toEqual([]);
  });
});
