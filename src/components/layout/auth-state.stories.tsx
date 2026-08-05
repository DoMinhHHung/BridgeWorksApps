import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AuthState } from "@/components/layout/auth-state";

const meta = {
  title: "Layout/Authentication States",
  component: AuthState,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <main className="grid min-h-dvh w-screen place-items-center bg-background px-4 py-10 text-foreground">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof AuthState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MissingConfiguration: Story = {
  args: { kind: "configuration-missing", headingLevel: "h1" },
};

export const PlaceholderConfiguration: Story = {
  args: { kind: "configuration-placeholder", headingLevel: "h1" },
};

export const MalformedConfiguration: Story = {
  args: { kind: "configuration-malformed", headingLevel: "h1" },
};

export const SessionUnavailable: Story = {
  args: { kind: "session-unavailable", headingLevel: "h1" },
};
