// Usage: node scripts/shots.mjs <outDir> [baseUrl]
// Same key sequence works on the old UI (search input) and the new one (command palette).
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const out = process.argv[2] ?? "docs/T1_2909/shots/after";
const base = process.argv[3] ?? "http://localhost:4173/";
mkdirSync(out, { recursive: true });

const VIEWPORTS = {
  d1440: { width: 1440, height: 900 },
  d1280: { width: 1280, height: 800 },
  t768: { width: 768, height: 1024 },
  m390: { width: 390, height: 844 },
};

const enter = async (p) => {
  await p.keyboard.press("Enter");
  await p.waitForTimeout(250);
};
const clickFirst = async (p, selectors) => {
  for (const s of selectors) {
    const el = p.locator(s).first();
    if ((await el.count()) && (await el.isVisible())) return el.click();
  }
};

const STATES = {
  "00-legal": async () => {},
  "01-anterior": async (p) => enter(p),
  "02-posterior": async (p) => { await enter(p); await p.keyboard.press("p"); },
  "03-st36": async (p) => { await enter(p); await p.keyboard.press("/"); await p.keyboard.type("ST36", { delay: 20 }); await p.keyboard.press("Enter"); },
  "04-face": async (p) => { await enter(p); await p.keyboard.press("2"); },
  "05-hand": async (p) => { await enter(p); await p.keyboard.press("3"); },
  "06-foot": async (p) => { await enter(p); await p.keyboard.press("4"); },
  "07-dantian": async (p) => { await enter(p); await p.keyboard.press("/"); await p.keyboard.type("dantian medio", { delay: 20 }); await p.keyboard.press("Enter"); },
  "08-index": async (p) => { await enter(p); await clickFirst(p, ['[data-testid="index-toggle"]', 'button:has-text("Índice")', 'button:has-text("Meridianos")']); },
  "09-palette": async (p) => { await enter(p); await p.keyboard.press("/"); await p.keyboard.type("zu", { delay: 20 }); },
  "10-help": async (p) => { await enter(p); await p.keyboard.press("?"); },
  "11-zoom": async (p) => { await enter(p); for (let i = 0; i < 4; i++) await p.keyboard.press("+"); },
};

const browser = await chromium.launch();
for (const [vp, size] of Object.entries(VIEWPORTS)) {
  for (const [name, run] of Object.entries(STATES)) {
    let lastErr = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      try {
        await page.goto(base, { waitUntil: "load", timeout: 60_000 });
        await page.waitForTimeout(400);
        await run(page);
        await page.waitForTimeout(700);
        await page.screenshot({
          path: `${out}/${vp}-${name}.jpg`,
          type: "jpeg",
          quality: 80,
          timeout: 45_000,
        });
        await ctx.close();
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        await ctx.close();
      }
    }
    if (lastErr) throw lastErr;
  }
}
await browser.close();
console.log(`shots: ${Object.keys(VIEWPORTS).length * Object.keys(STATES).length} → ${out}`);
