# Sleak

Design decision guide for interfaces that feel intentional, concentric radius, accent restraint, motion budget, and the other details that separate craft from template UI.

For **designers** who want a checklist while reviewing. For **engineers** implementing screens. For **agents** assisting either, load as an agent skill (Claude Code, Cursor, or any `AGENTS.md`-aware tool, see [Install](#install-agents)), or read the reference files directly.

## Structure

```
Sleak/
├── SKILL.md                 # Entry point, core principles + workflow
├── AGENTS.md                # Pointer for AGENTS.md-aware agents (Codex, Kimi, …)
├── checklist.md             # Pre-ship audit
├── references/
│   ├── concentric-radius.md # parent − padding = child (core)
│   ├── section-eyebrows.md  # limit kickers / overlines (core)
│   ├── content-copy.md      # action-first UI copy
│   ├── typography.md
│   ├── contrast.md          # WCAG (mathematical) + APCA (perceptual)
│   ├── layout-spacing.md
│   ├── color.md
│   ├── components.md
│   └── motion.md
├── examples/
│   ├── before-after.md
│   ├── landing-before.html   # natural default build (no skill applied)
│   └── landing-after.html    # same content + layout, Sleak applied
├── docs/                     # Static site (GitHub Pages)
│   ├── index.html            # Landing page (self-contained)
│   ├── assets/               # Shared CSS/JS + interactive rule demos
│   └── rules/                # One page per rule, generated from references/
└── scripts/
    └── build_rules.py        # Regenerates docs/rules/ from the reference markdown
```

Browse the rules with a live, interactive demo on each: open `docs/index.html` in a browser (or the published GitHub Pages site). The rule pages under `docs/rules/` are generated, edit the matching `references/*.md`, then run `python3 scripts/build_rules.py` (needs `pip install markdown`).

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
- **Landing demo** (open in a browser), [landing-before.html](examples/landing-before.html) + [landing-after.html](examples/landing-after.html)
