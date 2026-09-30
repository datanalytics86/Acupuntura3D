import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const __dirname = import.meta.dirname;
const root = join(__dirname, "..");
const HAN = /[\u3400-\u4dbf\u4e00-\u9fff]/gu;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(json|ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

describe("self-hosted hanzi font", () => {
  it("covers every hanzi in data/ and src/", () => {
    const subset = new Set(readFileSync(join(root, "src/assets/fonts/hanzi-subset.txt"), "utf8").trim());
    const missing = new Set<string>();
    for (const file of [...walk(join(root, "data")), ...walk(join(root, "src"))]) {
      for (const ch of readFileSync(file, "utf8").match(HAN) ?? []) if (!subset.has(ch)) missing.add(ch);
    }
    expect([...missing].join(""), "run: node scripts/fonts-hanzi.mjs").toBe("");
  });

  it("ships two small woff2 files and declares them in fonts.css", () => {
    for (const w of [500, 600]) {
      const file = join(root, `src/assets/fonts/noto-serif-sc-${w}.woff2`);
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThan(60_000);
    }
    const css = readFileSync(join(root, "src/app/fonts.css"), "utf8");
    expect(css).toMatch(/@font-face\s*{[^}]*"Noto Serif SC"[^}]*noto-serif-sc-500\.woff2/);
    expect(css).toMatch(/@font-face\s*{[^}]*"Noto Serif SC"[^}]*noto-serif-sc-600\.woff2/);
  });

  it("does not depend on Google Fonts (Vite 8 drops that <link> in build)", () => {
    expect(readFileSync(join(root, "index.html"), "utf8")).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  });
});
