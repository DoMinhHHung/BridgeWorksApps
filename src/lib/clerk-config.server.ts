import "server-only";

import {
  classifyClerkConfiguration,
  type ClerkConfiguration,
} from "@/lib/clerk-config";

/**
 * Server-only configuration boundary. The secret is inspected for validity and
 * discarded; callers can never read or serialize it.
 */
export function getClerkConfiguration(): ClerkConfiguration {
  return classifyClerkConfiguration({
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  });
}
