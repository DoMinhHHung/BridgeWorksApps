import { auth } from "@clerk/nextjs/server";

export async function getClerkSessionState() {
  try {
    const session = await auth();

    if (!session.isAuthenticated) {
      return {
        status: "signed-out" as const,
        redirectToSignIn: session.redirectToSignIn,
      };
    }

    if (!session.sessionId) {
      return { status: "session-unavailable" as const };
    }

    return {
      status: "signed-in" as const,
      sessionId: session.sessionId,
    };
  } catch {
    return { status: "unexpected" as const };
  }
}
