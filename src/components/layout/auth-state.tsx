import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { APP_ROUTE, HOME_ROUTE } from "@/lib/auth-routes";
import type { ClerkConfiguration } from "@/lib/clerk-config";

type AuthStateKind =
  | "configuration-missing"
  | "configuration-placeholder"
  | "configuration-malformed"
  | "session-unavailable"
  | "unexpected";

type AuthStateProps = {
  kind: AuthStateKind;
  headingLevel?: "h1" | "h2";
};

const stateContent: Record<
  AuthStateKind,
  { title: string; description: string; actionLabel: string; actionHref: string }
> = {
  "configuration-missing": {
    title: "Authentication is not configured",
    description:
      "BridgeWorks public pages remain available, but secure account access requires the application operator to finish the Clerk configuration.",
    actionLabel: "Return to BridgeWorks",
    actionHref: HOME_ROUTE,
  },
  "configuration-placeholder": {
    title: "Authentication setup is incomplete",
    description:
      "Example credentials are still active. Replace them with a valid Clerk development or production key pair before opening secure routes.",
    actionLabel: "Return to BridgeWorks",
    actionHref: HOME_ROUTE,
  },
  "configuration-malformed": {
    title: "Authentication configuration is invalid",
    description:
      "The configured Clerk key pair cannot be used safely. The application operator must correct the configuration before secure routes can open.",
    actionLabel: "Return to BridgeWorks",
    actionHref: HOME_ROUTE,
  },
  "session-unavailable": {
    title: "Your session is not ready",
    description:
      "BridgeWorks confirmed an account but could not establish a usable session. Reload the protected application to try again.",
    actionLabel: "Reload the application",
    actionHref: APP_ROUTE,
  },
  unexpected: {
    title: "Authentication could not be verified",
    description:
      "A temporary authentication error prevented BridgeWorks from confirming the session. No protected content was rendered.",
    actionLabel: "Try the application again",
    actionHref: APP_ROUTE,
  },
};

export function configurationStateKind(
  configuration: Exclude<ClerkConfiguration, { status: "configured" }>,
): AuthStateKind {
  return `configuration-${configuration.status}`;
}

export function AuthState({ kind, headingLevel = "h2" }: AuthStateProps) {
  const content = stateContent[kind];
  const Heading = headingLevel;

  return (
    <section
      aria-labelledby={`auth-state-${kind}`}
      className="w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-foreground">
        <AlertTriangle aria-hidden="true" className="size-5" />
      </div>
      <Heading
        id={`auth-state-${kind}`}
        className="mt-5 text-2xl font-semibold tracking-tight"
      >
        {content.title}
      </Heading>
      <p className="mt-3 max-w-prose text-base leading-7 text-muted-foreground">
        {content.description}
      </p>
      <Link
        href={content.actionHref}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
      >
        {content.actionLabel}
      </Link>
    </section>
  );
}
