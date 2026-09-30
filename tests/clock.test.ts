import { describe, expect, it } from "vitest";
import { loadMeridians } from "@/data";
import { meridianAtHour } from "@/atlas/qiTime";
import { sectorAngle } from "@/ui/QiClock";

describe("reloj de organos", () => {
  it("sectorAngle(3) es 45 y sectorAngle(7) es 105", () => {
    expect(sectorAngle(3)).toBe(45);
    expect(sectorAngle(7)).toBe(105);
  });

  it("meridianAtHour sigue en LU a las 3 y ST a las 7", () => {
    const meridians = loadMeridians();
    expect(meridianAtHour(3, meridians)).toBe("LU");
    expect(meridianAtHour(4, meridians)).toBe("LU");
    expect(meridianAtHour(7, meridians)).toBe("ST");
    expect(meridianAtHour(8, meridians)).toBe("ST");
  });
});
