export const CLERK_ENV_KEYS = {
  publishableKey: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  secretKey: "CLERK_SECRET_KEY",
} as const;

type ClerkEnvironmentKey =
  (typeof CLERK_ENV_KEYS)[keyof typeof CLERK_ENV_KEYS];

type ClerkInstanceEnvironment = "test" | "live";

export type ClerkConfiguration =
  | {
      status: "configured";
      publishableKey: string;
      environment: ClerkInstanceEnvironment;
    }
  | {
      status: "missing";
      keys: readonly ClerkEnvironmentKey[];
    }
  | {
      status: "placeholder";
      keys: readonly ClerkEnvironmentKey[];
    }
  | {
      status: "malformed";
      keys: readonly ClerkEnvironmentKey[];
      reason: "invalid_format" | "environment_mismatch";
    };

type ClerkEnvironmentInput = {
  publishableKey?: string;
  secretKey?: string;
};

const publishableKeyPattern = /^pk_(test|live)_[A-Za-z0-9_-]{16,}$/;
const secretKeyPattern = /^sk_(test|live)_[A-Za-z0-9_-]{16,}$/;

function normalize(value: string | undefined) {
  return value?.trim() ?? "";
}

function isPlaceholder(value: string) {
  const normalized = value.toLowerCase();

  return (
    normalized.includes("replace_me") ||
    normalized.includes("placeholder") ||
    normalized.includes("your_key") ||
    normalized.startsWith("<") ||
    normalized.endsWith(">")
  );
}

export function classifyClerkConfiguration(
  input: ClerkEnvironmentInput,
): ClerkConfiguration {
  const publishableKey = normalize(input.publishableKey);
  const secretKey = normalize(input.secretKey);

  const missingKeys: ClerkEnvironmentKey[] = [];
  if (!publishableKey) {
    missingKeys.push(CLERK_ENV_KEYS.publishableKey);
  }
  if (!secretKey) {
    missingKeys.push(CLERK_ENV_KEYS.secretKey);
  }
  if (missingKeys.length > 0) {
    return { status: "missing", keys: missingKeys };
  }

  const placeholderKeys: ClerkEnvironmentKey[] = [];
  if (isPlaceholder(publishableKey)) {
    placeholderKeys.push(CLERK_ENV_KEYS.publishableKey);
  }
  if (isPlaceholder(secretKey)) {
    placeholderKeys.push(CLERK_ENV_KEYS.secretKey);
  }
  if (placeholderKeys.length > 0) {
    return { status: "placeholder", keys: placeholderKeys };
  }

  const publishableMatch = publishableKey.match(publishableKeyPattern);
  const secretMatch = secretKey.match(secretKeyPattern);
  if (!publishableMatch || !secretMatch) {
    const malformedKeys: ClerkEnvironmentKey[] = [];
    if (!publishableMatch) {
      malformedKeys.push(CLERK_ENV_KEYS.publishableKey);
    }
    if (!secretMatch) {
      malformedKeys.push(CLERK_ENV_KEYS.secretKey);
    }

    return {
      status: "malformed",
      keys: malformedKeys,
      reason: "invalid_format",
    };
  }

  const publishableEnvironment = publishableMatch[1] as ClerkInstanceEnvironment;
  const secretEnvironment = secretMatch[1] as ClerkInstanceEnvironment;
  if (publishableEnvironment !== secretEnvironment) {
    return {
      status: "malformed",
      keys: [CLERK_ENV_KEYS.publishableKey, CLERK_ENV_KEYS.secretKey],
      reason: "environment_mismatch",
    };
  }

  return {
    status: "configured",
    publishableKey,
    environment: publishableEnvironment,
  };
}
