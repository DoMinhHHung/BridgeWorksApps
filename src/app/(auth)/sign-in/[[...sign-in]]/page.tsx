import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  AuthComponentFallback,
  AuthPage,
} from "@/components/layout/auth-page";
import {
  AuthState,
  configurationStateKind,
} from "@/components/layout/auth-state";
import { getClerkSessionState } from "@/lib/auth-session.server";
import {
  APP_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from "@/lib/auth-routes";
import { getClerkConfiguration } from "@/lib/clerk-config.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the protected BridgeWorks application.",
};

export default async function SignInPage() {
  const configuration = getClerkConfiguration();

  if (configuration.status !== "configured") {
    return (
      <AuthPage
        title="Sign in to BridgeWorks"
        description="Continue to the secure application workspace after your account is authenticated."
      >
        <AuthState kind={configurationStateKind(configuration)} />
      </AuthPage>
    );
  }

  const session = await getClerkSessionState();
  if (session.status === "signed-in") {
    redirect(APP_ROUTE);
  }
  if (session.status === "session-unavailable") {
    return (
      <AuthPage
        title="Sign in to BridgeWorks"
        description="Continue to the secure application workspace after your account is authenticated."
      >
        <AuthState kind="session-unavailable" />
      </AuthPage>
    );
  }
  if (session.status === "unexpected") {
    return (
      <AuthPage
        title="Sign in to BridgeWorks"
        description="Continue to the secure application workspace after your account is authenticated."
      >
        <AuthState kind="unexpected" />
      </AuthPage>
    );
  }

  return (
    <AuthPage
      title="Sign in to BridgeWorks"
      description="Continue to the secure application workspace after your account is authenticated."
    >
      <SignIn
        path={SIGN_IN_ROUTE}
        routing="path"
        signUpUrl={SIGN_UP_ROUTE}
        fallbackRedirectUrl={APP_ROUTE}
        signUpFallbackRedirectUrl={APP_ROUTE}
        fallback={<AuthComponentFallback />}
      />
    </AuthPage>
  );
}
