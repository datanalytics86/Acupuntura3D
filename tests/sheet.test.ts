import { describe, expect, it } from "vitest";
import { nextSnap } from "@/ui/Sheet";

describe("nextSnap", () => {
  it("sends a fast upward fling from peek to full", () => {
    expect(nextSnap("peek", -36, -1.2)).toBe("full");
    expect(nextSnap("peek", -12, -2)).toBe("full");
  });

  it("sends a moderate upward fling from peek to half", () => {
    expect(nextSnap("peek", -8, -0.6)).toBe("half");
    expect(nextSnap("peek", 0, -0.9)).toBe("half");
  });

  it("closes when the sheet is dragged or flung down from peek", () => {
    expect(nextSnap("peek", 48, 0)).toBe("closed");
    expect(nextSnap("peek", 120, 0.2)).toBe("closed");
    expect(nextSnap("peek", 16, 0.6)).toBe("closed");
  });

  it("keeps the current snap on a short drag", () => {
    expect(nextSnap("peek", 12, 0.05)).toBe("peek");
    expect(nextSnap("peek", -16, -0.1)).toBe("peek");
    expect(nextSnap("half", 23, 0)).toBe("half");
    expect(nextSnap("full", -10, -0.2)).toBe("full");
    expect(nextSnap("closed", 8, 0)).toBe("closed");
  });

  it("advances one snap on a medium drag and two on a long one", () => {
    expect(nextSnap("peek", -48, 0)).toBe("half");
    expect(nextSnap("peek", -160, 0)).toBe("full");
    expect(nextSnap("half", 48, 0)).toBe("peek");
    expect(nextSnap("full", 160, 0)).toBe("peek");
    expect(nextSnap("half", -48, 0)).toBe("full");
  });
});
