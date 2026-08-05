"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isAppNavigationItemCurrent,
  type AppNavigationItem,
} from "@/components/layout/app-navigation";
import { cn } from "@/lib/utils";

type AppNavigationLinkProps = {
  item: AppNavigationItem;
};

export function AppNavigationLink({ item }: AppNavigationLinkProps) {
  const pathname = usePathname();
  const current = isAppNavigationItemCurrent(pathname, item.href);
  const Icon = item.icon;

  return (
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
  );
}
