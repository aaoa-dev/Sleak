# Accessibility

Whether real users, keyboard-only, screen-reader, low-vision, motor-impaired, can perceive and operate the interface. This file covers the non-contrast surface (names, focus, keyboard, targets, non-color cues); text/UI **contrast** lives in [contrast.md](contrast.md).

Scaffold based on WCAG 2.2 AA and common platform guidance. Treat as a baseline, not exhaustive.

## Purpose

Make every interactive element reachable, labeled, and operable without a mouse or perfect vision, so the design holds up for the people who need it most.

## Rules

### 1. Accessible names on every control

Every interactive element exposes a name to assistive tech.

- Images that carry meaning have `alt`; decorative images use `alt=""`.
- Icon-only buttons/links get an `aria-label` (or visually-hidden text). A bare `<button><svg/></button>` is unnamed.
- Inputs have a real `<label>` (or `aria-labelledby`); placeholder is **not** a label.

### 2. Visible focus indicator

Keyboard users must always see where they are.

- Never `outline: none` without a replacement.
- Focus ring clears **3:1** against both the component and the page (see [contrast.md](contrast.md)).
- Prefer `:focus-visible` so pointer users don't get rings but keyboard users do.

### 3. Full keyboard operability

Everything you can do with a mouse works from the keyboard.

- Logical tab order; no keyboard traps.
- Custom widgets (menus, tabs, dialogs) implement expected key handling (Esc, arrows, Enter/Space).
- Prefer native elements (`<button>`, `<a>`, `<input>`) over `div`+`onClick`, which ship these behaviors for free.

### 4. Touch / hit targets ≥ 44×44px

Pointer and touch targets are large enough to hit reliably.

- Minimum **44×44px** (WCAG 2.5.8 AA is 24px; 44px is the safer platform norm).
- Spacing between adjacent targets prevents mis-taps.
- The clickable area can extend past the visible glyph via padding.

### 5. Never encode meaning by color alone

Anyone with color-vision deficiency must get the same information.

- Pair color with text, icon, shape, or pattern (error field: red border **and** a message; chart series: color **and** label/marker).
- Links in body text carry a non-color cue (underline).

### 6. Structure and landmarks

Screen readers navigate by structure.

- One `<h1>` per view; heading levels don't skip.
- Landmark elements (`<nav>`, `<main>`, `<header>`, `<footer>`) frame the page.
- Lists use list markup; tables use `<th>` + scope.

### 7. Respect user settings

- `prefers-reduced-motion` honored (see [motion.md](motion.md)).
- Layout survives 200% zoom and user font-size changes (use `rem`, not fixed `px` type).

## Assistive technology & standards
- **Baseline: WCAG 2.1 level AA.** A good, often legally-required floor. Aim to pass it for
  contrast, targets, and non-text UI (≥3:1 for borders/icons/controls).
- **Design for screen readers.** Elements are read *out of context*, so headings and link/
  action text must be descriptive on their own ("View pricing", not "Read more"). This is a
  copy rule too, see [content-copy.md](content-copy.md).
- **Design for screen magnifiers** (more common than screen readers). The user sees only a
  small slice of the screen at a time, so **keep related actions close together** and
  **left-align** primary actions so they aren't scrolled out of view or missed.
- **Good accessibility = good usability for everyone.** Sufficient contrast, low interaction
  cost, and low cognitive load help sighted, able users too, and everyone hits temporary or
  situational impairment (bright sun, one hand, an injury).
- **When you replace text with a visual/motion cue** (a shake for an invalid field, a
  colour change for a state), provide an accessible equivalent: `aria-invalid`, an
  accessibility hint, or a live-region announcement. Motion is never the only channel
  (see [motion.md](motion.md)).

## Common mistakes

| Tell | Fix |
|------|-----|
| Icon button with no label | Add `aria-label` |
| `outline: none` with no `:focus-visible` style | Restore a visible focus ring |
| `<div onClick>` acting as a button | Use `<button>` |
| Placeholder used as the only label | Add a real `<label>` |
| Error shown only as red border | Add text + icon |
| Tap target < 44px | Grow via padding/min-size |
| Heading levels skip (h1 → h4) | Fix hierarchy |

## Do / Don't

| Do | Don't |
|----|-------|
| Name every control | Ship unnamed icon buttons |
| Keep a visible `:focus-visible` ring | `outline: none` globally |
| Use native interactive elements | Rebuild buttons from `div`s |
| Pair color with a second cue | Rely on hue alone |
| Size targets ≥ 44px | Cram tiny tap targets together |

## Audit

- **High**: unnamed control, no visible focus, keyboard-inoperable widget, meaning by color alone, target < 44px
- **Medium**: skipped heading levels, missing landmarks, no reduced-motion handling
- **Low**: minor label wording, non-underlined body links

Verify on the **rendered** page: tab through it with no mouse, and check names in the accessibility tree, not just the source.
