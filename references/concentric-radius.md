# Concentric corner radius

Nested rounded corners must share a **single curve axis**. The gap between parent and child (padding or margin) determines how the radii relate.

This is a core Sleak rule. Defaulting to identical radii on every layer breaks the geometry and reads as template UI.

## The formulas

Three equivalent forms. Use whichever variable you know first.

```
parent − padding = child
parent − child   = padding
child  + padding = parent
```

| Variable | Meaning |
|----------|---------|
| **parent** | Border radius of the outer rounded container |
| **child** | Border radius of the inner rounded element |
| **padding** | Inset between the two curves, padding, gap, or margin between their edges |

All values use the **same unit** (px, rem, etc.) and apply **per corner** when corners differ.

## Which variable drives?

| You know… | Solve for… | Use |
|-----------|------------|-----|
| Parent radius + padding | Child | `child = parent − padding` |
| Child radius + padding | Parent | `parent = child + padding` |
| Parent + child | Padding | `padding = parent − child` |

**Parent drives child**, most common. Set the outer shell, pick padding, derive inner radius.

**Child drives parent**, inner component has a fixed radius (button, chip, image). Increase outer radius to match: `parent = child + padding`.

**Padding drives both**, spacing scale is fixed. Pick parent for the brand, compute child; or pick child and compute parent.

## Rules

1. **Never use the same radius on parent and child** when padding > 0. The curves won't be concentric.
2. **Child radius ≥ 0.** If `parent − padding` is negative, set `child = 0` (square inner corners).
3. **Apply at every nesting level.** Each parent/child pair gets its own triplet. Grandchild uses its immediate parent as "parent."
4. **Padding is the physical gap**, not border-width alone. If a border sits between curves, include it in the inset you measure.
5. **Match per corner.** Asymmetric radii (e.g. `12px 12px 0 0`), run the formula on each corner independently.

## Common mistakes

| Mistake | Typical default | Fix |
|------|--------------|-----|
| Clone radius | Parent `16px`, child `16px`, padding `12px` | Child → `4px` (`16 − 12`) |
| Oversized child | Child radius ≥ parent | Child → `0` or reduce child |
| Ignored padding | Tightens padding but leaves child radius unchanged | Recompute child |
| Flat stack | Every card `rounded-xl` with no nesting math | Audit nested pairs only where both layers are rounded |

## Examples

### Card with inner panel

Outer card: `border-radius: 16px`, padding: `12px`.

```
child = 16 − 12 = 4px
```

Inner panel: `border-radius: 4px`.

### Fixed button inside rounded bar

Button radius fixed at `8px`. Bar padding to button edge: `6px`.

```
parent = 8 + 6 = 14px
```

Bar: `border-radius: 14px`.

### Hero image inset in rounded frame

Frame: `24px` radius, `8px` padding.

```
child = 24 − 8 = 16px
```

Image wrapper: `border-radius: 16px`.

## CSS

```css
.card {
  --radius-parent: 16px;
  --padding: 12px;
  --radius-child: calc(var(--radius-parent) - var(--padding));

  border-radius: var(--radius-parent);
  padding: var(--padding);
}

.card__panel {
  border-radius: max(0px, var(--radius-child));
}
```

Use `max(0px, …)` so negative values clamp to square corners.

### Tailwind-style tokens

If parent is `rounded-2xl` (16px) and padding is `p-3` (12px):

- Inner element → `rounded` (4px) or explicit `rounded-[4px]`
- Do not give inner element `rounded-2xl`

## Audit workflow

For each nested pair where **both** have `border-radius > 0`:

1. Measure **parent** radius (computed or token)
2. Measure **padding/gap** between the two curve edges
3. Compute expected **child**: `parent − padding`
4. Compare to actual child radius, fix if off by more than 1px (rounding)

Flag as **High** when parent and child radii are equal with visible padding between them.

## Do / Don't

| Do | Don't |
|----|-------|
| Derive inner radius from outer + padding | Copy the same `rounded-*` class at every depth |
| Clamp child to 0 when math goes negative | Force a visible inner radius that breaks the curve |
| Use CSS variables for the triplet | Hard-code unrelated radius tokens per layer |
| Re-run formula when padding changes | Tune radius visually without the formula |

## Notes

- **Full-bleed children** (edge-to-edge image, no gap): child radius can equal parent on the flush corners only; inset corners still follow the formula where padding exists.
- **Circles / pills**: When parent is `9999px` and child is a pill, padding still subtracts, inner pill radius = outer − padding.
- **Design tools**: In Figma, set outer radius first, then inner = outer − padding. Auto-layout padding is the gap value.

## Text sits concentric to the corner radius

When a card ends with text, anchor the text **concentric to the corner**: the **start of the last line's baseline lands on the center of the corner's radius circle**, the same circle whose quarter-arc rounds that corner. The text therefore takes **both** a horizontal and a vertical inset equal to the radius `R`.

**Geometry.** A corner of radius `R` has its arc center at `(R, R)` from the corner: `R` in from the side edge, `R` up from the bottom edge. Put the leading end of the last baseline on that center point:

- **Horizontal:** the text's leading edge sits **`R`** from the side edge (`padding-inline-start: R`).
- **Vertical:** the last baseline sits **`R`** above the bottom edge (`padding-bottom` to the baseline `= R`).

Both insets equal the radius, so the corner curve and the text's bottom-leading corner share one center, they are concentric.

```
  card bottom-left corner
        ·  ← baseline start = center of the corner circle, at (R, R)
       ╱ ╲
      (   )  radius R, its quarter-arc is the card's rounded corner
       ╲ ╱
  ──────┼──────────────────  bottom edge   (baseline is R above this)
        │
     R from the side edge
```

**Why:** the last line defines where the card's bottom space begins; tying that corner to `R` makes the text concentric with the rounding instead of floating at an arbitrary padding. Small radius → tight, large radius → airier, the spacing scales with roundness and reads intentional. Same principle as the icon square in [components.md](components.md#buttons): let the geometry set the spacing.

**Implementation.** The vertical inset is measured to the **baseline**, not the line box (which extends below the baseline by the font's descent). Trim the trailing leading so the box ends at the baseline, then inset by `R` on both axes:

```css
.card { --r: 24px; border-radius: var(--r); }
.card__text {
  padding-inline-start: var(--r);   /* leading edge = R from the side (RTL-safe) */
  padding-bottom: var(--r);         /* last baseline = R above the bottom */
  /* end the text box at the alphabetic baseline so R lands on the baseline, not the descender */
  text-box-trim: trim-end;
  text-box-edge: cap alphabetic;
}
```

If the card already carries a base padding `P`, the text's **extra** inset is `R − P` on each axis (it stacks on the existing padding to total `R` from the card edge). Where `text-box-trim` is unavailable, approximate the vertical with `calc(var(--r) - (1lh - 1cap) / 2)`. Either way **verify on the rendered pixels**, measure the last-baseline start to the corner: `R` from the side, `R` from the bottom. This offset is invisible in the source.

**Audit:** for a rounded card whose last element is text, the last baseline's leading end should sit at the corner arc center, `R` from the side edge and `R` above the bottom edge. Text crowding the curve, or floating far from it, or inset on only one axis → **Medium**.
