import { expect, test, type Page } from "@playwright/test";

test.beforeEach(({ }, info) => {
  info.skip(info.project.name !== "chromium", "el toque por punto corre en chromium");
});

async function enter(page: Page): Promise<void> {
  await page.goto("/");
  await page.keyboard.press("Enter");
  await expect(page.locator("#legal-gate")).toHaveCount(0);
}

async function visibleCodes(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const plate = document.querySelector('[data-testid="plate-window"]');
    if (!(plate instanceof Element)) return [];
    const bounds = plate.getBoundingClientRect();
    const codes: string[] = [];
    for (const el of document.querySelectorAll('[data-testid^="point-"]')) {
      const box = el.getBoundingClientRect();
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      if (cx < bounds.left || cx > bounds.right || cy < bounds.top || cy > bounds.bottom) continue;
      const code = (el.getAttribute("data-testid") ?? "").slice(6);
      if (code) codes.push(code);
    }
    return codes;
  });
}

async function tapCode(page: Page, code: string, touch: boolean): Promise<void> {
  const mark = page.getByTestId(`point-${code}`);
  const box = await mark.boundingBox();
  expect(box, code).not.toBeNull();
  if (!box) return;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  if (touch) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
  await expect(page.locator(".folio .code").first()).toHaveText(code);
  await page.keyboard.press("Escape");
  await expect(page.locator(".folio")).toHaveCount(0);
}

test.describe("cada marca abre su código", () => {
  test.describe("desktop", () => {
    test.use({ viewport: { width: 1440, height: 900 } });
    test("el centro de cada punto visible", async ({ page }) => {
      await enter(page);
      const codes = await visibleCodes(page);
      expect(codes.length).toBeGreaterThan(8);
      for (const code of codes) await tapCode(page, code, false);
      await page.waitForTimeout(300);
      await expect(page.getByTestId("first-hint")).toHaveCount(0);
    });
  });

  test.describe("móvil", () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    test("los pares que se solapaban", async ({ page }) => {
      await enter(page);
      for (let i = 0; i < 2; i += 1) await page.keyboard.press("+");
      const wanted = ["ST36", "GB34", "SP6", "KI3", "LR3", "CV12"];
      for (const code of wanted) {
        await expect(page.getByTestId(`point-${code}`)).toBeVisible();
        await tapCode(page, code, true);
      }
      await page.waitForTimeout(300);
      await expect(page.getByTestId("first-hint")).toHaveCount(0);
    });
  });
});
