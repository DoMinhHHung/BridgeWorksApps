import { describe, expect, it } from "vitest";

import { classifyClerkConfiguration } from "@/lib/clerk-config";

const publishableTestKey = `pk_test_${"a".repeat(24)}`;
const secretTestKey = `sk_test_${"b".repeat(24)}`;
const publishableLiveKey = `pk_live_${"c".repeat(24)}`;

 describe("classifyClerkConfiguration", () => {
  it("classifies matching valid keys as configured without returning the secret", () => {
    const result = classifyClerkConfiguration({
      publishableKey: `  ${publishableTestKey}  `,
      secretKey: `  ${secretTestKey}  `,
    });

    expect(result).toEqual({
      status: "configured",
      publishableKey: publishableTestKey,
      environment: "test",
    });
    expect(result).not.toHaveProperty("secretKey");
  });

  it("reports every missing key", () => {
    expect(classifyClerkConfiguration({})).toEqual({
      status: "missing",
      keys: [
        "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
        "CLERK_SECRET_KEY",
      ],
    });
  });

  it("treats blank values as missing before inspecting placeholders", () => {
    expect(
      classifyClerkConfiguration({
        publishableKey: " ",
        secretKey: "sk_test_replace_me",
      }),
    ).toEqual({
      status: "missing",
      keys: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
    });
  });

  it("classifies checked-in example values as placeholders", () => {
    expect(
      classifyClerkConfiguration({
        publishableKey: "pk_test_replace_me",
        secretKey: "sk_test_replace_me",
      }),
    ).toEqual({
      status: "placeholder",
      keys: [
        "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
        "CLERK_SECRET_KEY",
      ],
    });
  });

  it("classifies invalid key formats as malformed", () => {
    expect(
      classifyClerkConfiguration({
        publishableKey: "publishable-value",
        secretKey: secretTestKey,
      }),
    ).toEqual({
      status: "malformed",
      keys: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
      reason: "invalid_format",
    });
  });

  it("rejects test and live keys from different Clerk instances", () => {
    expect(
      classifyClerkConfiguration({
        publishableKey: publishableLiveKey,
        secretKey: secretTestKey,
      }),
    ).toEqual({
      status: "malformed",
      keys: [
        "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
        "CLERK_SECRET_KEY",
      ],
      reason: "environment_mismatch",
    });
  });
});
