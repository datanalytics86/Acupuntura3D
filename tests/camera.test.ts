import { describe, expect, it } from "vitest";
import { clientToUnits, lerpCamera, zoomAbout } from "@/atlas/camera";
import { VIEW_H, VIEW_W } from "@/atlas/figure/landmarks";
import { REGION_FOCUS, regionFrame } from "@/atlas/regionFrames";
import { unitsPerPx } from "@/atlas/screen";
import { loadAcupoints } from "@/data";
import { STAR_CODES } from "@/data/ids";
import type { AtlasRegion, AtlasView, Point2D } from "@/types";

describe("camera", () => {
  it("keeps the cursor anchor fixed while zooming", () => {
    const box = { w: 1000, h: 800 };
    const rect = { left: 0, top: 0, width: box.w, height: box.h };
    const cam = { pan: { x: 400, y: 800 }, zoom: 1 };
    const cursor = { x: 700, y: 200 };
    const before = clientToUnits(cursor, rect, cam.pan, unitsPerPx(800 / cam.zoom, 1600 / cam.zoom, box));
    const next = zoomAbout(cam, 2, before);
    const after = clientToUnits(cursor, rect, next.pan, unitsPerPx(800 / next.zoom, 1600 / next.zoom, box));
    expect(after.x).toBeCloseTo(before.x, 6);
    expect(after.y).toBeCloseTo(before.y, 6);
  });

  it("lands exactly on the target and clamps zoom", () => {
    const a = { pan: { x: 400, y: 800 }, zoom: 1 };
    const b = { pan: { x: 338, y: 1185 }, zoom: 2.4 };
    expect(lerpCamera(a, b, 0)).toEqual(a);
    const end = lerpCamera(a, b, 1);
    expect(end.pan).toEqual(b.pan);
    expect(end.zoom).toBeCloseTo(2.4, 9);
    expect(zoomAbout(a, 100, a.pan).zoom).toBe(6);
    expect(zoomAbout(a, 0.01, a.pan).zoom).toBe(1);
  });
});

function frameHolds(region: AtlasRegion, view: AtlasView, pos: Point2D): boolean {
  const frame = regionFrame(region, view);
  const hw = VIEW_W / frame.zoom / 2;
  const hh = VIEW_H / frame.zoom / 2;
  return Math.abs(pos.x - frame.pan.x) <= hw && Math.abs(pos.y - frame.pan.y) <= hh;
}

/** True when a disk of `margin` units around `p` lies inside the ellipse. */
function insideWithMargin(
  p: Point2D,
  e: { cx: number; cy: number; rx: number; ry: number },
  margin: number,
): boolean {
  const onEllipse = (x: number, y: number) => {
    const nx = (x - e.cx) / e.rx;
    const ny = (y - e.cy) / e.ry;
    return nx * nx + ny * ny <= 1 + 1e-9;
  };
  if (!onEllipse(p.x, p.y)) return false;
  const steps = 48;
  for (let i = 0; i < steps; i += 1) {
    const a = (i / steps) * Math.PI * 2;
    if (!onEllipse(p.x + Math.cos(a) * margin, p.y + Math.sin(a) * margin)) return false;
  }
  return true;
}

describe("REGION_FOCUS", () => {
  it("keeps each regional star point at least 16u inside its ellipse", () => {
    expect(REGION_FOCUS.body).toBeNull();
    const stars = new Set<string>(STAR_CODES);
    const points = loadAcupoints().filter((p) => stars.has(p.code));
    for (const region of ["face", "hand", "foot"] as const) {
      const focus = REGION_FOCUS[region];
      expect(focus).not.toBeNull();
      if (!focus) continue;
      let n = 0;
      for (const point of points) {
        for (const view of ["anterior", "posterior"] as const) {
          const pos = point.position2d?.[view];
          if (!pos || !frameHolds(region, view, pos)) continue;
          n += 1;
          expect(insideWithMargin(pos, focus, 16)).toBe(true);
        }
      }
      expect(n).toBeGreaterThan(0);
    }
  });
});
