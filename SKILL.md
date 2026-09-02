---
name: sleak
description: >-
  Design-decision guide for intentional product UI and marketing surfaces. Use when creating,
  reviewing, or refining interface hierarchy and craft, especially when a screen feels generic,
  noisy, inconsistent, or lacks a clear primary action. Routes to focused references by task;
  use the full checklist only for broad or pre-ship audits.
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

## Strength of guidance

Read every Sleak rule at the right strength:

- **Invariant**: correctness, accessibility, semantics, or broken geometry. Do not violate it
  without a concrete platform constraint.
- **Strong default**: Sleak's opinionated starting point. Depart when the product, content, or
  established system gives a better reason, and preserve the intent behind the rule.
- **Contextual heuristic**: a diagnostic, not a pass/fail law. Verify it on the rendered result.

The three core principles are **strong defaults**. Accessibility requirements and native
interaction semantics are **invariants**. Measurements involving typography, optical balance,
or content density are usually **contextual heuristics**.

## When to apply

Load this skill when:

- Creating or refining UI (web, mobile, desktop)
- Reviewing a design, Figma file, or implementation before ship
- The user asks for polish, hierarchy, craft, or direction on a screen
- An interface feels generic, template-like, or visually noisy but the fixes aren't obvious



## Route the task first

Load the smallest useful context. The three core principles above are always in scope; then
choose references by the surface and request:

| Request | Read |
|---|---|
| Product UI, dashboard, settings, tool | `components`, `ux`, `design-systems`; add visual categories implicated by the screen |
| Marketing or landing page | `typography`, `layout-spacing`, `color`, `content-copy`, `motion` as needed |
| Component-level change | Only the component's category plus `accessibility` when interactive |
| Accessibility or interaction audit | `accessibility`, `contrast`, `ux`; add `components` for compound controls |
| Visual polish / generic-feeling UI | The implicated visual categories; add `principles` when direction itself is weak |
| Broad redesign or pre-ship review | Full [checklist](checklist.md) and every reference for a failed category |

Do not load every reference for a narrow task. Do not run the full checklist by default when
the request concerns one component or one category.

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
- **Surface**, product interface or marketing/brand surface
- **Single job**, the one verb the person must accomplish here

Match the project's existing system when one exists. Do not impose a new aesthetic for its own sake.

For greenfield work or a generic-feeling direction, read
[principles.md](references/principles.md#derive-the-direction-from-the-domain) and derive the
visual direction from the product's real domain before choosing palette, type, layout, or a
signature element.

### 2. Audit

For a broad or pre-ship review, run the [checklist](checklist.md). For a narrow request, inspect
only the routed categories and apply their relevant audit items. Flag issues by category:


| Category                        | Reference                                                          |
| ------------------------------- | ------------------------------------------------------------------ |
| **Concentric radius**           | [references/concentric-radius.md](references/concentric-radius.md) |
| **Section eyebrows**            | [references/section-eyebrows.md](references/section-eyebrows.md)   |
| **Color** (accent intent + hue) | [references/color.md](references/color.md)                         |
| Typography (including numeric alignment) | [references/typography.md](references/typography.md)       |
| **Contrast** (WCAG + APCA)      | [references/contrast.md](references/contrast.md)                   |
| Layout & spacing (including stable scan rails) | [references/layout-spacing.md](references/layout-spacing.md) |
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

Before adding UI code, inspect what the project already provides. Prefer, in order:

1. Native semantic HTML where it supplies the required behavior
2. The project's existing component or design-system primitive
3. An established accessible primitive for complex behavior
4. A custom implementation only when the first three do not fit

Follow the repository's existing styling and token conventions. Do not introduce a second
primitive system, one-off token vocabulary, or hand-built keyboard/focus behavior without a
specific reason. Read [design-systems.md](references/design-systems.md#use-what-exists-before-adding) for implementation rules.

### 4. Verify

Re-run the applicable audit items; for broad or pre-ship work, re-run the full
[checklist.md](checklist.md). Confirm:

- No category still has unresolved high-severity issues
- Changes are consistent with project constraints
- The result still reads clearly at a glance
- **Render the actual output and look at it** (screenshot the built UI), don't sign off from source alone. Contrast especially must be checked on rendered pixels, not CSS tokens, the cascade can paint a color the token math never predicted (see [contrast.md](references/contrast.md)).

For non-trivial UI, verify desktop and mobile widths, keyboard operation, every implemented
theme, and loading/empty/error/populated states that are in scope. Run the repository's relevant
build, typecheck, and tests when code changed.



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
- [references/typography.md](references/typography.md), line length, numeric alignment, size by distance
- [references/contrast.md](references/contrast.md), readability via WCAG (mathematical) + APCA (perceptual)
- [references/layout-spacing.md](references/layout-spacing.md), spacing over dividers, stable scan rails
- [references/components.md](references/components.md), clickable cards and interaction patterns
- [references/accessibility.md](references/accessibility.md), names, focus, keyboard, targets, non-color cues (contrast lives in contrast.md)
- [references/ux.md](references/ux.md), loading/empty/error states, destructive confirms, form and control mechanics
- [references/design-systems.md](references/design-systems.md), tokens as single source of truth, lean scales, atomic composition, elevation
- [references/principles.md](references/principles.md), the process layer, how to decide what to build (research, framing, low-fi iteration, feedback), upstream of the craft rules
- [references/writing-docs.md](references/writing-docs.md), how Sleak's own docs are written (Diátaxis mode, sentence clarity), not a product-UI rule
- [references/sources.md](references/sources.md), the reference library
