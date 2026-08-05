"use client";

import { getClerkSessionState } from "@/lib/auth-session.server";
import { getClerkConfiguration } from "@/lib/clerk-config.server";

export default function ServerOnlyVerificationPage() {
  void getClerkConfiguration;
  void getClerkSessionState;

  return null;
}
