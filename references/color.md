# Color

Neutrals, accents, and semantic color that hold together as one palette, not a theme color bolted onto default grays.

## Purpose

Catch color choices that weaken hierarchy and harmony: `#000` on everything, purple gradients, **wrong-hue blacks**, and **accent color sprayed everywhere**.

## Intentional accent use (core rule)

**Use the main accent with intent, not decoration.** The accent exists to pull the eye to the **most important task** on the page. Every extra hit of full accent dilutes that signal and wastes brand impact.

### Goal

One clear visual priority per view. The user should know what to do next without scanning a sea of the same brand color.

### Rule

| Tier | Use | Saturation |
|------|-----|------------|
| **Primary accent** | The main action, critical link, or single focal control | Full accent |
| **Accent tints** | Selected row, subtle highlight, focus ring fill, badge that supports the primary task | Same hue, **lower opacity** or lower saturation |
| **Neutrals** | Body text, surfaces, borders, icons, secondary buttons | Accent **hue** only on tinted darks (see below), not full chroma |

**Full accent is scarce.** If everything is accent, nothing is.

### Allowed (intent)

- Primary CTA button
- Current nav item / active tab (one)
- Key inline link or single hero action
- Critical status that blocks or unlocks the main task (error on submit, required field)
- Focus indicator (often accent at partial opacity)

### Limit or remove (decoration)

- Accent icon on every feature card
- Accent borders on all containers
- Accent headings, eyebrows, and dividers on the same page
- Gradient wash **and** accent buttons **and** accent bullets
- Secondary buttons in full accent when one primary already exists
- Decorative badges ("New", "Popular") on every block unless they drive the one main action

**Test:** Cover the page with your thumb except one element. If the main task isn't obvious, you have too much accent, or it's on the wrong things.

### Opacity variations

Same accent hue at reduced strength is fine **when it supports hierarchy**, not when it spreads color for looks:

```css
--accent: hsl(var(--accent-h) var(--accent-s) var(--accent-l));

--accent-primary: var(--accent);                    /* full, primary CTA only */
--accent-subtle:  hsl(var(--accent-h) var(--accent-s) var(--accent-l) / 0.12);
--accent-muted:   hsl(var(--accent-h) var(--accent-s) var(--accent-l) / 0.08);
--accent-border:  hsl(var(--accent-h) var(--accent-s) var(--accent-l) / 0.24);
```

Use tints for: selected state background, hover on related items, focus halo, progress toward the primary action.

Do **not** stack many tint layers across unrelated sections, that recreates "accent everywhere" at lower saturation.

### Workflow

1. **Name the one job**, "Sign up", "Export", "Choose plan", "Send message".
2. **Assign full accent** to that control (and at most 1–2 supporting calls if truly co-equal).
3. **Demote everything else**, neutral secondary buttons, neutral icons, spacing for structure.
4. **Audit decorative accent**, remove any full-chroma use that doesn't change what the user does next.
5. **Tints sparingly**, opacity variants only where they reinforce the primary path.

### Audit

| Signal | Severity |
|--------|----------|
| Can't identify primary task in 3 seconds | **High** |
| 4+ elements at full accent saturation | **High** |
| Accent on icons, borders, and headings with no action tie | **Medium** |
| More than one competing primary-strength CTA | **Medium** |
| Tinted accents on every section background | **Medium**, trim to active/related areas |

Count **full-saturation accent instances**. Target: **1 primary**, rarely **2** on dense screens. Everything else neutral or low-opacity tint.

## Accent-hue blacks (core rule)

**Blacks and dark neutrals must pair with the accent.** A blue theme with a red-based near-black clashes even when both look "dark" in isolation.

### Rule

When a dark neutral has **saturation > 0**, its **hue must equal the theme / accent hue**.

```
if saturation > 0 → hue = accent hue
if saturation = 0 → achromatic OK (#000, neutral gray)
```

Same logic in any color space, HSL, HSV, OKLCH, LCH, etc. Convert to read/write hue; apply the rule on the hue channel.

| Space | Match on |
|-------|----------|
| HSL / HSV | `h` |
| OKLCH / LCH | `h` (hue angle) |
| RGB hex | Derive hue; if chroma/sat > 0, retint to accent hue at same lightness |

**Saturation 0** = true neutral black or gray. No hue to align.

**Saturation > 0** = tinted dark. Hue **must** follow accent, not warm default, not random gray from a library.

### Why this goes wrong

- Uses `#000`, `#111`, `#1a1a1a` (often warm or green-shifted in perception)
- Pulls "slate" or "zinc" scales from a component library without matching brand hue
- Blue accent + `hsl(0, 10%, 8%)` or stone/warm gray stack → subtle red/yellow cast against blue

### Examples

**Blue accent**, `hsl(220, 85%, 55%)`

| Bad (clash) | Good (paired) |
|-------------|---------------|
| `hsl(10, 12%, 8%)`, warm/red black | `hsl(220, 14%, 8%)` |
| `hsl(45, 8%, 9%)`, yellow-cast near-black | `hsl(220, 10%, 12%)` for surfaces |
| Tailwind `stone-950` under blue brand | Custom `--surface: hsl(var(--accent-h) 12% 9%)` |

A true achromatic (`hsl(0, 0%, 7%)`, saturation 0) is **not** a clash, it has no hue to conflict, see the rule above. It can read flat beside saturated UI; a slight accent-hue tint (`hsl(220, 10%, 12%)`) usually feels more intentional, but the neutral is allowed.

**Green accent**, `hsl(145, 60%, 45%)`

- Dark text on light: `hsl(145, 8%, 12%)` not `hsl(30, 8%, 12%)`

### Workflow

1. Set **accent hue** once (`--accent-h: 220` or from primary token).
2. For each dark neutral (background, text, border) with saturation > 0:
   - Set `h = --accent-h`
   - Tune `s` and `l` for contrast and hierarchy only
3. Leave **s = 0** only for true black/white/gray when you want achromatic.

### CSS tokens

```css
:root {
  --accent-h: 220;
  --accent-s: 85%;
  --accent-l: 55%;

  --color-primary: hsl(var(--accent-h) var(--accent-s) var(--accent-l));

  /* Tinted darks, hue locked to accent */
  --color-bg:        hsl(var(--accent-h) 12% 7%);
  --color-surface:   hsl(var(--accent-h) 10% 11%);
  --color-text:      hsl(var(--accent-h) 8% 92%);
  --color-text-muted: hsl(var(--accent-h) 6% 62%);

  /* Achromatic escape hatch */
  --color-black: hsl(0 0% 0%);
}
```

Dark mode: same rule, elevated surfaces use accent hue with lower `l`, not a unrelated gray scale.

### OKLCH

```css
/* accent ~ oklch(0.55 0.18 250) → hue 250 */
--color-bg: oklch(0.14 0.02 250);   /* h matches accent */
--color-bg-bad: oklch(0.14 0.02 25); /* warm hue, clashes with blue accent */
```

If `c > 0` (or chroma equivalent), `h` = accent `h`.

### Audit

For each near-black / dark gray with measurable saturation:

1. Read hue of accent / primary
2. Read hue of dark neutral
3. If neutral `s > 0` (or chroma > 0) and hues differ → **High**, retint to accent hue

Flag common library grays (`zinc`, `stone`, `neutral`) under a saturated brand unless their hue was deliberately aligned.

## Building the palette
Sleak's accent + accent-hue-black rules above are the sharpened version of the conventional
palette method. The underlying construction recipe:

**One monochromatic ramp** built from the brand hue, each step with a defined job and a
contrast floor (against the lightest/background):

| Role | Use | Contrast floor |
|------|-----|----------------|
| **Primary** | Actions: links, buttons, interactive elements | ≥ 4.5:1 |
| **Darkest** | Primary text (headings, body, labels) | ≥ 4.5:1 |
| **Dark** | Secondary / supporting text | ≥ 4.5:1 |
| **Medium** | Non-decorative borders (form fields, inputs) | ≥ 3:1 |
| **Light** | Decorative borders | decorative, no floor |
| **Lightest** | Alternate background surface | n/a |

- Greys carry a **tinge of the primary hue** (saturate slightly, don't use pure neutral),
  this is exactly the [accent-hue blacks](#accent-hue-blacks-core-rule) rule. Use `s: 0`
  only when you deliberately want true achromatic.
- **Apply the brand colour to interactive elements**, not decoration, it teaches users
  what's clickable. (Sleak goes further: reserve *full* accent for the single primary task.)
- **If the brand colour carries meaning** (e.g. red = errors) or is too light/dark to hit
  contrast, use the **darkest/white variation** for actions instead, or add a 3:1 border.

**Keep the ramp lean.** A few tints (mixed toward white) and shades (mixed toward black) per
colour, plus a slim neutral set, no more. Too many near-identical steps invite inconsistency
and misuse; add an option only when a real need appears. Store them as
[tokens](design-systems.md).

**Darken/lighten without muddiness.** Mixing a colour with pure black or white can turn it
muddy, a darkened yellow drifts toward brown. Mix toward a **neighbouring hue** instead (deepen
yellow with a little orange) to keep the shade clean.

**Start in black and white.** Design the interface in greys first, it forces you to solve
spacing, size, and contrast before colour, and colour then goes only where it carries meaning.
And avoid **pure `#000` on pure `#fff`**: the maximal contrast causes eye strain over long
reading, prefer a very dark grey (which also satisfies the accent-hue-black rule above).

**System colours**, you need three, each paired with an icon (never colour alone):

| Colour | Meaning |
|--------|---------|
| Red | Error / failure needing attention |
| Amber | Warning / risky action |
| Green | Success / completed as expected |

System-colour **text** needs ≥ 4.5:1; system-colour **icons/components** need ≥ 3:1.

## Light & dark mode: slide, don't invert

**Switching themes is not colour inversion.** Flipping every value (light ↔ dark) breaks
hierarchy and produces harsh, muddy results. Instead, **slide each colour along its range**
to the equivalent role in the other mode, keeping the palette's relationships intact.

### Preserve relative luminance across modes

A surface keeps its **relative brightness rank** when you toggle modes. The surface that is
brightest *relative to its neighbours* in light mode stays the brightest *relative to its
neighbours* in dark mode, the whole set slides down the luminance range together; it doesn't
flip.

### Elevation governs luminance

Surface luminance is driven by **elevation**, how close a surface sits to the user:

- **Surfaces closer to the user (higher elevation) have higher luminance.**
- In **dark mode**, elevated surfaces (cards, menus, modals, popovers) get **lighter** as
  they rise, not darker. The base/background is the darkest; each layer above lifts.
- In **light mode**, the ordering is preserved by the same range-slide; don't invert it into a
  contradictory stack.

Model elevation as steps on one luminance ramp and reuse the same ramp in both modes:

```css
/* one ramp; each mode slides the same roles along it */
:root { /* light */
  --surface-0: hsl(var(--accent-h) 10% 99%);  /* base */
  --surface-1: hsl(var(--accent-h) 10% 97%);  /* raised card */
  --surface-2: hsl(var(--accent-h) 10% 95%);  /* menu / modal, closest to user */
}
:root[data-theme="dark"] { /* slid down the range, elevation still lifts luminance */
  --surface-0: hsl(var(--accent-h) 12% 9%);   /* base, darkest */
  --surface-1: hsl(var(--accent-h) 11% 13%);  /* raised card, lighter */
  --surface-2: hsl(var(--accent-h) 10% 17%);  /* menu / modal, lightest */
}
```

Neutrals still follow [accent-hue blacks](#accent-hue-blacks-core-rule); re-check
[contrast.md](contrast.md) after the slide (a pair that passed in light mode is a different
ratio in dark).

| Do | Don't |
|----|-------|
| Slide each role to its dark-mode equivalent | Invert every colour value |
| Lift luminance with elevation in dark mode | Make raised surfaces darker than the base |
| Keep relative brightness ranking across modes | Reorder the surface stack between modes |

## Common mistakes

| Tell | Fix |
|------|-----|
| Accent on every card icon and border | Neutral cards; full accent on one CTA |
| Hero gradient + accent nav + accent footer links | One accent focal point; neutrals elsewhere |
| Three equally loud "primary" buttons | One full accent; others secondary/outline |
| Purple/blue theme with every heading tinted | Headings neutral; accent on action only |
| `#000` text on tinted brand page | Accent-hue dark or true `s: 0` neutral |
| Warm gray dark mode + cool accent | Rebuild dark scale on `--accent-h` |
| Gradient hero + unrelated gray sections | One hue family for neutrals |
| Default Tailwind/shadcn gray + custom primary | Retint `--background`, `--foreground`, `--muted` to accent hue |

## Fixes

1. Define the **single primary task** for the view; give it the only full-accent control.
2. Strip decorative accent from icons, section chrome, and non-action headings.
3. Use **opacity tints** only on states tied to the primary path (selected, focus, progress).
4. Define `--accent-h` (or equivalent) at theme root for neutrals (see accent-hue blacks).
5. Replace tinted darks whose hue ≠ accent hue.
6. Keep saturation low on neutrals (often 6–15%), **hue** harmonizes; **chroma** is for actions.

## Do / Don't

| Do | Don't |
|----|-------|
| One clear accent focal point per view | Paint every component brand-colored |
| Full accent on primary action only | Full accent on secondary + tertiary buttons |
| Opacity tints for related selected/hover states | Low-opacity accent wash on every section |
| Neutrals for structure; accent for direction | Accent eyebrows, dividers, and icons by default |
| Lock hue on tinted blacks/darks to accent | Mix warm `#1a1a1a` under cool blue brand |
| Use `s: 0` for true achromatic black/white | Assume more brand color = stronger brand |
| Check hue in HSL, OKLCH, or converted RGB | Eyeball hex without checking hue |

## Notes

- **Contrast / a11y:** Retinting hue rarely breaks WCAG if lightness is unchanged; re-check contrast after shifts.
- **Multi-accent brands:** Use dominant UI accent hue for neutrals, or split by surface role, document the choice.
- **Print / exports:** Same rule when generating theme tokens for Figma or design systems.
