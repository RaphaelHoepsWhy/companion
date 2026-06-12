---
name: folder-structure
description: Project folder and file naming conventions for this Next.js codebase. Use when creating new folders, files, components, hooks, or deciding where to place code. Triggers on file/folder creation, component scaffolding, refactoring file locations, or questions about where code should live.
---

# Folder & File Structure

Apply these rules **before** creating any folder or file. When in doubt about placement, ask.

## Folder naming

| Casing               | Meaning                                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CamelCase`          | A **component folder**. Contains the root component, its private subcomponents, hooks, queries. Only the root component (matching folder name) may be imported from outside. |
| `kebab-case`         | A **feature group**. Bundles related items; siblings are independently importable.                                                                                           |
| `lowercase` reserved | `components`, `hooks`, `assets`, `fonts`, `lib`, `utils` — hold only items of that kind.                                                                                     |

### Component folder example

```
MyList/
  MyList.tsx          ← root, only public export
  MyListItem.tsx      ← private to MyList
  hooks/
    useMyListItemAnimation.ts
```

If something inside a `CamelCase` folder gets imported elsewhere, **move it out** to a shared location.

If a component does not need any other files and just stands for its own, it does not need a dedicated wrapper folder.

```
// ❌ Never
components/
  MyComponent/
    MyComponent.tsx  ← the only file in the folder

// ✅ Do
components/
  MyComponent.tsx
```

However when the component gets subcomponents or other helper files etc. refactor this and create a folder.

### Feature group example

```
data-tables/
  StockTable/
  DataTable/
  MiniTable/
  AnimatedTableRow/
  utils.ts
```

## Placement decision

```
Used by exactly one page?      → place next to that page.tsx (in its components/, hooks/)
Used by multiple places?       → src/components, src/hooks, src/lib (top-level)
Private to one component?      → inside that CamelCase folder
```

Page-local example:

```
app/[locale]/
  game/
    components/
    hooks/
    page.tsx
  (main)/
    components/
      HomepageHero/
      HomepageScrollAnimation/
    page.tsx
    layout.tsx
```

Refactor freely: when a page-local component starts being reused, move it to the shared folder. Don't leave it stranded.

## Component files

- **One component per file.** Filename matches the component name (`Headline.tsx` → `Headline`).
- Default export, typed props:

  ```tsx
  export type ItemProps = {
    children: ReactNode
  }

  export default function Item({ children }: ItemProps) {
    // ...
  }
  ```

- **Exception:** shadcn/ui-style files may use multiple named arrow components per file with `displayName` exports.

## Quick checklist before creating

- [ ] Is this used by one component/page or many? → picks the location
- [ ] Is the folder a single component or a group? → picks `CamelCase` vs `kebab-case`
- [ ] Does the file name match the exported component?
- [ ] One component per file (unless shadcn/ui)?
- [ ] Did I avoid putting reusable code inside another component's `CamelCase` folder?
