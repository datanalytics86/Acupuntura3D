import { expect, test } from "@playwright/test";

test.beforeEach(({ }, info) => {
  info.skip(info.project.name !== "reduced", "solo el proyecto con movimiento reducido");
});

test("el cometa no corre y el reloj no arranca", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Enter");
  await expect(page.locator("#legal-gate")).toHaveCount(0);
  await expect(page.locator(".qi-comet")).toHaveCount(0);
  await expect(page.getByTestId("clock-play")).toBeDisabled();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});
