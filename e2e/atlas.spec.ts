import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { decodePng, patchStats } from "./png";

const PAPER = [251, 247, 238] as const;

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

test.beforeEach(({ }, info) => {
  info.skip(info.project.name !== "chromium", "las 12 tareas corren en el proyecto chromium");
});

async function enterAtlas(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.locator("#legal-gate")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#legal-gate")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByTestId("plate")).toBeVisible();
}

async function axeClean(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((item) => item.impact === "serious" || item.impact === "critical");
  expect(bad.map((item) => `${item.id} (${item.nodes.length})`)).toEqual([]);
}

async function openPalette(page: Page, query: string): Promise<void> {
  await page.keyboard.press("/");
  const input = page.getByTestId("palette-input");
  await expect(input).toBeVisible();
  await input.fill(query);
  await expect(page.getByTestId("palette-option").first()).toBeVisible();
}

async function pointState(page: Page, testId: string): Promise<string> {
  return page.evaluate((id) => {
    const mark = document.querySelector(`[data-testid="${id}"]`);
    const plate = document.querySelector("#plate");
    if (!(mark instanceof Element) || !(plate instanceof Element)) return "missing";
    const m = mark.getBoundingClientRect();
    const p = plate.getBoundingClientRect();
    if (m.width < 1) return "zero";
    const cx = m.x + m.width / 2;
    const cy = m.y + m.height / 2;
    if (cx < p.left || cx > p.right || cy < p.top || cy > p.bottom) return "outside";
    const sheet = document.querySelector("[data-testid='sheet']");
    if (sheet instanceof Element) {
      const s = sheet.getBoundingClientRect();
      if (s.height > 8 && cx > s.left && cx < s.right && cy > s.top && cy < s.bottom) return "under-sheet";
    }
    const folio = document.querySelector(".app-folio .folio");
    if (folio instanceof Element) {
      const f = folio.getBoundingClientRect();
      if (f.width > 8 && cx > f.left && cx < f.right && cy > f.top && cy < f.bottom) return "under-folio";
    }
    return "ok";
  }, testId);
}

async function expectMarkPx(locator: Locator): Promise<void> {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  expect(box.width).toBeGreaterThanOrEqual(10.5);
  expect(box.width).toBeLessThanOrEqual(13.5);
  expect(Math.abs(box.width - box.height)).toBeLessThan(1.5);
}

async function viewBoxWidth(page: Page): Promise<number> {
  const value = await page.locator('[data-testid="plate-window"] svg').first().getAttribute("viewBox");
  const parts = (value ?? "").split(/[\s,]+/);
  return Number(parts[2] ?? "0");
}

function overlapArea(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): number {
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return x * y;
}

async function labelOverlap(page: Page): Promise<number> {
  const boxes = await page.locator('[data-testid^="callout-"] text').evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = (node as SVGGraphicsElement).getBoundingClientRect();
      return { x: rect.x, y: rect.y, w: rect.width, h: rect.height };
    }),
  );
  let worst = 0;
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i];
      const b = boxes[j];
      if (!a || !b) continue;
      worst = Math.max(worst, overlapArea(a, b));
    }
  }
  return worst;
}

for (const viewport of VIEWPORTS) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("portada, lámina y grilla", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("#legal-gate")).toBeVisible();
      await axeClean(page);
      await page.keyboard.press("Enter");
      await expect(page.locator("#legal-gate")).toHaveCount(0);
      await expect(page.getByTestId("plate")).toBeVisible();
      await expect(page.getByRole("group", { name: "Atlas corporal de meridianos" })).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      const regions = await page.locator(".app-head, .app-plate, .app-foot").evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return { x: rect.x, y: rect.y, w: rect.width, h: rect.height };
        }),
      );
      for (let i = 0; i < regions.length; i += 1) {
        for (let j = i + 1; j < regions.length; j += 1) {
          const a = regions[i];
          const b = regions[j];
          if (!a || !b) continue;
          expect(overlapArea(a, b)).toBeLessThanOrEqual(1);
        }
      }
      const head = regions[0];
      if (viewport.name === "mobile") {
        expect(head?.h ?? 999).toBeLessThanOrEqual(104);
      }
    });

    test("ST36, ficha, precauciones y flechas", async ({ page }) => {
      await enterAtlas(page);
      if (viewport.name === "desktop") {
        await expect(page.locator('[data-testid^="callout-"]')).toHaveCount(15);
        await expectMarkPx(page.getByTestId("point-ST36"));
      }
      await expect.poll(() =>
        page.evaluate(async () => {
          await document.fonts.ready;
          return [...document.fonts].some((f) => f.family.replace(/["']/g, "") === "Noto Serif SC" && f.status === "loaded");
        }),
      ).toBe(true);

      await openPalette(page, "zusanli");
      await expect(page.getByTestId("palette-option").first()).toContainText("ST36");
      await page.keyboard.press("Enter");
      await expect(page.locator(".folio-hanzi")).toHaveText("足三里");
      await expect.poll(() => pointState(page, "point-ST36")).toBe("ok");
      if (viewport.name === "desktop") await expectMarkPx(page.getByTestId("point-ST36"));

      const lines = (await page.locator(".folio-body li").allTextContents()).map((line) => line.trim()).filter((line) => line.length > 8);
      expect(new Set(lines).size).toBe(lines.length);

      for (const code of ["LI4", "SP6"]) {
        await openPalette(page, code);
        await page.keyboard.press("Enter");
        await expect(page.locator(".folio .code").first()).toHaveText(code);
        await expect(page.locator(".caution")).toContainText("embarazo");
      }

      await openPalette(page, "GB34");
      await page.keyboard.press("Enter");
      await expect(page.locator(".folio .code").first()).toHaveText("GB34");
      await page.keyboard.press("ArrowRight");
      await expect(page.locator(".folio .code").first()).toHaveText("GB20");
      await page.keyboard.press("ArrowLeft");
      await expect(page.locator(".folio .code").first()).toHaveText("GB34");

      await openPalette(page, "ST36");
      await page.keyboard.press("Enter");
      await expect.poll(() => pointState(page, "point-ST36")).toBe("ok");
      for (let i = 0; i < 4; i += 1) await page.keyboard.press("+");
      await expect.poll(() => pointState(page, "point-ST36")).toBe("ok");
      await expectMarkPx(page.getByTestId("point-ST36"));
    });

    test("posterior, mano, reloj, capas, teclado, idioma, zoom y dantian", async ({ page }) => {
      await enterAtlas(page);

      await page.keyboard.press("p");
      await expect.poll(async () => {
        return page.locator("#plate image").evaluateAll((nodes) =>
          nodes.some((node) => (node.getAttribute("href") ?? "").includes("body-posterior.png")),
        );
      }).toBe(true);
      if (viewport.name === "desktop") {
        await expect(page.locator('[data-testid^="callout-"]')).toHaveCount(6);
      }

      await page.keyboard.press("3");
      await expect(page.getByTestId("region-hand")).toHaveAttribute("aria-checked", "true");
      await expect.poll(() => labelOverlap(page)).toBeLessThanOrEqual(2);
      await page.keyboard.press("Escape");
      await page.keyboard.press("1");
      await page.keyboard.press("a");
      await expect(page.getByTestId("region-body")).toHaveAttribute("aria-checked", "true");
      await expect(page.getByTestId("view-anterior")).toHaveAttribute("aria-checked", "true");

      const chip = page.locator(".qi-chip");
      if ((await chip.count()) > 0) await chip.click();
      await page.locator("#clock-sector-LR").click();
      await expect(page.locator("#clock-sector-LR")).toHaveAttribute("aria-checked", "true");
      const filled = page.locator('path[data-sector][data-on="true"]');
      await expect(filled).toHaveCount(1);
      await expect(filled).not.toHaveCSS("fill", "none");
      await expect(page.locator(".qi-caption").first()).toContainText("01:00");
      await expect(page.locator(".qi-caption").first()).toContainText("LR");
      await expect(page.locator('[data-meridian="LR"][data-hour="on"]').first()).toBeAttached();

      const play = page.getByTestId("clock-play");
      await expect(play).toHaveAttribute("aria-pressed", "true");
      await play.click();
      await expect(page.locator(".qi-comet").first()).toHaveCSS("animation-play-state", "paused");
      await play.click();
      await expect(page.locator(".qi-comet").first()).toHaveCSS("animation-play-state", "running");
      if ((await page.locator(".qi-pop").count()) > 0) await page.keyboard.press("Escape");
      await expect(page.locator(".qi-pop")).toHaveCount(0);

      await page.getByTestId("index-toggle").click();
      const meridians = page.getByRole("button", { name: "Meridianos", exact: true });
      const qi = page.getByRole("button", { name: "Qi", exact: true });
      await meridians.click();
      await expect(page.locator("[data-meridian]")).toHaveCount(0);
      await meridians.click();
      await expect(page.locator("[data-meridian]").first()).toBeAttached();
      await qi.click();
      await expect(page.locator(".qi-comet")).toHaveCount(0);
      await qi.click();
      await expect(page.locator(".qi-comet").first()).toBeAttached();
      if ((await page.locator(".rail-scrim").count()) > 0) await page.keyboard.press("Escape");
      else await page.getByTestId("index-toggle").click();

      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      });
      let found = false;
      for (let i = 0; i < 80; i += 1) {
        found = await page.evaluate(() => {
          const el = document.activeElement;
          if (!(el instanceof Element) || el.getAttribute("role") !== "button") return false;
          return Boolean(el.querySelector("[data-testid^='point-']"));
        });
        if (found) break;
        await page.keyboard.press("Tab");
      }
      expect(found).toBe(true);
      await page.keyboard.press("Enter");
      await expect(page.locator(".folio-hanzi")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator(".folio")).toHaveCount(0);
      await expect.poll(async () =>
        page.evaluate(() => {
          const el = document.activeElement;
          if (!(el instanceof Element) || el.getAttribute("role") !== "button") return false;
          return Boolean(el.querySelector("[data-testid^='point-']"));
        }),
      ).toBe(true);

      await expect(page.locator("h1")).toHaveText("Enciclopedia del cuerpo");
      await page.getByRole("button", { name: /Idioma/ }).click();
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.locator("h1")).toHaveText("Encyclopedia of the body");
      await expect(page.locator(".topbar-mark")).toHaveText("针");
      await page.getByRole("button", { name: /Idioma|Language/ }).click();
      await expect(page.locator("html")).toHaveAttribute("lang", "es");

      const before = await viewBoxWidth(page);
      const win = page.getByTestId("plate-window");
      const winBox = await win.boundingBox();
      expect(winBox).not.toBeNull();
      if (winBox) {
        await page.mouse.move(winBox.x + winBox.width * 0.5, winBox.y + winBox.height * 0.45);
        await page.mouse.wheel(0, -800);
      }
      await expect.poll(() => viewBoxWidth(page)).toBeLessThan(before - 5);
      await page.keyboard.press("+");
      await page.keyboard.press("-");
      await page.keyboard.press("0");
      await expect.poll(() => viewBoxWidth(page)).toBeGreaterThan(700);
      if (viewport.name === "desktop") {
        await page.getByTestId("zoom-in").click();
        await page.getByTestId("zoom-in").click();
        await page.getByTestId("zoom-in").click();
      } else {
        await page.keyboard.press("+");
        await page.keyboard.press("+");
        await page.keyboard.press("+");
      }
      await expect(page.locator(".plate-minimap")).toBeVisible();
      await page.getByRole("group", { name: "Atlas corporal de meridianos" }).dblclick({ position: { x: 24, y: 70 } });
      await expect(page.locator(".plate-minimap")).toHaveCount(0);

      await openPalette(page, "dantian medio");
      await page.keyboard.press("Enter");
      const openPoint = page.getByRole("button", { name: /Abrir el punto CV17/ });
      await expect(openPoint).toBeVisible();
      await expect(openPoint).toContainText("膻中");
      await openPoint.click();
      await expect(page.locator(".folio-hanzi")).toHaveText("膻中");
    });

    test("axe en anterior, ficha y paleta", async ({ page }) => {
      await enterAtlas(page);
      await axeClean(page);
      await openPalette(page, "zusanli");
      await page.keyboard.press("Enter");
      await expect(page.locator(".folio-hanzi")).toBeVisible();
      await axeClean(page);
      await page.keyboard.press("/");
      await expect(page.getByTestId("palette-input")).toBeVisible();
      await axeClean(page);
    });

    test("franjas de papel sin rectángulo fantasma", async ({ page }) => {
      test.skip(viewport.name !== "desktop", "las franjas se miden en la lámina de 1440");
      await enterAtlas(page);
      const png = decodePng(await page.getByTestId("plate").screenshot({ type: "png" }));
      const bands = [
        [0.18, 0.22],
        [0.18, 0.3],
        [0.18, 0.38],
        [0.18, 0.62],
      ] as const;
      for (const [xf, yf] of bands) {
        const stats = patchStats(
          png,
          png.w * xf,
          png.h * yf,
          png.w * xf + 14,
          png.h * yf + 14,
        );
        for (let c = 0; c < 3; c += 1) {
          expect(stats.stdev[c] ?? 99).toBeLessThanOrEqual(2);
          expect(Math.abs((stats.mean[c] ?? 0) - (PAPER[c] ?? 0))).toBeLessThanOrEqual(8);
        }
      }
    });

    test("el mobiliario no pisa la ventana", async ({ page }) => {
      await enterAtlas(page);
      const area = await page.evaluate(() => {
        const w = document.querySelector('[data-testid="plate-window"]')?.getBoundingClientRect();
        if (!w) return -1;
        const selectors = [
          '[data-testid="plate-title"]',
          '[data-testid="plate-key"]',
          '[data-testid="plate-clock"]',
          '[data-testid="plate-zoom"]',
          '[data-testid="minimap"]',
          '[data-testid="plate-colophon"]',
        ];
        let hit = 0;
        for (const sel of selectors) {
          for (const el of document.querySelectorAll(sel)) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            const ix = Math.max(0, Math.min(r.right, w.right) - Math.max(r.left, w.left));
            const iy = Math.max(0, Math.min(r.bottom, w.bottom) - Math.max(r.top, w.top));
            hit += ix * iy;
          }
        }
        return hit;
      });
      expect(area).toBe(0);
    });

    test("con zoom cada punto visible tiene rótulo", async ({ page }) => {
      await enterAtlas(page);
      for (let i = 0; i < 4; i += 1) await page.keyboard.press("+");
      await page.waitForTimeout(500);
      const coverage = await page.evaluate(() => {
        const node = document.querySelector('[data-testid="plate-window"]');
        if (!node) return -1;
        const w = node.getBoundingClientRect();
        const inside = (r: DOMRect) => r.width > 0 && r.left >= w.left && r.right <= w.right && r.top >= w.top && r.bottom <= w.bottom;
        const marks = [...document.querySelectorAll('[data-testid^="point-"]')].filter((el) => inside(el.getBoundingClientRect()));
        const labels = new Set(
          [...document.querySelectorAll('[data-testid^="label-"], [data-testid^="callout-"]')]
            .filter((el) => el.getBoundingClientRect().width > 0)
            .map((el) => (el.getAttribute("data-testid") ?? "").replace(/^(label|callout)-/, "")),
        );
        const codes = marks.map((el) => (el.getAttribute("data-testid") ?? "").replace(/^point-/, ""));
        return codes.length === 0 ? -1 : codes.filter((code) => labels.has(code)).length / codes.length;
      });
      expect(coverage).toBe(1);
    });

    test("el peek móvil muestra el hanzi y no pisa el aviso", async ({ page }) => {
      test.skip(viewport.name !== "mobile", "el peek se mide en 390");
      await enterAtlas(page);
      await openPalette(page, "ST36");
      await page.keyboard.press("Enter");
      const hanzi = page.locator('[data-testid="sheet"] .folio-hanzi');
      await expect(hanzi).toHaveText("足三里");
      const box = await hanzi.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      }
      const overlap = await page.evaluate(() => {
        const foot = document.querySelector(".app-foot")?.getBoundingClientRect();
        const bar = document.querySelector('[data-testid="sheet"] .folio-foot')?.getBoundingClientRect();
        if (!foot || !bar || bar.height === 0) return -1;
        const ix = Math.max(0, Math.min(bar.right, foot.right) - Math.max(bar.left, foot.left));
        const iy = Math.max(0, Math.min(bar.bottom, foot.bottom) - Math.max(bar.top, foot.top));
        return ix * iy;
      });
      expect(overlap).toBe(0);
    });

    test("el foco de la portada es tinta", async ({ page }) => {
      await page.goto("/");
      const cta = page.getByTestId("legal-accept");
      await cta.focus();
      await expect(cta).toBeFocused();
      const outline = await cta.evaluate((el) => getComputedStyle(el).outlineColor);
      expect(outline).toBe("rgb(28, 25, 21)");
    });
  });
}
