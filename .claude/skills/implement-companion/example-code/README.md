# Companion — reference implementation

A frozen snapshot of the working Companion, used as the source of truth by the
`implement-companion` skill. **Do not edit these to fit a host project** — copy
them out and adapt the copies (see `../SKILL.md`).

```
components/companion/
  CompanionContextProvider.tsx   state + scroll debounce; wrap the app once
  CompanionInitializer.tsx       page defaults + show the companion; render once per page
  CompanionScrollArea.tsx        per-section payload; claims the companion at viewport center
  Companion/
    Companion.tsx                fixed pill shell + outside-click close (render at page root)
    CompanionViewSwitcher.tsx    size morph between default and search
    CompanionDefaultView.tsx     pill contents: search / icon buttons / CTA
    CompanionSearchView.tsx      search overlay (result list is placeholder)
    components/
      CompanionCta.tsx           the CTA button (next/link)
      CompanionIconButton.tsx    icon button + tooltip
      AnimateWidth.tsx           fade-out → resize → fade-in width morph helper
      AnimatedLabel.tsx          per-letter stagger-in label

components/ui/tooltip.tsx        Radix tooltip (reuse the host's if it has one)
utilities/ui.ts                  cn() — clsx + tailwind-merge
utilities/animation.ts           twEaseIn / twEaseInOut / twEaseOut
app/page.tsx                     full wiring example
app/globals.css                  optional letter-bounce keyframe (commented out)
```

Built for: `motion` v12 (`motion/react`), `lucide-react`, Next.js App Router,
Tailwind v4. Dark-only by design.
