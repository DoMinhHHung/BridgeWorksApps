"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isAppNavigationItemCurrent,
  type AppNavigationItem,
} from "@/components/layout/app-navigation";
import { cn } from "@/lib/utils";

const navigationIcons = {
  dashboard: LayoutDashboard,
} satisfies Record<
  AppNavigationItem["icon"],
  React.ComponentType<React.SVGProps<SVGSVGElement>>
>;

type AppNavigationLinkProps = {
  item: AppNavigationItem;
  onNavigate?: () => void;
};

export function AppNavigationLink({
  item,
  onNavigate,
}: AppNavigationLinkProps) {
  const pathname = usePathname();
  const isCurrent = isAppNavigationItemCurrent(pathname, item.href);
  const Icon = navigationIcons[item.icon];

  return (
    <Link
      href={item.href}
      aria-current={isCurrent ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
        isCurrent
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/70",
      )}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}