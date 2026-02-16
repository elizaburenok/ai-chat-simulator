# Input Message — Token scan (sizes, colors, typography, spacings)

Component: **Input Message** (Figma node 44:4750)  
Purpose: map every visual property to `@tokens`; no implementation yet.

---

## 1. Colors

| Figma variable / usage | Raw value | Map to @tokens | Notes |
|------------------------|-----------|----------------|-------|
| **Popup/Primary** (input background) | `#ffffff` | `colors.bg.default` or `colors.page.primary` | CSS: `--color-bg-default`, `--color-popup-primary` |
| **Primitive/Primary** (input text) | `#191919` | `colors.primitive.primary` | CSS: `--color-primitive-primary` |
| **Primitive/Neutral 4** (placeholder, secondary icons) | `#949494` | `colors.primitive.neutral4` | CSS: `--color-primitive-neutral-4` |
| **Primitive/Neutral 3** (disabled send button bg, disabled state) | `#c8c8c8` | `colors.primitive.neutral3` | CSS: `--color-primitive-neutral-3` |
| **Primitive/Brand** (active send button bg) | `#835de1` | `colors.primitive.brand` | CSS: `--color-primitive-brand` |
| **Translucent/Primitive/Neutral 3** | `#19191940` (rgba 25,25,25,0.25) | ❌ **Missing** | No `translucent.primitiveNeutral3` in tokens; only `translucent.primitiveNeutral4` exists. Use for hover/overlay on icons if needed. |
| **Translucent/Primitive/Neutral 2** | `#19191933` (rgba 25,25,25,0.2) | ❌ **Missing** | No token. Could reuse `colors.state.containerTransparent1Active` (0.1) or add token. |
| Send icon on brand (e.g. arrow) | On `#835de1` | `colors.primitive.primaryOnInverse` | `#ffffff` — CSS: `--color-primitive-primary-on-inverse` |
| Icon default (attach, emoji, mic) | Same as placeholder | `colors.primitive.neutral4` | As above |

**Summary — colors:**  
- All main fills and text map to existing `colors.*` and CSS vars.  
- Add or alias **Translucent/Primitive/Neutral 3** and **Neutral 2** if you use them for icon hover/overlay.

---

## 2. Typography

| Figma variable / usage | Raw value | Map to @tokens | Notes |
|------------------------|-----------|----------------|-------|
| **TTN 400/M** (input text) | Family: TT Norms Tochka Extended, 16px, 400, line-height 20, letterSpacing 1 | See below | — |
| Font family | TT Norms Tochka Extended | `typography.fontFamily.primary` | CSS: `--font-family-primary` |
| Font size | 16px | `typography.fontSizes.m` | CSS: `--font-size-m` |
| Font weight | 400 | `typography.fontWeights.regular` | CSS: `--font-weight-regular` |
| Line height | 20px | `typography.lineHeights.m` | CSS: `--line-height-m` |
| Letter spacing | Figma: `1` (likely 1px) | `typography.letterSpacing.m` → `0.16px` | **Check:** tokens use `0.16px`; Figma shows `1`. If design is 1px, add a token or use `1px` and note. |
| Predefined style | — | ❌ **No TTN-400-M** in `typography.styles` | Styles only have TTN-500-M-01, TTN-600-XS-01, TTN-400-XS-01. Add `TTN-400-M` (16px, 400, 20px, 0.16px or 1px) if you want a single style token. |

**Summary — typography:**  
- Map input to: `fontFamily.primary`, `fontSizes.m`, `fontWeights.regular`, `lineHeights.m`, `letterSpacing.m`.  
- Confirm letter-spacing (0.16px vs 1px) with design.  
- Optionally add `typography.styles['TTN-400-M']` and use it for the input.

---

## 3. Sizes

| Element | Figma / design | Map to @tokens | Notes |
|---------|----------------|----------------|-------|
| **Input container (pill) height** | From layout (e.g. 48–52px) | `getSpacing(12)` → 48px or measure in Figma | No fixed “input height” token; use spacing scale (4px base). |
| **Border radius (pill)** | **Rounding 6x** = **24px** | `getRounding(6)` → 24px | `rounding` object has only `1x` (4px). Use **`getRounding(6)`** from `@tokens/rounding` or add `rounding['6x'] = '24px'` to match Figma. CSS: add `--rounding-6x: 24px` if desired. |
| **Icon size (attach, emoji, mic)** | From frame (e.g. 24×24) | `getSpacing(6)` → 24px for touch target; icon asset size per spec | Reuse spacing scale for hit area. |
| **Send button (circle)** | From frame (e.g. 40×40 or 44×44) | `getSpacing(10)` or `getSpacing(11)` | No “button size” token; use `getSpacing(n)`. |
| **Send icon (arrow)** | Inside circle (e.g. 20×20) | `getSpacing(5)` → 20px or icon size | — |

**Summary — sizes:**  
- **Radius:** use **`getRounding(6)`** (24px); consider adding `rounding['6x']` and `--rounding-6x` for parity with Figma.  
- All other sizes: derive from `getSpacing(n)` (4px base); exact `n` from Figma layout.

---

## 4. Spacings (padding, gaps)

| Area | Suggested usage | Map to @tokens | Notes |
|------|-----------------|----------------|-------|
| Horizontal padding (pill inner) | Left/right inside pill | `spacing['6x']` (24px) or `getSpacing(5)` (20px) | Match Figma padding; use `spacing['6x']` or `getSpacing(n)`. |
| Vertical padding (pill inner) | Top/bottom | `getSpacing(2)` (8px) or `getSpacing(3)` (12px) | Same. |
| Gap between prefix icons (e.g. + and emoji) | Icon-to-icon | `getSpacing(1)` or `getSpacing(2)` (4px / 8px) | — |
| Gap between last prefix icon and text | | `getSpacing(2)` (8px) | Same as SearchInput icon margin. |
| Gap between text and send button | | `getSpacing(2)` or `getSpacing(3)` | — |
| Gap between emoji and microphone (suffix) | | `getSpacing(1)` or `getSpacing(2)` | — |

**Summary — spacings:**  
- Use **`spacing['1x']`**, **`spacing['6x']`**, **`spacing['8x']`**, **`spacing['12x']`** or **`getSpacing(n)`** for all internal padding and gaps.  
- Exact values to be read from Figma (inspect padding/gaps); no new token types needed.

---

## 5. Effects (shadow)

| Figma variable / usage | Raw value | Map to @tokens | Notes |
|------------------------|-----------|----------------|-------|
| **Surfaces/Card** | DROP_SHADOW: color `#0000000D`, offset (0, 5), blur 15, spread 0 | ❌ **Missing** | No shadow tokens in `tokens/`. Add e.g. `shadows.card` or use CSS var `--shadow-surfaces-card` if you add it. |

**Summary — effects:**  
- If the input uses the card shadow, add a **shadow token** (and optional CSS var) and link the component to it.

---

## 6. Token gaps (add or extend)

| Gap | Recommendation |
|-----|-----------------|
| **Rounding 6x (24px)** | Add `rounding['6x'] = '24px'` and `--rounding-6x: 24px` so the pill uses a named token. |
| **TTN-400-M style** | Add `typography.styles['TTN-400-M']` (16px, 400, 20px, letterSpacing per spec). |
| **Letter spacing** | Align Figma “1” with token: either use `0.16px` (current `letterSpacing.m`) or add 1px and use for input. |
| **Translucent Neutral 2 / 3** | Add to `colors.translucent` (and CSS) if used for icon hover/overlay. |
| **Surfaces/Card shadow** | Add `shadows` (or `effects`) in tokens + CSS var for card/input shadow. |

---

## 7. Quick reference — use in component

- **Background:** `colors.bg.default` / `var(--color-bg-default)`  
- **Text:** `colors.primitive.primary` / `var(--color-primitive-primary)`  
- **Placeholder / icons:** `colors.primitive.neutral4` / `var(--color-primitive-neutral-4)`  
- **Disabled text / disabled send bg:** `colors.primitive.neutral3` / `var(--color-primitive-neutral-3)`  
- **Send active bg:** `colors.primitive.brand` / `var(--color-primitive-brand)`  
- **Send icon (on brand):** `colors.primitive.primaryOnInverse` / `var(--color-primitive-primary-on-inverse)`  
- **Font:** `typography.fontFamily.primary`, `fontSizes.m`, `fontWeights.regular`, `lineHeights.m`, `letterSpacing.m` (or new TTN-400-M)  
- **Radius:** `getRounding(6)` or future `rounding['6x']`  
- **Padding / gaps:** `spacing['1x']`, `spacing['6x']`, `getSpacing(n)`  
- **Shadow:** define and use a card/input shadow token once added.

This scan links every size, color, typography, and spacing to `@tokens` and records what’s missing so the Input Message can be built token-driven later.
