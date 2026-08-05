import { describe, expect, it } from "vitest";

import {
  mapCurrentUserResponse,
  parseRetryAfter,
} from "@/features/current-user/current-user-contract";
import type { BridgeWorksTransportResult } from "@/lib/bridgeworks-api-core";

const user = {
  id: "0198e9a0-1234-7abc-8def-1234567890ab",
  id_user: "bw123405082634",
  primary_email: "member@example.test",
  status: "active",
  created_at: "2026-08-03T01:02:03.000Z",
  updated_at: "2026-08-05T04:05:06.000Z",
};

function transportResponse(
  status: number,
  body: unknown,
  options: { requestId?: string; retryAfter?: string | null } = {},
): BridgeWorksTransportResult {
  return {
    kind: "response",
    status,
    body: typeof body === "string" ? body : JSON.stringify(body),
    bodyTooLarge: false,
    requestId: options.requestId ?? "header-request-id",
    retryAfter: options.retryAfter ?? null,
  };
}

function errorEnvelope(code: string, requestId = "backend-request-id") {
  return {
    code,
    message: "safe backend message",
    request_id: requestId,
    details: null,
  };
}

describe("mapCurrentUserResponse", () => {
  it("parses the exact active current-user payload", () => {
    expect(mapCurrentUserResponse(transportResponse(200, user))).toEqual({
      status: "ready",
      user,
    });
  });

  it("accepts a null primary email", () => {
    expect(
      mapCurrentUserResponse(
        transportResponse(200, { ...user, primary_email: null }),
      ),
    ).toMatchObject({
      status: "ready",
      user: { primary_email: null },
    });
  });

  it.each([
    ["invalid UUID", { ...user, id: "not-a-uuid" }],
    ["non-v7 UUID", { ...user, id: "0198e9a0-1234-4abc-8def-1234567890ab" }],
    ["invalid public ID", { ...user, id_user: "user-123" }],
    ["unsupported status", { ...user, status: "disabled" }],
    ["invalid email", { ...user, primary_email: "not-an-email" }],
    ["invalid timestamp", { ...user, created_at: "yesterday" }],
    ["extra field", { ...user, clerk_user_id: "private-provider-id" }],
  ])("maps malformed success payload: %s", (_label, payload) => {
    expect(mapCurrentUserResponse(transportResponse(200, payload))).toEqual({
      status: "malformed-response",
      requestId: "header-request-id",
    });
  });

  it.each([
    [401, "unauthorized", "unauthorized"],
    [403, "account_disabled", "disabled"],
    [403, "account_deleted", "deleted"],
    [503, "service_unavailable", "service-unavailable"],
  ] as const)(
    "maps HTTP %s code %s to %s and preserves the backend request ID",
    (status, code, expectedStatus) => {
      expect(
        mapCurrentUserResponse(
          transportResponse(status, errorEnvelope(code, "preserved-request-id")),
        ),
      ).toEqual({
        status: expectedStatus,
        requestId: "preserved-request-id",
      });
    },
  );

  it("maps identity-not-ready with Retry-After", () => {
    expect(
      mapCurrentUserResponse(
        transportResponse(409, errorEnvelope("identity_not_ready"), {
          retryAfter: "2",
        }),
      ),
    ).toEqual({
      status: "identity-not-ready",
      requestId: "backend-request-id",
      retryAfterSeconds: 2,
    });
  });

  it("maps HTTP 429 without inventing a backend-specific error code", () => {
    expect(
      mapCurrentUserResponse(
        transportResponse(429, errorEnvelope("gateway_rate_limited"), {
          retryAfter: "15",
        }),
      ),
    ).toEqual({
      status: "rate-limited",
      requestId: "backend-request-id",
      retryAfterSeconds: 15,
    });
  });

  it("maps unsupported status/code combinations to unexpected", () => {
    expect(
      mapCurrentUserResponse(
        transportResponse(403, errorEnvelope("permission_denied")),
      ),
    ).toEqual({
      status: "unexpected",
      requestId: "backend-request-id",
    });
  });

  it.each([
    ["invalid JSON", transportResponse(200, "{broken")],
    ["empty response", transportResponse(200, "")],
    [
      "invalid error envelope",
      transportResponse(503, {
        code: "service_unavailable",
        message: "service temporarily unavailable",
      }),
    ],
    [
      "unsupported details primitive",
      transportResponse(503, {
        ...errorEnvelope("service_unavailable"),
        details: "raw diagnostic",
      }),
    ],
  ])("maps %s to a safe malformed-response state", (_label, result) => {
    expect(mapCurrentUserResponse(result)).toEqual({
      status: "malformed-response",
      requestId: "header-request-id",
    });
  });

  it("maps oversized response to malformed-response", () => {
    expect(
      mapCurrentUserResponse({
        kind: "response",
        status: 200,
        body: "",
        bodyTooLarge: true,
        requestId: "large-request-id",
        retryAfter: null,
      }),
    ).toEqual({
      status: "malformed-response",
      requestId: "large-request-id",
    });
  });

  it.each(["timeout", "network-error"] as const)(
    "maps %s to service-unavailable",
    (kind) => {
      expect(
        mapCurrentUserResponse({ kind, requestId: "transport-request-id" }),
      ).toEqual({
        status: "service-unavailable",
        requestId: "transport-request-id",
      });
    },
  );
});

describe("parseRetryAfter", () => {
  it("parses integer seconds", () => {
    expect(parseRetryAfter("20")).toBe(20);
  });

  it("parses an HTTP date", () => {
    expect(
      parseRetryAfter("Wed, 05 Aug 2026 10:00:05 GMT", Date.UTC(2026, 7, 5, 10)),
    ).toBe(5);
  });

  it("rejects invalid values", () => {
    expect(parseRetryAfter("later")).toBeNull();
  });
});
