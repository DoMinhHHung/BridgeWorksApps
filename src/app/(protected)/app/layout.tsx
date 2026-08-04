import { UserButton } from "@clerk/nextjs";

import { AppShell } from "@/components/layout/app-shell";
import {
  AuthState,
  configurationStateKind,
} from "@/components/layout/auth-state";
import { getClerkSessionState } from "@/lib/auth-session.server";
import { APP_ROUTE } from "@/lib/auth-routes";
import { getClerkConfiguration } from "@/lib/clerk-config.server";

export const dynamic = "force-dynamic";

function StandaloneAuthState({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-10 text-foreground sm:px-6">
      {children}
    </main>
  );
}

function AccountControlFallback() {
  return (
    <div
      role="status"
      aria-label="Loading account controls"
      className="h-11 w-40 max-w-full animate-pulse rounded-md bg-muted motion-reduce:animate-none"
    >
      <span className="sr-only">Loading account controls</span>
    </div>
  );
}

export default async function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configuration = getClerkConfiguration();
  if (configuration.status !== "configured") {
    return (
      <StandaloneAuthState>
        <AuthState
          kind={configurationStateKind(configuration)}
          headingLevel="h1"
        />
      </StandaloneAuthState>
    );
  }

  const session = await getClerkSessionState();
  if (session.status === "signed-out") {
    return session.redirectToSignIn({ returnBackUrl: APP_ROUTE });
  }
  if (session.status === "session-unavailable") {
    return (
      <StandaloneAuthState>
        <AuthState kind="session-unavailable" headingLevel="h1" />
      </StandaloneAuthState>
    );
  }
  if (session.status === "unexpected") {
    return (
      <StandaloneAuthState>
        <AuthState kind="unexpected" headingLevel="h1" />
      </StandaloneAuthState>
    );
  }

  const accountControl = (
    <UserButton showName fallback={<AccountControlFallback />} />
  );

  return <AppShell accountControl={accountControl}>{children}</AppShell>;
}
