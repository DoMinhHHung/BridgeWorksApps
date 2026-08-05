import { LayoutDashboard, type LucideIcon } from "lucide-react";

import { APP_ROUTE } from "@/lib/auth-routes";

export type AppNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const APP_NAVIGATION_ITEMS: readonly AppNavigationItem[] = [
  {
    label: "Overview",
    href: APP_ROUTE,
    icon: LayoutDashboard,
  },
];

export function isAppNavigationItemCurrent(pathname: string, href: string) {
  if (href === APP_ROUTE) {
    return pathname === APP_ROUTE;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
