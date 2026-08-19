# Sleak checklist

Pre-ship audit. Mark each item pass/fail. Fix all **High** failures before shipping.

## Core (check first)

See [concentric-radius.md](references/concentric-radius.md), [section-eyebrows.md](references/section-eyebrows.md), and [color.md](references/color.md).

### Concentric corner radius

- [ ] Every nested parent/child pair with rounded corners satisfies `child + padding = parent` (or equivalent form)
- [ ] Parent and child do not share the same radius when padding between them is > 0
- [ ] Child radius clamped to 0 when `parent − padding` would be negative
- [ ] Per-corner radii computed independently when corners differ
- [ ] Text in a rounded card sits **concentric to the corner**: the last line's baseline start lands on the corner arc center, `R` from the side edge **and** `R` above the bottom edge (both axes), measured on the render

### Section eyebrows

- [ ] Hero has no eyebrow (or at most one factual release badge, not a category kicker)
- [ ] Page has ≤ 1 section eyebrow total (zero is the default)
- [ ] No eyebrow duplicates nav labels or section names ("Features", "Pricing", "Testimonials")
- [ ] Section hierarchy uses headings and spacing, not repeated kickers on every block

### Intentional accent use

- [ ] Full accent reserved for the primary task, not decorative icons, borders, or headings
- [ ] At most 1–2 full-saturation accent focal points per view; secondary actions neutral/outline
- [ ] Opacity tints used sparingly and only where they support the primary action path
- [ ] Primary task obvious in ~3 seconds; no competing equally loud accent CTAs

## Typography

See [references/typography.md](references/typography.md).

- [ ] Body and subtitles aim for **7–12 words per line** (typically `max-width` ~`42ch`–`65ch`, near `55ch`)
- [ ] Center-aligned blocks: **≤3 lines**, short copy, constrained to ~half column or ~`35ch`–`45ch`
- [ ] Longer text is start-aligned with normal paragraph measure, not centered full-width
- [ ] Font sizes scale by device / viewing distance (hand → arm → ~2 m for TV); not one size everywhere
- [ ] Desktop reading text ≥14px body (16–18px preferred); no 8px readable copy on desktop
- [ ] Mobile body ≥16px on web; tiny sizes only for brief labels with strong contrast
- [ ] Type uses `rem` / semantic scales so user zoom and platform text settings still work

## Contrast

See [references/contrast.md](references/contrast.md). Check **both** methods, mathematical and perceptual.

- [ ] Checked on the **rendered page** (screenshot + sampled pixels), not from CSS tokens, the cascade, specificity, and inheritance can override the intended color
- [ ] Body text clears **WCAG 4.5:1** (large text / bold ≥ 3:1) against its real background
- [ ] Same text also clears its **APCA** target (Lc ≥ 75 body, ≥ 45 large/bold); fix even if WCAG passed
- [ ] Meaningful non-text (icons, input borders, dividers, focus rings, chart marks) ≥ **3:1**
- [ ] Focus indicator visible ≥ 3:1 against **both** the component and the page
- [ ] Contrast tested against the **resolved** background (tints, gradients, overlays, images at worst point)
- [ ] Placeholder not used as the only label; low-contrast hint text has a real `<label>`
- [ ] Hover, active, disabled, and **dark mode** states re-checked, not just the default
- [ ] Contrast gained via **lightness**, hue stays aligned to accent (not desaturated to a clashing gray)
- [ ] Meaning not encoded by hue alone; paired with text, icon, or shape

## Layout & spacing

See [references/layout-spacing.md](references/layout-spacing.md).

- [ ] No full-bleed dividers between page sections (list/table row hairlines inset to their component are fine)
- [ ] Separation uses spacing, surface tiers, or inset rules, not stacked `<hr>` / `border-b`
- [ ] Any line dividers align to content inset (padding column), not viewport or card outer edge
- [ ] List/table row separators inset within their container when lines are used

## Color

See [references/color.md](references/color.md).

- [ ] Dark neutrals with saturation > 0 use the same hue as the theme / accent
- [ ] No warm or red-based near-black under a cool accent (or mismatched hue families)
- [ ] `--accent-h` (or equivalent) defined once; tinted surfaces derive from it
- [ ] True achromatic black/gray (`saturation = 0`) used only when intentionally neutral
- [ ] Default library gray scales retinted or replaced to match accent hue
- [ ] Contrast re-checked after hue alignment

## Components

See [references/components.md](references/components.md).

- [ ] Content cards with a "View / Open / Read" action: entire card navigates, not just the button
- [ ] One primary link or stretched-link target per navigational card; no nested `<button>` inside `<a>`
- [ ] Card-level hover, focus ring, and pointer cursor match the full clickable area
- [ ] Secondary actions (menu, favorite) sit above the link layer with separate handlers and `stopPropagation`
- [ ] Multi-action or selectable cards documented; whole-card click only when one primary destination exists
- [ ] Button icons sit in a **square**: equal padding top, bottom, and outer edge, **measured on the rendered pixels** (set button `line-height: 1` so the text line box doesn't inflate the vertical gap)
- [ ] Icon+text buttons use **uneven** horizontal padding, icon side ≈ half the text side
- [ ] Icon-only buttons are square (equal padding all sides); text-only buttons are symmetric
- [ ] Full-width / fill buttons center their content with symmetric padding

## Motion

See [references/motion.md](references/motion.md).

- [ ] High-frequency interactions (hover rows, tabs, typing) use no motion or ≤150ms color/opacity only
- [ ] Each animation has a named purpose (feedback, spatial, state), not "looks cool"
- [ ] At most 1–2 expressive springs or bouncy hovers per view; not on every card
- [ ] Motion recipes vary by role, not the same spring/duration copied everywhere
- [ ] UI durations under 300ms; ease-out on enter/exit (never ease-in on UI)
- [ ] No `transition: all`; animate `transform` and `opacity` only
- [ ] Stagger only on infrequent entrances (onboarding, first view), not every section
- [ ] State changes visible without motion (color/icon/label); `prefers-reduced-motion` handled

## Content & copy

See [references/content-copy.md](references/content-copy.md).

- [ ] Headline or title leads with action, object, or status, not "Welcome to…"
- [ ] Primary CTA is verb + object (not generic "Get started" / "Learn more")
- [ ] One job per label; helpers are one line max
- [ ] Multi-step flows use numbered steps, one action each
- [ ] No preamble, recap, or closer padding ("Hope this helps", "Let us know…")
- [ ] Errors are matter-of-fact: what failed + what to do (no "Oops!")
- [ ] Time and limits are specific or omitted, not "quick" / "easy"
- [ ] Visible lists capped at 5 or split into ranked groups
- [ ] No generic marketing voice (seamless, empower, journey, etc.)
- [ ] Surrounding prose (landing copy, docs, README) is free of AI-tell patterns: puffery, fancy "is" synonyms, forced triads, bold-label-as-fake-structure, chatbot tics
- [ ] Title + primary button alone make the screen's purpose clear

## Accessibility

See [references/accessibility.md](references/accessibility.md). Contrast is covered separately above.

- [ ] Every interactive control has an accessible name (icon buttons get `aria-label`; inputs have real `<label>`)
- [ ] Meaningful images have `alt`; decorative images use `alt=""`
- [ ] Visible `:focus-visible` indicator on all focusable elements (no bare `outline: none`)
- [ ] Fully keyboard-operable: logical tab order, no traps, custom widgets handle Esc/arrows/Enter
- [ ] Interactive uses native elements (`<button>`, `<a>`, `<input>`) rather than `div` + `onClick`
- [ ] Touch/hit targets ≥ 44×44px with spacing to avoid mis-taps
- [ ] No meaning encoded by color alone (paired with text, icon, or shape)
- [ ] One `<h1>`, heading levels don't skip, landmarks present; layout survives 200% zoom

## UX (states & interaction)

See [references/ux.md](references/ux.md).

- [ ] Loading, empty, and error states designed, not just the populated state
- [ ] Destructive/irreversible actions confirm or offer undo; confirm button names the action
- [ ] Actions are `<button>`, navigation is `<a href>`, submits live in a `<form>`
- [ ] No dead zones: checkbox/radio labels clickable, full card/row surface interactive
- [ ] Mobile input `font-size ≥ 16px` (avoids iOS focus-zoom); correct `type`/`inputmode`/`autocomplete`
- [ ] No font-weight change on state (use color/background to avoid layout shift); space reserved for appearing content
- [ ] Every action gives feedback within ~100ms; user input preserved on error/navigation

## Cross-cutting

- [ ] Matches existing brand or design system (if applicable)
- [ ] No decorative change reduced clarity or accessibility
- [ ] Result does not read as generic template UI
