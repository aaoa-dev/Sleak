# Sleak

Design decision guide for interfaces that feel intentional, concentric radius, accent restraint, motion budget, and the other details that separate craft from template UI.

**[View the site →](https://aaoa-dev.github.io/Sleak/)**

For **designers** who want a checklist while reviewing. For **engineers** implementing screens. For **agents** assisting either, load as an agent skill (Claude Code, Cursor, or any `AGENTS.md`-aware tool, see [Install](#install-agents)), or read the reference files directly.

## Structure

```
Sleak/
├── SKILL.md                 # Entry point, core principles + workflow
├── AGENTS.md                # Pointer for AGENTS.md-aware agents (Codex, Kimi, …)
├── checklist.md             # Pre-ship audit
├── references/
│   ├── accessibility.md      # names, focus, targets, non-colour cues
│   ├── color.md              # accent tiers, neutrals, dark mode
│   ├── components.md         # buttons, icons, clickable cards
│   ├── concentric-radius.md # parent − padding = child (core)
│   ├── content-copy.md      # action-first UI copy
│   ├── contrast.md          # WCAG (mathematical) + APCA (perceptual)
│   ├── design-systems.md    # tokens, lean sets, elevation
│   ├── layout-spacing.md
│   ├── motion.md
│   ├── principles.md        # decide what to build, iterate
│   ├── section-eyebrows.md  # limit kickers / overlines (core)
│   ├── sources.md           # reference library & credits
│   ├── typography.md
│   ├── ux.md                # loading/empty/error states, forms
│   └── writing-docs.md      # how Sleak's own docs get written (not a product rule)
├── examples/
│   ├── before-after.md
│   ├── landing-before.html   # natural default build (no skill applied)
│   └── landing-after.html    # same content + layout, Sleak applied
├── docs/                     # Static site (GitHub Pages)
│   ├── index.html            # Landing page (self-contained)
│   ├── assets/               # Shared CSS/JS + interactive rule demos
│   └── rules/                # One hand-authored page per rule
```

Browse the rules with a live, interactive demo on each: open `docs/index.html` in a browser (or the published GitHub Pages site). The rule pages under `docs/rules/` are hand-authored vanilla HTML, each interactive demo sits **inline at the section it illustrates**. The pages share `docs/assets/site.css` + `demos.js`; `references/*.md` remain the canonical, agent-facing source of truth (SKILL.md and AGENTS.md point there), so when a rule changes, update the reference **and** the matching page together.

## Install (agents)

Two install styles depending on how your agent loads context.

### Agents with a skills folder (Claude Code, Cursor)

Symlink (or copy) this repo into the skills directory. **The installed folder must be named `sleak`** (lowercase, matching `name:` in `SKILL.md`) regardless of what the repo folder is called, these agents match skills by folder name.

```sh
# Claude Code, personal (all projects) / project-local
ln -s "$(pwd)" ~/.claude/skills/sleak
mkdir -p .claude/skills && ln -s "$(pwd)" .claude/skills/sleak

# Cursor, personal / project-local
ln -s "$(pwd)" ~/.cursor/skills/sleak
mkdir -p .cursor/skills && ln -s "$(pwd)" .cursor/skills/sleak
```

Use `cp -r "$(pwd)" <dest>/sleak` instead of `ln -s` if you prefer a copy over a symlink.

### Agents that use an instructions file (Codex, Kimi, Gemini, Copilot, …)

These agents have no skills folder, they read a single instructions file. Clone this repo somewhere stable, then add a pointer line to that file so the agent loads the guide when it does UI work:

```md
For any UI / frontend / design work, read and follow the Sleak design guide
at <path-to>/sleak/SKILL.md and its references/.
```

Where the instructions file lives per agent:

| Agent            | Project file                     | Global file                          |
| ---------------- | -------------------------------- | ------------------------------------ |
| OpenAI Codex     | `AGENTS.md` (repo root)          | `~/.codex/AGENTS.md`                 |
| Kimi Code        | `AGENTS.md` (repo root)          | `~/.agents/AGENTS.md`, `~/.kimi-code/AGENTS.md` |
| Gemini CLI       | `GEMINI.md` (repo root)          | `~/.gemini/GEMINI.md`                |
| GitHub Copilot   | `.github/copilot-instructions.md`|,                                    |
| Any AGENTS.md-aware tool | `AGENTS.md` (repo root)   | `~/.agents/AGENTS.md`                |

`AGENTS.md` is a shared cross-tool standard, so a single repo-root `AGENTS.md` pointer covers Codex, Kimi, and most other agents that adopt it. Keep the pointer short, the agent reads `SKILL.md` on demand rather than inlining the whole guide.

Human readers can use the repo as-is, start at `SKILL.md` or jump to any `references/` file.

## Status

- **Concentric corner radius**, drafted (core; includes nested-container radius + text-baseline-concentric-to-corner)
- **Section eyebrows**, drafted (core)
- **Intentional accent use**, drafted (core, [color.md](references/color.md))
- **Accent-hue blacks**, drafted ([color.md](references/color.md))
- **Full-bleed section dividers**, avoid ([layout-spacing.md](references/layout-spacing.md))
- **Content & copy**, drafted ([i-have-adhd](https://github.com/ayghri/i-have-adhd) + [caveman](https://github.com/JuliusBrussee/caveman) patterns)
- **Motion**, drafted ([motion.md](references/motion.md); informed by [emilkowalski/skills](https://github.com/emilkowalski/skills), [jakubkrehel/skills](https://github.com/jakubkrehel/skills))
- **Clickable cards**, drafted ([components.md](references/components.md))
- **Buttons** (icon-in-a-square padding, uneven horizontal), drafted ([components.md](references/components.md))
- **Typography**, drafted ([typography.md](references/typography.md))
- **Contrast**, drafted, dual-method WCAG + APCA ([contrast.md](references/contrast.md))
- **Accessibility**, drafted, names/focus/keyboard/targets/non-colour cues ([accessibility.md](references/accessibility.md))
- **UX & states**, drafted, loading/empty/error states, forms, control mechanics ([ux.md](references/ux.md))
- **Design system foundations**, drafted, tokens/lean sets/atomic composition/elevation ([design-systems.md](references/design-systems.md))
- **Principles** (process layer), how to decide what to build, research/framing/iteration/feedback ([principles.md](references/principles.md))
- **Writing Sleak's own docs** (meta, not a product rule), Diátaxis mode and sentence clarity for this repo's own material ([writing-docs.md](references/writing-docs.md))
- **Reference library & credits**, reference skills ([sources.md](references/sources.md))
- **Landing demo** (open in a browser), [landing-before.html](examples/landing-before.html) + [landing-after.html](examples/landing-after.html)
