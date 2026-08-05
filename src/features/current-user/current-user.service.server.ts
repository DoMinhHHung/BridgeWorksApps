import "server-only";

import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

import {
  mapCurrentUserResponse,
  type CurrentUserBackendResult,
  type CurrentUserViewState,
} from "@/features/current-user/current-user-contract";
import { requestCurrentIdentityUser } from "@/lib/bridgeworks-api.server";

type ClerkAuthState = Awaited<ReturnType<typeof auth>>;
type RedirectToSignIn = ClerkAuthState["redirectToSignIn"];

export type CurrentUserExperience =
  | CurrentUserBackendResult
  | {
      status: "configuration-error";
      configurationStatus: "missing" | "placeholder" | "malformed";
      requestId: string;
    }
  | {
      status: "signed-out";
      redirectToSignIn: RedirectToSignIn;
    };

function safeRequestId(value: string | null) {
  const normalized = value?.trim() ?? "";
  return /^[A-Za-z0-9._:-]{1,128}$/.test(normalized)
    ? normalized
    : crypto.randomUUID();
}

function logCurrentUserState(result: CurrentUserViewState) {
  if (result.status === "ready") {
    return;
  }

  console.warn("bridgeworks_current_user_state", {
    state: result.status,
    request_id: result.requestId,
  });
}

export async function getCurrentUserExperience(): Promise<CurrentUserExperience> {
  const requestHeaders = await headers();
  const requestId = safeRequestId(requestHeaders.get("x-request-id"));

  try {
    const session = await auth();
    if (!session.isAuthenticated) {
      return {
        status: "signed-out",
        redirectToSignIn: session.redirectToSignIn,
      };
    }

    const token = await session.getToken();
    if (!token) {
      const result: CurrentUserViewState = {
        status: "unauthorized",
        requestId,
      };
      logCurrentUserState(result);
      return result;
    }

    const response = await requestCurrentIdentityUser({ token, requestId });
    if (response.status === "configuration-error") {
      const result: CurrentUserViewState = {
        status: "configuration-error",
        configurationStatus: response.configurationStatus,
        requestId,
      };
      logCurrentUserState(result);
      return result;
    }

    const result = mapCurrentUserResponse(response.result);
    logCurrentUserState(result);
    return result;
  } catch {
    const result: CurrentUserViewState = {
      status: "unexpected",
      requestId,
    };
    logCurrentUserState(result);
    return result;
  }
}
