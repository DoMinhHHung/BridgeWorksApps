---
name: bridgeworks-ui
description: Design and implement polished, accessible, responsive BridgeWorks interfaces in Next.js while preserving the product design system and verified backend contracts.
---

# BridgeWorks UI Skill

## Use this skill when

Use this skill for:

- new pages;
- dashboards;
- navigation;
- forms;
- data tables;
- onboarding;
- authentication screens;
- organization screens;
- responsive redesigns;
- accessibility improvements;
- component-system work;
- visual QA;
- UI review.

Do not use it to invent backend functionality.

## Inputs to inspect

Before designing:

1. Current task and scope.
2. Existing page and component patterns.
3. `docs/design-system.md`.
4. Relevant Storybook stories.
5. Approved screenshots or references.
6. Backend API contracts from `DoMinhHHung/bridgeworks`.
7. Existing responsive and accessibility tests.

## Workflow

### 1. Understand the user job

Write down:

- user role;
- primary task;
- decision the user needs to make;
- information needed;
- primary action;
- secondary actions;
- risky or irreversible actions.

### 2. Build the state matrix

Define:

- loading;
- empty;
- partial;
- success;
- validation error;
- unauthorized;
- forbidden;
- not ready;
- dependency unavailable;
- rate limited;
- unexpected error.

Do not implement only the happy path.

### 3. Establish hierarchy

Decide:

- page title and context;
- primary content;
- supporting information;
- action placement;
- progressive disclosure;
- mobile ordering.

### 4. Reuse primitives

Prefer existing BridgeWorks components.

Use shadcn/ui primitives as source code that can be adapted. Do not let default shadcn styling become the final product identity.

### 5. Implement responsively

Check at minimum:

- 375px;
- 768px;
- 1024px;
- 1440px.

Avoid merely shrinking desktop layouts.

### 6. Verify interaction quality

Check:

- keyboard navigation;
- focus order;
- hover, focus, active, disabled, and pending states;
- destructive confirmation;
- reduced motion;
- form recovery;
- request ID visibility on technical failures.

### 7. Validate

Run relevant lint, type, unit, Storybook, accessibility, build, and Playwright checks.

Capture screenshots for material visual changes.

## Visual system rules

- Use semantic tokens.
- Prefer neutral surfaces with one clear product accent.
- Use typography, spacing, and alignment before decoration.
- Use shadows sparingly.
- Use radius consistently.
- Keep data-dense screens readable.
- Use cards only when they represent a meaningful grouped object.
- Use icons as support, not replacement for important text.
- Avoid generic AI-dashboard aesthetics.

## Review checklist

Before delivery, confirm:

- Does the first viewport explain what the user can do?
- Is the primary action obvious?
- Are failure states actionable?
- Is the mobile layout intentionally designed?
- Can the screen be used by keyboard?
- Are focus states visible?
- Are loading dimensions stable?
- Are empty states useful rather than decorative?
- Are backend codes mapped accurately?
- Is private data excluded from logs and errors?
- Did the implementation remain within scope?