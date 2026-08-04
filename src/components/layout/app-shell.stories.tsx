import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { AppShell } from "@/components/layout/app-shell";

function OverviewContent() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Authenticated workspace
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          The protected BridgeWorks application shell is ready for focused
          product vertical slices.
        </p>
      </header>
      <section className="max-w-2xl rounded-xl border border-border bg-card p-8">
        <h2 className="text-xl font-semibold">Foundation ready</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This story uses presentation-only account data and does not require a
          Clerk secret.
        </p>
      </section>
    </div>
  );
}

const meta = {
  title: "Layout/App Shell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
  },
  args: {
    accountControl: <button type="button">Account for Taylor Bridge</button>,
    children: <OverviewContent />,
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
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Mobile application" }),
    ).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
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
