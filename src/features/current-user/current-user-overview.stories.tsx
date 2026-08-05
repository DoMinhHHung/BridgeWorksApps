import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { CurrentUserLoading } from "@/features/current-user/current-user-loading";
import { CurrentUserOverview } from "@/features/current-user/current-user-overview";

const readyState = {
  status: "ready" as const,
  user: {
    id: "0198e9a0-1234-7abc-8def-1234567890ab",
    id_user: "bw123405082634",
    primary_email: "member@example.test",
    status: "active" as const,
    created_at: "2026-08-03T01:02:03.000Z",
    updated_at: "2026-08-05T04:05:06.000Z",
  },
};

const meta = {
  title: "Features/Current User/Overview",
  component: CurrentUserOverview,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
  args: {
    state: readyState,
  },
} satisfies Meta<typeof CurrentUserOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Welcome to BridgeWorks", level: 1 }),
    ).toBeVisible();
    await expect(canvas.getByText("bw123405082634")).toBeVisible();
    await expect(
      canvas.queryByText("0198e9a0-1234-7abc-8def-1234567890ab"),
    ).not.toBeInTheDocument();
  },
};

export const PrimaryEmailUnavailable: Story = {
  args: {
    state: {
      ...readyState,
      user: { ...readyState.user, primary_email: null },
    },
  },
};

export const IdentityNotReady: Story = {
  args: {
    state: {
      status: "identity-not-ready",
      requestId: "request-identity-not-ready",
      retryAfterSeconds: 2,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Try again" })).toBeVisible();
    await expect(canvas.getByText(/Request ID:/)).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    state: { status: "disabled", requestId: "request-disabled" },
  },
};

export const Deleted: Story = {
  args: {
    state: { status: "deleted", requestId: "request-deleted" },
  },
};

export const RateLimited: Story = {
  args: {
    state: {
      status: "rate-limited",
      requestId: "request-rate-limited",
      retryAfterSeconds: 30,
    },
  },
};

export const ServiceUnavailable: Story = {
  args: {
    state: {
      status: "service-unavailable",
      requestId: "request-service-unavailable",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toBeVisible();
    await expect(
      canvas.getByRole("heading", {
        name: "Account service is temporarily unavailable",
        level: 1,
      }),
    ).toBeVisible();
  },
};

export const Unexpected: Story = {
  args: {
    state: {
      status: "malformed-response",
      requestId: "request-malformed-response",
    },
  },
};

export const Loading: Story = {
  render: () => <CurrentUserLoading />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("status", { name: "Loading your BridgeWorks account" }),
    ).toBeVisible();
  },
};

export const MobileReady: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
