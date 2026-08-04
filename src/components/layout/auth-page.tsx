import Link from "next/link";

import { HOME_ROUTE } from "@/lib/auth-routes";

type AuthPageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthPage({ title, description, children }: AuthPageProps) {
  return (
    <main className="min-h-dvh bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl flex-col sm:min-h-[calc(100dvh-4rem)]">
        <Link
          href={HOME_ROUTE}
          className="w-fit rounded-sm text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          BridgeWorks
        </Link>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(24rem,1fr)] lg:gap-16 lg:py-16">
          <header className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Secure workspace access
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-prose text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {description}
            </p>
          </header>

          <div className="flex min-w-0 justify-center lg:justify-end">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export function AuthComponentFallback() {
  return (
    <div
      role="status"
      aria-label="Loading authentication form"
      className="h-[31rem] w-full max-w-[25rem] animate-pulse rounded-xl border border-border bg-card motion-reduce:animate-none"
    >
      <span className="sr-only">Loading authentication form</span>
    </div>
  );
}
