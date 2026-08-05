import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the BridgeWorks public foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/BridgeWorks/);
  await expect(
    page.getByRole("heading", {
      name: "Build trusted work relationships, step by step.",
    }),
  ).toBeVisible();
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
