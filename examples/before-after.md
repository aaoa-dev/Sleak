# Before & after examples

Annotated comparisons showing weak default patterns and the Sleak fix.

## Format

Each example should include:

1. **Context**, product type and constraint
2. **Before**, the weak pattern (with category tags)
3. **After**, what changed and why
4. **Checklist**, which checklist items this example exercises

---

## Example 1, Empty state (Content & copy)

**Context:** Project management app, first visit, no projects yet.

**Before** (weak pattern: welcome wall + vague CTA + closer energy)

> Welcome to your workspace!
>
> We're excited to help you organize your work and collaborate seamlessly with your team. Getting started is quick and easy, just create your first project to unlock the full power of the platform.
>
> [Get started]

**After** (Sleak: action-first, specific CTA, no filler)

> **No projects yet**
>
> [Create project]

**Checklist exercised:** headline leads with status; CTA is verb + object; no preamble/closer; no "seamless/quick/easy."

---

## Example 2, Nested radius (Concentric radius)

**Context:** Dashboard card with inset stats panel. Padding `12px`.

**Before** (weak pattern: same radius on both layers)

```css
.card       { border-radius: 16px; padding: 12px; }
.card__stat { border-radius: 16px; }
```

Curves fight each other, reads as stacked templates, not one shell.

**After**

```css
.card       { border-radius: 16px; padding: 12px; }
.card__stat { border-radius: 4px; }  /* 16 − 12 */
```

Or with variables: `--radius-child: calc(var(--radius-parent) - var(--padding))`.

**Checklist exercised:** `child + padding = parent`; parent ≠ child when padding > 0.

---

## Example 3, Section eyebrows

**Context:** SaaS landing page, five sections.

**Before** (weak pattern: eyebrow on every block + hero)

```
[Introducing]          ← hero eyebrow, delete
Ship faster with AI

[Features]             ← delete
Everything you need

[Why us]               ← delete
Trusted by teams

[Testimonials]         ← delete
What customers say
```

**After**

```
Ship faster with AI    ← headline only; no hero eyebrow

Everything you need    ← H2 only

Trusted by teams

What customers say
```

Optional: one factual badge elsewhere, e.g. `v2.0` on the announcement card, not an eyebrow above the H1.

**Checklist exercised:** hero no eyebrow; ≤ 1 eyebrow per page (here: zero).

---

## Example 4, Accent-hue blacks (Color)

**Context:** Blue accent `hsl(220, 85%, 55%)`, dark mode app shell.

**Before** (weak pattern: warm/red-tinted black with blue theme)

```css
--accent: hsl(220, 85%, 55%);
--bg:     hsl(10, 14%, 8%);   /* red-brown black, clashes */
--text:   hsl(0, 0%, 95%);
```

**After**

```css
--accent-h: 220;
--accent:   hsl(var(--accent-h) 85% 55%);
--bg:       hsl(var(--accent-h) 12% 8%);   /* same hue as accent */
--text:     hsl(var(--accent-h) 8% 94%);
```

Rule: saturation > 0 → hue = accent hue. Pure `#000` / `hsl(0 0% 0%)` stays valid when intentionally achromatic.

**Checklist exercised:** tinted darks match accent hue; no warm near-black under cool brand.

---

## Example 5, Full-width dividers (Layout)

**Context:** Marketing page, three sections in a centered `max-width` column.

**Before** (weak pattern: edge-to-edge rules between every block)

```html
<section class="border-b border-gray-200">…hero…</section>
<section class="border-b border-gray-200">…features…</section>
<section class="border-b border-gray-200">…pricing…</section>
```

Lines span the full viewport; page reads like a bordered wireframe.

**After**

```html
<section class="pb-16">…hero…</section>
<section class="py-16">…features…</section>
<section class="pt-16">…pricing…</section>
```

If a line is truly needed between two items **inside** a padded card:

```html
<div class="rounded-2xl p-4">
  <p>Item A</p>
  <div class="my-3 mx-0 h-px bg-border" aria-hidden="true"></div>
  <p>Item B</p>
</div>
```

Rule stays **inside** the card padding, not under the rounded outer edge at 100% width.

**Checklist exercised:** no full-width section dividers; spacing replaces rules.

---

## Example 6, Intentional accent (Color)

**Context:** SaaS landing page. Primary job: **Start free trial**.

**Before** (weak pattern: accent everywhere, dilutes the CTA)

- Accent gradient hero background
- Accent icons on all six feature cards
- Accent border on pricing cards
- Three buttons all `bg-primary`: "Learn more", "Contact sales", "Start free trial"

User can't tell which button matters; brand color becomes noise.

**After**

- Neutral hero surface; headline + copy in neutral hierarchy
- Neutral feature icons (or single accent icon only on the feature tied to trial)
- Pricing cards neutral; recommended plan uses **subtle accent tint** background (`/ 0.08`), not a loud border on every tier
- **One** full-accent button: "Start free trial"
- "Contact sales" → outline/secondary; "Learn more" → text link

**Checklist exercised:** one full-accent focal point; tints support path; no decorative accent on every block.

---

## Example 7, Motion budget (Motion)

**Context:** Dashboard with 12 stat cards, sidebar nav, data table.

**Before** (weak pattern: same spring on everything)

```jsx
{cards.map(card => (
  <motion.div
    whileHover={{ scale: 1.05, transition: { type: "spring", bounce: 0.4 } }}
  >
    …
  </motion.div>
))}
```

Every card bounces on hover. Motion noise; nothing feels primary.

**After**

- Stat cards: **no hover motion**, static surface, color border on focus only
- Table rows: `background-color` 100ms on hover
- **One** highlighted card (today's KPI): optional subtle lift, single spring, `bounce: 0.2`
- Primary button: `scale(0.96)` on `:active` only
- Modal open: `ease-out` 200ms opacity + translate

**Checklist exercised:** ≤2 expressive springs; high-frequency hover subtle; recipes vary by role.

---

## Example 8, Clickable card (Components)

**Context:** Project grid. Each tile shows image, title, summary, and "View project" button.

**Before** (weak pattern: only the button navigates)

```html
<div class="card">
  <img alt="" src="…" />
  <h3>Project Alpha</h3>
  <p>Redesign of the checkout flow.</p>
  <button type="button" onclick="go('/projects/alpha')">View project</button>
</div>
```

Clicking the title or padding does nothing. Large target wasted.

**After**

```html
<a href="/projects/alpha" class="card">
  <img alt="" src="…" />
  <h3>Project Alpha</h3>
  <p>Redesign of the checkout flow.</p>
  <span class="card__cta">View project</span>
</a>
```

Hover and focus apply to `.card`. One tab stop. CTA reads as a button but is part of the link.

**Checklist exercised:** whole card navigates; card-level affordance; single primary target.

---

## Example 9, Typography (line length & center align)

**Context:** Marketing hero on desktop, 1200px content column.

**Before** (weak pattern: centered wall of text at full width)

```html
<section class="hero" style="text-align: center; max-width: 1200px;">
  <h1>Ship faster</h1>
  <p>
    Our platform helps teams collaborate seamlessly across every stage of the
    product lifecycle with tools designed for modern workflows and real-time
    feedback from stakeholders around the world.
  </p>
</section>
```

Paragraph wraps to 5+ centered lines, ~20 words per line. Hard to read.

**After**

```html
<section class="hero">
  <h1 style="text-align: center; max-width: 45ch; margin-inline: auto;">
    Ship faster
  </h1>
  <p style="text-align: start; max-width: 55ch; margin-inline: auto;">
    Tools for teams to build and ship together. Real-time feedback, one workspace.
  </p>
</section>
```

Headline: 1 line, centered, narrow measure. Body: start-aligned, ~7–12 words per line, ≤3 lines.

**Checklist exercised:** line length; center ≤3 lines; half-width measure on hero title.

---

## Example 10, Full landing page (composite)

**Context:** SaaS marketing page for "Flowstack", a team project tool. **Same content and same 16-section layout, two implementations.** The *before* was built as a natural default (no skill consulted); the *after* is that file duplicated with Sleak applied, so the only differences are the craft details each rule governs.

**Live files**

| Version | File | Open |
|---------|------|------|
| Before (no Sleak) | [landing-before.html](landing-before.html) | Honest default build; carries the anti-patterns |
| After (Sleak) | [landing-after.html](landing-after.html) | Same file, every rule applied |

### Page sections (both files)

| # | Section | Before | After fix |
|---|---------|--------|-----------|
| 0 | Announce bar | Gradient promo strip, "unlock seamless team velocity" | Factual changelog line, neutral surface |
| 1 | Nav | Gradient accent CTA, accent brand + hover | Neutral links, one primary CTA (pill) |
| 2 | Hero | "Welcome" pill, gradient H1, gradient stat numbers, stats top-divider, section divider, symmetric icon-button padding | No eyebrow, neutral H1, one primary + ghost, icon-square + pill buttons, spacing not rules |
| 3 | Logos | "Trusted by" eyebrow + H2 + fluff, section divider | Muted caption, wordmarks, no kicker |
| 4 | Features | Eyebrow, gradient icon, accent link inside dead `<div>`, spring lift | Whole-card `<a>`, neutral mark, shadow/border hover |
| 5 | Bento | Container, cards, media, columns, chips **all `1.5rem`** (non-concentric); arbitrary label padding | Concentric radius `40 → 24 → 12 → 4 → 0`; text baseline concentric to the corner; container level |
| 6 | Use cases | Eyebrow, gradient icons, **no link at all** (dead cards) | Whole-card `<a>` role links, specific copy |
| 7 | How it works | Eyebrow, gradient number circles, section divider | Neutral number chips, start-aligned, spacing |
| 8 | Testimonials | Eyebrow, gold stars + gradient avatars, non-clickable cards | Whole-card `<a>`, narrow measure, "Read case study →" |
| 9 | Compare | Eyebrow, gradient thead, row borders, accent checkmarks | Muted header, inset row rules, `Yes` in text color |
| 10 | Integrations | Eyebrow, bordered squares, scale/lift hover | Neutral pills, color-only hover |
| 11 | Security | Eyebrow, radial-gradient band, scale-hover badges | Plain section, static chips |
| 12 | Pricing | Eyebrow, scaled gradient "hot" card, both "Get started" | One accent CTA on Pro (pill), ghost "Choose Starter" |
| 13 | Resources | Eyebrow, gradient thumbs, link inside dead `<div>` | Whole-card `<a>`, neutral thumb, readable measure |
| 14 | FAQ | Eyebrow, generic answers | No eyebrow, factual answers, readable measure |
| 15 | Final CTA | Gradient band, eyebrow, 2 CTAs | Calm surface tier, one primary (pill) + quiet link |
| 16 | Footer | Full-width top border, accent headings, "Built with ❤️" | Surface tier, muted headings, `© 2026 Flowstack` |

### Before → violations (by rule)

| Category | What's wrong |
|----------|----------------|
| Section eyebrows | **14**: hero "Welcome" pill + 13 section kickers (logos, features, overview/bento, use cases, how it works, testimonials, compare, integrations, security, pricing, resources, FAQ, final CTA) |
| Content & copy | "Welcome to Flowstack", "Empower your team to ship seamlessly", seamless/robust/journey/leverage, "Get started"/"Learn more"/"Book a demo", promo bar, "Built with ❤️" closer |
| Intentional accent | Nav, gradient H1, stat numbers, card icons, checkmarks, badges, gradient bands, full chroma everywhere; no single focal point |
| Accent-hue | Two-hue accent (violet + fuchsia gradients); neutrals hardcoded ad-hoc, not derived from one hue |
| Concentric radius | Bento container, cards, media, columns, and chips all `1.5rem` with padding between → curves not concentric; label bottom padding arbitrary |
| Full-width dividers | `border-bottom` on header, hero, every `section.block`, security band, footer |
| Typography | Fixed 15px base (no breakpoint scaling); centered section intros; no line-length caps |
| Clickable cards | Features/resources link sits in a dead `<div>`; use-case and testimonial cards have no link at all |
| Buttons | Icon buttons keep symmetric padding → icon not in a square; icon side = text side |
| Motion | `transition: all`, spring `cubic-bezier(.34,1.56,.64,1)`, scale/translate hover on nav, buttons, and every card; no reduced-motion |
| Contrast | Not checked; gradient text and light greys never verified |

### After → fixes applied

| Category | What changed |
|----------|----------------|
| Section eyebrows | Zero across all 17 sections |
| Content & copy | Action-first headlines, verb+object CTAs, factual FAQ/resources, no promo fluff or footer closer |
| Intentional accent | Full accent only on the recurring primary CTA (nav, hero, Pro plan, final CTA); everything else neutral |
| Accent-hue | Single `--accent-h: 262`; every neutral (text/muted/line/surface) derived from it |
| Layout | Section spacing + alternating `.tint` surface tiers; no full-width section rules |
| Concentric radius | Bento derives each layer from its parent: container `40 → card 24 → media 12 → columns 4 → chips 0` (clamped). Card labels sit **concentric to the corner**, last baseline start at the corner arc center (`R` in, `R` up) |
| Typography | `rem` base scales at 900/1280px; prose capped near ~55ch |
| Clickable cards | Features, use cases, testimonials, resources are whole-card `<a>` elements with card-level hover + focus ring |
| Buttons | Icon in a square: icon-side padding = vertical, text side ≈ 2×; `line-height: 1` so the square holds; pill radius |
| Motion | 140–160ms ease-out on color/border/shadow; `scale(0.98)` on primary press only; `prefers-reduced-motion` handled |
| Contrast | Every text pair verified **WCAG AA + APCA**: `--text`/`--muted` pass on all surfaces; `--faint` demoted to decorative-only; primary button (white on accent) 6.4:1 |

**How to compare:** Open both HTML files in a browser side by side, or run a local server from `examples/`.

```bash
cd examples && python3 -m http.server 8080
# http://localhost:8080/landing-before.html
# http://localhost:8080/landing-after.html
```

**Checklist exercised:** all sections in [checklist.md](../checklist.md).
