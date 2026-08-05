export const BRIDGEWORKS_API_BASE_URL_ENV_KEY =
  "NEXT_PUBLIC_API_BASE_URL" as const;

export type BridgeWorksApiConfiguration =
  | {
      status: "configured";
      baseUrl: string;
    }
  | {
      status: "missing";
      key: typeof BRIDGEWORKS_API_BASE_URL_ENV_KEY;
    }
  | {
      status: "placeholder";
      key: typeof BRIDGEWORKS_API_BASE_URL_ENV_KEY;
    }
  | {
      status: "malformed";
      key: typeof BRIDGEWORKS_API_BASE_URL_ENV_KEY;
    };

function isPlaceholder(value: string) {
  const normalized = value.toLowerCase();

  return (
    normalized.includes("replace_me") ||
    normalized.includes("placeholder") ||
    normalized.includes("your_url") ||
    normalized.startsWith("<") ||
    normalized.endsWith(">")
  );
}

export function classifyBridgeWorksApiConfiguration(
  value: string | undefined,
): BridgeWorksApiConfiguration {
  const normalized = value?.trim() ?? "";

  if (!normalized) {
    return {
      status: "missing",
      key: BRIDGEWORKS_API_BASE_URL_ENV_KEY,
    };
  }

  if (isPlaceholder(normalized)) {
    return {
      status: "placeholder",
      key: BRIDGEWORKS_API_BASE_URL_ENV_KEY,
    };
  }

  try {
    const url = new URL(normalized);
    const hasSupportedProtocol = url.protocol === "http:" || url.protocol === "https:";
    const hasOriginOnlyPath = url.pathname === "/";

    if (
      !hasSupportedProtocol ||
      !url.hostname ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !hasOriginOnlyPath
    ) {
      throw new Error("invalid BridgeWorks API base URL");
    }

    return {
      status: "configured",
      baseUrl: url.origin,
    };
  } catch {
    return {
      status: "malformed",
      key: BRIDGEWORKS_API_BASE_URL_ENV_KEY,
    };
  }
}
