import type { Metadata } from "next";

import { CurrentUserOverview } from "@/features/current-user/current-user-overview";
import { getCurrentUserExperience } from "@/features/current-user/current-user.service.server";
import { APP_ROUTE } from "@/lib/auth-routes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account overview",
  description: "Review your BridgeWorks account identity and lifecycle status.",
};

export default async function AppOverviewPage() {
  const experience = await getCurrentUserExperience();

  if (experience.status === "signed-out") {
    return experience.redirectToSignIn({ returnBackUrl: APP_ROUTE });
  }

  return <CurrentUserOverview state={experience} />;
}
