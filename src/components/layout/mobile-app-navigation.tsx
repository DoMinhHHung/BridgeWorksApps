"use client";

import { Home, Menu, X } from "lucide-react";
import Link from "next/link";

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
import { APP_ROUTE } from "@/lib/auth-routes";

type MobileAppNavigationProps = {
  accountControl: React.ReactNode;
};

export function MobileAppNavigation({
  accountControl,
}: MobileAppNavigationProps) {
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
                BridgeWorks
              </SheetTitle>
              <SheetDescription className="mt-1">
                Application navigation
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
          <SheetClose asChild>
            <Link
              href={APP_ROUTE}
              aria-current="page"
              className="flex min-h-11 items-center gap-3 rounded-md bg-sidebar-accent px-3 py-2 text-sm font-medium text-sidebar-accent-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring motion-reduce:transition-none"
            >
              <Home aria-hidden="true" className="size-4" />
              Overview
            </Link>
          </SheetClose>
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
