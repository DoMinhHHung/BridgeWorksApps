import { Buffer } from "node:buffer";

import { describe, expect, it } from "vitest";

import { classifyClerkConfiguration } from "@/lib/clerk-config";

const frontendApiDomain = "bridgeworks-test.accounts.dev";
const encodedFrontendApi = Buffer.from(`${frontendApiDomain}$`, "utf8").toString(
  "base64",
);
const publishableTestKey = `pk_test_${encodedFrontendApi}`;
const publishableLiveKey = `pk_live_${encodedFrontendApi}`;
const secretTestKey = "sk_test_opaque:fixture/with+punctuation=";

describe("classifyClerkConfiguration", () => {
  it("accepts an official-shaped test key pair without returning the secret", () => {
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
    expect(JSON.stringify(result)).not.toContain(secretTestKey);
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

  it("classifies an invalid publishable key as malformed", () => {
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

  it("classifies a Secret Key without an opaque payload as malformed", () => {
    expect(
      classifyClerkConfiguration({
        publishableKey: publishableTestKey,
        secretKey: "sk_test_",
      }),
    ).toEqual({
      status: "malformed",
      keys: ["CLERK_SECRET_KEY"],
      reason: "invalid_format",
    });
  });

  it("rejects a live publishable key paired with a test Secret Key", () => {
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
