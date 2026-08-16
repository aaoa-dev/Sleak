# AGENTS.md

This repo ships **Sleak**, a design-decision guide for building intentional product UI.

## When to use it

For any UI, frontend, or visual-design work, creating or refining screens, reviewing a
design or implementation before ship, or when an interface feels generic, noisy, or lacks a
clear primary action, read and follow the guide before making changes:

- Start at [`SKILL.md`](SKILL.md) for the core principles and workflow.
- Run [`checklist.md`](checklist.md) as a pre-ship audit.
- Open the relevant file in [`references/`](references/) for full rules, CSS, and audits.

Read these on demand rather than inlining them, pull in only the reference for the category
you're working on.

## Core rules (check first)

1. **Concentric corner radius**, nested radii follow `parent − padding = child`; never reuse
   the same radius on both layers when padding > 0. See [`references/concentric-radius.md`](references/concentric-radius.md).
2. **Section eyebrows**, small kickers above headings weaken when repeated; ≤1 per page, and
   almost never in the hero. See [`references/section-eyebrows.md`](references/section-eyebrows.md).
3. **Intentional accent**, full accent color is scarce; reserve it for the single most
   important task, not decorative icons, borders, or every card. See [`references/color.md`](references/color.md).

## Using Sleak from another project

Copy this file's pointer into your own project's `AGENTS.md` (or `~/.agents/AGENTS.md` for all
projects), and adjust the paths to wherever you cloned this repo, e.g.:

```md
For any UI / frontend / design work, read and follow the Sleak design guide
at <path-to>/sleak/SKILL.md and its references/.
```
