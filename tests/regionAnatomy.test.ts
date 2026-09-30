import { describe, expect, it } from "vitest";
import { loadAcupoints } from "@/data";
import { REGION_ANATOMY, fitRegion, focusEllipse } from "@/atlas/regionAnatomy";
import { unitsPerPx, visibleRect } from "@/atlas/screen";

const WINDOWS = [
  { w: 1072, h: 709 },
  { w: 784, h: 709 },
  { w: 560, h: 709 },
  { w: 374, h: 612 },
];
const REGIONS = ["face", "hand", "foot"] as const;
const VIEWS = ["anterior", "posterior"] as const;

describe("detail plates frame whole anatomy", () => {
  it("fitRegion shows the whole anatomy box in every window size", () => {
    for (const region of REGIONS) {
      for (const view of VIEWS) {
        for (const box of WINDOWS) {
          const cam = fitRegion(region, view, box);
          expect(cam.zoom).toBeGreaterThanOrEqual(1);
          expect(cam.zoom).toBeLessThanOrEqual(6);
          const k = unitsPerPx(800 / cam.zoom, 1600 / cam.zoom, box);
          const vis = visibleRect(cam.pan, k, box);
          const a = REGION_ANATOMY[region][view];
          const tag = `${region}/${view} ${box.w}×${box.h}`;
          if (cam.zoom > 1) {
            expect(vis.l, tag).toBeLessThanOrEqual(a.l);
            expect(vis.r, tag).toBeGreaterThanOrEqual(a.r);
            expect(vis.t, tag).toBeLessThanOrEqual(a.t);
            expect(vis.b, tag).toBeGreaterThanOrEqual(a.b);
          }
        }
      }
    }
  });

  it("the solid loupe holds the four corners of the anatomy box (no cut through the face)", () => {
    for (const region of REGIONS) {
      for (const view of VIEWS) {
        const e = focusEllipse(region, view);
        const a = REGION_ANATOMY[region][view];
        for (const [x, y] of [[a.l, a.t], [a.r, a.t], [a.l, a.b], [a.r, a.b]] as const) {
          expect(((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2, `${region}/${view}`).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it("every star point of a region sits inside its anatomy box", () => {
    const members: Record<(typeof REGIONS)[number], string[]> = {
      face: ["GV20", "EX-HN3", "GB20", "GV14", "EX-B1"],
      hand: ["LI4", "LU7", "HT7", "PC6", "TE5", "SI3"],
      foot: ["SP6", "KI3", "LR3"],
    };
    for (const region of REGIONS) {
      for (const code of members[region]) {
        const pt = loadAcupoints().find((p) => p.code === code);
        for (const view of VIEWS) {
          const pos = pt?.position2d?.[view];
          if (!pos) continue;
          const a = REGION_ANATOMY[region][view];
          const x = Math.min(pos.x, 800 - pos.x);
          expect(x >= a.l && x <= a.r && pos.y >= a.t && pos.y <= a.b, `${code} ${view} in ${region}`).toBe(true);
        }
      }
    }
  });
});
