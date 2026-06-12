---
name: tailwind
description: Tailwind CSS conventions for this codebase. Use when writing or editing Tailwind classes, translating Figma designs into className values, or applying conditional classes with cn(). Triggers on any JSX className edits, Figma-to-code work involving colors, or any use of cn().
---

# Tailwind Conventions

Apply these rules **every time** you write a Tailwind class. They override generic Tailwind habits.

## 1. Keep fixed classes in one string

Inside `cn()`, the static portion is a **single string**. Do not split it across multiple strings for "readability".

```jsx
// ❌ Don't
className={cn(
  "flex items-center",
  "gap-4 px-6 py-3",
  "rounded-md bg-deepBlue text-white",
)}

// ✅ Do
className={cn("flex items-center gap-4 px-6 py-3 rounded-md bg-deepBlue text-white")}
```

## 2. Classes live inside `className` / `cn()` / `cva()` only — not in variables

Do not extract Tailwind classes into variables, constants, or helpers. Try to apply them directly on the element.

```jsx
// ❌ Don't
const buttonClasses = "flex items-center px-4 py-2 rounded-md bg-deepBlue"
return <button className={buttonClasses} />

// ✅ Do
return <button className="bg-deepBlue flex items-center rounded-md px-4 py-2" />
```

The classnames should preferrably not leave the `className={""}` or `cn(...)` call.

### When extraction outside of className={} is justified, use `cva()` — never a plain string

If you've established a good reason to extract (and potentially confirmed with the prompter), the extraction **must** go through `cva()`. Never assign Tailwind classes to a plain `const`.

- If the component has variants (size, intent, state…), define them as `cva` variants. That's what `cva` is for.
- If it has no variants and you just need a shared base string, still wrap it: `cva("...")` with no variants. This helps the prettier-sort plugin and other validation / linting processes, keeps the codebase consistent and makes adding variants later trivial.

```jsx
// ❌ Don't — plain string assignment
const buttonClasses = "inline-flex items-center rounded-md px-4 py-2"

// ✅ Variants make sense
const buttonVariants = cva("inline-flex items-center rounded-md", {
  variants: {
    size: {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    },
  },
  defaultVariants: { size: "md" },
})

// ✅ No variants needed — still wrap in cva
const buttonVariants = cva("inline-flex items-center rounded-md px-4 py-2")
```

## 3. Conditional classes — use `cn()`

### 3.1. Boolean conditions

For "either-or" conditions, use `cn()` with this notation:

```jsx
// ✅ Do
className={cn(
  "flex",
  isLarge ? "size-96" : "size-8",
)}

// ✅ Do
className={cn(
  "flex",
  isHigh ? "h-96" : "h-8",
  isWide ? "w-58": "w-4"
)}
```

Do not use notations with \`${}\`.

```jsx
// ❌ Never
className={`flex ${isLarge ? "h-96" : "h-8"}`}

// ❌ Never
className={`${isLarge ? "h-96" : "h-8"} ${isWide ? "w-58": "w-4"}`}

// ❌ Never
className={cn(`flex ${isLarge ? "h-96" : "h-8"} ${isWide ? "w-58": "w-4"}`)}

// ❌ Never
className={cn("flex",`${isLarge ? "h-96" : "h-8"} ${isWide ? "w-58": "w-4"}`)}

```

### 3.2. Other conditions

For other conditions use the object notation inside `cn()`, inline on the element. Never build class names with template strings — enumerate every variant explicitly, even if the prop has many values.

```jsx
// ❌ Never
className={`justify-${align}`}
className={cn(`bg-${color}-500`)}

// ✅ Do
className={cn({
  "justify-start": align === "left",
  "justify-center": align === "center",
  "justify-end": align === "right",
})}
```

### 3.3. Arbitrary values

For arbitrary one-off values that can change during runtime (e.g. `height: ${height}$px`), use inline `style` instead of Tailwind OR use a css variable.

```jsx
// ❌ Never
let heightPx = useDynamicHeight()
return <div className={`h-[${heightPx}px]`}/>

// ✅ Do
let heightPx = useDynamicHeight()
style={{ height: `${heightPx}px` }}
```

```jsx
// ✅ Do
let centerX = useCoordinateX()
return <div className={"bg-[radial-gradient(circle_at_var(--center-x)_50%,...)]"} style={ "--center-x": `${centerX}%` }  />
```

For fixed one-off values, just write a custom tailwind class like this:

```jsx
// ✅ Do
className={"shadow-[0_8px_24px_-4px_rgba(0,0,0,0.10)]"}
```

## 5. Usage of Figma MCP

When using Figma MCP and Figma exposes a color via a CSS variable like `var(--color/brand/deep-blue, rgba(4,25,45,1))`, **do not** hardcode the hex/rgba. Find the corresponding name in the project's Tailwind config and use that.

- `--color/brand/deep-blue` → look for `deepBlue` (or similar camelCase) in the config.
- Mind the opacity: if the Figma value is `rgba(..., 0.6)`, use the Tailwind opacity modifier (`bg-deepBlue/60`, `text-deepBlue/60`), not a different color name.
- If no matching token exists, make the best possible implementation anyway. You may use hard coded hex values in that case, but summarize that in your response.

Always read the project's `global.css` before guessing token names.
