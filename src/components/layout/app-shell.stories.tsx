import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { AppShell } from "@/components/layout/app-shell";
import { CurrentUserOverview } from "@/features/current-user/current-user-overview";

const overview = (
  <CurrentUserOverview
    state={{
      status: "ready",
      user: {
        id: "0198e9a0-1234-7abc-8def-1234567890ab",
        id_user: "bw123405082634",
        primary_email: "member@example.test",
        status: "active",
        created_at: "2026-08-03T01:02:03.000Z",
        updated_at: "2026-08-05T04:05:06.000Z",
      },
    }}
  />
);

const meta = {
  title: "Layout/App Shell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    nextjs: {
      navigation: {
        pathname: "/app",
      },
    },
  },
  args: {
    accountControl: <button type="button">Account for Taylor Bridge</button>,
    children: overview,
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("main")).toBeVisible();
    await expect(
      canvas.getByRole("navigation", { name: "Application" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("heading", { name: "Welcome to BridgeWorks", level: 1 }),
    ).toBeVisible();
  },
};

export const MobileNavigation: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open navigation" });

    await userEvent.click(trigger);

    const page = within(canvasElement.ownerDocument.body);
    const dialog = page.getByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());
    await waitFor(() =>
      expect(
        page.getByRole("navigation", { name: "Mobile application" }),
      ).toBeVisible(),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const LongDisplayName: Story = {
  args: {
    accountControl: (
      <button type="button" className="max-w-full truncate text-left">
        Account for Alexandria Montgomery-Wellington from BridgeWorks
        Operations
      </button>
    ),
  },
};
