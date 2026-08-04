# BridgeWorks Apps Agent Rules

## Scope and source priority

Before changing code, inspect in this order:

1. The current task and allowed scope.
2. This `AGENTS.md`.
3. `.agents/skills/bridgeworks-ui/SKILL.md`.
4. Existing BridgeWorks design-system docs, Storybook stories, and approved UI.
5. `.agents/skills/ui-ux-pro-max/SKILL.md`.
6. The current `main` branch of this repository.
7. The current `main` branch of `DoMinhHHung/bridgeworks` for API, auth, authorization, CORS, error-envelope, status, and request-ID contracts.

BridgeWorks-specific rules and verified backend contracts override generic design recommendations. Stop and report conflicts or missing contracts instead of guessing.

## Required UI workflow

For every visual or interaction task, read both UI skills completely. Before editing files, state:

- target user and primary job;
- information hierarchy;
- complete state matrix;
- responsive behavior at 375, 768, 1024, and 1440 px;
- accessibility behavior;
- existing components to reuse;
- verified backend contracts;
- exact files expected to change.

Use UI UX Pro Max as design intelligence only. Do not apply generated styles, palettes, typography, or patterns blindly.

## Architecture

- Use Next.js App Router and TypeScript strict mode.
- Prefer React Server Components; keep Client Components small and low in the tree.
- Put feature code in `src/features`, generic primitives in `src/components/ui`, layout components in `src/components/layout`, and shared API/auth/config code in `src/lib`.
- Centralize APISIX transport, backend error parsing, and `X-Request-Id` handling.
- Do not invent backend endpoints or modify `DoMinhHHung/bridgeworks` unless the task explicitly allows it.
- Avoid duplicate fetching, unnecessary global state, and unrelated refactors.

## UI quality

Implement loading, empty, partial, success, validation, unauthorized, forbidden, not-ready, unavailable, rate-limited, and unexpected-error states when relevant.

Target WCAG 2.2 AA. Use semantic HTML, visible focus, keyboard operation, correct labels, reduced-motion support, sufficient contrast, and stable loading dimensions. Avoid generic AI-dashboard styling, excessive cards, arbitrary gradients, hover-only interactions, and icon-only controls without accessible names.

## Validation

Run the checks relevant to the scope:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
pnpm test:storybook
pnpm test:e2e
```

Do not claim a command passed unless it was actually run.

## Git and PR

Use a focused branch and draft PR. Do not merge, mark ready, request reviewers, or trigger review bots unless explicitly asked. Report changed files, routes and states, responsive and accessibility behavior, tests run, evidence, risks, branch, PR URL, and final head SHA.
