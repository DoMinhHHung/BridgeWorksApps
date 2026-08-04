import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the BridgeWorks frontend foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/BridgeWorks/);
  await expect(
    page.getByRole("heading", {
      name: "Build trusted work relationships, step by step.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore the product foundation" }),
  ).toBeVisible();
});

test("has no automatically detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
