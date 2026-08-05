import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CurrentUserLoading } from "@/features/current-user/current-user-loading";
import { CurrentUserOverview } from "@/features/current-user/current-user-overview";

const readyUser = {
  id: "0198e9a0-1234-7abc-8def-1234567890ab",
  id_user: "bw123405082634",
  primary_email: "member@example.test",
  status: "active" as const,
  created_at: "2026-08-03T01:02:03.000Z",
  updated_at: "2026-08-05T04:05:06.000Z",
};

describe("CurrentUserOverview", () => {
  it("renders product-facing account details without the internal UUID", () => {
    render(
      <CurrentUserOverview state={{ status: "ready", user: readyUser }} />,
    );

    expect(
      screen.getByRole("heading", { name: "Welcome to BridgeWorks", level: 1 }),
    ).toBeVisible();
    expect(screen.getByText("bw123405082634")).toBeVisible();
    expect(screen.getByText("member@example.test")).toBeVisible();
    expect(
      screen.queryByText("0198e9a0-1234-7abc-8def-1234567890ab"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Foundation ready/i)).not.toBeInTheDocument();
  });

  it("renders a safe null-email fallback", () => {
    render(
      <CurrentUserOverview
        state={{
          status: "ready",
          user: { ...readyUser, primary_email: null },
        }}
      />,
    );

    expect(screen.getByText("Not available")).toBeVisible();
  });

  it.each([
    ["disabled", "Account access is restricted"],
    ["deleted", "This account is no longer available"],
    ["service-unavailable", "Account service is temporarily unavailable"],
    ["malformed-response", "We could not load your account safely"],
  ] as const)("renders the %s state without stale account data", (status, title) => {
    render(
      <CurrentUserOverview
        state={{ status, requestId: `request-${status}` }}
      />,
    );

    expect(screen.getByRole("heading", { name: title, level: 1 })).toBeVisible();
    expect(screen.getByText(`request-${status}`)).toBeVisible();
    expect(screen.queryByText("bw123405082634")).not.toBeInTheDocument();
  });

  it("renders identity-not-ready retry guidance without auto-refresh", () => {
    render(
      <CurrentUserOverview
        state={{
          status: "identity-not-ready",
          requestId: "request-not-ready",
          retryAfterSeconds: 2,
        }}
      />,
    );

    expect(screen.getByRole("status")).toBeVisible();
    expect(screen.getByText(/about 2 seconds/)).toBeVisible();
    expect(screen.getByRole("link", { name: "Try again" })).toHaveAttribute(
      "href",
      "/app",
    );
  });

  it("renders a stable accessible loading state", () => {
    render(<CurrentUserLoading />);

    expect(
      screen.getByRole("status", { name: "Loading your BridgeWorks account" }),
    ).toBeVisible();
  });
});
