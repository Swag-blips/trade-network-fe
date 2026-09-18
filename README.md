# Trade Network

A B2B trade-finance platform connecting lenders with suppliers and distributors across
regional supply chains. This repo is a Turborepo monorepo holding the Next.js web app and
the shared packages it is built from.

## Requirements

| Tool    | Version   | Notes                                                      |
| ------- | --------- | ---------------------------------------------------------- |
| Node.js | `>= 24`   | Enforced by `engines` in the root `package.json`           |
| pnpm    | `11.25.0` | Pinned via `packageManager` — Corepack installs it for you |

**Use pnpm.** The workspace links packages with the `workspace:*` protocol; installing
with npm or yarn writes a second lockfile and breaks those links.

If you don't have pnpm, let Corepack handle it rather than installing globally:

```bash
corepack enable
```

## Setup

```bash
git clone <repo-url> trade-network && cd trade-network && pnpm install
```

There are no environment variables to configure — the app currently runs entirely on
local mock data, so a clean install is all you need.

## Run it

```bash
pnpm dev
```

Two apps come up: **lender** on [http://localhost:3001](http://localhost:3001) — this is
where every screen currently lives — and **business** on [http://localhost:3000](http://localhost:3000),
which has no routes yet. Turbopack is on, so edits
reload as you save.

Lender routes worth opening first (all on :3001):

| Route               | What it is                                                   |
| ------------------- | ------------------------------------------------------------ |
| `/create-account`   | Sign-up, then `/role` → `/organisation` → `/funding-mandate` |
| `/home`             | Lender dashboard                                             |
| `/matched`          | Matched opportunities, with the offer flow                   |
| `/offers`           | Offers list                                                  |
| `/offers/[id]`      | Negotiation timeline — counter, accept, disburse, withdraw   |
| `/portfolio`        | Funded customers                                             |
| `/portfolio/[id]`   | Customer overview, funded trades and repayments              |
| `/settings/profile` | Account and organisation settings                            |

`/` redirects to `/home`, and `/inbox` does not exist yet.

## Commands

Run these from the repo root; Turbo fans each one out across every workspace.

| Command            | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Dev servers (business :3000, lender :3001)        |
| `pnpm build`       | Production builds                                 |
| `pnpm lint`        | ESLint — **`--max-warnings 0`, so warnings fail** |
| `pnpm check-types` | `tsc --noEmit`                                    |
| `pnpm format`      | Prettier over `**/*.{ts,tsx,md}`                  |

Scope any of them to a single workspace with a filter:

```bash
pnpm --filter lender dev
```

Before pushing, the full gate is:

```bash
pnpm format && pnpm check-types && pnpm lint && pnpm build
```

## Layout

```
apps/
  lender/  Next.js 16 — capital-provider app: onboarding, dashboard, settings
  business/ Next.js 16 — business app (suppliers, distributors); empty shell for now
  agent/   AI agent service — planned, not yet scaffolded
packages/
  ui/                @repo/ui — design tokens + every component both apps share
  eslint-config/     base / next-js / react-internal presets
  typescript-config/ base / nextjs / react-library
```

App source lives under `apps/<app>/src/`, not a top-level `app/`. Code is colocated: each
route folder owns its own `components/`, `hooks/`, `types/` and `utils/`, and only moves
up to `src/` once a second route imports it.

## Stack

- **Next.js 16.3.4** (App Router, Turbopack), **React 19.2.8**, **TypeScript 7**
- **React Compiler is enabled** — don't hand-write `useMemo` or `useCallback`
- **Tailwind CSS v4**, configured in CSS via `@theme` in
  [`packages/ui/src/styles.css`](packages/ui/src/styles.css), imported by each app's
  `globals.css`. There is no
  `tailwind.config.js` and there should not be one.
- [Hugeicons](https://hugeicons.com) for icons, three Google fonts via `next/font`

Every design token from the Figma style guide is a Tailwind utility: `--color-evergreen-600`
generates `bg-evergreen-600`, `text-evergreen-600` and so on. Reach for a token before
writing a hex or a pixel value.

## Working on this repo

[`AGENTS.md`](AGENTS.md) is the detailed guide — design-system rules, the component
inventory in `packages/ui`, the colocation and promotion rules, and a list of pitfalls
this codebase has already hit. Read it before adding UI. `CLAUDE.md` just points at it,
so Claude Code picks up the same instructions.

Agent skills live in `.agents/skills/` and are tracked in git. `.claude/` is ignored
because it holds machine-specific symlinks into that folder; re-create them locally with:

```bash
npx skills add https://github.com/hugeicons/hugeicons --skill hugeicons
```
