# BridgeWorks Apps

BridgeWorks Apps is the Next.js frontend for BridgeWorks, a private talent liquidity network that helps people move from a new connection to trusted collaboration and longer-term work.

The backend lives in `DoMinhHHung/bridgeworks`. Public application requests go through Apache APISIX rather than directly to individual services.

## Stack

- Next.js App Router and React Server Components
- TypeScript strict mode
- Tailwind CSS and owned shadcn/ui primitives
- Clerk for authentication and session management
- Zod for external-response validation
- Storybook and Vitest
- Playwright and axe accessibility checks
- pnpm and Node.js 24 LTS

## Current deployment status

As of 2026-08-07, the frontend is deployed on Vercel and the authenticated Identity vertical slice has been exercised against the deployed BridgeWorks backend.

```text
Production frontend: https://bridge-works-apps.vercel.app
Public backend edge: https://apisix-gateway-fi2xhi6azq-as.a.run.app
```

The deployed request path is:

```text
Browser
  -> Vercel / BridgeWorks Apps
  -> Clerk session
  -> Next.js server-side current-user request
  -> public APISIX Cloud Run edge
  -> private Identity Cloud Run service
  -> PostgreSQL projection
```

The production integration smoke completed successfully with a real Clerk development user: sign-in succeeded, `/app` rendered, and the application displayed the real public BridgeWorks ID, primary email, active lifecycle state, joined date, and last Identity update date returned by `GET /api/v1/me`.

Vercel environment variables are managed outside the repository. The current pre-production integration uses a Clerk development instance; no Clerk Secret Key, session token, webhook secret, or backend credential belongs in Git history, screenshots, logs, fixtures, or client-visible output.

## Local setup

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

Populate `.env.local` with development values from the Clerk dashboard. Never commit `.env.local`, real Clerk keys, session tokens, or backend secrets.

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:9080
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
CLERK_SECRET_KEY=sk_test_replace_me
```

`NEXT_PUBLIC_API_BASE_URL` is the project-standard APISIX gateway origin. It is validated as an absolute HTTP or HTTPS origin with no credentials, query, fragment, or path. Missing, placeholder, or malformed values produce a deterministic protected configuration state. The URL is not a credential; authenticated `/api/v1/me` calls are still initiated only from server code.

The checked-in `.env.example` contains local origins and safe placeholders only.

## Authentication boundary

`src/lib/clerk-config.ts` classifies the Clerk key pair as `configured`, `missing`, `placeholder`, or `malformed`. The Publishable Key is validated using Clerk's documented environment prefix and encoded Frontend API shape. The Secret Key is treated as opaque after its documented environment prefix and is never returned, logged, rendered, snapshotted, or serialized.

`src/lib/clerk-config.server.ts`, `src/lib/auth-session.server.ts`, `src/lib/bridgeworks-api-config.server.ts`, `src/lib/bridgeworks-api.server.ts`, and the current-user use case import `server-only`. A Client Component import therefore fails the Next.js build.

The existing fail-closed route policy remains:

| Route | Clerk configured | Clerk unavailable |
| --- | --- | --- |
| `/` | Public | Public |
| `/sign-in/[[...sign-in]]` | Clerk sign-in | Safe configuration state |
| `/sign-up/[[...sign-up]]` | Clerk sign-up | Safe configuration state |
| `/app` and `/app/**` | Authentication required | HTTP 503 fail closed |
| `/api/**` | No global policy; each future route owns its boundary | No global policy |

The proxy performs the early authentication redirect. Protected layouts and server use cases repeat session checks so a layout is not the only security boundary.

## Verified Identity current-user contract

Backend source and tests currently define:

```http
GET /api/v1/me
Authorization: Bearer <Clerk session token>
X-Request-Id: <forwarded or generated request ID>
```

The request goes through APISIX. The frontend does not verify Clerk JWTs and does not send cookies or use credentialed CORS assumptions.

Successful response:

```json
{
  "id": "<UUIDv7>",
  "id_user": "bw123456789012",
  "primary_email": "member@example.com or null",
  "status": "active",
  "created_at": "<RFC 3339 timestamp>",
  "updated_at": "<RFC 3339 timestamp>"
}
```

Error response:

```json
{
  "code": "<stable error code>",
  "message": "<safe message>",
  "request_id": "<request ID>",
  "details": null
}
```

Verified mappings:

| HTTP | Code | Frontend state |
| ---: | --- | --- |
| 200 | active payload | ready |
| 401 | `unauthorized` | Clerk sign-in recovery with `/app` return URL |
| 403 | `account_disabled` | disabled |
| 403 | `account_deleted` | deleted |
| 409 | `identity_not_ready` | identity not ready; preserves `Retry-After` |
| 503 | `service_unavailable` | service unavailable |

The Identity route does not currently provide a verified stable 429 error code. A structurally valid HTTP 429 response is mapped by status to the rate-limited UI without inventing a backend code. Unsupported status/code combinations and malformed payloads stop at a generic safe state.

Current-user responses are `Cache-Control: no-store` and vary on `Authorization`. A 401 includes the backend Bearer challenge; a 409 currently recommends `Retry-After: 2`.

## Frontend architecture

The current-user vertical slice is separated into:

- `src/lib/bridgeworks-api-config.ts` — pure API origin classification;
- `src/lib/bridgeworks-api-config.server.ts` — server-only environment boundary;
- `src/lib/bridgeworks-api-core.ts` — bounded request transport with timeout, `cache: "no-store"`, `credentials: "omit"`, Bearer header, request-ID forwarding, and bounded response bodies;
- `src/lib/bridgeworks-api.server.ts` — server-only APISIX client entry point;
- `src/features/current-user/current-user-contract.ts` — strict Zod decoding and backend status/code mapping;
- `src/features/current-user/current-user.service.server.ts` — Clerk token acquisition and typed current-user use case;
- `src/features/current-user/current-user-overview.tsx` — product-facing UI state mapping.

The Clerk token exists only in the server request path. It is never returned in a result union, passed to a Client Component, written to logs, or included in Storybook fixtures. Server diagnostics contain only a bounded state name and request ID.

## Current account experience

When Identity is ready, `/app` shows:

- public BridgeWorks ID (`id_user`);
- primary email or a safe unavailable value;
- active lifecycle state;
- joined date;
- last Identity update date;
- a neutral next-step message without a fake profile route, progress percentage, or product metric.

The internal Identity UUID is validated but not rendered.

Dedicated states exist for loading, Identity synchronization pending, disabled, deleted, unauthorized session recovery, rate limiting, service unavailable, API configuration failure, malformed response, and unexpected failure. Error states do not show stale account data. Backend request IDs are rendered with a clear label on non-success states.

The application shell still exposes only one real route:

```text
Overview → /app
```

Desktop and mobile navigation consume the same navigation model, and `aria-current` is derived from the active pathname.

## Product UI

The public landing page contains product-facing value and links to:

- Create an account → `/sign-up`
- Sign in → `/sign-in`

It does not expose framework, testing, engineering-status, fake testimonial, fake company, fake user-count, jobs, marketplace, organization, billing, messaging, or analytics copy.

BridgeWorks uses a focused indigo brand accent plus semantic information, success, warning, and destructive tokens. The existing shadcn/Tailwind foundation, visible focus behavior, reduced-motion support, and restrained card hierarchy remain. Clerk appearance uses the same typography, radius, primary action, input, focus, error, and social-button direction without custom authentication logic.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
pnpm test:storybook
pnpm test:e2e
pnpm check
```

`pnpm check` runs lint, typecheck, unit tests, application build, and Storybook build. Playwright runs Chromium, Firefox, and WebKit.

Secretless CI covers public product copy, auth CTAs, deterministic auth-unavailable pages, fail-closed `/app`, component states, responsive navigation presentation, accessibility smoke, and horizontal overflow checks at 375, 768, 1024, and 1440 pixels. CI does not bypass Clerk or claim an authenticated Clerk flow without a dedicated test instance and credentials.

### Manual authenticated Identity smoke checklist

**Status: Partially completed on the deployed Vercel integration — 2026-08-07.** The real Clerk sign-in and real `GET /api/v1/me` happy path have been verified. Items not explicitly observed remain unchecked.

- [ ] A signed-out user opens `/app`.
- [ ] Clerk redirects the user to `/sign-in` with `/app` as the return destination.
- [x] Real Clerk sign-in renders and succeeds.
- [x] The user returns to `/app`.
- [x] The frontend obtains the Clerk session token only on the server by implementation boundary.
- [x] The server calls APISIX `GET /api/v1/me` with the Bearer token by the verified current-user integration.
- [x] A real current-user response renders the public ID, email state, lifecycle, and dates.
- [ ] Refreshing `/app` preserves the authenticated session.
- [ ] `UserButton` opens and works.
- [ ] Signing out completes successfully.
- [ ] `/app` becomes protected again after sign-out.
- [ ] Browser DevTools and client bundles contain no Clerk Secret Key or session token rendered by the application.
- [x] The APISIX request path does not rely on browser credentialed CORS; the current-user request is server-side.
- [ ] Error responses display the backend request ID and honor `Retry-After` guidance without an automatic retry loop.
- [x] `.env.local` remains ignored and uncommitted by repository policy.

## Agent instructions and repository boundaries

Agents must read, in order:

1. `AGENTS.md`
2. `.agents/skills/bridgeworks-ui/SKILL.md`
3. `.agents/skills/ui-ux-pro-max/SKILL.md`

BridgeWorks-specific rules, verified backend contracts, and the existing design system override generic recommendations.

- Do not invent backend endpoints or response fields.
- Keep generic primitives in `src/components/ui` and feature code in `src/features`.
- Prefer Server Components and keep Client Components small.
- Preserve `X-Request-Id` and the backend error envelope.
- Do not expose tokens, secrets, private provider identifiers, internal UUIDs, or raw backend errors.
- Do not add jobs, talent, marketplace, organizations, billing, messaging, or deployment behavior without an approved vertical slice.
