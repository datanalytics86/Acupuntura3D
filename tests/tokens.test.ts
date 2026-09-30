import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getMeridianColor } from "../src/lib/colors";
import { INK, INK_2, INK_3, PAPER, PAPER_INSET, PIGMENT, meridianPigment } from "../src/lib/tokens";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SKIN = ["#E2C8A9", "#D5BC9E", "#D3B08D"] as const;

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const raw = hex.replace("#", "");
  const n = Number.parseInt(raw, 16);
  const r = channel((n >> 16) & 255);
  const g = channel((n >> 8) & 255);
  const b = channel(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const lighter = Math.max(relativeLuminance(a), relativeLuminance(b));
  const darker = Math.min(relativeLuminance(a), relativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

function stripAllowedCss(css: string): string {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let i = 0;
  let out = "";
  while (i < source.length) {
    const rest = source.slice(i);
    const imported = /^@(?:import|source)\b[^;]*;/.exec(rest);
    if (imported) {
      i += imported[0].length;
      continue;
    }
    if (/^@(theme|keyframes|layer)\b/.test(rest)) {
      const brace = rest.indexOf("{");
      if (brace < 0) {
        out += rest;
        break;
      }
      let depth = 0;
      let j = brace;
      for (; j < rest.length; j += 1) {
        const ch = rest[j];
        if (ch === "{") depth += 1;
        else if (ch === "}") {
          depth -= 1;
          if (depth === 0) {
            j += 1;
            break;
          }
        }
      }
      i += j;
      continue;
    }
    out += source[i] ?? "";
    i += 1;
  }
  return out.replace(/\s+/g, "");
}

describe("tokens", () => {
  it("keeps pigment contrast on skin and paper", () => {
    for (const hex of Object.values(PIGMENT)) {
      for (const skin of SKIN) {
        expect(contrast(hex, skin)).toBeGreaterThanOrEqual(3);
      }
      expect(contrast(hex, PAPER)).toBeGreaterThanOrEqual(7);
    }
  });

  it("keeps ink contrast on paper surfaces", () => {
    for (const ink of [INK, INK_2, INK_3]) {
      expect(contrast(ink, PAPER)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(ink, PAPER_INSET)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("mirrors every tokens.ts hex into index.css", () => {
    const css = readFileSync(join(root, "src/app/index.css"), "utf8").toLowerCase();
    const tokenSrc = readFileSync(join(root, "src/lib/tokens.ts"), "utf8");
    const hexes = tokenSrc.match(/#[0-9A-Fa-f]{6}/g) ?? [];
    expect(hexes.length).toBeGreaterThan(0);
    for (const hex of hexes) {
      expect(css).toContain(hex.toLowerCase());
    }
  });

  it("resolves channel pigments, with vessel for GV/CV and ink for extras", () => {
    expect(getMeridianColor("LU")).toBe(PIGMENT.metal);
    expect(getMeridianColor("LI")).toBe(PIGMENT.metal);
    expect(getMeridianColor("ST")).toBe(PIGMENT.earth);
    expect(getMeridianColor("SP")).toBe(PIGMENT.earth);
    expect(getMeridianColor("HT")).toBe(PIGMENT.fire);
    expect(getMeridianColor("SI")).toBe(PIGMENT.fire);
    expect(getMeridianColor("PC")).toBe(PIGMENT.fire);
    expect(getMeridianColor("TE")).toBe(PIGMENT.fire);
    expect(getMeridianColor("BL")).toBe(PIGMENT.water);
    expect(getMeridianColor("KI")).toBe(PIGMENT.water);
    expect(getMeridianColor("GB")).toBe(PIGMENT.wood);
    expect(getMeridianColor("LR")).toBe(PIGMENT.wood);
    expect(getMeridianColor("GV")).toBe(PIGMENT.vessel);
    expect(getMeridianColor("CV")).toBe(PIGMENT.vessel);
    expect(getMeridianColor("EX-HN3")).toBe(INK);
    expect(meridianPigment({ id: "GV", element: "fire" })).toBe(PIGMENT.vessel);
    expect(meridianPigment({ id: "CV" })).toBe(PIGMENT.vessel);
    expect(meridianPigment({ id: "ST", element: "earth" })).toBe(PIGMENT.earth);
  });

  it("keeps own CSS inside base and components layers", () => {
    const css = readFileSync(join(root, "src/app/index.css"), "utf8");
    expect(stripAllowedCss(css)).toBe("");
    expect(css).toMatch(/@layer base/);
    expect(css).toMatch(/@layer components/);
    expect(css).toMatch(/--color-paper/);
    expect(css).not.toMatch(/background:\s*#07090d/i);
    expect(css).toMatch(/outline:\s*2px solid var\(--color-cinnabar\)/);
    expect(css).toMatch(/outline-offset:\s*2px/);
    expect(css).toMatch(/\[tabindex="-1"\]:focus/);
    expect(css).toMatch(/baseFrequency='1\.15'/);
    expect(css).toMatch(/baseFrequency='0\.75'/);
    expect(css).toMatch(/--font-hanzi:\s*"Noto Serif SC"/);
    expect(css).not.toContain("--color-brass");
    expect(css).not.toContain("--color-jade-ink");
    const sizes = [...css.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)].map((match) => Number(match[1]));
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      expect(size).toBeGreaterThanOrEqual(11);
    }
  });
});
