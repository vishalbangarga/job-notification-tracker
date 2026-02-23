## Job Notification App – Design System Foundation

This document describes the **foundational design system** for the Job Notification App. It focuses on tokens, layout, and core components. It does **not** define product features.

---

## 1. Design Principles

- **Calm**: Low visual noise, generous whitespace, predictable layouts.
- **Intentional**: Limited, purposeful color and type scales; consistent spacing.
- **Coherent**: Same patterns for hierarchy, cards, forms, and status.
- **Confident**: Strong typography, clear affordances, no gimmicks.

No gradients. No glassmorphism. No neon. No playful or hackathon-style visuals.

---

## 2. Foundations (Tokens)

### 2.1 Color System

All colors are defined as tokens. Neutrals (background and text) plus three semantic hues (accent, success, warning). No additional hex colors are allowed.

- **Background**
  - `--color-bg`: `#F7F6F3`
- **Text**
  - `--color-text`: `#111111`
- **Accent**
  - `--color-accent`: `#8B0000` (deep red – primary action color)
- **Success**
  - `--color-success`: `#3F6F4A` (muted green)
- **Warning**
  - `--color-warning`: `#B1791F` (muted amber)

Derived values (borders, subtle dividers, focus rings) use **opacity** on existing colors, not new hex values (for example, `rgba(17, 17, 17, 0.08)` for borders).

### 2.2 Typography

- **Headings (Serif)**
  - Font family stack:
    - `--font-family-heading`: `"Georgia", "Times New Roman", serif`
- **Body (Sans-Serif)**
  - Font family stack:
    - `--font-family-body`: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

**Base sizes and line heights**

- Body text:
  - `--font-size-body`: `16px`
  - `--font-size-body-large`: `18px`
  - `--line-height-body`: `1.7`
- Headings:
  - `--font-size-heading-xl`: `32px`
  - `--font-size-heading-lg`: `24px`
  - `--font-size-heading-md`: `20px`
  - `--line-height-heading`: `1.3`

**Text width**

- `--max-text-width`: `720px`

All headings and body text must use these tokens—no ad-hoc font sizes.

### 2.3 Spacing System

Only the following spacing values are allowed anywhere in the UI (margin, padding, gaps):

- `--space-8`: `8px`
- `--space-16`: `16px`
- `--space-24`: `24px`
- `--space-40`: `40px`
- `--space-64`: `64px`

No other spacing values may be used (for example, **no** `13px`, `27px`, etc.).

### 2.4 Radius and Borders

- **Border radius**
  - `--radius-sm`: `4px`
  - This is the global radius for buttons, inputs, cards, and badges.
- **Borders**
  - Use 1px borders with low-opacity text color:
    - `--border-subtle`: `1px solid rgba(17, 17, 17, 0.08)`
    - `--border-strong`: `1px solid rgba(17, 17, 17, 0.16)`

No drop shadows on cards; depth is communicated via spacing and border contrast only.

### 2.5 Motion

- Duration:
  - `--transition-fast`: `150ms`
  - `--transition-default`: `180ms`
  - `--transition-slow`: `200ms`
- Timing:
  - `--transition-ease`: `ease-in-out`

Applies to:

- Background color changes
- Border color changes
- Text color changes

No bounce, parallax, or attention-grabbing animations.

---

## 3. Global Layout Structure

Every screen follows the same macro layout:

1. **Top Bar**
2. **Context Header**
3. **Workspace Row**
   - Primary Workspace (70%)
   - Secondary Panel (30%)
4. **Proof Footer**

### 3.1 Top Bar

Layout:

- Left: App name – `Job Notification App`
- Center: Progress indicator – `Step X / Y`
- Right: Status badge – `Not Started`, `In Progress`, `Shipped`

Behavior:

- Uses serif for the app name (to anchor brand) and sans-serif for meta information (step and status).
- Top bar height uses `--space-64`.

### 3.2 Context Header

Structure:

- Large serif headline (`heading-xl`)
- Single-line subtext (`body-large`), constrained to `--max-text-width`

Content rules:

- Clear, factual purpose.
- No hype, no marketing superlatives.

### 3.3 Primary Workspace (70%)

- Layout:
  - Cards arranged in a single column with vertical spacing of `--space-24` or `--space-40`.
  - Within cards, internal spacing uses `--space-16` or `--space-24`.
- Visual treatment:
  - Background: `--color-bg`
  - Card background: same as page background
  - Card border: `--border-subtle`
  - Radius: `--radius-sm`

Content:

- Focused on the main task of the current step.
- No visual crowding; use spacing tokens to separate sections.

### 3.4 Secondary Panel (30%)

- Purpose:
  - Explain the current step.
  - Provide a copyable “prompt” or instruction block.
  - Surface consistent supporting actions (for example, primary/secondary buttons).

Structure:

- Panel container uses `--border-subtle` and `--space-24` internal padding.
- Contains:
  - Panel title (`heading-md`)
  - Brief description (`body`)
  - Copyable prompt box
  - Button group

Copyable prompt box:

- Monospace or body font (no decorative font).
- Fixed-width background derived from text color using opacity; no new hex.
- Uses `--space-16` padding and `--space-16` vertical margin to separate from text.

### 3.5 Proof Footer

Always present at the bottom of the page.

Structure:

- Horizontal or vertical checklist using the same pattern:
  - □ UI Built
  - □ Logic Working
  - □ Test Passed
  - □ Deployed

Implementation options:

- Native checkboxes styled with `--border-subtle`, or
- Typography-only representation using the `□` character and aligned labels.

The proof footer uses subtle borders and `--space-16` / `--space-24` padding.

---

## 4. Core Components

### 4.1 Buttons

Shared base:

- `--radius-sm`
- Horizontal padding: `--space-16`
- Vertical padding: `--space-8`
- Typography: body font, medium weight
- Transitions:
  - Background, border, and text colors use `--transition-default` and `--transition-ease`.

#### Primary Button

- Background: `--color-accent`
- Text color: `--color-bg`
- Border: none or `1px solid rgba(17, 17, 17, 0.0)` to keep sizing consistent
- Hover:
  - Slight darken via opacity or filter, no new hex.
- Focus:
  - Outline using `rgba(139, 0, 0, 0.4)` and `--transition-default`.

#### Secondary Button

- Background: transparent (page background shows through)
- Border: `1px solid rgba(17, 17, 17, 0.16)` or accent at low opacity
- Text color: `--color-text`
- Hover:
  - Background: subtle overlay using text color with very low opacity.

All buttons share the same radius and spacing tokens. No icon-only variants are defined at this stage.

### 4.2 Inputs

Applies to text inputs, textareas, and select elements.

- Height:
  - Vertical padding: `--space-8`
  - Horizontal padding: `--space-16`
- Border:
  - Default: `--border-subtle`
  - Focus: `1px solid rgba(139, 0, 0, 0.7)` with no change in radius.
- Background: `--color-bg`
- Placeholder:
  - Lower opacity version of `--color-text`.

Error state:

- Border color is derived from `--color-accent` or `--color-warning` with opacity.
- Error message:
  - Text color: `--color-accent`
  - Font size: `--font-size-body`
  - Margin-top: `--space-8`

### 4.3 Cards

Cards are used in both the primary workspace and secondary panel.

- Background: `--color-bg`
- Border: `--border-subtle`
- Radius: `--radius-sm`
- Padding:
  - Outer: `--space-24`
  - Internal element spacing: `--space-16`
- No shadows, no elevation tricks.

Card header:

- Heading (`heading-md` or `heading-lg`)
- Optional meta text (`body`) below the heading with `--space-8` spacing.

### 4.4 Status Badge

Used in the top bar to reflect step status.

- Shape:
  - Pill with `--radius-sm` and horizontal padding `--space-16`, vertical padding `--space-8`.
- Typography:
  - Uppercase or small caps using `--font-size-body`.
- Colors:
  - Not Started: border and text use low-opacity `--color-text`.
  - In Progress: border and text use `--color-warning`.
  - Shipped: border and text use `--color-success`.

Backgrounds for badges are derived via opacity from the same colors, no new hex.

---

## 5. Interaction Rules

### 5.1 Transitions

- Duration:
  - 150–200ms, using tokens:
    - `--transition-fast`
    - `--transition-default`
    - `--transition-slow`
- Timing:
  - Always `ease-in-out`.

Applies to:

- Hover states for buttons and interactive cards.
- Focus states (border and outline color changes).

No:

- Bounce
- Parallax
- Excessive motion or continuous animations

### 5.2 Focus Management

- Focus states must be as visible as hover states.
- Use border and outline changes with accent or semantic colors.
- Do not rely only on color; shape (outline) and contrast must signal focus.

---

## 6. Error & Empty States

### 6.1 Error States

Error presentation:

- Use an error banner or inline error component.
- Background:
  - Derived from `--color-accent` at low opacity.
- Text:
  - Uses `--color-accent`.
- Layout:
  - Full-width within the card or section.
  - Padding: `--space-16`.

Content rules:

- Clearly explain **what went wrong**.
- Clearly state **how to fix it**.
- Never blame the user (for example, use “We couldn’t save your changes because…” instead of “You did X wrong.”).

### 6.2 Empty States

Empty state pattern:

- Located inside cards or primary workspace area.
- Uses:
  - Title (`heading-md`)
  - Short explanation (`body`)
  - Single, clear next action (primary or secondary button).

There should never be a blank screen. Empty states must guide the user to the next meaningful step using the same calm, confident tone as the rest of the UI.

---

## 7. Implementation Notes

- Use CSS custom properties for all tokens defined above.
- Enforce spacing and typography via utility classes and component-level styles.
- Avoid ad-hoc styling; every new visual property should map to an existing token.

This design system is the **foundation** only. Product-specific flows, data, and interactions should be implemented separately using these primitives.

