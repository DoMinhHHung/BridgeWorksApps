const DEFAULT_TIMEOUT_MS = 4_000;
const DEFAULT_MAX_RESPONSE_BYTES = 64 * 1024;

export type BridgeWorksFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type BridgeWorksTransportResult =
  | {
      kind: "response";
      status: number;
      body: string;
      bodyTooLarge: boolean;
      requestId: string;
      retryAfter: string | null;
    }
  | {
      kind: "timeout";
      requestId: string;
    }
  | {
      kind: "network-error";
      requestId: string;
    };

type BridgeWorksRequestInput = {
  baseUrl: string;
  path: string;
  token: string;
  requestId: string;
  timeoutMs?: number;
  maxResponseBytes?: number;
  fetcher?: BridgeWorksFetch;
};

async function readBoundedResponseBody(
  response: Response,
  maxBytes: number,
): Promise<{ body: string; bodyTooLarge: boolean }> {
  if (!response.body) {
    return { body: "", bodyTooLarge: false };
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!value) {
        continue;
      }

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { body: "", bodyTooLarge: true };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return {
    body: new TextDecoder().decode(bytes),
    bodyTooLarge: false,
  };
}

export async function requestBridgeWorksApi({
  baseUrl,
  path,
  token,
  requestId,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxResponseBytes = DEFAULT_MAX_RESPONSE_BYTES,
  fetcher = fetch,
}: BridgeWorksRequestInput): Promise<BridgeWorksTransportResult> {
  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetcher(new URL(path, `${baseUrl}/`), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Request-Id": requestId,
      },
      cache: "no-store",
      credentials: "omit",
      redirect: "manual",
      signal: controller.signal,
    });
    const body = await readBoundedResponseBody(response, maxResponseBytes);
    const responseRequestId = response.headers.get("x-request-id")?.trim();

    return {
      kind: "response",
      status: response.status,
      body: body.body,
      bodyTooLarge: body.bodyTooLarge,
      requestId: responseRequestId || requestId,
      retryAfter: response.headers.get("retry-after"),
    };
  } catch (error) {
    if (
      timedOut ||
      (error instanceof DOMException && error.name === "AbortError")
    ) {
      return { kind: "timeout", requestId };
    }

    return { kind: "network-error", requestId };
  } finally {
    clearTimeout(timeout);
  }
}
