# CSS Restyle Implementation Plan

**Target schema:** `~/repos/css-styling-template` (echo-bridge design system)  
**Reference implementations:** `~/repos/reel-danialrami`, `~/repos/echo-bridge-manual`  
**Date:** 2026-04-26

---

## Scope

Restyle `daniel-ramirez-io` to match the retro flat aesthetic of the template. Keep all current functionality — dropdowns, carousel links, hero content — but apply the unified rendering system and retro design language.

---

## Key Design Decisions

- **Keep dropdowns** for the LUFS and danialrami link sections
- **Unify rendering** — replace the two-rendering-engine setup (p5.js canvas in hero + bottom animation) with a single, consistent system based on the template's animated-background + floating-shapes approach
- **Add `reel.danialrami.com`** to the danialrami dropdown

---

## Design Differences: Current → Target

| Aspect | Current | Target |
|---|---|---|
| Corners | `--border-radius: 12px` (rounded) | `--radius: 0` (flat/retro) |
| UI effects | Glassmorphism (`backdrop-filter: blur`) | Sharp borders, flat shadows |
| Body background | p5.js generative canvas (hero + bottom animation) | Unified animated background with floating shapes |
| Body rendering | Default | `image-rendering: pixelated` |
| Layout width | `--container-max-width: 680px` | `1200px` max container |
| Selection | Teal on cream | Yellow on black |
| Dropdown style | Glassmorphic with blur | Flat bordered panels |
| Hero | Generative art + profile SVG | Floating shapes + logo |
| Text shadows | Subtle dark drop shadows | Accent glow (`0 0 2px var(--lufs-teal)`) |
| Shadows | Soft box-shadow | Retro `2px 2px 0 var(--retro-border)` |
| Headings | Uses `.name` + `.tagline` classes | Styled via gradient top border + text-shadow |
| Carousel | Glassy rounded items | Flat bordered items |
| Footer | Simple centered text | Teal border-top + teal text |

---

## Shared Tokens (No Changes Needed)

The following are already aligned across all repos:

- `--lufs-teal: #78BEBA`
- `--lufs-red: #D35233`
- `--lufs-yellow: #E7B225`
- `--lufs-blue: #2069af`
- `--lufs-black: #111111`
- `--lufs-white: #fbf9e2`
- `--font-title: 'Host Grotesk'`
- `--font-body: 'Public Sans'`

---

## Retro Grays to Add

```css
--retro-gray: #c0c0c0;
--retro-dark-gray: #808080;
--retro-light-gray: #e0e0e0;
--retro-border: #888888;
```

---

## Retro Spacing Scale to Add

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

---

## Retro Shadow Tokens to Add

```css
--shadow-flat: 2px 2px 0 var(--retro-border);
--shadow-inset: inset 1px 1px 0 var(--retro-light-gray);
```

---

## Implementation Steps

### Step 1 — Replace `:root` variables
Remove/modify current flat tokens. Add retro grays, spacing scale, shadow tokens, `--radius: 0`. Keep the shared brand colors as-is.

### Step 2 — Replace `body` styles
Add the scanline background pattern and `image-rendering: pixelated` per the template. Remove p5.js canvas references.

### Step 3 — Replace hero section
- Remove `.hero-banner` generative canvas + fullscreen mode
- Apply `.animated-background` with `.floating-shape` elements (circles and squares)
- Keep hero content (profile image + name SVG) but style with retro borders and flat shadows
- Replace glassmorphism on hero with flat bordered frame
- Style `.name` and `.tagline` with retro text shadows matching the template

### Step 4 — Replace dropdown/button system
- `.link-button` → flat bordered panels (`border: 2px solid var(--lufs-teal)`), no blur
- `.dropdown-content` → flat background, sharp corners, retro borders
- `.carousel-item` → flat bordered, retro shadows on hover

### Step 5 — Add reel.danialrami.com carousel item
Insert into the danialrami dropdown between existing items.

### Step 6 — Update container max-width
Increase from 680px to 1200px, adjust padding to use `--spacing-lg`/`--spacing-md`.

### Step 7 — Replace footer
Flat border-top (`2px solid var(--lufs-teal)`) + teal text.

### Step 8 — Replace selection style
```css
::selection { background: var(--lufs-yellow); color: var(--lufs-black); }
```

### Step 9 — Remove p5.js references
Remove or repurpose `<div id="background-container">`, `background.js`, and `bottom-animation.js` from `index.html` since rendering is unified into CSS.

### Step 10 — Clean up animations
Remove current keyframes (`fadeInUp`, `fadeInScale`). Adopt the template's simpler keyframes (`floatAround`, `dr-pulseShadow`, `dr-float`) or adapt for the link buttons.

### Step 11 — Update responsive breakpoints
Align breakpoints to template: 768px and 480px with the spacing scale.

---

## Files to Modify

| File | Changes |
|---|---|
| `styles.css` | Full restyle — tokens, body, hero, buttons, dropdowns, footer, animations |
| `index.html` | Add reel.danialrami carousel item; remove p5.js script tag and background-container div |

## Files to Remove/Deprecate

| File | Reason |
|---|---|
| `background.js` | p5.js generative — replaced by CSS animated background |
| `bottom-animation.js` | Replaced by unified CSS floating shapes |

## Files to Create

| File | Changes |
|---|---|
| `docs/restyle-plan.md` | This document |

---

## Notes

- The p5.js scripts currently power the generative hero and bottom animation. These should be replaced entirely by CSS animated shapes (`.animated-background` + `.floating-shape`).
- The fullscreen toggle and immersive mode are specific to this site and not in the template. Recommend removing — the retro flat aesthetic works better with a consistent single layout.
- The webring-button styles in the template are for the webring widget; this site doesn't currently have webring buttons, so those are optional.