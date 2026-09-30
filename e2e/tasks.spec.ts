import { expect, test, type Locator, type Page } from "@playwright/test";

const CAPS = {
  desktop: { U1: 3, U2: 4, U3: 3, U4: 3, U5: 3, U6: 2, U7: 2, U8: 2, U9: 1, U10: 2, U11: 2, U12: 2 },
  mobile: { U1: 3, U2: 4, U3: 3, U4: 3, U5: 4, U6: 3, U7: 2, U8: 2, U9: 0, U10: 3, U11: 2, U12: 3 },
} as const;

test.beforeEach(({ }, info) => {
  info.skip(info.project.name !== "chromium", "las 12 tareas corren en el proyecto chromium");
});

async function enterAtlas(page: Page): Promise<void> {
  await page.goto("/");
  await page.evaluate(() => {
    try {
      window.localStorage.setItem("acu3d.hint.v1", "1");
    } catch {
      /* private */
    }
  });
  await page.keyboard.press("Enter");
  await expect(page.locator("#legal-gate")).toHaveCount(0);
  await expect(page.getByTestId("plate")).toBeVisible();
}

function actions(page: Page) {
  let n = 0;
  const mark = () => {
    n += 1;
  };
  return {
    get count() {
      return n;
    },
    reset() {
      n = 0;
    },
    async click(target: Locator) {
      mark();
      await target.click();
    },
    async press(key: string) {
      mark();
      await page.keyboard.press(key);
    },
    async type(text: string) {
      mark();
      await page.keyboard.type(text);
    },
    async wheel() {
      mark();
      const win = page.getByTestId("plate-window");
      const box = await win.boundingBox();
      if (!box) return;
      await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.45);
      await page.mouse.wheel(0, -400);
    },
  };
}

async function openCode(page: Page, act: ReturnType<typeof actions>, code: string): Promise<void> {
  await act.press("/");
  await act.type(code);
  await act.press("Enter");
  await expect(page.locator(".folio .code").first()).toHaveText(code);
}

async function clickMark(page: Page, act: ReturnType<typeof actions>, code: string): Promise<void> {
  for (let i = 0; i < 2 && (await page.getByTestId(`point-${code}`).count()) === 0; i += 1) {
    await act.press("+");
  }
  const mark = page.getByTestId(`point-${code}`);
  await expect(mark).toBeVisible();
  await act.click(mark);
  await expect(page.locator(".folio .code").first()).toHaveText(code);
}

async function openClock(page: Page, act: ReturnType<typeof actions>): Promise<void> {
  const chip = page.locator(".qi-chip");
  if ((await chip.count()) > 0 && (await chip.isVisible())) await act.click(chip);
}

for (const viewport of [
  { name: "desktop" as const, width: 1440, height: 900 },
  { name: "mobile" as const, width: 390, height: 844 },
]) {
  test.describe(viewport.name, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.name === "mobile",
      isMobile: viewport.name === "mobile",
    });
    const cap = CAPS[viewport.name];

    test("U1–U12 dentro del tope", async ({ page }) => {
      const act = actions(page);
      await enterAtlas(page);

      await openCode(page, act, "ST36");
      expect(act.count).toBeLessThanOrEqual(cap.U1);
      await page.keyboard.press("Escape");

      act.reset();
      await openCode(page, act, "LI4");
      await expect(page.locator(".caution")).toContainText("embarazo");
      expect(act.count).toBeLessThanOrEqual(cap.U2);
      await page.keyboard.press("Escape");

      act.reset();
      await act.press("p");
      await clickMark(page, act, "BL23");
      expect(act.count).toBeLessThanOrEqual(cap.U3);
      await page.keyboard.press("Escape");
      await page.keyboard.press("a");

      act.reset();
      await act.press("3");
      await clickMark(page, act, "LI4");
      expect(act.count).toBeLessThanOrEqual(cap.U4);
      await page.keyboard.press("Escape");
      await page.keyboard.press("1");

      act.reset();
      await openClock(page, act);
      await act.click(page.getByTestId("clock-play"));
      await act.click(page.locator("#clock-sector-ST"));
      await expect(page.locator(".qi-caption").first()).toContainText("07:00");
      await expect(page.locator(".qi-caption").first()).toContainText("ST");
      expect(act.count).toBeLessThanOrEqual(cap.U5);
      const pop = page.locator(".qi-pop");
      if ((await pop.count()) > 0) await page.keyboard.press("Escape");

      act.reset();
      await openClock(page, act);
      await act.click(page.locator("#clock-sector-BL"));
      await expect(page.locator(".qi-caption").first()).toContainText("15:00");
      await expect(page.locator(".qi-caption").first()).toContainText("BL");
      expect(act.count).toBeLessThanOrEqual(cap.U6);
      if ((await page.locator(".qi-pop").count()) > 0) await page.keyboard.press("Escape");

      act.reset();
      await act.click(page.getByRole("button", { name: /Idioma/ }));
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await act.click(page.getByRole("button", { name: /Language/ }));
      await expect(page.locator("html")).toHaveAttribute("lang", "es");
      expect(act.count).toBeLessThanOrEqual(cap.U7);

      await page.keyboard.press("+");
      await page.keyboard.press("/");
      await page.keyboard.type("ST36");
      await page.keyboard.press("Enter");
      await expect(page.locator(".folio")).toBeVisible();
      act.reset();
      await act.press("Escape");
      await act.press("0");
      await expect(page.locator(".folio")).toHaveCount(0);
      await expect(page.getByTestId("region-body")).toHaveAttribute("aria-checked", "true");
      await expect(page.getByTestId("view-anterior")).toHaveAttribute("aria-checked", "true");
      expect(act.count).toBeLessThanOrEqual(cap.U8);

      if (viewport.name === "desktop") {
        act.reset();
        await act.press("?");
        await expect(page.getByTestId("help-dialog")).toContainText("A / P");
        await expect(page.getByTestId("help-dialog")).toContainText("Glosario");
        expect(act.count).toBeLessThanOrEqual(cap.U9);
        await page.keyboard.press("Escape");
      }

      act.reset();
      await page.keyboard.press("0");
      await clickMark(page, act, "ST36");
      expect(act.count).toBeLessThanOrEqual(cap.U10);
      const from = await page.locator(".folio .code").first().innerText();
      act.reset();
      await act.press("ArrowRight");
      await expect(page.locator(".folio .code").first()).not.toHaveText(from);
      expect(act.count).toBeLessThanOrEqual(cap.U11);
      act.reset();
      await act.press("ArrowLeft");
      await expect(page.locator(".folio .code").first()).toHaveText(from);
      expect(act.count).toBeLessThanOrEqual(cap.U11);

      act.reset();
      const sources = page.getByRole("heading", { name: "Fuentes" });
      const confidence = page.getByRole("heading", { name: "Confianza" });
      if (!(await sources.isVisible()) || !(await confidence.isVisible())) await act.wheel();
      await sources.scrollIntoViewIfNeeded();
      await confidence.scrollIntoViewIfNeeded();
      await expect(sources).toBeVisible();
      await expect(confidence).toBeVisible();
      expect(act.count).toBeLessThanOrEqual(cap.U12);
    });
  });
}
