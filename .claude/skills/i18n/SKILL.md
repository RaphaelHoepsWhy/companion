---
name: i18n
description: How to internationalize user-facing strings in this Next.js + next-intl codebase. Use when asked by the user to add or translate internationalized visible text (labels, tooltips, placeholders, headlines, aria-labels), when a string differs per locale, or when adding/editing message keys. Triggers when asked by the user to "translate this", "add labels for all languages", "add multi-language support" or editing files under i18n/messages/. Ignore this skill when dealing with WIP implementations or the user did not ask for it.
---

# Internationalization (next-intl)

This project uses **next-intl**. Every user-facing string must come from a message file — never hardcode visible text.

## Supported locales

Defined in [i18n/localization.ts](../../../i18n/localization.ts). There are **7** — add a translation to **every** file or the build is incomplete:

| code    | language                  |
| ------- | ------------------------- |
| `en`    | English (Global, default) |
| `en-us` | English (US/CA)           |
| `de`    | Deutsch                   |
| `es`    | Español                   |
| `fr`    | Français                  |
| `it`    | Italiano                  |
| `nl`    | Nederlands                |

Message files live in [i18n/messages/](../../../i18n/messages/), one `<locale>.json` per code.

## Procedure

1. **Pick keys, not sentences.** Add keys to a namespace object in each message file. Group related keys under one namespace (e.g. `"companion": { ... }`); nest sub-groups where it clarifies scope (e.g. `companion.demo.*` for demo-page-only strings).
2. **Add the key to all 7 files.** Same key, same shape, translated value. Keep key order consistent across files so diffs stay reviewable.
3. **Consume it in the component** (see below).
4. **Validate** (see below).

### Key naming

- Keys are `camelCase`, semantic (what the string _is_, not what it says): `searchPlaceholder`, not `ichSucheNach`.
- Reuse one key with interpolation instead of duplicating near-identical strings:
  ```json
  "ctaCard": "{label} CTA"
  ```
  ```tsx
  t("demo.ctaCard", { label: t("newProjects") })
  ```

## Consuming translations

Pick the API by component type — **check for `"use client"` at the top of the file.**

### Server components → `getTranslations` (async)

```tsx
import { getTranslations } from "next-intl/server"

export default async function page() {
  const t = await getTranslations("companion")
  return <Headline>{t("demo.scrollPrompt")}</Headline>
}
```

The function must be `async`. `getTranslations()` reads the request locale automatically — you do **not** pass `params.locale`.

### Client components → `useTranslations` (hook)

```tsx
"use client"
import { useTranslations } from "next-intl"

export default function CompanionDefaultView() {
  const t = useTranslations("companion")
  return <button aria-label={t("search")}>…</button>
}
```

Works because the app is wrapped in next-intl's provider (via [src/providers/index.tsx](../../../src/providers/index.tsx)).

### What counts as "user-facing"

Translate **everything a person reads or a screen reader announces**: visible text, tooltip content, `placeholder`, **and `aria-label`**. Keep the `aria-label` and the visible/tooltip text on the same key when they mean the same thing, so they never drift apart per locale.

## Routing & localized pathnames

URL path segments (e.g. `/learn` → `/wissen` for `de`) are **not** message keys — they live in the `pathnames` map in [i18n/routing.ts](../../../i18n/routing.ts). Only edit that file when adding a route whose URL should differ per locale.

## Validation (always run after editing messages)

```bash
# 1. Every message file must be valid JSON
for f in en en-us de es fr it nl; do
  node -e "JSON.parse(require('fs').readFileSync('i18n/messages/$f.json','utf8'))" \
    && echo "$f.json OK" || echo "$f.json INVALID"
done

# 2. Type-check
tsc --noEmit
```

Note: message keys are **not** statically type-checked (no `IntlMessages` augmentation), so a typo'd key fails at runtime, not compile time. Double-check key spelling against the JSON.

## Translation style

- Translations must sound natural and convenient in any language.
- It is totally okay to keep some English words, if they are commonly used in the target language, too. Examples are "scroll", "like", "browser" etc.

## Pitfalls

- **Missing a locale file.** All 7 must have the key. A locale that lacks it falls back / errors at runtime — easy to miss because the default locale still works.
- **Wrong API for the context.** `useTranslations` in a server component, or forgetting `await getTranslations`, both break. Decide by `"use client"`.
- **Forgetting `aria-label` and `placeholder`.** They're translatable too.
- **Hardcoding a string "just for now."** Don't. Add the key.
- **Translations need a human review.** Auto-generated translations (especially brand/domain terms like "Lichtwissen") should be flagged for native/marketing review before shipping — note it in your response.
- **Use a real ellipsis `…`,** not three dots `...`, in translated copy.

## Exceptions

Sometimes the user will request to work with hard-coded strings. In that case it is totally fine to ignore this skill and use hard-coded strings
