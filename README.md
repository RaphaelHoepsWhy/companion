# Companion Demo

A demo app with a single goal: showcasing the **Companion** UI component — a floating pill anchored to the bottom of the viewport that adapts to the content the user is looking at.

## What it demonstrates

- **Scroll-driven content** — wrap any section in a `CompanionScrollArea` and the companion picks up its CTA and icon buttons when the section crosses the viewport center (debounced, so fast scroll-throughs don't thrash it).
- **Size animations** — the pill animates its width when content swaps (`AnimateWidth`), labels stagger in letter by letter (`AnimatedLabel`), and icon buttons grow/shrink in and out.
- **Search view** — clicking the search icon expands the pill into a large search panel with staggered list items; clicking outside or the chevron collapses it.

## Getting started

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) and scroll.

## Structure

```
components/companion/
  CompanionContextProvider.tsx   # state: view, variant, active scroll area
  CompanionInitializer.tsx       # per-page defaults, shows/hides the companion
  CompanionScrollArea.tsx        # registers a section + its companion payload
  Companion/
    Companion.tsx                # the floating pill shell
    CompanionViewSwitcher.tsx    # default ⇄ search transition
    CompanionDefaultView.tsx
    CompanionSearchView.tsx
    components/                  # AnimateWidth, AnimatedLabel, buttons, CTA
```
