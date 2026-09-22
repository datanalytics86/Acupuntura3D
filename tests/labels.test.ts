import { describe, expect, it } from "vitest";
import { layoutCallouts, type CalloutSeed } from "../src/atlas/Points2D";

const NECK: CalloutSeed[] = [
  { key: "L", x: 364, y: 260.8, anchor: "end", text: "EX-B1 定喘" },
  { key: "C", x: 400, y: 248, anchor: "middle", text: "GV14 大椎" },
  { key: "R", x: 436, y: 260.8, anchor: "start", text: "EX-B1 定喘" },
];

function gap(a: { l: number; t: number; r: number; b: number }, b: { l: number; t: number; r: number; b: number }) {
  const dx = Math.max(0, Math.max(a.l, b.l) - Math.min(a.r, b.r));
  const dy = Math.max(0, Math.max(a.t, b.t) - Math.min(a.b, b.b));
  return Math.max(dx, dy);
}

describe("posterior neck callouts", () => {
  it("keeps GV14 clear of both EX-B1 labels", () => {
    const laid = layoutCallouts(NECK);
    const boxes = ["L", "C", "R"].map((key) => laid.get(key)!.box);
    expect(gap(boxes[0]!, boxes[1]!)).toBeGreaterThanOrEqual(4);
    expect(gap(boxes[1]!, boxes[2]!)).toBeGreaterThanOrEqual(4);
    expect(gap(boxes[0]!, boxes[2]!)).toBeGreaterThanOrEqual(4);
    expect(laid.get("C")!.box.l).toBeGreaterThan(laid.get("L")!.box.r - 1);
    expect(laid.get("R")!.box.l).toBeGreaterThan(laid.get("C")!.box.r - 1);
  });
});
