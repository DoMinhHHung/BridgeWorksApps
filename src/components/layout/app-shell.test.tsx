import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "@/components/layout/app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/app",
}));

function renderShell(accountName = "Taylor Bridge") {
  return render(
    <AppShell
      accountControl={<button type="button">Account for {accountName}</button>}
    >
      <h1>Welcome to BridgeWorks</h1>
      <p>Current account content</p>
    </AppShell>,
  );
}

describe("AppShell", () => {
  it("renders semantic route-aware navigation, a skip link, and the main landmark", () => {
    renderShell();

    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("navigation", { name: "Application" })).toBeVisible();
    expect(
      within(screen.getByRole("navigation", { name: "Application" })).getByRole(
        "link",
        { name: "Overview" },
      ),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(
      screen.getByRole("heading", { name: "Welcome to BridgeWorks" }),
    ).toBeVisible();
  });

  it("opens and closes mobile navigation with keyboard focus returned", async () => {
    const user = userEvent.setup();
    renderShell();

    const trigger = screen.getByRole("button", { name: "Open navigation" });
    trigger.focus();
    await user.keyboard("{Enter}");

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("navigation", {
        name: "Mobile application",
      }),
    ).toBeVisible();
    expect(
      within(dialog).getByRole("link", { name: "Overview" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(dialog).getByRole("button", { name: "Close navigation" }),
    ).toBeVisible();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("keeps the shell usable with a long account display name", () => {
    renderShell(
      "Alexandria Montgomery-Wellington the Third from BridgeWorks Operations",
    );

    expect(screen.getByRole("main")).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: /Alexandria Montgomery-Wellington/,
      }),
    ).toBeInTheDocument();
  });
});
