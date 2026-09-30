import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SILHOUETTE } from "@/atlas/figure/silhouette";
import { decodePngAlpha } from "./pngAlpha";

const PLATES = {
  anterior: { x: 97.61, y: 40, w: 604.79, h: 1440, file: "public/atlas/body-anterior.png" },
  posterior: { x: 97.47, y: 40, w: 605.06, h: 1440, file: "public/atlas/body-posterior.png" },
} as const;

describe("vector silhouette", () => {
  for (const view of ["anterior", "posterior"] as const) {
    it(`${view}: every vertex sits on the alpha edge (≤ 1.5 u) and the outline spans the figure`, () => {
      const p = PLATES[view];
      const img = decodePngAlpha(join(__dirname, "..", p.file));
      const s = Math.min(p.w / img.width, p.h / img.height);
      const ox = p.x + (p.w - img.width * s) / 2;
      const oy = p.y + (p.h - img.height * s) / 2;
      const on = (x: number, y: number) => {
        const px = Math.floor((x - ox) / s);
        const py = Math.floor((y - oy) / s);
        if (px < 0 || py < 0 || px >= img.width || py >= img.height) return false;
        return (img.alpha[py * img.width + px] ?? 0) > 127;
      };
      const nums = SILHOUETTE[view].replace(/[MLZ]/g, " ").trim().split(/\s+/).map(Number);
      expect(nums.length % 2).toBe(0);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < nums.length; i += 2) {
        const x = nums[i]!;
        const y = nums[i + 1]!;
        minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        let edge = false;
        for (let a = 0; a < 16 && !edge; a += 1) {
          const t = (a / 16) * Math.PI * 2;
          edge = on(x + 1.5 * Math.cos(t), y + 1.5 * Math.sin(t)) !== on(x - 1.5 * Math.cos(t), y - 1.5 * Math.sin(t));
        }
        expect(edge, `${view} vertex ${x},${y}`).toBe(true);
      }
      expect(minX).toBeLessThan(100);
      expect(maxX).toBeGreaterThan(700);
      expect(minY).toBeLessThan(42);
      expect(maxY).toBeGreaterThan(1477);
    });
  }
});
