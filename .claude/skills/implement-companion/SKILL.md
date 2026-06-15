---
name: implement-companion
description: Set up the Companion — a fixed, scroll-aware pill at the bottom of the page that morphs between a default action bar (search, CTA, icon buttons) and a full search overlay. Use when the user asks to add, install, port, or implement "the companion" into a codebase. Triggers on "add the companion", "set up the companion", "implement-companion".
---

# Implement Companion

The Companion is a living, scroll-aware brand surface: a fixed pill centered at the bottom of the viewport that adapts to the section the user has settled on. As they scroll, it swaps in that section's CTA and icon buttons; clicking search expands it into a full overlay. It is built from the reference implementation in [example-code/](example-code/) — treat those files as the source of truth for behavior, and port them into the current codebase, **rebranded** to match the host.

Do not invent a new design. Port the reference, then adapt only the surface styling (colors, radius, font, shadow) to the host brand.

## What it is made of

The system is self-contained under `components/companion/`:

| File                                  | Role                                                                                                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CompanionContextProvider.tsx`        | State: which view (`default`/`search`), which area is centered, the active CTA + icon buttons. Debounces scroll so fast scroll-throughs don't thrash. Wrap the app once. |
| `CompanionInitializer.tsx`            | Sets the page-level default CTA/icon buttons and flips the companion from `hidden` → `default`. Render once per page. Returns `null`.                                    |
| `CompanionScrollArea.tsx`             | Wraps a section; when it crosses the viewport center it claims the companion and shows its `cta` / `iconButtons`.                                                        |
| `Companion/Companion.tsx`             | The fixed pill shell + outside-click-to-close. The thing you render at the page root.                                                                                    |
| `Companion/CompanionViewSwitcher.tsx` | Animates the size morph between default pill and the search overlay.                                                                                                     |
| `Companion/CompanionDefaultView.tsx`  | The pill contents: search trigger, icon buttons, CTA (or a fake search input when empty).                                                                                |
| `Companion/CompanionSearchView.tsx`   | The expanded search overlay (input + result list). The result list is **placeholder data** — wire it to real search.                                                     |
| `Companion/components/*`              | `CompanionCta`, `CompanionIconButton`, `AnimateWidth` (width-morph helper), `AnimatedLabel` (per-letter stagger).                                                        |

## Dependencies it needs

Try to reuse as much as possible in the host app. Reuse dependencies, constants, helper functions. Reuse the ui/tooltip component if present.

Here is a more in-depth list of the dependencies:

- **`motion`** (v12+) — imported as `motion/react`. This is the renamed `framer-motion`. If the host still has `framer-motion`, install `motion` instead — do not mix.
- **`lucide-react`** — icons (`Search`, `ChevronDown`, `ArrowRight`, …).
- **`next`** App Router — `CompanionCta` uses `next/link`. If the host is not Next.js, swap `Link` for the host's router link (or a plain `<a>`).
- **A `cn()` helper** — clsx + tailwind-merge. See [example-code/utilities/ui.ts](example-code/utilities/ui.ts). Reuse the host's if it already has one; otherwise add it.
- **Easing constants** — `twEaseIn`/`twEaseInOut`/`twEaseOut`. See [example-code/utilities/animation.ts](example-code/utilities/animation.ts).
- **A Radix-based tooltip** — `Tooltip*` from `components/ui/tooltip`. See [example-code/components/ui/tooltip.tsx](example-code/components/ui/tooltip.tsx). If the host already has a tooltip (e.g. shadcn), reuse it and drop the example one.
- **Tailwind v4** — classes assume Tailwind. If the host is on v3 or another system, translate the utility classes.

## Setup steps

1. **Locate the target.** Find the host's `components/` folder (the convention is a top-level `components/`) or create one.

2. **Copy the companion tree** from [example-code/components/companion/](example-code/components/companion/) into the host's `components/companion/`, preserving the folder structure (the `Companion/` component folder with its private `components/` subfolder).

3. **Resolve the supporting deps** (cn, easings, tooltip) per the table above — reuse the host's equivalents where they exist, otherwise copy from `example-code/`. Fix import paths so they point at the host's actual locations.

4. **Wire it into the app** — wrap the page (or layout) once and render the pieces. See [example-code/app/page.tsx](example-code/app/page.tsx) for the full pattern:
   - `<CompanionContextProvider>` around everything.
   - `<CompanionInitializer />` (with optional page-default `cta` / `iconButtons`).
   - `<CompanionScrollArea cta={...} iconButtons={[...]}>` around each section that should drive the companion.
   - `<Companion />` once, as the last child inside the provider.

5. \*\*Rebrand — See the section below.

## Rebranding to the host (do this carefully)

The reference is intentionally neutral: a dark `neutral-*` pill with a white CTA. **Match the host's brand instead of leaving it neutral.**

1. **Color.** Check `tailwind.config.*`, the global CSS `@theme`, and existing components for the palette. Stick to the colors used in the app.

2. **Sizes** Keep the sizes (padding, font-size etc.) as they are in the example-code. The target app my have a complex spacing system that differs from standard tailwind. Do not adapt this for this compoenent.

3. **motion.** Do **not** change the easings, durations, or the morph choreography — the feel is the point. Rebrand surfaces, not timings.

## Verify

- The pill appears centered at the bottom and animates in.
- Scrolling between `CompanionScrollArea` sections swaps the CTA / icon buttons, and a quick scroll-past does **not** flip it (the 100 ms debounce).
- Clicking search expands to the overlay; clicking outside or the chevron collapses it.
- Colors, radius, and shadow read as the host brand — not as neutral gray.
- Typecheck / lint passes and there are no `framer-motion` ↔ `motion` import clashes.
