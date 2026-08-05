export const CLERK_ENV_KEYS = {
  publishableKey: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  secretKey: "CLERK_SECRET_KEY",
} as const;

type ClerkEnvironmentKey =
  (typeof CLERK_ENV_KEYS)[keyof typeof CLERK_ENV_KEYS];

type ClerkInstanceEnvironment = "test" | "live";
type ClerkKeyKind = "pk" | "sk";

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

function parsePrefixedEnvironment(
  value: string,
  kind: ClerkKeyKind,
): ClerkInstanceEnvironment | null {
  for (const environment of ["test", "live"] as const) {
    const prefix = `${kind}_${environment}_`;
    if (value.startsWith(prefix) && value.length > prefix.length) {
      return environment;
    }
  }

  return null;
}

function parsePublishableKeyEnvironment(
  publishableKey: string,
): ClerkInstanceEnvironment | null {
  const environment = parsePrefixedEnvironment(publishableKey, "pk");
  if (!environment) {
    return null;
  }

  const encodedFrontendApi = publishableKey.slice(
    `pk_${environment}_`.length,
  );

  try {
    const decodedFrontendApi = atob(encodedFrontendApi);
    if (
      decodedFrontendApi.length <= 1 ||
      !decodedFrontendApi.endsWith("$")
    ) {
      return null;
    }
  } catch {
    return null;
  }

  return environment;
}

function parseSecretKeyEnvironment(
  secretKey: string,
): ClerkInstanceEnvironment | null {
  // Clerk documents the environment prefixes, but the remaining secret payload
  // is opaque. Do not impose an undocumented charset or minimum length on it.
  return parsePrefixedEnvironment(secretKey, "sk");
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

  const publishableEnvironment =
    parsePublishableKeyEnvironment(publishableKey);
  const secretEnvironment = parseSecretKeyEnvironment(secretKey);
  if (!publishableEnvironment || !secretEnvironment) {
    const malformedKeys: ClerkEnvironmentKey[] = [];
    if (!publishableEnvironment) {
      malformedKeys.push(CLERK_ENV_KEYS.publishableKey);
    }
    if (!secretEnvironment) {
      malformedKeys.push(CLERK_ENV_KEYS.secretKey);
    }

    return {
      status: "malformed",
      keys: malformedKeys,
      reason: "invalid_format",
    };
  }

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
