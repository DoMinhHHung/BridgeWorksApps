import { SignUp } from "@clerk/nextjs";
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
import {
  APP_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from "@/lib/auth-routes";
import { getClerkConfiguration } from "@/lib/clerk-config.server";
import { getClerkSessionState } from "@/lib/auth-session.server";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create an account for the protected BridgeWorks application.",
};

export default async function SignUpPage() {
  const configuration = getClerkConfiguration();

  if (configuration.status !== "configured") {
    return (
      <AuthPage
        title="Create your BridgeWorks account"
        description="Create a secure account before entering the BridgeWorks application workspace."
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
        title="Create your BridgeWorks account"
        description="Create a secure account before entering the BridgeWorks application workspace."
      >
        <AuthState kind="session-unavailable" />
      </AuthPage>
    );
  }
  if (session.status === "unexpected") {
    return (
      <AuthPage
        title="Create your BridgeWorks account"
        description="Create a secure account before entering the BridgeWorks application workspace."
      >
        <AuthState kind="unexpected" />
      </AuthPage>
    );
  }

  return (
    <AuthPage
      title="Create your BridgeWorks account"
      description="Create a secure account before entering the BridgeWorks application workspace."
    >
      <SignUp
        path={SIGN_UP_ROUTE}
        routing="path"
        signInUrl={SIGN_IN_ROUTE}
        fallbackRedirectUrl={APP_ROUTE}
        signInFallbackRedirectUrl={APP_ROUTE}
        fallback={<AuthComponentFallback />}
      />
    </AuthPage>
  );
}
