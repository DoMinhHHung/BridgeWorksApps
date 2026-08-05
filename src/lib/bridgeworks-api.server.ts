import "server-only";

import {
  requestBridgeWorksApi,
  type BridgeWorksTransportResult,
} from "@/lib/bridgeworks-api-core";
import { getBridgeWorksApiConfiguration } from "@/lib/bridgeworks-api-config.server";

export type BridgeWorksServerRequestResult =
  | {
      status: "configuration-error";
      configurationStatus: "missing" | "placeholder" | "malformed";
    }
  | {
      status: "transport-result";
      result: BridgeWorksTransportResult;
    };

export async function requestCurrentIdentityUser(input: {
  token: string;
  requestId: string;
}): Promise<BridgeWorksServerRequestResult> {
  const configuration = getBridgeWorksApiConfiguration();
  if (configuration.status !== "configured") {
    return {
      status: "configuration-error",
      configurationStatus: configuration.status,
    };
  }

  return {
    status: "transport-result",
    result: await requestBridgeWorksApi({
      baseUrl: configuration.baseUrl,
      path: "/api/v1/me",
      token: input.token,
      requestId: input.requestId,
    }),
  };
}
