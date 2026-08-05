export const HOME_ROUTE = "/";
export const APP_ROUTE = "/app";
export const SIGN_IN_ROUTE = "/sign-in";
export const SIGN_UP_ROUTE = "/sign-up";

export function isProtectedAppPathname(pathname: string) {
  const normalizedPathname =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  return (
    normalizedPathname === APP_ROUTE ||
    normalizedPathname.startsWith(`${APP_ROUTE}/`)
  );
}
