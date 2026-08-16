# Typography

Readable type comes from **line length**, **alignment**, and **size matched to device and viewing distance**. Not from picking a trendy font and calling it done.

## Purpose

Catch typography that looks fine in a mockup but fails in use: full-width centered paragraphs, desktop body text at mobile sizes, or lines so long the eye loses its place.

## Line length (7–12 words)

**Aim for 7–12 words per line** for comfortable reading of body copy and long subtitles.

Long lines fatigue the eye; very short lines break rhythm. This band keeps scan speed high without losing flow.

### Measure in practice

Word count depends on typeface and language. Use **max-width** as the control:

| Target | Approx. width |
|--------|----------------|
| 7–12 words (English body) | **`42ch`–`65ch`** (start near **`55ch`**) |
| Narrow sidebar / caption | **`35ch`–`45ch`** |
| Wide marketing hero (short line) | Still cap line length; don't span the viewport |

```css
.prose {
  max-width: 55ch;
}
```

**Audit:** Pick a representative body paragraph. Count words on a full line at the target viewport. Outside 7–12 → adjust `max-width` (or font size if the container is fixed).

Headings can break the rule if they're short phrases. **Paragraphs and subtitles** should not.

## Center-aligned text

Centered type is for **short, ceremonial lines**, not paragraphs.

### Rules

1. **Do not exceed 3 lines** of center-aligned text in one block.
2. Keep copy **short**: headlines, labels, one-line stats, brief hero lines.
3. **Constrain width** to about **half** the content column (or **`35ch`–`45ch`**) so lines don't sprawl.
4. Longer content → **left-align** (or start-align) with normal paragraph width (7–12 words per line).

| OK centered | Not centered |
|-------------|----------------|
| Hero headline (1–2 lines) | Feature descriptions (4+ lines) |
| Section title + one subtitle | Pricing fine print |
| Empty-state title + one helper line | Legal body text |

```css
.hero__title {
  text-align: center;
  max-width: 45ch;
  margin-inline: auto;
}

.hero__body {
  text-align: start;
  max-width: 55ch;
  margin-inline: auto;
}
```

**Weak pattern:** full-width centered paragraph wrapping to 6+ lines. **Fix:** shorten, split, or switch to start-aligned prose.

## Font size and viewing distance

Typography must **adapt to device and distance from the eyes**. The same pixel size is not the same visual size across contexts.

### Viewing distance (rule of thumb)

| Context | Typical distance | Type treatment |
|---------|------------------|----------------|
| **Phone** | Hand length (~30–40 cm) | Smaller UI labels can go down to ~**11–12px** for metadata; body **≥16px** on web |
| **Laptop / desktop** | Arm length (~50–70 cm) | Body **16–18px**; avoid body below **14px**; **8px** only for non-critical chrome, never long reading text |
| **TV / large display** | ~2 m | Much larger type; scale with **rem**, viewport units, or platform TV guidelines |

**8px on mobile** may work for dense captions, badges, or tab bar labels when contrast is strong and copy is minimal. **8px on desktop** for anything the user reads → **High** failure.

Think in **angular size** (how large the letter subtends at the eye), not raw pixels. farther screen → larger type for the same legibility.

### Responsive scaling

Size up for farther viewing; don't ship one global `font-size` for all breakpoints.

```css
:root {
  font-size: 100%; /* 16px base on most browsers */
}

@media (min-width: 768px) {
  :root {
    font-size: 106.25%; /* ~17px base */
  }
}

@media (min-width: 1280px) {
  :root {
    font-size: 112.5%; /* ~18px base for arm-length reading */
  }
}
```

Prefer **`rem`** for text so user zoom and root scaling propagate. Use **`clamp()`** when type should track viewport smoothly:

```css
.hero__title {
  font-size: clamp(1.75rem, 1rem + 2.5vw, 3rem);
}
```

### By role, not one size everywhere

| Role | Phone | Desktop | Notes |
|------|-------|---------|-------|
| Body | 16–17px | 16–18px | 7–12 words per line via width |
| Secondary / meta | 12–14px | 13–14px | Short strings only |
| Captions / legal | 11–12px min | 12–14px min | Check WCAG contrast |
| TV body |, |, | Often 24px+ at 1080p; follow platform HIG |

Match the project's type scale if one exists. Extend it per breakpoint; don't fork a second system.

## Accessibility

- Meet **WCAG contrast** for every size you use; smaller type needs stricter pairing.
- Respect **user font scaling** (browser zoom, iOS Dynamic Type, Android font size). Avoid px-locked layouts that clip when text grows.
- **`prefers-reduced-motion`:** unrelated to size, but don't solve readability with motion.
- **Line height:** body ~**1.5–1.6**; tight center-aligned headlines ~**1.1–1.2** with fewer lines.

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Body spans full viewport width | `max-width: 55ch` (7–12 words) |
| 5-line centered marketing paragraph | ≤3 lines centered, or start-align |
| Centered block at 100% width | `max-width: 45ch`; ~half column |
| 14px body on large desktop monitor | Raise base `rem` at `md`/`lg` breakpoints |
| 8px helper text on desktop forms | ≥12–14px or demote to icon + tooltip |
| Same font-size token on phone and TV | Breakpoint or context-specific scale |
| Long lines in cards in a grid | Cap card text width; align start |

## Audit

1. **Line length:** sample body at target breakpoint; count words per line (7–12?).
2. **Center align:** any centered block >3 lines? → **High** for body-like copy.
3. **Center width:** centered text near full container width? → **Medium**.
4. **Desktop size:** any reading text <14px on desktop? → **High** (except deliberate dense UI with strong contrast and short strings).
5. **Distance fit:** phone layout on desktop without larger type? → **Medium** when readability suffers.

## Do / Don't

| Do | Don't |
|----|-------|
| Cap prose at ~55ch for 7–12 words | Full-bleed paragraphs |
| Center ≤3 short lines in a narrow measure | Center long paragraphs |
| Scale root or role sizes by breakpoint / device | One px size for all screens |
| 16px+ body on phone web | 8px body anywhere |
| Larger type for TV / far viewing | Desktop sizes on a 2 m display |
| `rem` + user scaling | Fixed px that breaks zoom |

## Notes

- **Design tools:** Figma auto-layout max width in `ch` or fixed px equivalent to 55ch at body size.
- **iOS / Android:** use Dynamic Type / sp; map semantic styles (body, headline) not single hard-coded px.
- **Data-heavy UI:** tables may use smaller type for cells; still respect minimums and contrast; don't use table density as an excuse for unreadable defaults on desktop.
