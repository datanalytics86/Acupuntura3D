// Usage: node scripts/qa/census.mjs [baseUrl] [out.json]
// Control census: finds every interactive control in every context, names it, measures it,
// clicks it in a fresh page and checks that something observable happens, with no console errors.
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4173/";
const outFile = process.argv[3] ?? "";

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, minTarget: 24 },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, minTarget: 44 },
};

const CONTROL = [
  "button", "a[href]", "input", "select", "textarea", "summary",
  '[role="button"]', '[role="tab"]', '[role="radio"]', '[role="switch"]', '[role="checkbox"]',
  '[role="option"]', '[role="slider"]', '[role="menuitem"]', '[role="combobox"]',
].join(",");

const press = (...keys) => async (p) => {
  for (const k of keys) {
    await p.keyboard.press(k);
    await p.waitForTimeout(120);
  }
};
const find = (q) => async (p) => {
  await p.keyboard.press("/");
  await p.keyboard.type(q, { delay: 15 });
  await p.keyboard.press("Enter");
};
const clickFirst = (...sels) => async (p) => {
  for (const s of sels) {
    const el = p.locator(s).first();
    if ((await el.count()) && (await el.isVisible())) return el.click();
  }
};

/** Each context is a way to reach a state. "legal" keeps the first-visit gate. */
const CONTEXTS = {
  legal: { accept: false, steps: [] },
  home: { steps: [] },
  index: { steps: [clickFirst('[data-testid="index-toggle"]', 'button:has-text("Índice")', 'button:has-text("Meridianos")')] },
  point: { steps: [find("ST36")] },
  center: { steps: [find("dantian medio")] },
  palette: { steps: [press("/")] },
  help: { steps: [press("?")] },
  posterior: { steps: [press("p")] },
  hand: { steps: [press("3")] },
  zoom: { steps: [press("+", "+", "+")] },
};

async function openPage(browser, vp, ctxName) {
  const { viewport, isMobile, hasTouch } = VIEWPORTS[vp];
  const context = await browser.newContext({ viewport, isMobile, hasTouch, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 160)}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 160)}`));
  await page.goto(base, { waitUntil: "load" });
  await page.waitForTimeout(350);
  const spec = CONTEXTS[ctxName];
  if (spec.accept !== false) {
    await page.keyboard.press("Enter");
    await page.waitForTimeout(250);
  }
  for (const step of spec.steps) await step(page);
  await page.waitForTimeout(450);
  return { context, page, errors };
}

/** Runs in the page: visible controls with a replayable CSS path. */
function listControls(selector) {
  const cssPath = (el) => {
    if (el.dataset?.testid) return `[data-testid="${el.dataset.testid}"]`;
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && n !== document.documentElement) {
      const tag = n.tagName.toLowerCase();
      const sibs = n.parentElement ? [...n.parentElement.children].filter((c) => c.tagName === n.tagName) : [];
      parts.unshift(sibs.length > 1 ? `${tag}:nth-of-type(${sibs.indexOf(n) + 1})` : tag);
      n = n.parentElement;
    }
    return parts.join(" > ");
  };
  const nameOf = (el) => {
    const byIds = (el.getAttribute("aria-labelledby") ?? "")
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? "")
      .join(" ")
      .trim();
    const label = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent : "";
    return (el.getAttribute("aria-label") || byIds || label || el.textContent || el.getAttribute("title") || el.getAttribute("placeholder") || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
  };
  const out = [];
  const modals = [...document.querySelectorAll('[aria-modal="true"]')].filter((m) => m.getBoundingClientRect().width > 0);
  const scope = modals.length ? modals[modals.length - 1] : document;
  for (const el of scope.querySelectorAll(selector)) {
    const box = el.getBoundingClientRect();
    const label = el instanceof SVGElement ? el.querySelector("text") : null;
    const r = label && label.getBoundingClientRect().width > 0 ? label.getBoundingClientRect() : box;
    const cs = getComputedStyle(el);
    if (r.width < 1 || r.height < 1 || cs.visibility === "hidden" || cs.display === "none") continue;
    if (el.closest('[aria-hidden="true"], [inert]')) continue;
    if (r.bottom < 0 || r.right < 0 || r.top > innerHeight || r.left > innerWidth) continue;
    const cx = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2));
    const cy = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
    const hit = document.elementFromPoint(cx, cy);
    const scrim = box.width >= innerWidth * 0.9 && box.height >= innerHeight * 0.9;
    const covered = !scrim && !(hit && (hit === el || el.contains(hit)));
    out.push({
      path: cssPath(el),
      testid: el.dataset?.testid ?? null,
      role: el.getAttribute("role") ?? el.tagName.toLowerCase(),
      type: el.getAttribute("type") ?? "",
      name: nameOf(el),
      w: Math.round(Math.max(r.width, box.width >= 24 && box.height >= 24 ? box.width : 0)),
      h: Math.round(Math.max(r.height, box.width >= 24 && box.height >= 24 ? box.height : 0)),
      x: Math.round(cx),
      y: Math.round(cy),
      covered,
      coveredBy: covered && hit ? `${hit.tagName.toLowerCase()}.${String(hit.className?.baseVal ?? hit.className).split(" ")[0]}` : "",
      disabled: Boolean(el.disabled) || el.getAttribute("aria-disabled") === "true",
      on: ["aria-pressed", "aria-checked", "aria-selected", "aria-current"].some((a) => el.getAttribute(a) === "true" || el.getAttribute(a) === "page"),
    });
  }
  return out;
}

function fingerprint() {
  const attrs = [...document.querySelectorAll("[aria-pressed],[aria-checked],[aria-expanded],[aria-selected],details,[data-state],[data-on],[data-hour]")]
    .map((e) =>
      [e.getAttribute("aria-pressed"), e.getAttribute("aria-checked"), e.getAttribute("aria-expanded"), e.getAttribute("aria-selected"), e.hasAttribute("open"), e.getAttribute("data-state"), e.getAttribute("data-on"), e.getAttribute("data-hour")].join(","),
    )
    .join("|");
  return {
    url: location.href,
    active: document.activeElement ? document.activeElement.outerHTML.slice(0, 120) : "",
    attrs,
    dialogs: document.querySelectorAll('[role="dialog"], dialog[open]').length,
    viewBox: [...document.querySelectorAll("svg[viewBox]")].map((s) => s.getAttribute("viewBox")).join(";"),
    html: document.body.innerHTML.length,
    lang: document.documentElement.lang,
    overflowX: document.documentElement.scrollWidth > innerWidth + 1,
  };
}

const browser = await chromium.launch();
const rows = [];
for (const vp of Object.keys(VIEWPORTS)) {
  const seen = new Set();
  for (const ctxName of Object.keys(CONTEXTS)) {
    const probe = await openPage(browser, vp, ctxName);
    const controls = await probe.page.evaluate(listControls, CONTROL);
    await probe.context.close();
    for (const c of controls) {
      const key = `${c.testid ?? `${c.role}:${c.name}`}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const run = await openPage(browser, vp, ctxName);
      const before = await run.page.evaluate(fingerprint);
      const errorsBefore = run.errors.length;
      let effect = "none";
      try {
        const loc = run.page.locator(c.path).first();
        if (c.role === "slider" || c.type === "range") {
          await loc.focus();
          await run.page.keyboard.press("ArrowRight");
        } else if (["input", "textarea", "combobox"].includes(c.role) && c.type !== "checkbox") {
          await loc.click({ timeout: 2000 });
          await run.page.keyboard.type("a");
        } else if (c.covered) {
          await loc.click({ timeout: 2000, force: true });
        } else {
          await run.page.mouse.click(c.x, c.y);
        }
        await run.page.waitForTimeout(500);
        const after = await run.page.evaluate(fingerprint);
        const changed = Object.keys(before).filter((k) => k !== "overflowX" && before[k] !== after[k]);
        effect = changed.length ? changed.join("+") : c.disabled ? "disabled" : c.on ? "already-on" : "none";
        c.overflowAfter = after.overflowX;
      } catch (e) {
        effect = `click-failed: ${String(e).split("\n")[0].slice(0, 100)}`;
      }
      const errs = run.errors.slice(errorsBefore);
      rows.push({ vp, ctx: ctxName, ...c, effect, errors: errs });
      await run.context.close();
    }
  }
}
await browser.close();

const minTarget = (r) => VIEWPORTS[r.vp].minTarget;
const issues = {
  dead: rows.filter((r) => r.effect === "none"),
  clickFailed: rows.filter((r) => r.effect.startsWith("click-failed")),
  errors: rows.filter((r) => r.errors.length),
  unnamed: rows.filter((r) => !r.name),
  covered: rows.filter((r) => r.covered),
  smallTarget: rows.filter((r) => Math.min(r.w, r.h) < minTarget(r) && !["input", "textarea"].includes(r.role)),
  overflowAfter: rows.filter((r) => r.overflowAfter),
};
const summary = Object.fromEntries(Object.entries(issues).map(([k, v]) => [k, v.length]));
const report = { base, total: rows.length, summary, pass: Object.values(summary).every((n) => n === 0), issues, rows };
if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ total: rows.length, summary, pass: report.pass }, null, 2));
for (const [k, v] of Object.entries(issues)) {
  for (const r of v.slice(0, 12)) console.log(`${k.padEnd(13)} ${r.vp.padEnd(7)} ${r.ctx.padEnd(9)} ${(r.testid ?? r.role).padEnd(22)} «${r.name}» ${r.w}×${r.h} ${r.effect} ${r.coveredBy} ${r.errors.join(" ")}`);
}
process.exitCode = report.pass ? 0 : 1;
