# Contrast

Text must be readable and UI elements must be visible against whatever sits behind them. Check contrast **two ways**, mathematical and perceptual, because each catches failures the other misses.

## Purpose

Catch color pairs that look fine in a mockup but fail in use: mid-tone gray on white, tinted text on a tinted surface, low-contrast placeholder and disabled states, borders and icons that vanish, and focus rings you can't see. Applies to text **and** non-text UI (borders, icons, controls, focus indicators, chart marks).

This pairs with [color.md](color.md) (retinting hue to the accent should not lower contrast, always re-check) and [typography.md](typography.md) (smaller type needs more contrast).

## Check both ways (core of this rule)

| Method | What it is | Catches |
|--------|-----------|---------|
| **Mathematical (WCAG 2.x)** | Luminance-ratio, `(L1 + 0.05) / (L2 + 0.05)`. The compliance floor. | Objective, legally referenced pass/fail; required for a11y conformance |
| **Perceptual (APCA)** | Lightness-contrast (Lc) from WCAG 3 draft; accounts for **polarity**, font size, and weight | Readability the ratio misses, dark mode, thin fonts, mid-tones, light-on-dark |

**Rule:** a pair **passes only when it clears the WCAG AA floor _and_ the APCA target for its role.** WCAG is the legal minimum; APCA is whether a human can actually read it. They disagree often enough that one alone is not enough:

- WCAG **passes** pairs that read poorly (many light-on-dark and saturated combinations).
- WCAG **fails** some pairs that are genuinely readable (over-penalizes certain dark-mode text).
- APCA models real perception but is **not** yet the conformance standard.

Use WCAG for the compliance gate, APCA to tune what's legible. When they conflict, satisfy WCAG AA **and** treat a weak APCA score as a real readability problem to fix.

## Check the rendered pixels, not the tokens (mandatory)

**Computing contrast from CSS variables or the palette table is not a contrast check.** It tells you what a pair *should* be, not what the browser actually paints. The number that matters is the **rendered foreground on the rendered background**, after the cascade, inheritance, specificity, opacity, gradients, and overlays have all resolved.

A pair verified in the abstract can still fail on screen when:

- **A more specific selector overrides the color.** e.g. `.nav-links a { color: var(--muted) }` (specificity 0,1,1) beats `.btn-primary { color:#fff }` (0,1,0), so a "white on accent" button renders **dark text on the accent fill**, a hard fail, even though the token pair was 6.4:1. This exact bug shipped once because only the token math was checked.
- `color: inherit` / a parent color pulls a different value than the token you measured.
- The element sits on a **different background than assumed** (a `.tint` section, a gradient, an image, a hover surface).
- Opacity on the text or an ancestor lowers the effective contrast.

### The rule

1. **Render the page** (real browser, the actual viewport and theme). Never sign off on contrast from CSS reading alone.
2. **Screenshot it**, then sample the **actual pixel colors** of the foreground and the background directly behind it (devtools eyedropper, a color picker on the screenshot, or devtools' built-in contrast readout).
3. **Run WCAG + APCA on those sampled pixels**, not on the token definitions.
4. Do this for every state and theme (hover, focus, disabled, dark mode) and for text over gradients/images at the worst point.

If you claimed a pair passes but never rendered it, you have not checked contrast, you have checked intent. Look at it.

## Mathematical thresholds (WCAG 2.2, AA)

| Content | Min ratio |
|---------|-----------|
| Body / normal text (< 18.66px bold or < 24px) | **4.5 : 1** |
| Large text (≥ 24px, or ≥ 18.66px bold) | **3 : 1** |
| Non-text: UI component boundaries, icons, form borders, focus indicators, graph/chart marks | **3 : 1** |
| AAA body / AAA large | 7 : 1 / 4.5 : 1 |

Measured between the foreground and the **actual** background it sits on (including tints, gradients test the worst point, and any overlay).

```js
// WCAG relative luminance + ratio
const lin = c => { c /= 255; return c <= 0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
const L = ([r,g,b]) => 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
const ratio = (fg, bg) => {
  const a = L(fg), b = L(bg);
  return (Math.max(a,b) + 0.05) / (Math.min(a,b) + 0.05);
}; // e.g. ratio([255,255,255],[124,58,237]) → 4.5+ passes AA large
```

## Perceptual thresholds (APCA, Lc)

APCA returns a signed **Lc** value; use its absolute magnitude. Direction matters, computing dark-on-light vs light-on-dark are not symmetric, so run it in the actual polarity.

| Lc (abs) | Cleared for |
|----------|-------------|
| **90** | Preferred for body text; required for thin (≤ 300) or very small text |
| **75** | Minimum for normal body text (~16px / 400) |
| **60** | Larger or medium-weight content text (~24px/400, ~16px/600) |
| **45** | Large / bold headlines (~36px+, or 24px bold) |
| **30** | Non-text elements, large UI, incidental/placeholder, disabled boundary |
| **15** | Absolute floor for _any_ discernible difference; below this is invisible |

Compute with the reference algorithm (`apca-w3` / `apcach`), not by hand:

```js
import { APCAcontrast, sRGBtoY } from 'apca-w3';
const Lc = APCAcontrast(sRGBtoY([124,58,237]), sRGBtoY([255,255,255]));
// |Lc| ≥ 75 for body; ≥ 45 for large/bold headlines
```

## Non-text elements

Readability isn't only text. Require **≥ 3:1 WCAG (≈ Lc 30+ APCA)** against adjacent color for:

- Icons and glyphs that carry meaning (not purely decorative)
- Input borders, card outlines, and dividers that must be seen to parse layout
- **Focus indicators**, the ring must clear 3:1 against both the component and the page
- Toggle/checkbox/radio boundaries in every state
- Chart/graph series, bars, lines, and their gridlines (see [dataviz] if present)
- Selected / active states that rely on color alone

Purely decorative shapes with no informational role are exempt, but confirm they're truly decorative.

## States people forget

| State | Requirement |
|-------|-------------|
| **Placeholder text** | Often too light; still needs ≥ 4.5:1 if it conveys the only label. Don't use placeholder as the label. |
| **Disabled** | WCAG exempts disabled controls, but keep them **perceivable** (Lc 15–30) so users see they exist |
| **Hover / active** | Re-check, hover often lightens the surface and drops text contrast |
| **On gradients / images** | Test the **lightest and darkest** point under the text; add a scrim if either fails |
| **Accent text on tint** | Accent-colored text on an `--accent-soft` tint frequently fails; use full-strength text color instead |
| **Dark mode** | Recompute; a pair that passes in light mode is a different ratio inverted |

## Workflow

1. **Render and screenshot first.** Open the built page in a real browser; sample the **actual painted** foreground/background pixels (see "Check the rendered pixels" above). Token math alone is not a check.
2. **List real pairs.** For each text and meaningful non-text element, note foreground + the exact background behind it (resolve tints, overlays, gradients to concrete colors).
3. **Run WCAG ratio.** Fail AA → **High**, fix before ship.
4. **Run APCA.** Below the role's Lc target → readability issue even if WCAG passed; fix or bump size/weight.
5. **Fix by lightness, not hue.** Adjust `L` (lightness) to gain contrast; keep hue aligned to accent (see [color.md](color.md)). Don't desaturate to a clashing gray.
6. **Re-check every state and both themes.** Hover, disabled, focus, dark mode.
7. **Prefer size/weight when a brand color can't move.** Larger or heavier text lowers the required ratio and Lc.

## Audit

| Signal | Severity |
|--------|----------|
| Contrast signed off from CSS tokens without rendering the page | **High**, not a check; render and re-verify |
| Rendered text color ≠ the token you measured (cascade/specificity override) | **High** |
| Body text below WCAG 4.5:1 (or APCA Lc 75) | **High** |
| Meaningful icon / border / focus ring below 3:1 | **High** |
| Passes WCAG but APCA under target (reads poorly, common in dark mode / mid-tones) | **Medium**, fix readability |
| Placeholder used as the only label, low contrast | **Medium** |
| Disabled state invisible (Lc < 15) | **Low/Medium** |
| Text on gradient/image with no scrim, fails at one end | **High** |

## Common mistakes

| Tell | Fix |
|------|-----|
| `#999` gray on white body text | Darken to clear 4.5:1 / Lc 75 |
| Accent-color label on accent tint background | Use `--text`; reserve accent for the action |
| Light-on-dark "passes" WCAG but looks muddy | Check APCA; raise foreground lightness |
| Focus ring same hue/lightness as border | Distinct ring ≥ 3:1 vs page and component |
| Placeholder as the label | Real `<label>`; placeholder is a hint only |
| Only checked light mode | Recompute the inverted pair for dark mode |
| Text over hero image, no overlay | Scrim/gradient so the worst pixel still passes |

## Do / Don't

| Do | Don't |
|----|-------|
| Gate on WCAG AA **and** APCA Lc for the role | Ship on one method alone |
| Test against the real resolved background | Assume the base surface color |
| Gain contrast via lightness, keep accent hue | Desaturate into a clashing neutral |
| Give focus rings and borders their own 3:1 | Rely on a faint 1px line no one can see |
| Re-check hover, disabled, focus, dark mode | Check the default state only |
| Bump size/weight when a brand color is fixed | Force an unreadable brand color at 12px |

## Notes

- **Tooling:** WCAG ratio, any contrast checker or the snippet above. APCA, `apca-w3` / `apcach`, or the online APCA calculator. Automate in CI where possible.
- **WCAG 2 vs 3:** WCAG 2.x (ratio) is the current conformance standard; APCA is the WCAG 3 draft direction. Report against 2.x for compliance, use APCA to catch real-world readability gaps.
- **Color-blindness:** contrast ≠ color independence. Don't encode meaning by hue alone; pair with text, icon, or shape.
