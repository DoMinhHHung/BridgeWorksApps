import "server-only";

import {
  classifyBridgeWorksApiConfiguration,
  type BridgeWorksApiConfiguration,
} from "@/lib/bridgeworks-api-config";

export function getBridgeWorksApiConfiguration(): BridgeWorksApiConfiguration {
  return classifyBridgeWorksApiConfiguration(
    process.env.NEXT_PUBLIC_API_BASE_URL,
  );
}
