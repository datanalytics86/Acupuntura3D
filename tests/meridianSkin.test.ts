import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadAcupoints, loadMeridians } from "@/data";
import { samplePath } from "@/atlas/catmullRom";
import { decodePngAlpha } from "./pngAlpha";

/** Same rects as src/atlas/figure/Figure.tsx and tests/skin.test.ts. */
const PLATES = {
  anterior: { x: 97.61, y: 40, w: 604.79, h: 1440, file: "public/atlas/body-anterior.png" },
  posterior: { x: 97.47, y: 40, w: 605.06, h: 1440, file: "public/atlas/body-posterior.png" },
} as const;
const OFF = 4;
const MAX_OFF = 6;
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function skinDistance(view: keyof typeof PLATES) {
  const p = PLATES[view];
  const img = decodePngAlpha(join(root, p.file));
  const s = Math.min(p.w / img.width, p.h / img.height);
  const ox = p.x + (p.w - img.width * s) / 2;
  const oy = p.y + (p.h - img.height * s) / 2;
  const on = (x: number, y: number) => {
    const px = Math.round((x - ox) / s);
    const py = Math.round((y - oy) / s);
    if (px < 0 || py < 0 || px >= img.width || py >= img.height) return false;
    return (img.alpha[py * img.width + px] ?? 0) > 16;
  };
  return (x: number, y: number) => {
    if (on(x, y)) return 0;
    for (let r = 1; r <= 60; r += 1) {
      for (let a = 0; a < 32; a += 1) {
        const t = (a / 32) * Math.PI * 2;
        if (on(x + r * Math.cos(t), y + r * Math.sin(t))) return r;
      }
    }
    return 99;
  };
}

describe("meridian traces stay on the skin", () => {
  const meridians = loadMeridians();
  for (const view of ["anterior", "posterior"] as const) {
    it(`${view}: ≤0.5% of samples more than ${OFF}u off skin, none past ${MAX_OFF}u`, () => {
      const dist = skinDistance(view);
      let total = 0;
      const off: string[] = [];
      for (const m of meridians) {
        const anchors = m.anchors2d?.[view];
        if (!anchors || anchors.length < 2) continue;
        for (const p of samplePath(anchors, 4)) {
          total += 1;
          const d = dist(p.x, p.y);
          if (d > OFF) off.push(`${m.id}@${p.x.toFixed(0)},${p.y.toFixed(0)}=${d}u`);
          expect(d, `${m.id} ${view} at ${p.x.toFixed(0)},${p.y.toFixed(0)}`).toBeLessThanOrEqual(MAX_OFF);
        }
      }
      expect(off.length / total, off.slice(0, 12).join(" ")).toBeLessThanOrEqual(0.005);
    });
  }

  it("every seed point sits on its own meridian trace (≤ 8u) where that trace is drawn", () => {
    const misses: string[] = [];
    for (const pt of loadAcupoints()) {
      const m = meridians.find((row) => row.id === pt.meridianId);
      for (const view of pt.views ?? []) {
        const anchors = m?.anchors2d?.[view];
        const pos = pt.position2d?.[view];
        if (!anchors || anchors.length < 2 || !pos) continue;
        const near = Math.min(...samplePath(anchors, 1).map((s) => Math.hypot(s.x - pos.x, s.y - pos.y)));
        if (near > 8) misses.push(`${pt.code}/${view}=${near.toFixed(1)}u`);
      }
    }
    expect(misses).toEqual([]);
  });

  it("first-to-last anchor follows the declared flow", () => {
    const lateral = (p: { x: number }) => Math.abs(p.x - 400);
    for (const m of meridians) {
      for (const view of ["anterior", "posterior"] as const) {
        const anchors = m.anchors2d?.[view];
        if (!anchors || anchors.length < 2) continue;
        const a = anchors[0]!;
        const b = anchors[anchors.length - 1]!;
        const where = `${m.id} ${view} ${m.flow}`;
        if (m.flow === "head-to-foot") {
          expect(b.y, where).toBeGreaterThan(a.y);
        } else if (m.flow === "foot-to-chest" || m.flow.startsWith("ascending-")) {
          expect(b.y, where).toBeLessThan(a.y);
        } else if (m.flow === "chest-to-hand") {
          expect(lateral(b), where).toBeGreaterThan(lateral(a));
        } else if (m.flow === "hand-to-head") {
          expect(lateral(b), where).toBeLessThan(lateral(a));
        }
      }
    }
  });
});
