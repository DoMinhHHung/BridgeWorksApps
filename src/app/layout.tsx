import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import {
  APP_ROUTE,
  HOME_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from "@/lib/auth-routes";
import { getClerkConfiguration } from "@/lib/clerk-config.server";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "BridgeWorks",
    template: "%s | BridgeWorks",
  },
  description:
    "A private talent liquidity network for building trusted professional relationships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkConfiguration = getClerkConfiguration();
  const document = (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        inter.variable,
        geistMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );

  if (clerkConfiguration.status !== "configured") {
    return document;
  }

  return (
    <ClerkProvider
      publishableKey={clerkConfiguration.publishableKey}
      signInUrl={SIGN_IN_ROUTE}
      signUpUrl={SIGN_UP_ROUTE}
      signInFallbackRedirectUrl={APP_ROUTE}
      signUpFallbackRedirectUrl={APP_ROUTE}
      afterSignOutUrl={HOME_ROUTE}
    >
      {document}
    </ClerkProvider>
  );
}
