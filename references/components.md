# Components

Cards, buttons, navigation, forms, lists, and interaction patterns that match how users expect content to behave.

## Core (see dedicated references)

- Nested rounded UI → [concentric-radius.md](concentric-radius.md)
- Section kickers / overlines → [section-eyebrows.md](section-eyebrows.md)

## Purpose

Catch component patterns that look polished but behave wrong: decorative cards with tiny click targets, nested controls that fight each other, or actions hidden behind a single small button.

## Clickable cards (content behavior)

**If a card contains a button to open or access its content, the whole card should be clickable, not just the button.**

Users read the card as one unit. A title, image, summary, and "View" button on the same surface implies the entire block goes somewhere. Making only the button work forces precise aiming and reads as unfinished implementation.

### Rule

| Situation | Behavior |
|-----------|----------|
| Card has **one** primary action (open detail, read article, go to project) | **Entire card** is the hit target |
| Button label mirrors card intent ("View", "Open", "Read more", "Go to…") | Card + button share **one** navigation action |
| Card is **presentational only** (no destination) | No fake button; no pointer cursor on the shell |
| Card has **multiple** actions (open + bookmark + menu) | Primary path = whole card or dominant region; secondary controls stay separate, clearly clickable |

### Implementation

**Prefer one interactive element**, not a button floating inside a dead div.

```html
<!-- Good: whole card is the link -->
<a href="/projects/alpha" class="card">
  <img alt="" src="…" />
  <h3>Project Alpha</h3>
  <p>Summary text</p>
  <span class="card__cta">View project</span>
</a>
```

The CTA can look like a button but is part of the link. One tab stop, one `click` target.

**Stretched link** (card stays semantic, link covers surface):

```html
<article class="card">
  <h3>Project Alpha</h3>
  <p>Summary text</p>
  <a href="/projects/alpha" class="card__link">
    <span class="sr-only">View Project Alpha</span>
  </a>
  <span class="card__cta" aria-hidden="true">View project</span>
</article>
```

```css
.card { position: relative; }
.card__link::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.card__cta { position: relative; z-index: 1; pointer-events: none; }
```

**Avoid:** `<div class="card">…<button>View</button></div>` with no handler on the card shell.

**Never:** `<a><button>View</button></a>` (invalid nesting, broken accessibility).

### Secondary actions on the same card

If the card opens content **and** has a kebab menu or favorite toggle:

- Primary: stretched link or card click → detail view
- Secondary: icon buttons **above** the stretched layer (`z-index`, `pointer-events: auto`) with their own handlers
- Stop propagation on secondary clicks so they don't trigger navigation

Document which region does what. Don't hide the only action behind a 32px label.

### Visual feedback

When the whole card is clickable:

- **Hover/focus** on the card shell (background, border, shadow), not only on the faux button
- **Cursor:** `pointer` on the card
- **Focus ring** around the card (or the covering link), visible for keyboard users
- Match [concentric-radius.md](concentric-radius.md) on the interactive boundary

### Common mistakes

| Mistake | Fix |
|---------|-----|
| Large card, only "Read more" clicks | Wrap card in one link or stretched link |
| Button as sole hit target on tile grid | Full tile clickable; CTA is visual affordance |
| `onClick` on button only in React | `onClick` on card/link wrapper, or `<Link>` wraps card |
| Entire card clickable but no hover state | Card-level hover/focus styles |
| Card link + inner button both navigate | One primary control; style span as button |
| Secondary icon triggers navigation | `stopPropagation` + separate button semantics |

### Audit

For each content card with a "View / Open / Read" pattern:

1. Click the **padding** away from the button. Does it navigate? If no → **High**
2. Tab to the card. One focus stop for the primary action? If multiple for one destination → **Medium**
3. Screen reader: is the destination clear (`aria-label` or visible heading in link name)?

### Exceptions

- **Explicit multi-action cards** (e.g. pricing tier with "Contact sales" vs "Start trial" as two real choices): not one destination; don't force whole-card single link
- **Selectable cards** (checkbox/radio choose one): whole card toggles selection, not navigation
- **Drag handles or reorder**: primary interaction is drag, not navigation; don't stretch a link over the card

## Do / Don't

| Do | Don't |
|----|-------|
| One primary hit target per navigational card | Decorative card chrome + lone small button |
| Stretched link or wrapping `<a>` | Dead div + isolated button |
| Card-level hover and focus | Button-only hover in a large tile |
| Separate controls for secondary actions | Nested `<button>` inside `<a>` |
| `sr-only` link text when heading isn't enough | Empty or "Click here" link names |

## Notes

- Pairs with [content-copy.md](content-copy.md): CTA label should name the action; card heading often becomes the link name
- Pairs with [motion.md](motion.md): subtle card hover is OK; don't spring every tile (see motion budget)
- Platform: iOS/Android often use full-row/cell tap natively; web cards should match that expectation

## Button hierarchy, states & size
### Three weights, hierarchy not by colour alone

Most UIs need three button weights, and the difference must survive colour-blindness, never
rely on hue alone to tell them apart:

| Weight | Style | Use |
|--------|-------|-----|
| **Primary** | Solid fill (accent), white text | The one most important action |
| **Secondary** | Outlined (border + accent text), no fill | Important but not primary |
| **Tertiary** | Text/link style, underlined | Least important |

- **Avoid a light-grey secondary fill**, it reads as *disabled*. Use an outline instead.
- Don't make primary and secondary similar weight/contrast; the hierarchy should be obvious
  at a glance and to the colour-blind.
- **Try to avoid disabled buttons**, they can look broken and give no path forward; prefer
  validating on submit and explaining what's needed (see [ux.md](ux.md)).

### States: distinguishable, not noisy

Each state (enabled, hover, pressed, focus, loading, disabled) must be clearly different from
the others, but don't overdo the change. Drastic per-state restyling is visual noise; a
measured shift in fill/elevation is enough. (Motion between states → [motion.md](motion.md).)

### Target size & hit area

- **Minimum 48×48px** (aligns to an 8pt grid; slightly above the WCAG **44×44** floor).
  Desktop mouse targets can go to ~32–40px, but touch/primary stays ≥44.
- **Separate adjacent buttons by ≥ 8px** to prevent mis-taps.
- **Extend the hit area beyond the visible glyph** with padding, especially for tertiary
  links and list items, whose tappable area is easy to forget. Never a bare icon with no
  invisible padding.

### Icon + text

- **Lead with the icon** when it aids scanning / communicates the action (icon before label,
  like an icon list). A trailing icon is for *where it leads* ("Log out" →, "Send" ✈).
- Match icon **weight and size** to the text, or balance a heavier icon by **lowering its
  contrast** (medium neutral vs dark text). See the square-padding geometry below.
- **Label = action verb + object.** Never "Click here" (users tap/keyboard too) or vague
  "Submit" when "Pay $49" is clearer (see [content-copy.md](content-copy.md)).

## Icon system

Icons look unified only when the rules are set **before** you draw them. Decide up front and
apply consistently:

- **Filled or outline?** Pick one as the default. A common split: solid/one-colour for utility
  and action icons (bell, cog), more expressive/multicolour for navigation or brand icons.
- **Line weight**, one stroke width across the set (match it to text weight when paired; see
  icon+text balance above).
- **Colour count**, usually one; document any exceptions.
- **Sizes**, a small set on the 4-based scale (16/20/24…), so icons align with text and
  spacing.
- **Art boundary**, a consistent inner icon boundary inside an outer box, so glyphs feel the
  same visual size even when shapes differ.
- **Format:** ship icons as **SVG** (crisp at any size, styleable); raster (PNG/JPG) only for
  photos.

Store these as shared assets/[tokens](design-systems.md) so every product draws from one set.
Depth/elevation (shadows, z-index) should likewise come from a standardized scale, not per-icon
one-offs, see [design-systems.md](design-systems.md).

### Alignment & control states

- **Left-align buttons** in forms and dialogs (stack them on multi-step flows). They stay on the
  reading axis and, under screen magnification, don't get scrolled out of view the way a
  right-aligned button can.
- **Give every interactive control distinct states**, default, hover, open, selected, disabled,
  via colour/shading/icon, with a smooth transition. A dropdown or control whose current state
  you can't read is a dead end.

## Buttons

A button's padding is **not** one uniform box. It follows the content: an icon needs equal space on every side, while text needs more room on its open end than it does next to an icon.

### Rule 1, icons sit in a square

An icon always gets the **same padding on all sides**, top, bottom, and its outer (edge-facing) side are equal, so the icon occupies a **square container** against whichever edge it's on.

- The **vertical padding** (top/bottom) defines that square.
- The icon's **outer horizontal padding equals the vertical padding**, completing the square.

### Horizontal padding is uneven

The two horizontal sides of a button are usually **not** equal:

| Side | Padding |
|------|---------|
| **Icon side** (edge nearest the icon) | = vertical padding (completes the square) |
| **Text side** (open end past the label) | ≈ **2×** the icon side |

So the **icon-side padding is about half the text-side padding**. Text wants a larger end inset to breathe; an icon already framed by a square of space does not.

```
 leading icon + text                     text + trailing icon
┌─────────────────────────┐             ┌─────────────────────────┐
│ ▢   Label            │             │            Label   ▢ │
│ p  gap      2p       │             │ 2p       gap      p  │
└─────────────────────────┘             └─────────────────────────┘
   p  = vertical padding (icon's square: p on top, bottom, outer side)
   2p = text-side padding  →  icon side is half the text side
```

### Icon-only

Equal padding on all four sides → a square (or circular) button. Same square rule applied to every edge.

```
┌──────┐
│  ▢  │   padding = p on every side
└──────┘
```

### Text-only

No icon, so **both** horizontal sides use the larger text inset (symmetric); vertical padding as usual.

### Exception, fill-container buttons

When a button **stretches to fill its container** (full-width / block), the uneven rule does not apply, **center the content** (icon + label as one group) with symmetric horizontal padding. The width now comes from the container, not the content, so lopsided padding would only push the group off-center.

### Implementation

```css
.btn {
  --pad-y: 0.65rem;                     /* vertical padding = the icon's square inset */
  --pad-text: calc(var(--pad-y) * 2);   /* text-side padding ≈ 2× the icon side */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;                          /* space between icon and label (not padding) */
  line-height: 1;                       /* REQUIRED: let the icon define height, not the text
                                           line box, otherwise the vertical gap exceeds --pad-y
                                           and the icon square breaks (see gotcha below) */
  padding: var(--pad-y) var(--pad-text);/* text-only: symmetric horizontal */
}
.btn .icon { flex: none; width: 1.25em; height: 1.25em; display: grid; place-items: center; }

/* leading icon → icon side collapses to the square inset */
.btn:has(.icon:first-child) { padding-left: var(--pad-y); }
/* trailing icon → icon side collapses to the square inset */
.btn:has(.icon:last-child)  { padding-right: var(--pad-y); }

/* icon-only → square: equal padding on all sides */
.btn.is-icon-only { padding: var(--pad-y); }

/* fill container → center content, symmetric padding */
.btn.is-block { width: 100%; justify-content: center; padding-inline: var(--pad-text); }
```

No `:has()` support? Set the icon side explicitly with a modifier class instead: `.btn--icon-left { padding-left: var(--pad-y); }` / `.btn--icon-right { padding-right: var(--pad-y); }`.

**Gotcha, line-height inflates the vertical gap.** The square only holds if the **icon**, not the text line box, defines the button's content height. A button that inherits `line-height: 1.6` makes the flex line taller than the icon, so the icon is centered with *extra* vertical space (`--pad-y` **plus** the leftover) while the icon-side horizontal padding stays exactly `--pad-y`, more space above/below the icon than beside it, and the "square" is broken. Set **`line-height: 1`** on the button (padding provides the height) so the top/bottom gap collapses to `--pad-y` and matches the icon side. **Verify by measuring the rendered pixels** (icon-to-edge top ≈ bottom ≈ outer side), not by reading the CSS, this asymmetry is invisible in the source.

### Common mistakes

| Tell | Fix |
|------|-----|
| Icon crammed against the edge / uneven space around it | Equal padding all sides; icon in a square |
| Same left and right padding on an icon+text button | Icon side = vertical padding; text side ≈ 2× |
| Icon-only button that isn't square | Equal padding every side (or fixed square) |
| Full-width button with content shoved left | Center the group; symmetric padding |
| Different icon box sizes across buttons | One icon size token; consistent square |

### Audit

1. **Icon square, measured on the rendered pixels** (not the CSS): is the icon's top ≈ bottom ≈ outer-side gap? Unequal (usually vertical > outer, from `line-height`, set `line-height: 1`) → **Medium**. Reading the source hides this; screenshot and measure.
2. **Uneven horizontals:** on an icon+text button, is the text side ≈ 2× the icon side? Equal both sides → **Medium**.
3. **Fill state:** full-width button, is the content centered with symmetric padding? Off-center → **Medium**.

### Do / Don't

| Do | Don't |
|----|-------|
| Frame every icon in an equal-padded square | Let icon padding drift per side |
| Icon side ≈ half the text side | Symmetric padding on an icon+text button |
| Center content when the button fills its container | Keep lopsided padding on a block button |
| One icon-size + `--pad-y` token driving all buttons | Hand-tune padding per button |
