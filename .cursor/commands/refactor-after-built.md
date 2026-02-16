## Refactor after built

description: Post-check after implementing or editing a UI component (e.g. from Figma MCP). Use with this project's CSS + design tokens setup.

globs: ["**/*.tsx", "**/*.css"]

alwaysApply: false

---

React + CSS + Figma MCP: post-check for components (with design tokens)

ALWAYS follow this checklist after you have implemented or edited a UI component

(especially one generated from Figma via MCP). This project uses **plain CSS** and

**design tokens** (`src/tokens/css-variables.css` and `src/tokens/*.ts`) as the

single source of truth — no Tailwind.

1. **Visual comparison with Figma**
- If the task includes a link to a Figma frame or component, compare the current render with the design.
- Explicitly check and fix if needed: padding, margin, gap, border-radius, box-shadow, and the sizes of hierarchical blocks.
- Preserve visual hierarchy: the primary content should stand out in the same way as in Figma (font size, weight, contrast).
1. **Exact geometry and design tokens**
- Prefer existing design tokens from `src/tokens/css-variables.css` (e.g. `var(--color-*)`, `var(--spacing-*)`, `var(--rounding-*)`, `var(--font-*)`) over hard-coded values in CSS.
- In TS/TSX, use exports from `src/tokens` (e.g. `typography`, `colors`, `spacing`, `rounding`) when setting inline styles or computing values.
- Use tokens that best match the Figma values. Do NOT invent new arbitrary hex/px values if a suitable token already exists.
- If there is a mismatch between the component and Figma, first fix the mapping to the correct token (or add a new token) instead of tweaking random pixel values.
1. **Token usage in CSS / styles**
- In component `.css` files, use `var(--token-name)` from the tokens CSS file. Avoid hard-coded colors, spacing, or radii unless no token exists.
- If you must hard-code a value (no matching token yet), keep it temporary and consider adding a new variable to `src/tokens/css-variables.css` (and TS if needed) instead of spreading magic numbers.
1. **Class composition (TSX)**
- For conditional or dynamic class names, use a small helper (e.g. `cn` from `@/lib/utils` or `clsx`) so that static and conditional parts are readable. Avoid long manual `classes.push(...); className={classes.join(' ')}` when a single expression is clearer.
- If the codebase does not yet have `cn`, follow the existing rule in `cn.mdc` (create from `@/lib/utils` or use `clsx`).
1. **Hover states and smoothness**
- For interactive elements (buttons, links, cards), add hover states that match the design: changes in color, shadow, scale, or opacity.
- Use CSS `transition` in the component’s `.css` file (e.g. `transition: background-color 0.2s ease`, `transition: transform 0.2s ease`).
- If using React transition APIs (e.g. for loading or filtering), apply them where they improve UX.
1. **will-change and performance**
- For elements whose `transform` or `opacity` changes on hover or during animation, add `will-change: transform` and/or `will-change: opacity` in the component’s `.css` (or a shared utility class).
- Do not apply `will-change` to many elements without a clear reason.
1. **Check in DevTools**
- Open the component in the browser and briefly check FPS / smoothness of animations and hover states in DevTools (Performance / Rendering).
- If animations stutter or layout is recalculated too often, simplify effects or adjust structure.

**Always at the end:**

- Briefly describe which differences from Figma you found and how you fixed them (especially padding / shadows / layout).
- Confirm that the implementation uses design tokens from `src/tokens` (CSS variables and/or TS exports) wherever possible instead of hard-coded values.
- Ensure the component remains responsive (breakpoints and content do not break at common screen widths).