# Compass Design System & UI Specs

This document defines visual guidelines, layout metrics, custom Tailwind v4 color tokens, and unique interaction patterns used in the Compass interface.

---

## Typography

- **Headlines:** **Manrope** (Bold/Extra Bold) — Used for page titles, card headers, and main nav labels to give a clean, premium editorial feel.
- **Body:** **Inter** (Regular/Medium) — Used for all descriptions, lists, inputs, and standard text to guarantee readability.
- Both fonts are loaded via Google Fonts imported directly in `index.css`.

---

## Design Tokens

### Active Dark Theme

These custom tokens live in the `@theme` block of `client/src/index.css` and map automatically to Tailwind classes (e.g. `--color-primary` becomes `bg-primary` / `text-primary`).

| CSS Variable             | Tailwind Utility    | Color Hex | Used For                                 |
| :----------------------- | :------------------ | :-------- | :--------------------------------------- |
| `--color-bg`             | `bg-bg`             | `#1a1c1e` | Main page backgrounds                    |
| `--color-surface`        | `bg-surface`        | `#33363b` | List containers, cards, dialogs          |
| `--color-surface-subtle` | `bg-surface-subtle` | `#3d4045` | Input fields, header sections            |
| `--color-surface-raised` | `bg-surface-raised` | `#45494f` | Tooltips, hover cards                    |
| `--color-sidebar`        | `bg-sidebar`        | `#0f1113` | Fixed left navigation pane               |
| `--color-text`           | `text-text`         | `#f1f5f9` | Primary headings and text                |
| `--color-text-muted`     | `text-text-muted`   | `#a9b4b9` | Helper labels, dates, subtitle text      |
| `--color-primary`        | `bg-primary`        | `#00a394` | Action buttons, active links, checkmarks |
| `--color-primary-dark`   | `bg-primary-dark`   | `#00877a` | Button hover states                      |
| `--color-primary-light`  | `bg-primary-light`  | `#89f5e7` | Completion badges, full-progress glow    |
| `--color-border`         | `border-border`     | `#4d5157` | Outlines, borders, unchecked elements    |
| `--color-error`          | `text-error`        | `#ef4444` | Deletion flags, broken streaks, errors   |
| `--color-error-light`    | `bg-error-light`    | `#450a0a` | Failure pill backgrounds                 |

### Archived Light Theme

Preserved for future light/dark mode triggers:

- `--color-bg`: `#f7f9fb`
- `--color-surface`: `#ffffff`
- `--color-surface-subtle`: `#e8eff3`
- `--color-primary`: `#006a61`
- `--color-border`: `#a9b4b9`

---

## Layout Structure

- **Left Sidebar:** Fixed width `w-64` (256px) on desktop. Toggles to a collapsible icon-only rail `w-16` (64px) on toggle click. Moves to a hidden drawer on viewport sizes below `1024px` (touch-to-slide overlay).
- **Main Container:** Margin offset matching the sidebar width (`ml-64` or `ml-16`). Scrolls independently using `overflow-y-auto` to prevent page-wide scrollbar clutter.
- **Header Bar:** Fixed height `h-16` (64px) aligned flush to the desktop sidebar.

---

## Unique UI Patterns

### Custom Checkbox Component

Standard browser checkboxes look inconsistent and render white backgrounds in dark mode. We use a div-based custom checkbox styled with Tailwind. When unchecked, it shows a subtle border; when checked, it transitions to `bg-primary` and scales in a Lucide SVG checkmark.

### Progress Card Celebration

When progress hits 100% on the `ProgressCard`:

1.  The progress bar background switches to the bright teal `--color-primary-light`.
2.  A CSS `@keyframes` shimmer animation plays across the bar once.
3.  The label swaps to "Complete!" in teal text.

### Task Urgency Colored Borders

Tasks are displayed in grid cards with a thick left-accent border (`border-l-4`) indicating urgency:

- `border-l-red-500` ── **Overdue**
- `border-l-teal-500` ── **Due Today**
- `border-l-amber-500` ── **Upcoming**
- `border-l-slate-500` ── **Completed**

### Task Completion 2.5s Delay

When a task is checked, it does not instantly disappear from its list. It stays checked and strikethrough in its current section for 2.5 seconds. This provides a clean "undo window" for misclicks before it is moved to the "Completed" group.
