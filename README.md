# BridgeWorks Apps

BridgeWorks Apps is the Next.js frontend for BridgeWorks, a private talent liquidity network that helps people and organizations move from a new connection to trusted collaboration and long-term work.

The backend lives in `DoMinhHHung/bridgeworks`. Public frontend requests must go through Apache APISIX rather than directly to individual services.

## Stack

- Next.js App Router and React Server Components
- TypeScript strict mode
- Tailwind CSS and owned shadcn/ui primitives
- Clerk for authentication and organization context
- React Hook Form and Zod
- TanStack Query for interactive client-side server state when needed
- Storybook and Vitest
- Playwright and axe accessibility checks
- pnpm and Node.js 24 LTS

## Prerequisites

```bash
node --version
pnpm --version
```

Use Node.js 24 LTS and pnpm 10.

## Local setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

Populate `.env.local` with the development values from the Clerk dashboard. Never commit `.env.local` or real secrets.

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:9080
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
CLERK_SECRET_KEY=sk_test_replace_me
```

`NEXT_PUBLIC_API_BASE_URL` points to the local APISIX gateway.

## Clerk bootstrap behavior

`src/app/layout.tsx` installs `ClerkProvider`, and `src/proxy.ts` installs `clerkMiddleware()` when both Clerk keys are real values.

The checked-in placeholders intentionally keep Clerk inactive so dependency installation, static builds, Storybook, and public foundation smoke tests can run without secrets. This is bootstrap behavior only. Protected product routes must be added explicitly and must fail closed before authenticated features are shipped.

## Commands

```bash
pnpm dev                # local development
pnpm lint               # ESLint
pnpm typecheck          # TypeScript
pnpm test               # Vitest
pnpm build              # production build
pnpm storybook          # Storybook development server
pnpm build-storybook    # static Storybook build
pnpm test:storybook     # Storybook component tests
pnpm test:e2e           # local Playwright tests
pnpm check              # lint, typecheck, unit test, app build, Storybook build
```

Playwright starts the local Next.js server automatically. Local runs cover Chromium, Firefox, and WebKit. CI uses Chromium for a bounded cross-commit smoke check.

## Agent instructions and UI skills

Agents must read these files before changing UI code:

1. `AGENTS.md`
2. `.agents/skills/bridgeworks-ui/SKILL.md`
3. `.agents/skills/ui-ux-pro-max/SKILL.md`

BridgeWorks-specific rules, verified backend contracts, and the existing design system override generic skill recommendations.

## Repository boundaries

- Do not invent backend endpoints.
- Verify routes, auth, status, error-envelope, CORS, and request-ID contracts from the backend `main` branch.
- Keep generic primitives in `src/components/ui`.
- Keep feature-specific code in `src/features`.
- Prefer Server Components and keep Client Components small.
- Preserve `X-Request-Id` when backend integration is added.
- Do not expose tokens, secrets, private identifiers, or raw backend errors.

## CI

The frontend workflow validates:

- frozen dependency installation;
- lint and typecheck;
- Vitest;
- Next.js production build;
- Storybook build and Storybook tests;
- Playwright smoke and axe checks.

Playwright reports are retained only when the workflow fails.
