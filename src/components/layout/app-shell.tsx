import Link from "next/link";

import { AppNavigationLink } from "@/components/layout/app-navigation-link";
import { APP_NAVIGATION_ITEMS } from "@/components/layout/app-navigation";
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
      className="rounded-sm text-lg font-semibold tracking-tight text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <span className="text-primary">Bridge</span>Works
    </Link>
  );
}

export function AppShell({ accountControl, children }: AppShellProps) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-muted/35 text-foreground">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
            <div className="space-y-1">
              {APP_NAVIGATION_ITEMS.map((item) => (
                <AppNavigationLink key={item.href} item={item} />
              ))}
            </div>
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
