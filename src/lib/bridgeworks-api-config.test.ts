import { describe, expect, it } from "vitest";

import { classifyBridgeWorksApiConfiguration } from "@/lib/bridgeworks-api-config";

describe("classifyBridgeWorksApiConfiguration", () => {
  it("accepts the local APISIX origin and removes a trailing slash", () => {
    expect(
      classifyBridgeWorksApiConfiguration(" http://127.0.0.1:9080/ "),
    ).toEqual({
      status: "configured",
      baseUrl: "http://127.0.0.1:9080",
    });
  });

  it("accepts an HTTPS gateway origin", () => {
    expect(
      classifyBridgeWorksApiConfiguration("https://gateway.example.test"),
    ).toEqual({
      status: "configured",
      baseUrl: "https://gateway.example.test",
    });
  });

  it("classifies a missing value", () => {
    expect(classifyBridgeWorksApiConfiguration(undefined)).toEqual({
      status: "missing",
      key: "NEXT_PUBLIC_API_BASE_URL",
    });
  });

  it("classifies a safe checked-in placeholder", () => {
    expect(
      classifyBridgeWorksApiConfiguration("https://replace_me.example"),
    ).toEqual({
      status: "placeholder",
      key: "NEXT_PUBLIC_API_BASE_URL",
    });
  });

  it.each([
    "gateway.example.test",
    "ftp://gateway.example.test",
    "https://user:password@gateway.example.test",
    "https://gateway.example.test/api",
    "https://gateway.example.test?token=value",
  ])("rejects malformed base URL %s", (value) => {
    expect(classifyBridgeWorksApiConfiguration(value)).toEqual({
      status: "malformed",
      key: "NEXT_PUBLIC_API_BASE_URL",
    });
  });
});
