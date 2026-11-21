# Brand guide (colours, type, rules)

| Name | Hex | Tailwind | Use |
|---|---|---|---|
| Navy | `#0F1B3D` | `navy-900` | hero, footer, admin sidebar, headings, text on pink buttons |
| White | `#FFFFFF` | `white` | page background, cards, text on navy |
| Pink | `#FF3D8B` | `pink-500` | buttons, badges, lines, focus ring, icons |

Supporting tints: `navy-50..800` (borders, body text, panels), `pink-50/100` (soft backgrounds), `pink-700 #C81E64` (pink *text* on white).
Green (`campus-*`) is used only for success states such as "Published".

## Contrast rules (checked with axe, WCAG 2.2 AA)
- Navy text on pink: 5.0 : 1. This is why buttons are pink with **navy** text.
- White text on pink: 3.3 : 1. Fails for small text, so **do not** put small white text on pink.
- Pink text on white: 3.3 : 1. Fails, so use `pink-700` for any pink *text* on a light background. Pink on navy is fine (5.0 : 1).

## Type
Headings: Plus Jakarta Sans (bold). Body: Public Sans. Both are self-hosted through `@fontsource-variable`, so no request goes to Google.

## Logo
The mountain mark is a placeholder. Replace `src/components/layout/Logo.jsx` and `public/favicon.svg` with the official logo when available.
