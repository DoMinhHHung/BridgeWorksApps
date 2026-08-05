import {
  Ban,
  CheckCircle2,
  Clock3,
  Gauge,
  RefreshCw,
  ServerCrash,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import type { CurrentUserViewState } from "@/features/current-user/current-user-contract";
import { APP_ROUTE, SIGN_IN_ROUTE } from "@/lib/auth-routes";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

type CurrentUserOverviewProps = {
  state: CurrentUserViewState;
};

type StatePanelProps = {
  tone: "information" | "warning" | "destructive";
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  requestId: string;
  action?: React.ReactNode;
  role?: "alert" | "status";
};

function RequestId({ value }: { value: string }) {
  return (
    <p className="mt-6 break-all border-t border-current/10 pt-4 text-xs leading-5 opacity-80">
      <span className="font-medium">Request ID:</span>{" "}
      <code className="font-mono">{value}</code>
    </p>
  );
}

function StatePanel({
  tone,
  icon: Icon,
  title,
  description,
  requestId,
  action,
  role = "alert",
}: StatePanelProps) {
  return (
    <section
      role={role}
      aria-labelledby="current-user-state-title"
      className={cn(
        "max-w-2xl rounded-2xl border p-6 shadow-sm sm:p-8",
        tone === "information" &&
          "border-information/25 bg-information-muted text-information-muted-foreground",
        tone === "warning" &&
          "border-warning/30 bg-warning-muted text-warning-muted-foreground",
        tone === "destructive" &&
          "border-destructive/25 bg-destructive/5 text-foreground",
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-background/80 shadow-sm">
        <Icon aria-hidden={true} className="size-5" />
      </div>
      <h1
        id="current-user-state-title"
        className="mt-5 text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </h1>
      <p className="mt-3 max-w-prose text-base leading-7">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
      <RequestId value={requestId} />
    </section>
  );
}

function RetryAction({ label = "Try again" }: { label?: string }) {
  return (
    <Link
      href={APP_ROUTE}
      prefetch={false}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
    >
      <RefreshCw aria-hidden="true" className="size-4" />
      {label}
    </Link>
  );
}

function retryGuidance(seconds: number | null) {
  if (seconds === null) {
    return "Wait a moment before trying again.";
  }
  if (seconds === 0) {
    return "You can try again now.";
  }

  return `Try again in about ${seconds} second${seconds === 1 ? "" : "s"}.`;
}

function ReadyOverview({ state }: { state: Extract<CurrentUserViewState, { status: "ready" }> }) {
  const { user } = state;

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Account overview
        </p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome to BridgeWorks
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          Your account workspace is ready. Review the identity details that
          connect your BridgeWorks activity.
        </p>
      </header>

      <section
        aria-labelledby="account-summary-title"
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-border bg-information-muted/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2
              id="account-summary-title"
              className="text-xl font-semibold tracking-tight"
            >
              Account summary
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your public BridgeWorks identity and account lifecycle.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-success-muted px-3 py-1.5 text-sm font-medium text-success-muted-foreground">
            <CheckCircle2 aria-hidden="true" className="size-4" />
            Active
          </span>
        </div>

        <dl className="grid sm:grid-cols-2">
          <div className="border-b border-border p-6 sm:border-r sm:p-8">
            <dt className="text-sm font-medium text-muted-foreground">
              Public ID
            </dt>
            <dd className="mt-2 break-all font-mono text-base font-semibold">
              {user.id_user}
            </dd>
          </div>
          <div className="border-b border-border p-6 sm:p-8">
            <dt className="text-sm font-medium text-muted-foreground">
              Primary email
            </dt>
            <dd className="mt-2 break-words text-base font-medium">
              {user.primary_email ?? "Not available"}
            </dd>
          </div>
          <div className="border-b border-border p-6 sm:border-b-0 sm:border-r sm:p-8">
            <dt className="text-sm font-medium text-muted-foreground">
              Joined BridgeWorks
            </dt>
            <dd className="mt-2 text-base font-medium">
              <time dateTime={user.created_at}>
                {dateFormatter.format(new Date(user.created_at))}
              </time>
            </dd>
          </div>
          <div className="p-6 sm:p-8">
            <dt className="text-sm font-medium text-muted-foreground">
              Identity last updated
            </dt>
            <dd className="mt-2 text-base font-medium">
              <time dateTime={user.updated_at}>
                {dateFormatter.format(new Date(user.updated_at))}
              </time>
            </dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="next-step-title"
        className="rounded-2xl border border-border bg-muted/45 p-6 sm:p-8"
      >
        <h2 id="next-step-title" className="text-lg font-semibold">
          Your next step
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          Your BridgeWorks identity is ready. Profile setup will be available in
          the next product step.
        </p>
      </section>
    </div>
  );
}

export function CurrentUserOverview({ state }: CurrentUserOverviewProps) {
  switch (state.status) {
    case "ready":
      return <ReadyOverview state={state} />;
    case "identity-not-ready":
      return (
        <StatePanel
          role="status"
          tone="information"
          icon={Clock3}
          title="Your account is being prepared"
          description={`BridgeWorks has your signed-in session, but the account record is still synchronizing. ${retryGuidance(state.retryAfterSeconds)}`}
          requestId={state.requestId}
          action={<RetryAction />}
        />
      );
    case "disabled":
      return (
        <StatePanel
          tone="warning"
          icon={Ban}
          title="Account access is restricted"
          description="This BridgeWorks account is currently disabled. Protected workspace data is unavailable. Contact the organization that manages your access for guidance."
          requestId={state.requestId}
        />
      );
    case "deleted":
      return (
        <StatePanel
          tone="destructive"
          icon={Trash2}
          title="This account is no longer available"
          description="The BridgeWorks identity linked to this session has been deleted, so the protected workspace cannot be opened."
          requestId={state.requestId}
        />
      );
    case "unauthorized":
      return (
        <StatePanel
          tone="warning"
          icon={ShieldAlert}
          title="Your session needs attention"
          description="BridgeWorks could not accept the current session. Continue through Clerk sign-in again to return to your account workspace."
          requestId={state.requestId}
          action={
            <Link
              href={SIGN_IN_ROUTE}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
            >
              Sign in again
            </Link>
          }
        />
      );
    case "rate-limited":
      return (
        <StatePanel
          tone="warning"
          icon={Gauge}
          title="Too many account requests"
          description={`BridgeWorks is temporarily limiting requests. ${retryGuidance(state.retryAfterSeconds)}`}
          requestId={state.requestId}
          action={<RetryAction />}
        />
      );
    case "service-unavailable":
      return (
        <StatePanel
          tone="information"
          icon={ServerCrash}
          title="Account service is temporarily unavailable"
          description="Your protected workspace remains closed while BridgeWorks reconnects to the account service. Try again without re-entering any information."
          requestId={state.requestId}
          action={<RetryAction />}
        />
      );
    case "configuration-error":
      return (
        <StatePanel
          tone="information"
          icon={ServerCrash}
          title="Account workspace is unavailable"
          description="BridgeWorks cannot safely connect to the account service right now. The protected experience will remain closed until the connection is configured correctly."
          requestId={state.requestId}
        />
      );
    case "malformed-response":
    case "unexpected":
      return (
        <StatePanel
          tone="information"
          icon={ShieldAlert}
          title="We could not load your account safely"
          description="BridgeWorks received an unexpected account-service response and stopped before showing incomplete information. Try again or share the request ID with support."
          requestId={state.requestId}
          action={<RetryAction />}
        />
      );
  }
}
