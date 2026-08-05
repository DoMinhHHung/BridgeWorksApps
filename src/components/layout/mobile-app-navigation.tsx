"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  APP_NAVIGATION_ITEMS,
  isAppNavigationItemCurrent,
} from "@/components/layout/app-navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type MobileAppNavigationProps = {
  accountControl: React.ReactNode;
};

export function MobileAppNavigation({
  accountControl,
}: MobileAppNavigationProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="size-11 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[min(20rem,calc(100vw-2rem))] gap-0 motion-reduce:transition-none"
      >
        <SheetHeader className="border-b border-border p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-lg font-semibold tracking-tight">
                <span className="text-primary">Bridge</span>Works
              </SheetTitle>
              <SheetDescription className="mt-1">
                Account workspace navigation
              </SheetDescription>
            </div>
            <SheetClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                className="size-11 shrink-0"
                aria-label="Close navigation"
              >
                <X aria-hidden="true" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <nav aria-label="Mobile application" className="flex-1 p-4">
          <div className="space-y-1">
            {APP_NAVIGATION_ITEMS.map((item) => {
              const current = isAppNavigationItemCurrent(pathname, item.href);
              const Icon = item.icon;

              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring motion-reduce:transition-none",
                      current
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {item.label}
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </nav>

        <SheetFooter className="border-t border-border p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Account
          </p>
          <div className="min-h-11 min-w-0">{accountControl}</div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
