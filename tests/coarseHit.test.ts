import { describe, expect, it } from "vitest";
import { clusterGapPx, nearestWithin, pointWinsOverSeal } from "@/atlas/coarseHit";

describe("nearestWithin", () => {
  const marks = [
    { id: "ST36", x: 0, y: 0 },
    { id: "GB34", x: 18, y: 0 },
  ];

  it("picks the mark under the tap when a larger neighbor circle would have won", () => {
    expect(nearestWithin(marks, 0, 0, 22)?.id).toBe("ST36");
    expect(nearestWithin(marks, 18, 0, 22)?.id).toBe("GB34");
  });

  it("returns nothing outside the radius", () => {
    expect(nearestWithin(marks, 41, 0, 22)).toBeNull();
  });

  it("lets a seal keep a tap that is not closer to a point", () => {
    expect(pointWinsOverSeal(0, 22, 22)).toBe(true);
    expect(pointWinsOverSeal(22, 0, 22)).toBe(false);
    expect(pointWinsOverSeal(11, 11, 22)).toBe(false);
    expect(pointWinsOverSeal(0, 0, 22)).toBe(true);
    expect(pointWinsOverSeal(10, 12, 22)).toBe(true);
  });

  it("groups only halos that cover each other", () => {
    const gap = clusterGapPx();
    const li4Si3 = 11.18;
    const sp6Ki3 = 45.18;
    const st36Gb34 = 50.99;
    const bodyDesktopK = 2.257;
    const bodyMobileZoomedK = 1.993;
    const handMobileK = 0.537;
    expect(gap * bodyDesktopK).toBeGreaterThan(li4Si3);
    expect(gap * bodyDesktopK).toBeLessThan(st36Gb34);
    expect(gap * bodyMobileZoomedK).toBeLessThan(sp6Ki3);
    expect(gap * handMobileK).toBeLessThan(li4Si3);
  });

  it("keeps the earlier mark on an exact tie", () => {
    const pair = [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 10, y: 0 },
    ];
    expect(nearestWithin(pair, 5, 0, 22)?.id).toBe("A");
  });
});
