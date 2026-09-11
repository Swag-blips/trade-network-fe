# Trade Network

Turborepo monorepo for the Trade Network platform — a B2B marketplace connecting
businesses across regional supply chains.

## Layout

```
apps/
  web/     Next.js 16 marketing site (App Router) — the only app currently built
  agent/   AI agent service — planned, not yet scaffolded (empty directory)
packages/
  ui/                @repo/ui — shared React components
  eslint-config/     @repo/eslint-config — base / next-js / react-internal presets
  typescript-config/ @repo/typescript-config — base / nextjs / react-library
```

## Code organisation — colocate first

**Code lives next to the page that uses it.** Every route folder owns its own
`components/`, `hooks/`, `types/` and `utils/`; only genuinely cross-page code moves up.

```
apps/web/src/
  app/
    layout.tsx          root layout — fonts, <html>/<body>
    globals.css         design tokens + base styles
    (home)/             route group: folder name in () is NOT part of the URL
      page.tsx
      components/       used only by this route
      hooks/
      types/
      utils/
  components/           shared by 2+ routes
  hooks/
  types/
  utils/
```

### Routes

```
/                          marketing starter page — still create-turbo boilerplate
/home                      lender dashboard        → app/(lender)/home
/settings/profile          my profile              → app/(settings)/settings/…
/settings/preferences      notifications + Tai autonomy
/settings/delete-account
/settings/company          company details
/settings/funding-mandate  mandate + ticket range
```

**There are two shells, deliberately.** `app/(lender)/` is the dashboard workspace with
the main sidebar; `app/(settings)/` is a separate group with its own settings sidebar
(Back link, Account / Organisation groups, Sign out). They share nothing but the token
system and `AgentFab`, which both layouts render.

Sibling routes the lender sidebar links to — `/portfolio`, `/inbox`, `/matched`,
`/offers` — do not exist yet and will 404.

**The promotion rule:** start colocated. Move something up to `src/` the moment a
_second_ route imports it — not in anticipation of one. A single consumer means it
stays in the route folder.

- Import shared code via the `@/*` alias: `@/components/…`, `@/hooks/…`, `@/utils/…`
  (mapped to `apps/web/src/*` in `tsconfig.json`). Colocated siblings use relative
  paths (`./components/…`).
- Truly app-agnostic components belong one level further out, in `packages/ui`.
- A folder under `app/` only becomes a route if it contains a `page.tsx`, so
  `components/`, `hooks/` etc. are safe to nest there. If you want a hard guarantee,
  prefix with `_` (`_components`) — Next.js excludes underscore folders from routing
  entirely.
- Every route gets a route group (`(home)`, `(about)`, …) rather than a bare
  `page.tsx` at a level, so the page and its private folders sit together.
- The `.gitkeep` files are placeholders holding empty directories in git — delete each
  one as soon as its folder has real content.

## Commands

Run from the repo root; Turbo fans them out to every workspace.

| Command            | What it does                     |
| ------------------ | -------------------------------- |
| `pnpm dev`         | Dev servers (web on :3000)       |
| `pnpm build`       | Production builds                |
| `pnpm lint`        | ESLint, `--max-warnings 0`       |
| `pnpm check-types` | `tsc --noEmit`                   |
| `pnpm format`      | Prettier over `**/*.{ts,tsx,md}` |

To scope to one workspace: `pnpm --filter web dev`.

**Toolchain is pinned.** pnpm 11.25.0, Node >= 24. Use pnpm — never npm or yarn;
mixing lockfiles breaks the workspace protocol (`workspace:*`) deps.

## Stack

- **Next.js 16.3.4**, App Router, Turbopack, React 19.2.8, TypeScript 7.0.2
- **Styling: Tailwind CSS v4**, configured in CSS (`@theme`), not a JS config file —
  there is no `tailwind.config.js` and there should not be one. No CSS Modules, no
  CSS-in-JS.
- Source lives under `apps/web/src/` (not a top-level `app/`).

## Design system

The source of truth is the Figma style guide — _Marketing Designs | Hops_ →
`trade-network-design-system` ([node 2549-35198][fig]). It is implemented as a Tailwind
`@theme` block in [`apps/web/src/app/globals.css`](apps/web/src/app/globals.css), so
**every token is also a utility class** — `--color-evergreen-600` generates
`bg-evergreen-600`, `text-evergreen-600`, `border-evergreen-600`, and so on.

| Layer         | Tokens                                          | Utilities                          |
| ------------- | ----------------------------------------------- | ---------------------------------- |
| 1. Primitives | `--color-evergreen-50` … `--color-ochre-900`    | `bg-ochre-500`, `text-grey-900`    |
| 2. Brand      | `--color-brand-evergreen`, …                    | `bg-brand-linen`                   |
| 3. Semantic   | `--color-background`, `--color-foreground`, …   | `bg-background`, `text-foreground` |
| 4. Typography | `--font-*`, `--text-*` (+ `--line-height` etc.) | `font-display`, `text-h2`          |
| 5. Radius     | `--radius-none` … `--radius-full`               | `rounded-lg`, `rounded-full`       |
| 6. Spacing    | `--spacing-xxs` … `--spacing-4xl`               | `p-xs`, `gap-lg`, `mt-2xl`         |
| 7. Elevation  | `--shadow-small-thick`, `--shadow-soft-section` | `shadow-soft-section`              |

The semantic layer renames Figma's labels to Tailwind's idiom, because `bg-background-primary`
and `text-text-primary` stutter. The mapping is written out in `globals.css`:
Background Primary → `bg-background`, Text Primary → `text-foreground`,
Text Secondary → `text-foreground-muted`, Text On Dark → `text-foreground-inverse`.

**Rules when writing styles:**

- Never hardcode a hex, px size, radius or spacing that a token already covers, and
  avoid arbitrary values (`bg-[#1e6b63]`) — if you need one, the token is missing.
- Reach for the **semantic** utility first; drop to a primitive ramp stop only when the
  semantic layer genuinely has no name for what you need.
- The numeric spacing scale (`p-4`, `gap-2`) still exists alongside the named one. Prefer
  the named tokens — they are the ones the designer actually specified.
- Type styles are applied to bare `h1`–`h4` in `@layer base`. Use `text-display`,
  `text-h2` … only when the semantic element and the visual style must differ.
- `type-overline` is a custom `@utility`, not a size token: Overline / Label carries
  weight and uppercase too, so `text-overline` alone is not the whole style.

**Fonts — two faces, two jobs:**

- `font-display` → **Fraunces** (serif). Display/H1–H3 only: the 48/36/28px marketing
  headings. It should not appear anywhere in the signed-in app.
- `font-sans` → **Inter**. H4 (22px) and everything below — body, labels, app chrome.
- `font-brand` → **Rethink Sans**. In-app emphasis, only where a comp names it: the
  dashboard greeting and the currency figures. Not general-purpose — reach for
  `font-sans` first, and check the comp before using this.

The style guide names _Rethink Sans_ for the whole sans role, but the comps draw UI in
Inter and keep Rethink Sans for those emphasis moments, so all three faces are loaded.
Only the family differs — the sizes, line-heights and tracking are the style guide's.
All three load via `next/font/google` in `apps/web/src/app/layout.tsx`; don't add
`<link>` tags or `@font-face`.

**`@layer base` binds Fraunces to the `h1`–`h3` elements**, which is right for prose and
wrong for app UI, where a heading is often a 12–16px label. Overriding only the size
(`text-body`, `type-overline`) leaves the serif in place — the whole lender dashboard
shipped that way until it was caught by eye. **When a heading is app chrome, say
`font-sans` explicitly.**

To pull new values from Figma, use the Figma MCP tools (`get_variable_defs` for bound
variables, `get_metadata` for spec text baked into layer names). `get_design_context`
returns React + Tailwind, which now maps almost directly onto this setup — but translate
its raw hex and `p-[8px]` arbitrary values back into the tokens above.

[fig]: https://www.figma.com/design/TcbSe6y2vzc4z3MU6P8ldR/Marketing-Designs-%7C-Hops?node-id=2549-35198

## Components

**Before building any UI, check `packages/ui/src/` for an existing component and use it.**
Do not hand-roll a `<button>`, or restyle an existing component by passing a `className`
that fights its variants. If what you need is close to an existing component but not
covered, extend that component's variant/size union rather than writing a parallel one.

Current inventory — `ls packages/ui/src/` is the authoritative check, this list will go
stale:

| Component      | Import              | Notes                                                                                      |
| -------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| `Button`       | `@repo/ui/button`   | 5 variants × 2 sizes, `loading` / `disabled` props                                         |
| `Avatar`       | `@repo/ui/avatar`   | Structure only (size/shape/clip); pass the skin via `className`                            |
| `Field`        | `@repo/ui/field`    | Label + control wrapper; `required` appends the asterisk                                   |
| `Input`        | `@repo/ui/input`    | 40px, `leading` slot for the ₦ prefix (not `prefix` — it collides with the HTML attribute) |
| `Select`       | `@repo/ui/select`   | Native `<select>` with the chevron overlaid                                                |
| `Switch`       | `@repo/ui/switch`   | `role="switch"`, controlled                                                                |
| `Radio`        | `@repo/ui/radio`    | Controlled radio dot                                                                       |
| `CheckboxChip` | `@repo/ui/checkbox` | Pill-shaped checkbox used for sector picking                                               |
| `Badge`        | `@repo/ui/badge`    | Small uppercase label (RECOMMENDED)                                                        |
| `Card`         | `@repo/ui/card`     | ⚠️ untouched `create-turbo` scaffolding — rewrite before use                               |

```tsx
import { Button } from "@repo/ui/button";

<Button
  variant="destructive"
  size="sm"
  loading
  leadingIcon={<HugeiconsIcon icon={Delete01Icon} />}
>
  Delete
</Button>;
```

`variant`: `primary` | `secondary` | `outline` | `ghost` | `destructive`. `size`: `sm` | `md` | `lg`.
Everything else forwards to the underlying `<button>`.

Where a new component belongs is the same promotion rule as everything else — route
folder first, `apps/web/src/components/` when a second route needs it, `packages/ui`
only when it is app-agnostic enough that `apps/agent` could use it too. See
[Code organisation](#code-organisation--colocate-first).

**App shell** lives in `apps/web/src/components/`, global to the web app but not
generic enough for `packages/ui`:

| Component                   | Notes                                                            |
| --------------------------- | ---------------------------------------------------------------- |
| `Sidebar` / `SidebarFooter` | Chrome only — takes `sections` and `footer` as props             |
| `UserAvatar` / `OrgAvatar`  | `@repo/ui/avatar` skinned with this app's tokens and icons       |
| `TaiAgent` / `AgentFab`     | The assistant, built in DOM; FAB is pinned bottom-right app-wide |
| `BrandMark` / `BrandArc`    | The interlocking-arcs symbol; `currentColor`, any size           |

`UserAvatar`'s empty state is the Figma person placeholder, inlined as one scalable
`viewBox` (`grey-300` disc, `grey-100` figure) rather than a committed file per size.

**Keep the shell free of persona knowledge.** `Sidebar` knows nothing about lenders;
`app/(lender)/components/lender-sidebar.tsx` supplies the destinations and the org
footer. A borrower or supplier workspace adds its own config file and reuses the same
shell — do not fork it.

Components are React + Tailwind utility classes, with variants expressed as plain
`Record<Variant, string>` maps — no `cva`, no `clsx`, just a local `cx()` join. Match
that pattern in new components.

Two pieces of wiring make this work across the workspace boundary:

- `globals.css` has `@source "../../../../packages/ui/src";` — `@repo/ui` resolves
  through `node_modules`, which Tailwind skips by default, so **without this the
  package's utility classes silently never generate.** Add an `@source` line for every
  new workspace package that ships classes.
- `apps/web/next.config.js` sets `transpilePackages: ["@repo/ui"]`, since the package
  exports raw `.tsx` rather than a build output.

**Figma state variants are not props.** A Figma component set enumerates Hover / Pressed
as variants because Figma has no interaction model. In code those are `:hover` and
`:active`; only application state (`disabled`, `loading`) becomes a prop. Don't mirror a
Figma variant axis into the TypeScript API without asking what it actually represents.

## Icons

[Hugeicons](https://hugeicons.com) — `@hugeicons/react` (renderer) + `@hugeicons/core-free-icons`
(the icon data). Installed in `apps/web` only.

```jsx
import { HugeiconsIcon } from "@hugeicons/react";
import { ContainerTruckIcon } from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={ContainerTruckIcon} />;
```

`icon` is the only required prop. Don't pass props that restate a default — `size` is 24,
`strokeWidth` is 1.5, and `color` is `currentColor`, so an icon already inherits whatever
`--text-primary` (or any local `color`) resolves to. Set `size` from the type scale when an icon
sits inline with text.

**Never guess an icon name.** There are 5,471 of them and near-misses are common. Grep the
catalog and copy the exact match:

```bash
grep -iE "truck|shipping" .agents/skills/hugeicons/references/icon-list.md
```

Do not read that file whole — it is tens of thousands of tokens. The `hugeicons` skill in
`.agents/skills/` documents the full API.

## Gotchas

- **No dark theme.** The style guide defines one light palette only. There is a
  `--background-inverse` token for dark structural blocks (header/footer), but no
  `prefers-color-scheme` block — don't add one without designer input.
- **`--text-secondary` is darker than `--text-primary`** (Cordovan `#200000` vs
  Evergreen `#023937`). That's what the Figma semantic table specifies; it reads as
  unusual but is intentional until a designer says otherwise.
- **`next/image` will destroy a transparent PNG/WebP.** The optimiser re-encodes to
  JPEG for any client that doesn't advertise webp/avif, and JPEG has no alpha — the
  transparency flattens to black with no error. Pass `unoptimized` for cut-out images
  (see the modal photo in `welcome-modal.tsx`).
- **The Figma MCP asset server is ephemeral.** Exported asset URLs
  (`http://localhost:3845/assets/…`) stop resolving — returning `Error getting image` —
  as soon as the Figma desktop app switches to a different tab. Download anything you
  need _while_ the file is the active tab, not later.
- **The lender dashboard uses values that are off the design system**, kept verbatim
  from Figma and marked with comments at each site: the 24px greeting and 20px stat
  figures are not on the type scale (which jumps 18 → 22), `#e0f2fe` behind the update
  icon is off-palette (nearest is `azure-100`), and the sidebar org avatar's gradient
  stops sit just off the ocean ramp.
- **Tailwind pitfalls this repo has already hit** (all three cost real debugging time):
  - **`next/font` variables must go on `<html>`, not `<body>`.** `@theme` declares
    `--font-sans` on `:root`; a `:root` variable cannot read one defined on a
    descendant, so the value computes invalid and falls back to the system stack —
    silently, with no error and a page that still looks plausible.
  - **Don't split one CSS property across a base string and a variant string.** Putting
    `border-transparent` in a shared base and `border-evergreen-600` in a variant does
    not do what the class order suggests: both are `border-color`, and Tailwind's
    generated stylesheet order decides the winner. Give every variant its own value.
  - **`text-<size>` already sets `line-height`.** A separate `leading-*` may lose to it.
    Use the slash form (`text-body-sm/[normal]`) to set both in one utility.
- **Lint warnings fail the build.** `eslint-plugin-only-warn` downgrades every rule to
  a warning, but the scripts run `--max-warnings 0`. A "warning" is a hard failure.
- **The starter page is still boilerplate.** `apps/web/src/app/page.tsx` and
  `page.module.css` are unmodified `create-turbo` output. `globals.css` keeps a couple
  of compatibility shims for it (`--background` / `--foreground` aliases, `.imgDark`),
  all marked with comments — delete them along with the starter page.
- **`Card` in `packages/ui` is still untouched scaffolding** (`Button` has been replaced).
- **The Figma button matrix contradicts the style guide in places** — see
  [node 2770-1631](https://www.figma.com/design/TcbSe6y2vzc4z3MU6P8ldR/Marketing-Designs-%7C-Hops?node-id=2770-1631).
  Its Destructive fills (`#e9594e`,
  `#d92d20`) match neither each other nor the style guide's `Error / Danger` red
  (`#C0392B`). The implementation follows the style guide for the font and Figma for the
  fills. Several states are also no-ops (Primary hover, Ghost hover/pressed, Destructive
  pressed) — implemented as specified, pending designer confirmation.
- **The icon catalog lags the installed package.** `references/icon-list.md` was generated from
  `core-free-icons@4.2.1`; the app is on 4.3.2. Icons added since then won't be listed. If an
  icon you expect is missing, check the package's own exports before assuming it doesn't exist.

## Conventions

- Prettier formats; don't hand-align. Run `pnpm format` before committing.
- Add a new shared component under `packages/ui/src/` — it is exported per-file via
  `"./*": "./src/*.tsx"`, so `packages/ui/src/badge.tsx` imports as `@repo/ui/badge`.
- New workspaces go in `apps/*` or `packages/*` and are picked up automatically.
