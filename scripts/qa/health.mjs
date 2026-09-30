// Usage: node scripts/qa/health.mjs [baseUrl] [out.json]
// Runtime health: console and network errors, CLS, LCP, long tasks, heap and DOM growth,
// focus traps in modals, reflow at 320 px, English without Spanish leaks, tap accuracy on mobile.
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4173/";
const origin = new URL(base).origin;
const own = (url) => !url || url.startsWith(origin) || url.startsWith("data:") || url.startsWith("blob:");
const outFile = process.argv[3] ?? "";
const m = {};
const wait = (p, ms = 250) => p.waitForTimeout(ms);

const browser = await chromium.launch({ args: ["--js-flags=--expose-gc", "--enable-precise-memory-info"] });

async function fresh(viewport, extra = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, ...extra });
  const page = await context.newPage();
  const log = { errors: [], warnings: [], failed: [], http: [], thirdParty: new Set() };
  page.on("console", (msg) => {
    const where = msg.location()?.url ?? "";
    const text = `${msg.text().slice(0, 160)}${where ? ` @ ${where.slice(0, 80)}` : ""}`;
    if (!own(where)) return;
    if (msg.type() === "error") log.errors.push(text);
    if (msg.type() === "warning") log.warnings.push(text);
  });
  page.on("pageerror", (e) => log.errors.push(`pageerror: ${String(e).slice(0, 200)}`));
  page.on("request", (r) => {
    if (!own(r.url())) log.thirdParty.add(new URL(r.url()).host);
  });
  page.on("requestfailed", (r) => {
    if (own(r.url())) log.failed.push(`${r.url().slice(0, 100)} ${r.failure()?.errorText}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && own(r.url())) log.http.push(`${r.status()} ${r.url().slice(0, 100)}`);
  });
  await page.addInitScript(() => {
    window.__qa = { cls: 0, lcp: 0, longTasks: [] };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__qa.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__qa.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        const marks = performance.getEntriesByType("mark").filter((mk) => mk.startTime <= e.startTime);
        const step = marks.length ? marks[marks.length - 1].name : "load";
        window.__qa.longTasks.push({ ms: Math.round(e.duration), step });
      }
    }).observe({ type: "longtask", buffered: true });
  });
  await page.goto(base, { waitUntil: "load" });
  await wait(page, 500);
  return { context, page, log };
}

const find = async (p, q) => {
  await p.keyboard.press("/");
  await p.keyboard.type(q, { delay: 10 });
  await p.keyboard.press("Enter");
  await wait(p, 500);
};

/* 1 · Journey on desktop: every main control once, errors and vitals. */
{
  const { context, page, log } = await fresh({ width: 1440, height: 900 });
  await wait(page, 2000);
  m.lcpMs = Math.round(await page.evaluate(() => window.__qa.lcp));
  m.clsLoad = Math.round((await page.evaluate(() => window.__qa.cls)) * 1000) / 1000;
  const mark = (name) => page.evaluate((n) => performance.mark(n), name);
  await mark("accept");
  await page.keyboard.press("Enter");
  await wait(page);
  for (const k of ["p", "a", "2", "3", "4", "1", "c", "c", "+", "+", "-", "0"]) {
    await mark(`key ${k}`);
    await page.keyboard.press(k);
    await wait(page, 300);
  }
  await mark("find ST36");
  await find(page, "ST36");
  await page.keyboard.press("ArrowRight");
  await wait(page);
  await page.keyboard.press("Escape");
  await find(page, "dantian medio");
  await page.keyboard.press("Escape");
  await page.keyboard.press("?");
  await wait(page);
  await page.keyboard.press("Escape");
  for (const sel of ['[data-testid="index-toggle"]', '[data-testid="clock-play"]', '[data-testid="clock-play"]']) {
    const el = page.locator(sel).first();
    if (await el.count()) await el.click();
    await wait(page, 300);
  }
  const q = await page.evaluate(() => ({ cls: window.__qa.cls, long: window.__qa.longTasks, nodes: document.getElementsByTagName("*").length }));
  m.clsSession = Math.round(q.cls * 1000) / 1000;
  m.longTasks = q.long.length;
  m.longestTaskMs = q.long.length ? Math.max(...q.long.map((t) => t.ms)) : 0;
  m.longTaskSteps = [...q.long].sort((a, b) => b.ms - a.ms).slice(0, 5).map((t) => `${t.ms}ms @ ${t.step}`);
  m.domNodes = q.nodes;
  m.consoleErrors = log.errors;
  m.consoleWarnings = log.warnings.filter((w) => !/Download the React DevTools/.test(w));
  m.requestFailed = log.failed;
  m.http4xx5xx = log.http;
  m.thirdPartyHosts = [...log.thirdParty];
  await context.close();
}

/* 2 · Leaks: the same 5-step loop 30 times; heap and DOM after GC at loop 5 and 30. */
{
  const { context, page } = await fresh({ width: 1440, height: 900 });
  await page.keyboard.press("Enter");
  const sample = () =>
    page.evaluate(() => {
      window.gc?.();
      return { heap: performance.memory?.usedJSHeapSize ?? 0, nodes: document.getElementsByTagName("*").length };
    });
  let at5 = null;
  for (let i = 1; i <= 30; i += 1) {
    await find(page, "ST36");
    await page.keyboard.press("Escape");
    await page.keyboard.press("p");
    await page.keyboard.press("3");
    await page.keyboard.press("1");
    await page.keyboard.press("a");
    await wait(page, 120);
    if (i === 5) at5 = await sample();
  }
  const at30 = await sample();
  m.heapGrowth = at5?.heap ? Math.round(((at30.heap - at5.heap) / at5.heap) * 1000) / 1000 : null;
  m.domGrowth = at5 ? Math.round(((at30.nodes - at5.nodes) / at5.nodes) * 1000) / 1000 : null;
  await context.close();
}

/* 3 · Focus traps: Tab never leaves an open modal. */
async function trap(openModal) {
  const { context, page } = await fresh({ width: 1440, height: 900 });
  await openModal(page);
  await wait(page, 300);
  let leaks = 0;
  for (let i = 0; i < 25; i += 1) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const modal = [...document.querySelectorAll('[aria-modal="true"]')].pop();
      return Boolean(modal && document.activeElement && modal.contains(document.activeElement));
    });
    if (!inside) leaks += 1;
  }
  await context.close();
  return leaks;
}
m.focusLeakLegal = await trap(async () => {});
m.focusLeakPalette = await trap(async (p) => {
  await p.keyboard.press("Enter");
  await p.keyboard.press("/");
});
m.focusLeakHelp = await trap(async (p) => {
  await p.keyboard.press("Enter");
  await p.keyboard.press("?");
});

/* 4 · Reflow at 320 px (WCAG 1.4.10) and at 200 % zoom (720×450 at 2x). */
for (const [key, vp, dsf] of [["reflow320", { width: 320, height: 640 }, 1], ["zoom200", { width: 720, height: 450 }, 2]]) {
  const { context, page } = await fresh(vp, { deviceScaleFactor: dsf, isMobile: key === "reflow320", hasTouch: key === "reflow320" });
  await page.keyboard.press("Enter");
  await wait(page, 400);
  m[key] = await page.evaluate(() => {
    const over = document.documentElement.scrollWidth > innerWidth + 1;
    const clipped = [...document.querySelectorAll("button, [role=button], a[href], input")].filter((e) => {
      const r = e.getBoundingClientRect();
      if (r.width === 0 || e.closest('[aria-hidden="true"], [inert]')) return false;
      for (let a = e.parentElement; a; a = a.parentElement) {
        const ox = getComputedStyle(a).overflowX;
        if ((ox === "auto" || ox === "scroll") && a.scrollWidth > a.clientWidth) return false;
      }
      return r.right > innerWidth + 1 || r.left < -1;
    });
    return {
      overflowX: over,
      controlsOffscreen: clipped.length,
      which: clipped.slice(0, 5).map((e) => (e.getAttribute("aria-label") || e.textContent || e.tagName).trim().slice(0, 40)),
    };
  });
  await context.close();
}

/* 5 · English: no Spanish UI words outside lang="es" content. */
{
  const { context, page } = await fresh({ width: 1440, height: 900 });
  await page.keyboard.press("Enter");
  const en = page.locator('button:has-text("EN"), [data-testid="locale-en"]').first();
  if (await en.count()) await en.click();
  await wait(page, 400);
  await find(page, "ST36");
  m.langAfterEn = await page.evaluate(() => document.documentElement.lang);
  m.spanishLeaksInEn = await page.evaluate(() => {
    const words = /\b(Buscar|Cerrar|Ayuda|Índice|Cuerpo|Rostro|Mano|Pie|Reproducir|Pausar|Velocidad|Reloj|Capas|Meridianos|Puntos|Centros|Entiendo|Clave|Localización|Funciones|Precauciones|Siguiente|Anterior punto|Seguir el Qi|Elemento|Polaridad|Lateralidad|Fuentes|Confianza)\b/;
    const hits = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      const el = n.parentElement;
      if (!el || el.closest('[lang="es"], [aria-hidden="true"], script, style')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      const t = n.textContent.trim();
      if (words.test(t)) hits.push(t.slice(0, 40));
    }
    return [...new Set(hits)].slice(0, 20);
  });
  await context.close();
}

/* 6 · Tap accuracy on mobile: tapping a point opens that same point. */
{
  const { context, page } = await fresh({ width: 390, height: 844 }, { isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  await page.keyboard.press("Enter");
  await wait(page, 400);
  const codes = await page.evaluate(() => [...document.querySelectorAll('[data-testid^="point-"]')].map((e) => e.getAttribute("data-testid").slice(6)));
  const wrong = [];
  for (const code of codes) {
    const el = page.getByTestId(`point-${code}`);
    const box = await el.boundingBox();
    if (!box) continue;
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await wait(page, 600);
    const opened = await page.evaluate((c) => {
      const panel = document.querySelector('[data-testid="sheet"], [role="dialog"][aria-label]');
      if (!panel) return null;
      const text = `${panel.getAttribute("aria-label") ?? ""} ${panel.innerText}`;
      return text.includes(c) ? c : (text.match(/\b(?:[A-Z]{2}\d+|EX-[A-Z]+\d+)\b/)?.[0] ?? "?");
    }, code);
    if (opened !== code) wrong.push(`${code}→${opened ?? "nada"}`);
    await page.keyboard.press("Escape");
    await wait(page, 300);
    const reset = page.locator('[data-testid="zoom-reset"]').first();
    if (await reset.count()) await reset.click({ force: true });
    await wait(page, 400);
  }
  m.tapPoints = codes.length;
  m.tapWrong = wrong;
  await context.close();
}

/* 7 · Storage denied (strict private mode): the app still opens and the gate still closes. */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    for (const key of ["localStorage", "sessionStorage"]) {
      Object.defineProperty(window, key, {
        get() {
          throw new DOMException("denied", "SecurityError");
        },
      });
    }
  });
  const page = await context.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  await page.goto(base, { waitUntil: "load" });
  await wait(page, 500);
  await page.keyboard.press("Enter");
  await wait(page, 400);
  const state = await page.evaluate(() => ({
    gate: Boolean(document.getElementById("legal-gate")),
    plate: Boolean(document.querySelector('[data-testid="plate"] svg')),
  }));
  m.storageDenied = { pageErrors: errs, gateStillOpen: state.gate, plate: state.plate };
  await context.close();
}

await browser.close();

const gates = {
  consoleErrors: m.consoleErrors.length === 0,
  requestFailed: m.requestFailed.length === 0,
  http4xx5xx: m.http4xx5xx.length === 0,
  thirdPartyHosts: m.thirdPartyHosts.length === 0,
  clsLoad: m.clsLoad <= 0.05,
  lcpMs: m.lcpMs > 0 && m.lcpMs <= 2500,
  longestTaskMs: m.longestTaskMs <= 200,
  heapGrowth: m.heapGrowth === null || m.heapGrowth <= 0.2,
  domGrowth: m.domGrowth === null || m.domGrowth <= 0.05,
  focusLeakLegal: m.focusLeakLegal === 0,
  focusLeakPalette: m.focusLeakPalette === 0,
  focusLeakHelp: m.focusLeakHelp === 0,
  reflow320: !m.reflow320.overflowX && m.reflow320.controlsOffscreen === 0,
  zoom200: !m.zoom200.overflowX && m.zoom200.controlsOffscreen === 0,
  langAfterEn: m.langAfterEn === "en",
  spanishLeaksInEn: m.spanishLeaksInEn.length === 0,
  tapAccuracy: m.tapWrong.length === 0,
  storageDenied: m.storageDenied.pageErrors.length === 0 && !m.storageDenied.gateStillOpen && m.storageDenied.plate,
};
const failed = Object.entries(gates).filter(([, ok]) => !ok).map(([k]) => k);
const report = { base, metrics: m, gates, failed, pass: failed.length === 0 };
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.pass ? 0 : 1;
