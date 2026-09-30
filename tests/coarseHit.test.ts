import { describe, expect, it } from "vitest";
import { nearestWithin, pointWinsOverSeal } from "@/atlas/coarseHit";

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
    expect(pointWinsOverSeal(10, 12, 22)).toBe(true);
  });

  it("keeps the earlier mark on an exact tie", () => {
    const pair = [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 10, y: 0 },
    ];
    expect(nearestWithin(pair, 5, 0, 22)?.id).toBe("A");
  });
});
