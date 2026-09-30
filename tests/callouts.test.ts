import { describe, expect, it } from "vitest";
import { loadAcupoints } from "@/data";
import { instancesOnView } from "@/atlas/mapCoords";
import { calloutHitPx, calloutHitSize, estimateLabelPx, layoutMarginCallouts, type Callout, type CalloutInput } from "@/atlas/callouts";
import { CENTERS, dantianProbeGapPx, dantianProbeRadiusPx, placeDantianSeal } from "@/atlas/centers";
import { unitsPerPx, visibleRect } from "@/atlas/screen";
import type { AtlasView, Point2D } from "@/types";

const FIGURE = { l: 97.6, r: 702.4 };

function inputs(view: AtlasView): CalloutInput[] {
  const byId = new Map<string, CalloutInput>();
  for (const p of loadAcupoints()) {
    for (const inst of instancesOnView(p, view, true)) {
      const text = `${p.code} ${p.names.zh}`;
      const row = byId.get(p.id) ?? { key: p.id, text, anchors: [], widthPx: estimateLabelPx(text, 12) };
      row.anchors.push(inst.position);
      byId.set(p.id, row);
    }
  }
  return [...byId.values()];
}

function frame(w: number, h: number) {
  const k = unitsPerPx(800, 1600, { w, h });
  return { view: visibleRect({ x: 400, y: 800 }, k, { w, h }), figure: FIGURE, k };
}

type Seg = [number, number, number, number];
function segs(c: Callout): Seg[] {
  return [
    [c.from.x, c.from.y, c.bend.x, c.bend.y],
    [c.bend.x, c.bend.y, c.to.x, c.to.y],
  ];
}
function cross(a: Seg, b: Seg): boolean {
  const o = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) =>
    Math.sign((bx - ax) * (cy - ay) - (by - ay) * (cx - ax));
  return (
    o(a[0], a[1], a[2], a[3], b[0], b[1]) * o(a[0], a[1], a[2], a[3], b[2], b[3]) < 0 &&
    o(b[0], b[1], b[2], b[3], a[0], a[1]) * o(b[0], b[1], b[2], b[3], a[2], a[3]) < 0
  );
}

describe("margin callouts", () => {
  for (const view of ["anterior", "posterior"] as const) {
    it(`${view}: every star point gets one label, no overlap, no crossing, desktop 1358×690`, () => {
      const items = inputs(view);
      const laid = layoutMarginCallouts(items, frame(1358, 690));
      expect(laid).not.toBeNull();
      expect(laid!.map((c) => c.key).sort()).toEqual(items.map((i) => i.key).sort());
      for (let i = 0; i < laid!.length; i += 1) {
        for (let j = i + 1; j < laid!.length; j += 1) {
          const a = laid![i]!;
          const b = laid![j]!;
          const apart = a.box.r <= b.box.l || b.box.r <= a.box.l || a.box.b <= b.box.t || b.box.b <= a.box.t;
          expect(apart, `${a.key} vs ${b.key}`).toBe(true);
          for (const sa of segs(a)) for (const sb of segs(b)) expect(cross(sa, sb), `${a.key} x ${b.key}`).toBe(false);
        }
      }
      const f = frame(1358, 690);
      for (const c of laid!) {
        expect(c.box.l).toBeGreaterThanOrEqual(f.view.l);
        expect(c.box.r).toBeLessThanOrEqual(f.view.r);
        expect(c.side === "left" ? c.box.r < FIGURE.l : c.box.l > FIGURE.r).toBe(true);
      }
    });
  }

  it("falls back to hover labels when the margin is too narrow (phone 350×500)", () => {
    expect(layoutMarginCallouts(inputs("anterior"), frame(350, 500))).toBeNull();
  });
});

describe("callout hit box", () => {
  it("stays above the census 24px floor on a fine pointer and 44px on a coarse one", () => {
    expect(calloutHitPx(false)).toBeGreaterThanOrEqual(28);
    expect(calloutHitPx(true)).toBeGreaterThanOrEqual(44);
    const fine = calloutHitSize({ l: 0, t: 0, r: 40, b: 12 }, 1.2, false);
    const coarse = calloutHitSize({ l: 0, t: 0, r: 40, b: 12 }, 1.2, true);
    expect(fine.h).toBeGreaterThanOrEqual(28 * 1.2);
    expect(coarse.h).toBeGreaterThanOrEqual(44 * 1.2);
    expect(fine.h / 2).toBeLessThan(22 * 1.2);
  });
});

describe("dantian seal clearance", () => {
  const windows = [
    { w: 1072, h: 709 },
    { w: 374, h: 612 },
  ];
  for (const box of windows) {
    for (const view of ["anterior", "posterior"] as const) {
      for (const zoom of [1, 1.75]) {
        it(`${view} ${box.w}×${box.h} zoom ${zoom}: no seal sits under 6px from a point`, () => {
          const k = unitsPerPx(800 / zoom, 1600 / zoom, box);
          const spots: Point2D[] = [];
          for (const point of loadAcupoints()) {
            for (const inst of instancesOnView(point, view, true)) spots.push(inst.position);
          }
          const radius = dantianProbeRadiusPx(zoom);
          for (const center of CENTERS) {
            const anchor = view === "posterior" ? center.posterior : center.anterior;
            if (!anchor) continue;
            const frozen = { x: anchor.x, y: anchor.y };
            const { draw } = placeDantianSeal(anchor, spots, k, radius);
            expect(anchor).toEqual(frozen);
            for (const spot of spots) {
              const gap = dantianProbeGapPx(draw, spot, k, radius);
              expect(gap, `${center.id} vs ${spot.x},${spot.y}`).toBeGreaterThanOrEqual(6);
            }
          }
        });
      }
    }
  }
});
