---
name: sleak
description: >-
  Craft guide for intentional product UI. Teaches concentric nested radius, scarce accent
  color, motion restraint, action-first copy, and related layout and color decisions.
  Use when designing, reviewing, or implementing screens, auditing before ship, or when
  work feels generic, visually noisy, or missing a clear primary action.
---

# Sleak

Better design decisions for interfaces that feel intentional, not assembled from defaults.

Works for **designers** reviewing work, **engineers** implementing UI, and **agents** assisting either. The rules are craft and hierarchy, not tool-specific. Read them directly or load this skill when you want a structured audit.

## Core principles

These rules define this skill. Check them first on every audit.

### 1. Concentric corner radius

Nested rounded elements must follow one relationship:

```
parent − padding = child
parent − child   = padding
child  + padding = parent
```

Either the **parent** or **child** radius drives; padding is the gap between curves. Never reuse the same radius on both layers when padding > 0.

→ Full rules, CSS, and audit: [references/concentric-radius.md](references/concentric-radius.md)

### 2. Section eyebrows

Small kickers above section headings ("Features", "About", pills, overlines). Fine on **one** section; weak when repeated on every block. **Hero: almost never**, only a rare release/status callout, and even then prefer a badge, not an eyebrow.

→ Limits and fixes: [references/section-eyebrows.md](references/section-eyebrows.md)

### 3. Intentional accent use

**Full accent color is scarce.** Use it to pull the eye to the **most important task** on the page, not to decorate icons, borders, headings, or every card.

- **One** primary focal point at full saturation (main CTA or critical action)
- Secondary controls → neutral or outline
- Opacity tints of the accent → only where they support that primary path (selected, focus, progress)
- Extra full-chroma accent dilutes brand impact and scatters attention

→ Full tiers, tokens, and audit: [references/color.md](references/color.md#intentional-accent-use-core-rule)

## When to apply

Load this skill when:

- Creating or refining UI (web, mobile, desktop)
- Reviewing a design, Figma file, or implementation before ship
- The user asks for polish, hierarchy, craft, or direction on a screen
- An interface feels generic, template-like, or visually noisy but the fixes aren't obvious



## Workflow

Follow this order. Do not skip the audit step.

```
Task progress:
- [ ] 1. Context, understand product, audience, and constraints
- [ ] 2. Audit, scan against the checklist
- [ ] 3. Fix, apply targeted changes by category
- [ ] 4. Verify, re-run checklist before shipping
```



### 1. Context

Before changing visuals, confirm:

- **Product type**, what is this, and what should it feel like?
- **Audience**, who uses it, and what do they expect?
- **Constraints**, existing brand, design system, platform, or codebase patterns
- **Scope**, full screen, component, or copy-only pass

Match the project's existing system when one exists. Do not impose a new aesthetic for its own sake.

### 2. Audit

Run the [checklist](checklist.md). Flag issues by category:


| Category                        | Reference                                                          |
| ------------------------------- | ------------------------------------------------------------------ |
| **Concentric radius**           | [references/concentric-radius.md](references/concentric-radius.md) |
| **Section eyebrows**            | [references/section-eyebrows.md](references/section-eyebrows.md)   |
| **Color** (accent intent + hue) | [references/color.md](references/color.md)                         |
| Typography                      | [references/typography.md](references/typography.md)               |
| **Contrast** (WCAG + APCA)      | [references/contrast.md](references/contrast.md)                   |
| Layout & spacing                | [references/layout-spacing.md](references/layout-spacing.md)       |
| Components                      | [references/components.md](references/components.md)               |
| Motion                          | [references/motion.md](references/motion.md)                       |
| Content & copy                  | [references/content-copy.md](references/content-copy.md)           |
| Accessibility                   | [references/accessibility.md](references/accessibility.md)         |
| UX (states & interaction)       | [references/ux.md](references/ux.md)                               |
| Design system foundations       | [references/design-systems.md](references/design-systems.md)       |




### 3. Fix

For each flagged issue:

1. Read the relevant reference file
2. Apply the smallest change that fixes the decision
3. Preserve accessibility and platform conventions

Prefer one strong decision over many small decorative tweaks.

### 4. Verify

Re-run [checklist.md](checklist.md). Confirm:

- No category still has unresolved high-severity issues
- Changes are consistent with project constraints
- The result still reads clearly at a glance
- **Render the actual output and look at it** (screenshot the built UI), don't sign off from source alone. Contrast especially must be checked on rendered pixels, not CSS tokens, the cascade can paint a color the token math never predicted (see [contrast.md](references/contrast.md)).



## Severity

When reporting or fixing issues, use:

- **High**, weak hierarchy, broken geometry, or hurts usability; fix before ship
- **Medium**, noticeable on review; fix when in scope
- **Low**, polish; fix if time allows



## Output format

When reviewing or proposing changes, use:

```markdown
## Sleak review

### Context
[Product, audience, constraints]

### Findings
- **[High/Medium/Low]** [Category], [issue] → [recommended fix]

### Applied changes
[What changed and why]

### Remaining notes
[Optional follow-ups]
```



## Additional resources

- [checklist.md](checklist.md), pre-ship audit
- [examples/before-after.md](examples/before-after.md), annotated comparisons
- [examples/landing-before.html](examples/landing-before.html) + [landing-after.html](examples/landing-after.html), full-page visual demo (open in a browser; violations before, Sleak applied after)
- [references/concentric-radius.md](references/concentric-radius.md), nested border radius (core)
- [references/section-eyebrows.md](references/section-eyebrows.md), limit section kickers (core)
- [references/color.md](references/color.md), intentional accent + accent-hue blacks (core)
- [references/motion.md](references/motion.md), motion budget, vary animations
- [references/content-copy.md](references/content-copy.md), action-first UI copy
- [references/typography.md](references/typography.md), line length, alignment, size by distance
- [references/contrast.md](references/contrast.md), readability via WCAG (mathematical) + APCA (perceptual)
- [references/layout-spacing.md](references/layout-spacing.md), spacing over dividers
- [references/components.md](references/components.md), clickable cards and interaction patterns
- [references/accessibility.md](references/accessibility.md), names, focus, keyboard, targets, non-color cues (contrast lives in contrast.md)
- [references/ux.md](references/ux.md), loading/empty/error states, destructive confirms, form and control mechanics
- [references/design-systems.md](references/design-systems.md), tokens as single source of truth, lean scales, atomic composition, elevation
- [references/principles.md](references/principles.md), the process layer, how to decide what to build (research, framing, low-fi iteration, feedback), upstream of the craft rules
- [references/writing-docs.md](references/writing-docs.md), how Sleak's own docs are written (Diátaxis mode, sentence clarity), not a product-UI rule
- [references/sources.md](references/sources.md), the reference library

