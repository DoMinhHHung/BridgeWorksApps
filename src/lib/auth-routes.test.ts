import { describe, expect, it } from "vitest";

import { isProtectedAppPathname } from "@/lib/auth-routes";

describe("isProtectedAppPathname", () => {
  it.each(["/app", "/app/", "/app/settings", "/app/settings/profile/"])(
    "protects %s",
    (pathname) => {
      expect(isProtectedAppPathname(pathname)).toBe(true);
    },
  );

  it.each([
    "/",
    "/sign-in",
    "/sign-up",
    "/application",
    "/app-store",
    "/api/app",
    "/api/v1/me",
  ])("leaves %s outside the application policy", (pathname) => {
    expect(isProtectedAppPathname(pathname)).toBe(false);
  });
});
