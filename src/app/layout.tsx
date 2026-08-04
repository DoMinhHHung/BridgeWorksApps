import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

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

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  const clerkConfigured = Boolean(
    publishableKey &&
      secretKey &&
      !publishableKey.includes("replace_me") &&
      !secretKey.includes("replace_me"),
  );

  if (clerkConfigured && publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey}>{document}</ClerkProvider>
    );
  }

  return document;
}
