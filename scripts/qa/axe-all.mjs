// Usage: node scripts/qa/axe-all.mjs [baseUrl] [out.json]
// WCAG 2.2 AA scan (axe-core) in every context of the census, desktop and mobile.
import { writeFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4173/";
const outFile = process.argv[3] ?? "";
const find = (q) => async (p) => {
  await p.keyboard.press("/");
  await p.keyboard.type(q, { delay: 10 });
  await p.keyboard.press("Enter");
};
const keys = (...ks) => async (p) => {
  for (const k of ks) await p.keyboard.press(k);
};
const CONTEXTS = {
  legal: null,
  home: [],
  index: [async (p) => p.locator('[data-testid="index-toggle"]').first().click()],
  point: [find("ST36")],
  center: [find("dantian medio")],
  palette: [keys("/"), async (p) => p.keyboard.type("zu")],
  help: [keys("?")],
  posterior: [keys("p")],
  hand: [keys("3")],
  english: [async (p) => p.locator('button:has-text("EN")').first().click(), find("ST36")],
};
const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
};

const browser = await chromium.launch();
const violations = [];
for (const [vp, opts] of Object.entries(VIEWPORTS)) {
  for (const [ctx, steps] of Object.entries(CONTEXTS)) {
    const context = await browser.newContext({ ...opts, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: "load" });
    await page.waitForTimeout(400);
    if (steps) {
      await page.keyboard.press("Enter");
      for (const s of steps) await s(page);
    }
    await page.waitForTimeout(600);
    const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    for (const v of res.violations) {
      violations.push({ vp, ctx, id: v.id, impact: v.impact, nodes: v.nodes.length, target: v.nodes[0]?.target?.join(" ").slice(0, 80), help: v.help });
    }
    await context.close();
  }
}
await browser.close();
const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
const report = { base, total: violations.length, serious: serious.length, pass: serious.length === 0, violations };
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ total: report.total, serious: report.serious, pass: report.pass }, null, 2));
for (const v of violations) console.log(`${v.impact.padEnd(9)} ${v.vp.padEnd(7)} ${v.ctx.padEnd(9)} ${v.id} ×${v.nodes} ${v.target} — ${v.help}`);
process.exitCode = report.pass ? 0 : 1;
