import { describe, expect, it } from "vitest";
import { CENTERS } from "@/atlas/centers";
import { loadAcupoints } from "@/data";
import { inRegionFrame, noteRegionPlate } from "@/atlas/regionFrames";

const WINDOWS = [
  { w: 0, h: 0 },
  { w: 1072, h: 709 },
  { w: 784, h: 709 },
  { w: 560, h: 709 },
  { w: 374, h: 612 },
  { w: 1600, h: 800 },
];

describe("region frames", () => {
  it("keeps the lower dantian off the hand and shows both feet", () => {
    const lower = CENTERS.find((c) => c.id === "lower")!.anterior!;
    const upper = CENTERS.find((c) => c.id === "upper")!.anterior!;
    const upperBack = CENTERS.find((c) => c.id === "upper")!.posterior!;
    const feet = ["SP6", "KI3", "LR3"].map((code) => {
      const pos = loadAcupoints().find((p) => p.code === code)?.position2d?.anterior;
      if (!pos) throw new Error(`missing ${code}`);
      return pos;
    });
    for (const box of WINDOWS) {
      noteRegionPlate(box);
      const tag = `${box.w}x${box.h}`;
      expect(inRegionFrame("body", "anterior", lower), tag).toBe(true);
      expect(inRegionFrame("hand", "anterior", lower), tag).toBe(false);
      expect(inRegionFrame("foot", "anterior", lower), tag).toBe(false);
      expect(inRegionFrame("face", "anterior", lower), tag).toBe(false);
      expect(inRegionFrame("face", "anterior", upper), tag).toBe(true);
      expect(inRegionFrame("face", "posterior", upperBack), tag).toBe(true);
      for (const pos of feet) {
        expect(inRegionFrame("foot", "anterior", pos), `${tag} ${pos.x}`).toBe(true);
        expect(inRegionFrame("foot", "anterior", { x: 800 - pos.x, y: pos.y }), `${tag} mirror ${pos.x}`).toBe(true);
      }
    }
    noteRegionPlate({ w: 0, h: 0 });
  });
});
