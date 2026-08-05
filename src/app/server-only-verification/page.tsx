"use client";

import { getClerkSessionState } from "@/lib/auth-session.server";
import { getClerkConfiguration } from "@/lib/clerk-config.server";

export default function ServerOnlyVerificationPage() {
  const configuration = getClerkConfiguration();
  void getClerkSessionState();

  return <p>{configuration.status}</p>;
}
