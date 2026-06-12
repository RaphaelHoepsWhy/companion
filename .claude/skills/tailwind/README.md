# Tailwind Skill — Reasoning

Background notes for the rules in `SKILL.md`. Not loaded by the agent — kept here for humans who want to understand _why_ the conventions exist.

## 1. Keep fixed classes in one string

In this project, we use prettier-tailwind, which is an established practise. It sorts classnames consistently to match the order of their application in the rendering and highlight potential conflicts like contradicting padding classes etc. Splitting into groups fights the sort and forces the next developer to guess your grouping logic.

Note: In VSCode/Cursoe use the `editor.wordWrap` setting to make sure long lines are visually wrapped in the Editor view. This makes sure you dont have to vertically scroll when working with very long className strings.

## 2. Classes live inside `className` / `cn()` / `cva()` only — not in variables

Outside `className`/`cn()`/`cva()`, prettier-sort and Tailwind IntelliSense (conflict detection, autocomplete, hover) stop working — you lose every guardrail.

## 3. Conditional classes — use `cn()` with object form

Tailwind's JIT only detects fully written class names — interpolated ones are silently dropped. Enumerating also decouples prop values (`"left"`) from Tailwind syntax (`justify-start`).
