import { z } from "zod";

import type { BridgeWorksTransportResult } from "@/lib/bridgeworks-api-core";

const uuidV7Pattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const currentUserSchema = z
  .object({
    id: z.string().regex(uuidV7Pattern),
    id_user: z.string().regex(/^bw[0-9]{12}$/),
    primary_email: z.string().email().nullable(),
    status: z.literal("active"),
    created_at: z.string().datetime({ offset: true }),
    updated_at: z.string().datetime({ offset: true }),
  })
  .strict();

const errorDetailsSchema = z.union([
  z.null(),
  z.record(z.string(), z.unknown()),
  z.array(z.unknown()),
]);

const errorEnvelopeSchema = z
  .object({
    code: z.string().min(1),
    message: z.string().min(1),
    request_id: z.string().min(1),
    details: errorDetailsSchema,
  })
  .strict();

export type CurrentUser = z.infer<typeof currentUserSchema>;

export type CurrentUserBackendResult =
  | { status: "ready"; user: CurrentUser }
  | {
      status: "identity-not-ready";
      requestId: string;
      retryAfterSeconds: number | null;
    }
  | { status: "disabled"; requestId: string }
  | { status: "deleted"; requestId: string }
  | { status: "unauthorized"; requestId: string }
  | {
      status: "rate-limited";
      requestId: string;
      retryAfterSeconds: number | null;
    }
  | { status: "service-unavailable"; requestId: string }
  | { status: "malformed-response"; requestId: string }
  | { status: "unexpected"; requestId: string };

export function parseRetryAfter(
  value: string | null,
  now = Date.now(),
): number | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (/^[0-9]+$/.test(normalized)) {
    const seconds = Number.parseInt(normalized, 10);
    return Number.isSafeInteger(seconds) ? seconds : null;
  }

  const retryAt = Date.parse(normalized);
  if (Number.isNaN(retryAt)) {
    return null;
  }

  return Math.max(0, Math.ceil((retryAt - now) / 1_000));
}

function malformed(requestId: string): CurrentUserBackendResult {
  return { status: "malformed-response", requestId };
}

export function mapCurrentUserResponse(
  result: BridgeWorksTransportResult,
  now = Date.now(),
): CurrentUserBackendResult {
  if (result.kind === "timeout" || result.kind === "network-error") {
    return { status: "service-unavailable", requestId: result.requestId };
  }

  if (result.bodyTooLarge || !result.body.trim()) {
    return malformed(result.requestId);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(result.body);
  } catch {
    return malformed(result.requestId);
  }

  if (result.status === 200) {
    const parsedUser = currentUserSchema.safeParse(payload);
    if (!parsedUser.success) {
      return malformed(result.requestId);
    }

    return { status: "ready", user: parsedUser.data };
  }

  const parsedError = errorEnvelopeSchema.safeParse(payload);
  if (!parsedError.success) {
    return malformed(result.requestId);
  }

  const requestId = parsedError.data.request_id;
  const code = parsedError.data.code;

  if (result.status === 401 && code === "unauthorized") {
    return { status: "unauthorized", requestId };
  }
  if (result.status === 403 && code === "account_disabled") {
    return { status: "disabled", requestId };
  }
  if (result.status === 403 && code === "account_deleted") {
    return { status: "deleted", requestId };
  }
  if (result.status === 409 && code === "identity_not_ready") {
    return {
      status: "identity-not-ready",
      requestId,
      retryAfterSeconds: parseRetryAfter(result.retryAfter, now),
    };
  }
  if (result.status === 429) {
    return {
      status: "rate-limited",
      requestId,
      retryAfterSeconds: parseRetryAfter(result.retryAfter, now),
    };
  }
  if (result.status === 503 && code === "service_unavailable") {
    return { status: "service-unavailable", requestId };
  }

  return { status: "unexpected", requestId };
}
