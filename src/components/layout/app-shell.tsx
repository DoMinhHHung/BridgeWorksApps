import { Home } from "lucide-react";
import Link from "next/link";

import { MobileAppNavigation } from "@/components/layout/mobile-app-navigation";
import { APP_ROUTE } from "@/lib/auth-routes";

type AppShellProps = {
  accountControl: React.ReactNode;
  children: React.ReactNode;
};

function BrandLink() {
  return (
    <Link
      href={APP_ROUTE}
      className="rounded-sm text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      BridgeWorks
    </Link>
  );
}

export function AppShell({ accountControl, children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-muted/40 text-foreground">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:hidden">
        <BrandLink />
        <MobileAppNavigation accountControl={accountControl} />
      </header>

      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[90rem] bg-background lg:min-h-dvh lg:border-x lg:border-border">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
          <div className="flex min-h-20 items-center border-b border-sidebar-border px-6">
            <BrandLink />
          </div>

          <nav aria-label="Application" className="flex-1 p-4">
            <Link
              href={APP_ROUTE}
              aria-current="page"
              className="flex min-h-11 items-center gap-3 rounded-md bg-sidebar-accent px-3 py-2 text-sm font-medium text-sidebar-accent-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring motion-reduce:transition-none"
            >
              <Home aria-hidden="true" className="size-4" />
              Overview
            </Link>
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Account
            </p>
            <div className="min-h-11 min-w-0 overflow-hidden">
              {accountControl}
            </div>
          </div>
        </aside>

        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 px-4 py-8 outline-none sm:px-6 sm:py-10 lg:px-10 lg:py-12 xl:px-14"
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
