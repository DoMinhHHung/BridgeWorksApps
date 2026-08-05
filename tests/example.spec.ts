import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders product-facing BridgeWorks landing content and auth CTAs", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/BridgeWorks/);
  await expect(
    page.getByRole("heading", {
      name: "Turn a new connection into work that lasts.",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Create an account" }),
  ).toHaveAttribute("href", "/sign-up");
  await expect(page.getByRole("link", { name: "Sign in" }).first()).toHaveAttribute(
    "href",
    "/sign-in",
  );
  await expect(
    page.getByText(/Next\.js|Storybook|Vitest|Playwright|Foundation status/i),
  ).toHaveCount(0);
});

test("renders deterministic secretless sign-in and sign-up states", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await expect(
    page.getByRole("heading", { name: "Sign in to BridgeWorks", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Authentication (is not configured|setup is incomplete|configuration is invalid)/,
      level: 2,
    }),
  ).toBeVisible();

  await page.goto("/sign-up");
  await expect(
    page.getByRole("heading", {
      name: "Create your BridgeWorks account",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Authentication (is not configured|setup is incomplete|configuration is invalid)/,
      level: 2,
    }),
  ).toBeVisible();
});

test("fails closed when a protected route has no usable Clerk configuration", async ({
  page,
}) => {
  const response = await page.goto("/app");

  expect(response?.status()).toBe(503);
  await expect(
    page.getByRole("heading", {
      name: "Authentication is temporarily unavailable",
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByText(/sk_test|CLERK_SECRET_KEY/)).toHaveCount(0);
});

for (const width of [375, 768, 1024, 1440]) {
  test(`landing has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test("has no automatically detectable accessibility violations", async ({
  page,
}) => {
  for (const route of ["/", "/sign-in", "/sign-up", "/app"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `accessibility violations on ${route}`).toEqual(
      [],
    );
  }
});
