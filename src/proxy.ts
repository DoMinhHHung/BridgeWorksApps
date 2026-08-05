import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import {
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  isProtectedAppPathname,
} from "@/lib/auth-routes";
import { getClerkConfiguration } from "@/lib/clerk-config.server";

const clerkConfiguration = getClerkConfiguration();

function clerkUnavailableResponse() {
  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Authentication unavailable | BridgeWorks</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: Canvas; color: CanvasText; }
      main { width: min(34rem, calc(100% - 2rem)); }
      p { line-height: 1.6; }
      a { color: LinkText; text-underline-offset: 0.2em; }
      a:focus-visible { outline: 3px solid Highlight; outline-offset: 4px; }
    </style>
  </head>
  <body>
    <main>
      <p>BridgeWorks</p>
      <h1>Authentication is temporarily unavailable</h1>
      <p>The protected application cannot open until authentication is configured correctly. Return to the public site or contact the application operator.</p>
      <p><a href="/">Return to BridgeWorks</a></p>
    </main>
  </body>
</html>`,
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Security-Policy":
          "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}

function unavailableProxy(request: NextRequest) {
  if (isProtectedAppPathname(request.nextUrl.pathname)) {
    return clerkUnavailableResponse();
  }

  return NextResponse.next();
}

const configuredProxy =
  clerkConfiguration.status === "configured"
    ? clerkMiddleware(
        async (auth, request) => {
          if (!isProtectedAppPathname(request.nextUrl.pathname)) {
            return NextResponse.next();
          }

          const session = await auth();
          if (!session.isAuthenticated) {
            return session.redirectToSignIn({ returnBackUrl: request.url });
          }

          return NextResponse.next();
        },
        {
          signInUrl: SIGN_IN_ROUTE,
          signUpUrl: SIGN_UP_ROUTE,
        },
      )
    : unavailableProxy;

export default configuredProxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
