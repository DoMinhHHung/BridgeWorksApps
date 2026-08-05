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

Populate `.env.local` with development values from the Clerk dashboard. Never commit `.env.local` or real secrets.

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:9080
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
CLERK_SECRET_KEY=sk_test_replace_me
```

`NEXT_PUBLIC_API_BASE_URL` points to the local APISIX gateway. The checked-in `.env.example` intentionally contains placeholders only.

## Authentication configuration

`src/lib/clerk-config.ts` classifies the Clerk key pair as one of:

- `configured` — both keys follow Clerk's documented formats and belong to the same test or live environment;
- `missing` — one or both values are absent or blank;
- `placeholder` — checked-in example values or other obvious placeholders are present;
- `malformed` — key formats are invalid or test/live environments do not match.

A Publishable Key is validated as a `pk_test_` or `pk_live_` value containing a base64-encoded Frontend API value with Clerk's trailing `$` delimiter. A Secret Key is treated as opaque after its documented `sk_test_` or `sk_live_` prefix and requires only a non-empty payload; the frontend does not impose an undocumented charset or length.

`src/lib/clerk-config.server.ts` is the only environment-reading boundary. It validates the secret but never returns, logs, renders, or serializes it. `src/lib/clerk-config.server.ts` and `src/lib/auth-session.server.ts` both import `server-only`, so Next.js rejects either module when it is pulled into a Client Component. The root layout receives only the publishable key when configuration is valid.

Secretless builds, public pages, Storybook, unit tests, and public browser tests continue to work. Protected routes never become public when Clerk is unavailable:

| Route | Policy when Clerk is configured | Policy when Clerk is unavailable |
| --- | --- | --- |
| `/` | Public | Public |
| `/sign-in/[[...sign-in]]` | Clerk sign-in; signed-in users return to `/app` | Safe configuration state |
| `/sign-up/[[...sign-up]]` | Clerk sign-up; signed-in users return to `/app` | Safe configuration state |
| `/app` and `/app/**` | Authentication required | HTTP 503 fail-closed response |
| `/api/**` | No global policy; each future route defines its own boundary | No global policy |

The proxy provides an early redirect for unauthenticated document requests. The protected layout and protected page both repeat the server-side Clerk session check. This defense in depth is intentional because a layout check alone is not sufficient for every client-side navigation or future server resource.

## Application shell

The current protected shell provides only one real navigation entry:

```text
Overview → /app
```

It includes:

- a skip link and semantic header, navigation, and main landmarks;
- a keyboard-accessible Radix mobile navigation sheet with Escape handling and focus return;
- persistent navigation from 1024 px upward;
- constrained content width at large viewports;
- a Clerk `UserButton` with stable loading dimensions;
- loading, configuration unavailable, session unavailable, and unexpected error states;
- reduced-motion behavior and visible focus states.

No jobs, talent, organizations, marketplace, applications, billing, messaging, fake metrics, fake users, or invented backend calls are included.

## Backend authentication contract

The backend verifies Clerk session JWTs at the service boundary. Browser requests must send `Authorization: Bearer <session token>` through APISIX. APISIX forwards the header, applies browser CORS and `X-Request-Id`, and does not perform JWT verification itself.

This frontend PR does not call a backend endpoint. A future API client must preserve `X-Request-Id`, parse the backend error envelope `{code,message,request_id,details}`, and map account and dependency states without exposing raw backend errors.

## Commands

```bash
pnpm dev                # local development
pnpm lint               # ESLint
pnpm typecheck          # TypeScript
pnpm test               # unit Vitest project
pnpm build              # production build
pnpm storybook          # Storybook development server
pnpm build-storybook    # static Storybook build
pnpm test:storybook     # Storybook component tests
pnpm test:e2e           # local Playwright tests in three browsers
pnpm check              # lint, typecheck, unit test, app build, Storybook build
```

Playwright starts the local Next.js server automatically and never visits an external website.

Without a dedicated Clerk test instance, CI covers:

- public routes;
- configuration classification;
- public/protected pathname policy;
- presentation-only shell rendering and keyboard navigation;
- deterministic auth-unavailable pages;
- protected-route HTTP 503 fail-closed behavior;
- axe checks across public and unavailable states.

CI does not claim an authenticated end-to-end Clerk redirect or sign-in flow without actual Clerk test credentials.

### Manual authenticated smoke checklist

**Status: pending.** This checklist has not been executed for this PR because no dedicated Clerk test instance and credentials were available in the automated environment.

- [ ] A signed-out request to `/app` redirects to `/sign-in` with a valid return path.
- [ ] The real Clerk sign-in component renders without a configuration or network error.
- [ ] Successful sign-in returns the user to `/app`.
- [ ] Refreshing `/app` preserves the authenticated session.
- [ ] The `UserButton` opens and signing out completes successfully.
- [ ] After sign-out, accessing `/app` is protected again and returns to the sign-in flow.
- [ ] `.env.local` remains ignored and is not staged or committed.
- [ ] Browser HTML, console output, network payloads, and client bundles contain no `CLERK_SECRET_KEY` value or other server secret.

## Agent instructions and UI skills

Agents must read these files before changing UI code:

1. `AGENTS.md`
2. `.agents/skills/bridgeworks-ui/SKILL.md`
3. `.agents/skills/ui-ux-pro-max/SKILL.md`

BridgeWorks-specific rules, verified backend contracts, and the existing design system override generic skill recommendations.

## Repository boundaries

- Do not invent backend endpoints.
- Verify routes, auth, status, error-envelope, CORS, and request-ID contracts from backend `main`.
- Keep generic primitives in `src/components/ui`.
- Keep feature-specific code in `src/features`.
- Prefer Server Components and keep Client Components small.
- Preserve `X-Request-Id` when backend integration is added.
- Do not expose tokens, secrets, private identifiers, or raw backend errors.

## CI

The frontend workflow validates:

- frozen dependency installation;
- lint and typecheck;
- Vitest unit tests;
- Next.js production build;
- Storybook build and Storybook tests;
- Playwright smoke, fail-closed, and axe checks across Chromium, Firefox, and WebKit.

Playwright reports are retained only when the workflow fails.
