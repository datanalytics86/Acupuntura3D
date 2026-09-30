import { describe, expect, it } from "vitest";
import { CENTERS } from "@/atlas/centers";
import { inRegionFrame } from "@/atlas/regionFrames";

describe("region frames", () => {
  it("keeps the lower dantian on the body plate and off the hand", () => {
    const lower = CENTERS.find((c) => c.id === "lower")!.anterior!;
    const upper = CENTERS.find((c) => c.id === "upper")!.anterior!;
    expect(inRegionFrame("body", "anterior", lower)).toBe(true);
    expect(inRegionFrame("hand", "anterior", lower)).toBe(false);
    expect(inRegionFrame("foot", "anterior", lower)).toBe(false);
    expect(inRegionFrame("face", "anterior", lower)).toBe(false);
    expect(inRegionFrame("face", "anterior", upper)).toBe(true);
    expect(inRegionFrame("face", "posterior", CENTERS.find((c) => c.id === "upper")!.posterior!)).toBe(true);
  });
});
