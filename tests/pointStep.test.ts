import { describe, expect, it } from "vitest";
import { loadAcupoints } from "@/data";
import { stepPoint } from "@/lib/pointStep";

describe("stepPoint", () => {
  const points = loadAcupoints();

  it("steps off a one-point channel instead of staying on ST36", () => {
    const st36 = points.find((pt) => pt.code === "ST36");
    expect(st36).toBeTruthy();
    const next = stepPoint(points, st36!.id, 1);
    expect(next?.code).not.toBe("ST36");
    expect(stepPoint(points, next!.id, -1)?.code).toBe("ST36");
  });

  it("keeps GB34 inside the gallbladder channel", () => {
    const gb34 = points.find((pt) => pt.code === "GB34");
    expect(stepPoint(points, gb34!.id, 1)?.code).toBe("GB20");
    expect(stepPoint(points, gb34!.id, -1)?.code).toBe("GB20");
  });
});
