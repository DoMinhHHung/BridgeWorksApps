import { afterEach, describe, expect, it, vi } from "vitest";

import {
  requestBridgeWorksApi,
  type BridgeWorksFetch,
} from "@/lib/bridgeworks-api-core";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("requestBridgeWorksApi", () => {
  it("sends only the Bearer token and request ID with no-store cookie-free fetch", async () => {
    const token = "session-token-fixture";
    let requestedUrl = "";
    let requestInit: RequestInit | undefined;
    const fetcher: BridgeWorksFetch = async (input, init) => {
      requestedUrl = input.toString();
      requestInit = init;
      return new Response('{"ok":true}', {
        status: 200,
        headers: { "X-Request-Id": "backend-request-id" },
      });
    };

    const result = await requestBridgeWorksApi({
      baseUrl: "http://127.0.0.1:9080",
      path: "/api/v1/me",
      token,
      requestId: "frontend-request-id",
      fetcher,
    });

    expect(requestedUrl).toBe("http://127.0.0.1:9080/api/v1/me");
    expect(requestInit).toMatchObject({
      method: "GET",
      cache: "no-store",
      credentials: "omit",
      redirect: "manual",
    });
    expect(requestInit?.headers).toMatchObject({
      Authorization: `Bearer ${token}`,
      "X-Request-Id": "frontend-request-id",
    });
    expect(JSON.stringify(result)).not.toContain(token);
    expect(result).toMatchObject({
      kind: "response",
      status: 200,
      requestId: "backend-request-id",
    });
  });

  it("falls back to the frontend request ID when the response omits it", async () => {
    const result = await requestBridgeWorksApi({
      baseUrl: "http://127.0.0.1:9080",
      path: "/api/v1/me",
      token: "fixture",
      requestId: "frontend-request-id",
      fetcher: async () => new Response("{}", { status: 503 }),
    });

    expect(result).toMatchObject({
      kind: "response",
      requestId: "frontend-request-id",
    });
  });

  it("maps an aborted bounded request to timeout", async () => {
    vi.useFakeTimers();
    const fetcher: BridgeWorksFetch = async (_input, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      });

    const request = requestBridgeWorksApi({
      baseUrl: "http://127.0.0.1:9080",
      path: "/api/v1/me",
      token: "fixture",
      requestId: "timeout-request-id",
      timeoutMs: 50,
      fetcher,
    });

    await vi.advanceTimersByTimeAsync(50);
    await expect(request).resolves.toEqual({
      kind: "timeout",
      requestId: "timeout-request-id",
    });
  });

  it("maps a network failure without exposing the raw error", async () => {
    const result = await requestBridgeWorksApi({
      baseUrl: "http://127.0.0.1:9080",
      path: "/api/v1/me",
      token: "fixture",
      requestId: "network-request-id",
      fetcher: async () => {
        throw new Error("private upstream diagnostic");
      },
    });

    expect(result).toEqual({
      kind: "network-error",
      requestId: "network-request-id",
    });
    expect(JSON.stringify(result)).not.toContain("private upstream diagnostic");
  });

  it("bounds response bodies", async () => {
    const result = await requestBridgeWorksApi({
      baseUrl: "http://127.0.0.1:9080",
      path: "/api/v1/me",
      token: "fixture",
      requestId: "large-response-request-id",
      maxResponseBytes: 4,
      fetcher: async () => new Response("12345", { status: 200 }),
    });

    expect(result).toEqual({
      kind: "response",
      status: 200,
      body: "",
      bodyTooLarge: true,
      requestId: "large-response-request-id",
      retryAfter: null,
    });
  });
});
