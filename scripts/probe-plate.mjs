// Usage: node scripts/probe-plate.mjs [baseUrl] [out.json]
// Objective gates for the plate: fonts, seams, furniture vs drawing window, labels, proportions.
// Works on the 29.09 UI (class fallbacks) and on the 30.09 UI (data-testid).
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4173/";
const outFile = process.argv[3] ?? "";
const CJK_FALLBACK = /WenQuanYi|Noto Sans CJK|Source Han Sans|SimSun|PingFang|Hiragino|Droid|Microsoft YaHei|Songti/i;

const WINDOW = '[data-testid="plate-window"]';
const FURNITURE = [
  '[data-testid="plate-title"]',
  '[data-testid="plate-key"]', ".plate-key",
  '[data-testid="plate-clock"]', '[data-testid="clock-dial"]',
  '[data-testid="plate-zoom"]', ".plate-zoom",
  '[data-testid="minimap"]', ".plate-minimap",
  '[data-testid="plate-colophon"]', ".plate-colophon",
  '[data-testid="folio"]',
  ".app-foot",
];

async function open(browser, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "load" });
  await page.waitForTimeout(400);
  await page.keyboard.press("Enter");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  return { ctx, page };
}

async function find(page, query) {
  await page.keyboard.press("/");
  await page.keyboard.type(query, { delay: 15 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
}

/** Drawing window: the explicit plate window, else the plate svg. */
async function windowRect(page) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) ?? document.querySelector('[data-testid="plate"] svg');
    return el ? el.getBoundingClientRect().toJSON() : null;
  }, WINDOW);
}

async function overlap(page) {
  return page.evaluate(({ win, furniture }) => {
    const w = (document.querySelector(win) ?? document.querySelector('[data-testid="plate"] svg'))?.getBoundingClientRect();
    if (!w) return { area: -1, hits: [] };
    const seen = new Set();
    const hits = [];
    let area = 0;
    for (const sel of furniture) {
      for (const el of document.querySelectorAll(sel)) {
        if (seen.has(el)) continue;
        seen.add(el);
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const ix = Math.max(0, Math.min(r.right, w.right) - Math.max(r.left, w.left));
        const iy = Math.max(0, Math.min(r.bottom, w.bottom) - Math.max(r.top, w.top));
        if (ix * iy > 0) {
          area += ix * iy;
          hits.push(`${sel}:${Math.round(ix * iy)}`);
        }
      }
    }
    return { area: Math.round(area), hits };
  }, { win: WINDOW, furniture: FURNITURE });
}

/** Screen rect of the figure frame (viewBox x 97.6..702.4, y 40..1480). */
async function figureRect(page) {
  return page.evaluate(() => {
    const svg = [...document.querySelectorAll('[data-testid="plate"] svg')].find((s) => s.querySelector("image"));
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const pt = (x, y) => new DOMPoint(x, y).matrixTransform(m);
    const a = pt(97.6, 40);
    const b = pt(702.4, 1480);
    return { left: a.x, top: a.y, right: b.x, bottom: b.y };
  });
}

async function hanziFonts(page, cdp, selector) {
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector });
  const fams = new Set();
  for (const id of nodeIds.slice(0, 6)) {
    try {
      const r = await cdp.send("CSS.getPlatformFontsForNode", { nodeId: id });
      for (const f of r.fonts) fams.add(f.familyName);
    } catch {
      /* node without text */
    }
  }
  return [...fams];
}

async function seam(page) {
  const w = await windowRect(page);
  if (!w) return { seam: -1, bars: -1 };
  const png = await page.screenshot({ type: "png" });
  return page.evaluate(async ({ data, w }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    const mean = (x0, y0, ww, hh) => {
      const d = x.getImageData(Math.round(x0), Math.round(y0), Math.round(ww), Math.round(hh)).data;
      const s = [0, 0, 0];
      for (let i = 0; i < d.length; i += 4) {
        s[0] += d[i];
        s[1] += d[i + 1];
        s[2] += d[i + 2];
      }
      const n = d.length / 4;
      return s.map((v) => v / n);
    };
    const band = Math.max(40, w.width * 0.12);
    const x0 = w.left + w.width * 0.04;
    const above = mean(x0, w.top - 8, band, 5);
    const below = mean(x0, w.top + 4, band, 5);
    const head = document.querySelector(".app-head")?.getBoundingClientRect();
    const foot = document.querySelector(".app-foot")?.getBoundingClientRect();
    let bars = -1;
    if (head && foot) {
      const a = mean(4, head.top + 2, 24, 4);
      const b = mean(4, foot.bottom - 6, 24, 4);
      bars = Math.max(...a.map((v, i) => Math.abs(v - b[i])));
    }
    return { seam: Math.max(...above.map((v, i) => Math.abs(v - below[i]))), bars };
  }, { data: png.toString("base64"), w });
}

const browser = await chromium.launch();
const m = {};

{
  const { ctx, page } = await open(browser, { width: 1440, height: 900 });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  m.hanziFontPlate = await hanziFonts(page, cdp, '[data-testid^="callout-"] text, [data-testid^="callout-"] tspan');
  const tone = await seam(page);
  m.seamDelta = Math.round(tone.seam * 10) / 10;
  m.headFootDelta = Math.round(tone.bars * 10) / 10;
  m.overlapBody = await overlap(page);
  const fig = await figureRect(page);
  m.figureShareDesktop = fig ? Math.round(((fig.bottom - fig.top) / 900) * 100) / 100 : -1;
  m.idleRouteLabels = await page.evaluate(() =>
    [...([...document.querySelectorAll('[data-testid="plate"] svg')].find((s) => s.querySelector("image"))?.querySelectorAll("text") ?? [])].filter((t) => {
      const r = t.getBoundingClientRect();
      return r.width > 0 && /^(LU|LI|ST|SP|HT|SI|BL|KI|PC|TE|GB|LR|GV|CV)$/.test(t.textContent.trim());
    }).length,
  );
  m.orientationGapPx = await page.evaluate((f) => {
    const marks = [...document.querySelectorAll('[data-testid^="plate-side"], .plate-side')].map((e) => e.getBoundingClientRect());
    if (!f || marks.length === 0) return -1;
    return Math.round(Math.max(...marks.map((r) => (r.right < f.left ? f.left - r.right : r.left > f.right ? r.left - f.right : 0))));
  }, fig);
  m.headerAccentText = await page.evaluate(() =>
    [...document.querySelectorAll(".app-head *, header *")].filter((e) => {
      const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      return own && getComputedStyle(e).color === "rgb(139, 30, 30)";
    }).length,
  );
  m.smallText = await page.evaluate(() =>
    [...document.querySelectorAll("body *")].filter((e) => {
      if (e.closest("svg")) return false;
      const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const r = e.getBoundingClientRect();
      return own && r.width > 0 && parseFloat(getComputedStyle(e).fontSize) < 11;
    }).length,
  );
  m.dantianGapPx = await page.evaluate(() => {
    const seals = [...document.querySelectorAll('[data-testid^="dantian-"], [data-testid="plate"] svg text')]
      .filter((t) => /丹田/.test(t.textContent))
      .map((t) => (t.closest("g")?.querySelector("circle") ?? t).getBoundingClientRect());
    const points = [...document.querySelectorAll('[data-testid^="point-"]')].map((p) => p.getBoundingClientRect());
    if (!seals.length || !points.length) return -1;
    let gap = Infinity;
    for (const s of seals) for (const p of points) {
      const d = Math.hypot(s.x + s.width / 2 - (p.x + p.width / 2), s.y + s.height / 2 - (p.y + p.height / 2));
      gap = Math.min(gap, d - s.width / 2 - 6);
    }
    return Math.round(gap);
  });
  for (let i = 0; i < 4; i += 1) await page.keyboard.press("+");
  await page.waitForTimeout(900);
  m.overlapZoom4 = await overlap(page);
  m.zoomLabelCoverage = await page.evaluate((sel) => {
    const w = (document.querySelector(sel) ?? document.querySelector('[data-testid="plate"] svg')).getBoundingClientRect();
    const inWin = (r) => r.width > 0 && r.left >= w.left && r.right <= w.right && r.top >= w.top && r.bottom <= w.bottom;
    const marks = [...document.querySelectorAll('[data-testid^="point-"]')].filter((e) => inWin(e.getBoundingClientRect()));
    const labels = new Set(
      [...document.querySelectorAll('[data-testid^="callout-"], [data-testid^="label-"]')]
        .filter((e) => e.getBoundingClientRect().width > 0)
        .map((e) => e.getAttribute("data-testid").replace(/^(callout|label)-/, "")),
    );
    const codes = marks.map((e) => e.getAttribute("data-testid").replace(/^point-/, ""));
    return codes.length ? Math.round((codes.filter((c) => labels.has(c)).length / codes.length) * 100) / 100 : -1;
  }, WINDOW);
  await page.keyboard.press("0");
  await find(page, "ST36");
  m.overlapST36 = await overlap(page);
  m.hanziFontFolio = await hanziFonts(page, cdp, "h2");
  await page.keyboard.press("Escape");
  await find(page, "dantian medio");
  m.overlapDantian = await overlap(page);
  await ctx.close();
}

{
  const { ctx, page } = await open(browser, { width: 390, height: 844 });
  const fig = await figureRect(page);
  m.figureShareMobile = fig ? Math.round(((fig.bottom - fig.top) / 844) * 100) / 100 : -1;
  m.mobileBrandTruncated = await page.evaluate(() =>
    [...document.querySelectorAll(".app-head *, header *")].some((e) => {
      const cs = getComputedStyle(e);
      return cs.textOverflow === "ellipsis" && e.scrollWidth > e.clientWidth + 1;
    }),
  );
  await find(page, "ST36");
  m.sheetPeekShowsHanzi = await page.evaluate(() => {
    const sheet = document.querySelector('[data-testid="sheet"]');
    if (!sheet) return false;
    return [...sheet.querySelectorAll("*")].some((e) => {
      if (e.children.length || !/足三里/.test(e.textContent ?? "")) return false;
      const r = e.getBoundingClientRect();
      if (r.height === 0 || r.top < 0 || r.bottom > innerHeight) return false;
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return Boolean(hit && (hit === e || e.contains(hit)));
    });
  });
  await ctx.close();
}
await browser.close();

const gates = {
  hanziFontPlate: m.hanziFontPlate.some((f) => /Noto Serif SC/.test(f)) && !m.hanziFontPlate.some((f) => CJK_FALLBACK.test(f)),
  hanziFontFolio: m.hanziFontFolio.some((f) => /Noto Serif SC/.test(f)) && !m.hanziFontFolio.some((f) => CJK_FALLBACK.test(f)),
  seamDelta: m.seamDelta >= 0 && m.seamDelta <= 1,
  overlapBody: m.overlapBody.area === 0,
  overlapZoom4: m.overlapZoom4.area === 0,
  overlapST36: m.overlapST36.area === 0,
  overlapDantian: m.overlapDantian.area === 0,
  figureShareDesktop: m.figureShareDesktop >= 0.7,
  figureShareMobile: m.figureShareMobile >= 0.62,
  idleRouteLabels: m.idleRouteLabels <= 2,
  zoomLabelCoverage: m.zoomLabelCoverage === 1,
  orientationGapPx: m.orientationGapPx >= 0 && m.orientationGapPx <= 96,
  headerAccentText: m.headerAccentText === 0,
  headFootDelta: m.headFootDelta >= 0 && m.headFootDelta <= 3,
  smallText: m.smallText === 0,
  dantianGapPx: m.dantianGapPx >= 6,
  mobileBrandTruncated: m.mobileBrandTruncated === false,
  sheetPeekShowsHanzi: m.sheetPeekShowsHanzi === true,
};
const failed = Object.entries(gates).filter(([, ok]) => !ok).map(([k]) => k);
const report = { metrics: m, gates, failed, pass: failed.length === 0 };
console.log(JSON.stringify(report, null, 2));
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2));
process.exitCode = failed.length === 0 ? 0 : 1;
