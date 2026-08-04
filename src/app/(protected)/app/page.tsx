import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

import {
  AuthState,
  configurationStateKind,
} from "@/components/layout/auth-state";
import { getClerkSessionState } from "@/lib/auth-session.server";
import { APP_ROUTE } from "@/lib/auth-routes";
import { getClerkConfiguration } from "@/lib/clerk-config.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Overview",
  description: "The protected BridgeWorks application foundation.",
};

const foundationCapabilities = [
  "Protected server rendering with a fail-closed authentication boundary",
  "Responsive navigation for mobile, tablet, and desktop workspaces",
  "Accessible account controls ready for future product vertical slices",
];

export default async function AppOverviewPage() {
  const configuration = getClerkConfiguration();
  if (configuration.status !== "configured") {
    return (
      <AuthState
        kind={configurationStateKind(configuration)}
        headingLevel="h1"
      />
    );
  }

  const session = await getClerkSessionState();
  if (session.status === "signed-out") {
    return session.redirectToSignIn({ returnBackUrl: APP_ROUTE });
  }
  if (session.status === "session-unavailable") {
    return <AuthState kind="session-unavailable" headingLevel="h1" />;
  }
  if (session.status === "unexpected") {
    return <AuthState kind="unexpected" headingLevel="h1" />;
  }

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Authenticated workspace
        </p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Overview
        </h1>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          The protected BridgeWorks application shell is ready. Product
          workflows will be added as focused vertical slices without weakening
          this authentication boundary.
        </p>
      </header>

      <section
        aria-labelledby="foundation-ready-title"
        className="max-w-3xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <h2
          id="foundation-ready-title"
          className="text-xl font-semibold tracking-tight"
        >
          Foundation ready
        </h2>
        <ul className="mt-6 space-y-4">
          {foundationCapabilities.map((capability) => (
            <li key={capability} className="flex gap-3 text-sm leading-6">
              <CheckCircle2
                aria-hidden="true"
                className="mt-1 size-4 shrink-0"
              />
              <span>{capability}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="next-slice-title" className="max-w-3xl">
        <h2 id="next-slice-title" className="text-lg font-semibold">
          What comes next
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
          The next approved feature can attach to this shell after its backend
          contract, authorization policy, states, and accessibility behavior are
          verified.
        </p>
      </section>
    </div>
  );
}
