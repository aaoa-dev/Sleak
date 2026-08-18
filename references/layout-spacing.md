# Layout & spacing

Catch layout patterns that feel templated, including the habit of slicing every section with edge-to-edge lines.

## Core (see dedicated references)

- Nested rounded containers → [concentric-radius.md](concentric-radius.md)

## Purpose

Fix grid, rhythm, and separation choices that read as generic dashboard / landing-page boilerplate.

## Avoid full-bleed section dividers

**Do not slice a landing page into strips** with full-bleed lines between sections. A full-width `<hr>`, a `border-bottom` on a 100%-width section wrapper, or any viewport-wide rule between hero / features / pricing / footer is the template tell.

**Scope:** this rule is about **section-level** dividers on a page. A 1px separator **inside** a dense list or data table is fine, often clearer than gaps, as long as it stays inset to that component's own content box. Don't read this as "never draw a line."

### Rule

- **Between page sections:** no divider by default; separate with **spacing** (margin/padding) or a **surface tier**.
- **If a section line is truly needed:** **inset** it, width matches the content column, never the viewport or a card's outer edge.
- **Inside lists / tables:** a hairline row separator is allowed (and often better than gaps), inset to the list's content box.
- **Never** stack full-bleed rules between every section on a page.

### Why it weakens the layout

- Template layouts use horizontal rules as cheap structure
- Lines at 100% width fight rounded containers and concentric radius
- Edge-to-edge rules make marketing pages look like wireframes with borders turned on

### Alternatives

| Instead of… | Use… |
|-------------|------|
| Full-width `<hr>` between sections | Section spacing (`gap`, `padding-block`) |
| List-row line **bleeding to the viewport** edge | Inset the row hairline to the list's content box (lines between rows are fine) |
| Line between sidebar and main | Background shift or whitespace, not a 1px wall |
| Divider under every heading | Heading margin-bottom only |
| Grid of cards with lines between | Gap between cards; card surface defines the block |

### Inset divider (when a line is justified)

Align to the **content inset**, not the container edge:

```css
/* Bad, full bleed */
.section { border-bottom: 1px solid var(--border); }

/* Good, inset to content padding */
.section__divider {
  height: 1px;
  margin-inline: var(--padding); /* or max-width + mx-auto on inner rule */
  background: var(--border);
}
```

In a padded card (`padding: 16px`), the divider sits **inside** the padding, same inset as text, not under the rounded border.

### Exceptions

- **Data tables / dense admin lists**, row separators may be inset within the table, still avoid bleeding past the table's content box when the table itself is inset.
- **Explicit design system**, if the product already uses full-width dividers consistently, match the system; don't introduce a new pattern mid-page.
- **Accessibility**, `<hr>` with semantic meaning ( thematic break in prose ) is OK in long-form content; not as a default section decorator on landing pages.

### Audit

Count **full-bleed section** rules on the page (row separators inset within a list or table don't count):

- **0–1**, good (prefer 0)
- **One between every section**, **Medium/High**; replace with spacing or a surface tier
- **Inside rounded cards at full bleed**, **High**; breaks radius harmony

## Spacing scale: base-4

Don't hand-pick gaps. Derive every margin, padding, and gap from a **4px base**, use
multiples of 4 (4, 8, 12, 16, 24, 32, 48, 64, 80…). Reasons it's the modern default:

- iOS and Android both recommend metrics divisible by 4; icons are 4-based (16/24/32) so they
  scale cleanly; the browser's default font size is 16.
- When everything snaps to one scale, elements **line up and "fit"** without pixel-nudging,
  and responsive math stays clean.
- **8-based** works well for most horizontal spacing; a 1px border can throw alignment off by
  a hair, subtract it case-by-case, don't abandon the scale.

Store the steps as [tokens](design-systems.md) (`--space-4: 1rem`) and space **related elements
closer than unrelated** ones (see grouping, below).

### Responsive by flow

Avoid fixed `width`/`height`, let elements **grow and shrink to fill** the space they're
given; it makes responsive layout far easier. Images: `max-width: 100%`, `height: auto`, with
a few preset fractions (½, ⅓, ¼) as *max-widths* so they rescale on small screens.

## Visual hierarchy & the squint test

Present information in **order of importance**, the eye should land on the most important thing
first. Build hierarchy with **size, weight, contrast, colour, and spacing** (plus depth/elevation
; see [design-systems.md](design-systems.md)), not by making everything loud.

**The squint test:** blur your eyes (or the screen) until detail drops out. Whatever still
stands out *is* your hierarchy, if the wrong things pop, or everything reads equally loud, it's
off. A fast, tool-free audit at any fidelity.

## Grouping related elements
Structure comes from **grouping**, not from boxing everything. Four ways to signal that
elements are related, from strongest to most subtle:

1. **Common region**, put them in one container (border, shadow, background). Strongest cue,
   but the heaviest. **Don't box every group**, containers everywhere = clutter.
2. **Proximity**, place related elements closer together; push unrelated ones apart. Often
   enough on its own, and lighter than a container.
3. **Similarity**, give related items the same size/shape/colour. Corollary: elements that
   **function the same should look the same**, and elements that function differently should
   look different (a non-interactive badge shouldn't look like a button).
4. **Continuity**, align items along a line; the eye follows it as a group. Break the line
   to end a group or highlight one item.

**Prefer spacing over containers.** When proximity + similarity + continuity already group
things, drop the box, it simplifies the design without losing the grouping.

**Form fields:** keep each **label close to its field** (and closer to its own field than to
the next), so it's unambiguous which label belongs to which input, and the eye focuses once.

## Common mistakes

| Tell | Fix |
|------|-----|
| `<hr>` after hero, features, pricing, footer | Remove; increase section `padding-block` |
| List row hairline bleeding past the list's content box | Inset the row `border-b` to the list padding (a line between rows is fine) |
| Divider + eyebrow + heading | Drop divider and eyebrow; keep spacing + H2 |
| Lines at viewport width inside max-width layout | Inset to `max-width` content column |

## Fixes

1. Remove the rule element or `border-*` on full-width wrappers.
2. Increase vertical spacing between sections (often 1.5–3× current gap is enough).
3. If separation is still unclear, use **surface change** (background tier) not a line.
4. When a line remains, wrap content in a padded inner; draw the rule **inside** that inset.

## Do / Don't

| Do | Don't |
|----|-------|
| Separate with whitespace and type hierarchy | Default to `<hr>` between blocks |
| Inset dividers to content padding | Span lines corner to corner |
| Let card gaps and backgrounds define groups | Grid of boxes + full-width rules |
| Match divider inset to text alignment | Bleed dividers through rounded parents |

## Notes

- Pairs with [concentric-radius.md](concentric-radius.md): full-bleed lines often ignore nested corner geometry.
- Pairs with [section-eyebrows.md](section-eyebrows.md): template pages combine eyebrows + full-width dividers, remove both.
