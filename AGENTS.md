# Trade Network

Turborepo monorepo for the Trade Network platform — a B2B marketplace connecting
businesses across regional supply chains.

## Layout

```
apps/
  lender/  Next.js 16 — the capital-provider app: onboarding, dashboard, settings (:3001)
  business/ Next.js 16 — the business app (suppliers, distributors, enterprises).
            An empty shell for now: layout + tokens, no routes (:3000)
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
apps/lender/src/           (apps/business/src/ follows the same shape)
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

All of these live in `apps/lender`. `apps/business` has none yet.

```
/                          redirects to /home
/create-account            sign-up                 → app/(auth)/…
/login
/verify-email              OTP, then the welcome splash
/onboarding                organisation + mandate  → app/(onboarding)/onboarding
/home                      lender dashboard        → app/(lender)/home
/matched                   matched opportunities   → app/(lender)/matched
/offers                    offers list             → app/(lender)/offers
/offers/[id]               negotiation timeline    → app/(lender)/offers/[id]
/portfolio                 funded customers        → app/(lender)/portfolio
/portfolio/[id]            customer overview / funded trades / repayments
/inbox                     conversations: Tai + counterparties → app/(lender)/inbox
/settings/profile          my profile              → app/(settings)/settings/…
/settings/preferences      notifications + Tai autonomy
/settings/delete-account
/settings/company          company details
/settings/funding-mandate  mandate + ticket range
```

**Four route groups, four shells.** `(auth)` and `(onboarding)` are the signed-out and
first-run flows, each with its own layout. `app/(lender)/` is the dashboard workspace
with the main sidebar; `app/(settings)/` is a separate group with its own settings
sidebar (Back link, Account / Organisation groups, Sign out). The dashboard and settings
shells share nothing but the token system and `AgentFab`, which both layouts render.

**Lender and business are separate apps; what they share lives in `packages/ui`.**
That is the design tokens (`packages/ui/src/styles.css`, imported by each app's
`globals.css`) and every component with no lender knowledge in it — tables, sheets,
tabs, the sidebar shell, avatars, the Tai character. What stays in `apps/lender` is
lender _content_: offers, matched opportunities, the trade room, Tai's chat (its mock
data is lender-specific), the ticket-range mandate control. Onboarding is also still in
lender: business will have a similar flow, but its shape isn't settled, so it stays put
until there is a second real consumer to extract against.

**The promotion rule:** start colocated. Move something up to `src/` the moment a
_second_ route imports it — not in anticipation of one. A single consumer means it
stays in the route folder.

- Import shared code via the `@/*` alias: `@/components/…`, `@/hooks/…`, `@/utils/…`
  (mapped to each app's own `src/*` in its `tsconfig.json`). Colocated siblings use relative
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

| Command            | What it does                               |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Dev servers (business :3000, lender :3001) |
| `pnpm build`       | Production builds                          |
| `pnpm lint`        | ESLint, `--max-warnings 0`                 |
| `pnpm check-types` | `tsc --noEmit`                             |
| `pnpm format`      | Prettier over `**/*.{ts,tsx,md}`           |

To scope to one workspace: `pnpm --filter lender dev`.

**Toolchain is pinned.** pnpm 11.25.0, Node >= 24. Use pnpm — never npm or yarn;
mixing lockfiles breaks the workspace protocol (`workspace:*`) deps.

## Stack

- **Next.js 16.3.4**, App Router, Turbopack, React 19.2.8, TypeScript 7.0.2
- **React Compiler is on** (`reactCompiler: true` in each app's `next.config.js`). Do not
  hand-write `useCallback` or `useMemo` — the compiler memoizes for you, and manual
  memoization is noise it has to work around. There is currently none in the codebase;
  keep it that way unless you can show a profile that needs it.
- **Styling: Tailwind CSS v4**, configured in CSS (`@theme`), not a JS config file —
  there is no `tailwind.config.js` and there should not be one. No CSS Modules, no
  CSS-in-JS.
- Source lives under `apps/<app>/src/` (not a top-level `app/`).

## Design system

The source of truth is the Figma style guide — _Marketing Designs | Hops_ →
`trade-network-design-system` ([node 2549-35198][fig]). It is implemented as a Tailwind
`@theme` block in [`packages/ui/src/styles.css`](packages/ui/src/styles.css), which every app's `globals.css` imports, so
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
and `text-text-primary` stutter. The mapping is written out in `styles.css`:
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
All three load via `next/font/google` in each app's `src/app/layout.tsx`; don't add
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

| Component                                     | Import                                     | Notes                                                                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`                                      | `@repo/ui/button`                          | 6 variants × 6 sizes, `loading` / `disabled` props                                                                                                                                                                             |
| `buttonClasses`                               | `@repo/ui/button-classes`                  | Button visuals without the element — for anchors. Not a client module, so a server component can call it                                                                                                                       |
| `Avatar`                                      | `@repo/ui/avatar`                          | Structure only (size/shape/clip); pass the skin via `className`                                                                                                                                                                |
| `IconButton`                                  | `@repo/ui/icon-button`                     | Icon-only actions; `label` required, hit target always ≥32px                                                                                                                                                                   |
| `Toast`                                       | `@repo/ui/toast`                           | `ToastProvider` in the root layout, pinned **top centre**; call `useToast().toast({ message, state })`                                                                                                                         |
| `Field`                                       | `@repo/ui/field`                           | Label + control wrapper; `required` appends the asterisk                                                                                                                                                                       |
| `Input`                                       | `@repo/ui/input`                           | 40px, `leading` slot for the ₦ prefix (not `prefix` — it collides with the HTML attribute)                                                                                                                                     |
| `Select`                                      | `@repo/ui/select`                          | Custom listbox (not a native `<select>` — Figma styles the popup). `value` + `onValueChange` + `options` (`string[]` or `{value,label,display?}[]`); `variant`: `field` (40px) or `chip` (29px pill); `placeholder`, `leading` |
| `Switch`                                      | `@repo/ui/switch`                          | `role="switch"`, controlled                                                                                                                                                                                                    |
| `Radio`                                       | `@repo/ui/radio`                           | Controlled radio dot                                                                                                                                                                                                           |
| `CheckboxChip`                                | `@repo/ui/checkbox`                        | Pill-shaped checkbox used for sector picking                                                                                                                                                                                   |
| `Badge`                                       | `@repo/ui/badge`                           | Small uppercase label (RECOMMENDED)                                                                                                                                                                                            |
| `Card`                                        | `@repo/ui/card`                            | ⚠️ untouched `create-turbo` scaffolding — rewrite before use                                                                                                                                                                   |
| `DataTable`                                   | `@repo/ui/data-table`                      | List tables. Declare `columns` with `header` / `width` / `cell`; leave `width` off the column that takes the slack. `rowHref` → `Link` rows, `onRowClick` → `button` rows, neither → `div` rows                                |
| `Sheet`                                       | `@repo/ui/sheet`                           | 544px right-edge `<dialog>` panel: header with optional icon chip, title and close                                                                                                                                             |
| `Panel`                                       | `@repo/ui/panel`                           | Bordered card with a 16px heading — the boxes inside sheets. `divided` adds a rule under the heading                                                                                                                           |
| `DetailRow`                                   | `@repo/ui/detail-row`                      | Label left, value right. `size="sm"` is the 14px summary row, default is 16px                                                                                                                                                  |
| `Tabs`                                        | `@repo/ui/tabs`                            | Underlined tab strip (tablist only; panels stay at the call site)                                                                                                                                                              |
| `FilterBar`                                   | `@repo/ui/filter-bar`                      | "Filter by:" and its chips — wrap one or more `<Select variant="chip">`                                                                                                                                                        |
| `ConfirmModal`                                | `@repo/ui/confirm-modal`                   | Confirm dialog — title, body slot, cancel + confirm footer. `width`: `sm` (453px) or `lg` (613px)                                                                                                                              |
| `UploadDropzone`                              | `@repo/ui/upload-dropzone`                 | Green dashed evidence dropzone with the attached-file row (click, drag-and-drop, replace, remove)                                                                                                                              |
| `DetailHeader`                                | `@repo/ui/detail-header`                   | 60px record header: back, avatar, name, status slot, prev/next                                                                                                                                                                 |
| `ButtonLink`                                  | `@repo/ui/button-link`                     | `next/link` wearing `buttonClasses()` — same props as `Button`                                                                                                                                                                 |
| `Sidebar`                                     | `@repo/ui/sidebar`                         | Chrome only — takes `sections` and `footer` as props; knows nothing about lenders                                                                                                                                              |
| `UserAvatar` / `OrgAvatar` / `InitialsAvatar` | `@repo/ui/avatars`                         | `Avatar` skinned with the app's tokens and icons                                                                                                                                                                               |
| `TaiAgent`                                    | `@repo/ui/tai-agent`                       | The assistant character, built in DOM; eyes follow the cursor. `size`: `xs` 20 / `avatar` 24 / `sm` 32 / `md` 56                                                                                                               |
| `BrandMark` / `BrandArc` / `Wordmark`         | `@repo/ui/brand-mark`, `@repo/ui/wordmark` | The interlocking-arcs symbol and the TRADE NETWORK wordmark; `currentColor`, any size                                                                                                                                          |
| `GoogleIcon`                                  | `@repo/ui/icons/google-icon`               | Sign-in-with-Google mark                                                                                                                                                                                                       |

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

`variant`: `primary` | `secondary` (grey-100 fill) | `tertiary` (white fill, grey-200 ring —
the social sign-in buttons) | `outline` | `ghost` | `destructive`.
`size`: `sm` | `md` | `lg` | `form` (settings/dialog footers) | `auth` (the sign-in and
sign-up pages) | `flush` (vertical padding only).
Everything else forwards to the underlying `<button>`.

**A button that navigates is a link.** Use `ButtonLink` (`@/components/button-link`) —
it wraps `next/link` in `buttonClasses()` so it keeps client-side navigation, middle-click
and the same visuals. That is why the variants use `not-disabled:hover:` rather than
`enabled:hover:`: `:enabled` never matches an anchor, so the hover states would silently
drop out.

**When NOT to use `Button`.** Most raw `<button>` in this app is correct: tabs
(`role="tab"`), menu rows (`role="menuitem"`), and whole clickable surfaces (an
opportunity card, a chat suggestion, an accordion header) are not buttons in the
design-system sense, and forcing a pill on them would be wrong. Icon-only actions are
the exception — reach for `IconButton`, never a hand-rolled `<button>` with `size-N`.

Where a new component belongs is the same promotion rule as everything else — route
folder first, the app's `src/components/` when a second route needs it, `packages/ui`
when both apps need it (or certainly will). A component with no lender or business
knowledge in it belongs in the package; one that renders lender content stays in the
app. `packages/ui` lists `next` as a peer dependency, so it may use `next/link` and
`next/navigation`. See [Code organisation](#code-organisation--colocate-first).

**Lender-only components** live in `apps/lender/src/components/` — they render lender
content, so they stay in the app until business genuinely needs one:

| Component             | Notes                                                                                                                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AgentFab` + `chat/*` | Tai's floating button and chat panel. The chat's suggestions and mock data are lender-specific, which is why the _character_ is shared but this isn't                                                                                                            |
| `ChatThread`          | The conversation body — messages, Thinking row, composer, notice — shared by the floating Tai panel and the inbox pane. Takes a `ThreadChat` (`useChat` returns one); `gutter` is `panel` (20px) or `page` (24px). The seam to cut if agent UI becomes a package |
| `OfferModal`          | Offer / counter-offer composer: form → review → send                                                                                                                                                                                                             |
| `PartyCard`           | Borrower identity block (name, type, terms line, 56px avatar) for the offer and accept dialogs                                                                                                                                                                   |
| `TradeRoom`           | Trade details / Evidence / Activity sub-tabs over a `TradeRoomData` prop. The first candidate to promote if business shows trade detail                                                                                                                          |
| `MatchBadge`          | Match-score pill on matched opportunities                                                                                                                                                                                                                        |
| `TicketRange`         | The funding-mandate ticket-size control, used by onboarding and settings                                                                                                                                                                                         |

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

- Each app's `globals.css` imports the tokens with `@import "@repo/ui/styles.css";`
  (exported explicitly from the package) and has `@source "../../../../packages/ui/src";` — `@repo/ui` resolves
  through `node_modules`, which Tailwind skips by default, so **without this the
  package's utility classes silently never generate.** Add an `@source` line for every
  new workspace package that ships classes.
- Each app's `next.config.js` sets `transpilePackages: ["@repo/ui"]`, since the package
  exports raw `.tsx` rather than a build output.

**Figma state variants are not props.** A Figma component set enumerates Hover / Pressed
as variants because Figma has no interaction model. In code those are `:hover` and
`:active`; only application state (`disabled`, `loading`) becomes a prop. Don't mirror a
Figma variant axis into the TypeScript API without asking what it actually represents.

## Icons

[Hugeicons](https://hugeicons.com) — `@hugeicons/react` (renderer) + `@hugeicons/core-free-icons`
(the icon data). Installed in each app and in `packages/ui`.

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
- **Trig in SSR-ed markup must be rounded.** `HealthGauge` computes tick and needle
  coordinates from `Math.cos`/`Math.sin`; the server and client disagreed on the last
  digit (`51.30642496536482` vs `…481`) and React reported a hydration mismatch. Every
  computed coordinate goes through `round()` to 3 decimals. Do the same in any other
  geometry drawn during render.
- **The portfolio banner ships without its grain overlay.** Figma layers a 1024×1024
  noise PNG at 4% opacity over the gradient; the export is 1.9 MB, which is not worth it
  for that. The gradient, the diagonals and the masked dot field
  (`public/portfolio-banner-dots.png`) are all there. Add the grain back only if a
  compressed export turns up.
- **The funding-window countdown has no real typeface.** Figma sets it in
  _Digital Numbers_, which is not on Google Fonts, and `next/font/google` is the only
  font path here — it renders in the system monospace stack with `tabular-nums`. Swap in
  the real face if the designer supplies it.
- **`/portfolio/[id]` holds the customer in client state.** `CustomerDetail` owns it so
  recording a repayment can update the status chip in `DetailHeader`, hide the Record
  repayment button, flip the trade to repaid and prepend the repayments row in one go.
  The page stays a server component that only looks the customer up.
- **`Select` is a hand-built listbox, so keyboard support is ours to keep.** Figma styles
  the popup ([node 3883-68463](https://www.figma.com/design/TcbSe6y2vzc4z3MU6P8ldR/Marketing-Designs-%7C-Hops?node-id=3883-68463)),
  which a native `<select>` cannot do. It implements `role="combobox"`/`listbox`/`option`
  with `aria-activedescendant`, arrow keys, Home/End, Enter/Space, Escape, Tab, typeahead,
  outside-click and scroll-into-view. Do not regress those when editing it. An option's
  `label` shows in the list and `display` in the closed control, which is how the trade
  picker shows a rich row but a bare `FT-0001` once chosen.
  The popup is absolutely positioned, so any scroll container it opens inside will clip
  it — dialogs that host one keep `overflow-visible`.
- **Clicking a funded trade opens a right-side sheet, not a route.** Figma draws it as a
  544px panel pinned to the right edge (node 3649-63954), so it is a native `<dialog>`
  with `ml-auto h-full` — the platform still gives the focus trap, Escape and backdrop.
  `/portfolio/[id]` keeps its own URL while the sheet is open.
- **`/offers/[id]` runs the whole negotiation in local state.** `NegotiationTimeline`
  owns the thread: only the newest entry carries the NEW tag and the action buttons,
  entries are grouped into one dot per day, and executing Tai's recommendation or
  sending a counter prepends a new "Offer sent" entry. Exactly one accordion is open per
  card — opening the recommendation collapses the offer details, as the Figma variants
  specify. Accepting prepends a `terms-agreed` entry, which strips the counter offer's
  action buttons and hands over to the disbursement dialogs.
- **The lender dashboard uses values that are off the design system**, kept verbatim
  from Figma and marked with comments at each site: the 24px greeting and 20px stat
  figures are not on the type scale (which jumps 18 → 22), `#e0f2fe` behind the update
  icon is off-palette (nearest is `azure-100`), the sidebar org avatar's gradient
  stops sit just off the ocean ramp, and the capital-deployed ring's two category
  colours (`#7be7fc`, `#005894`) match no ramp stop.
- **Tailwind pitfalls this repo has already hit** (all three cost real debugging time):
  - **`next/font` variables must go on `<html>`, not `<body>`.** `@theme` declares
    `--font-sans` on `:root`; a `:root` variable cannot read one defined on a
    descendant, so the value computes invalid and falls back to the system stack —
    silently, with no error and a page that still looks plausible.
  - **Don't split one CSS property across a base string and a variant string.** Putting
    `border-transparent` in a shared base and `border-evergreen-600` in a variant does
    not do what the class order suggests: both are `border-color`, and Tailwind's
    generated stylesheet order decides the winner. Give every variant its own value.
  - **Bare numeric spacing only survives 2 decimal places.** `w-[544px]` is fine as
    `w-136` and `h-[35px]` as `h-8.75`, but a fractional pixel like `w-[136.25px]`
    becomes `w-34.0625`, which Tailwind does not generate — no CSS, no error, the element
    silently falls back to `auto`. Whole-pixel values are always safe (`px / 4` lands on
    `.0`/`.25`/`.5`/`.75`); keep the arbitrary form for anything sub-pixel.
  - **`text-<size>` already sets `line-height`.** A separate `leading-*` may lose to it.
    Use the slash form (`text-body-sm/[normal]`) to set both in one utility.
- **Lint warnings fail the build.** `eslint-plugin-only-warn` downgrades every rule to
  a warning, but the scripts run `--max-warnings 0`. A "warning" is a hard failure.
- **There is no role picker, and no `/welcome` route.** `/role` was removed — this app
  _is_ the Capital Provider app, so the shell says "Capital provider" outright and
  `roles.ts` is gone with it. The welcome splash is a component `/verify-email` swaps in
  once the OTP clears, which then hands over to `/organisation`; it is `fixed inset-0`
  because it covers the auth chrome it renders inside. How a business picks a role (into
  `apps/business`? a shared auth domain?) is still undecided.
- **Onboarding is one route with two steps, not two routes.** `/onboarding` renders
  `OrganisationStep` or `FundingMandateStep` off `useOnboarding()`; nothing about the step
  is in the URL, and the collected fields stay in one place because step 3
  (`completeOnboarding`) posts them in a single body. The trade-off is browser back: it
  leaves onboarding rather than stepping backwards. The comps have no Back affordance on
  either step, so that was accepted rather than intercepted.
- **`app/(onboarding)/layout.tsx` is a _server_ component and stays that way.** It renders
  `<OnboardingProvider>` (client) wrapping `<OnboardingShell>` (server). Children passed
  from a server component into a client one keep their server-ness, so the sidebar, card
  and footer never reach the browser — only `Steps` and the two forms do. Put new chrome
  in the shell, not the provider.
- **Session storage is a refresh hint for the wizard, not its source of truth.** React
  state is; `saveOnboardingProgress` mirrors `{ step, data }` so a reload doesn't drop back
  to step 1 with empty fields. Restoring happens in an effect, not as seeded initial state,
  or the first client render would disagree with the server markup.
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
