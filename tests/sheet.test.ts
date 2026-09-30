import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { nextSnap } from "@/ui/Sheet";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

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

describe("ficha chrome", () => {
  it("keeps the three sheet heights and a 40px Noto peek hanzi", () => {
    const sheet = readFileSync(join(root, "src/ui/sheet.css"), "utf8");
    expect(sheet).toContain("height: 190px");
    expect(sheet).toContain("height: 52dvh");
    expect(sheet).toContain("height: calc(100dvh - 48px)");
    expect(sheet).toContain('font-family: "Noto Serif SC"');
    expect(sheet).toContain("font-size: 40px");
    const tsx = readFileSync(join(root, "src/ui/Sheet.tsx"), "utf8");
    expect(tsx).toContain('data-testid="sheet"');
  });

  it("seats both folios on inset paper with a left fillet and a top-right close", () => {
    const folio = readFileSync(join(root, "src/ui/folio.css"), "utf8");
    expect(folio).toContain("background: var(--color-paper-inset)");
    expect(folio).toContain("border-left: 1px solid var(--color-rule)");
    expect(folio).toMatch(/\.folio-close[\s\S]*?width: 44px;\r?\n\s*height: 44px;/);
    expect(folio).toContain("border-top: 1px solid var(--color-rule)");
    for (const name of ["PointDrawer.tsx", "CenterDrawer.tsx"]) {
      const src = readFileSync(join(root, "src/ui", name), "utf8");
      expect(src).toContain('className="folio-close"');
      expect(src).toContain("×");
      expect(src).toContain('className="folio-foot"');
      expect(src.indexOf("folio-close")).toBeLessThan(src.indexOf("folio-foot"));
    }
  });
});
