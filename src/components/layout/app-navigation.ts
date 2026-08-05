import { APP_ROUTE } from "@/lib/auth-routes";

export type AppNavigationIcon = "dashboard";

export type AppNavigationItem = {
  label: string;
  href: string;
  icon: AppNavigationIcon;
};

export const APP_NAVIGATION_ITEMS: readonly AppNavigationItem[] = [
  {
    label: "Overview",
    href: APP_ROUTE,
    icon: "dashboard",
  },
];

export function isAppNavigationItemCurrent(
  pathname: string,
  href: string,
) {
  if (href === APP_ROUTE) {
    return pathname === APP_ROUTE;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}