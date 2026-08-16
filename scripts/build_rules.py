#!/usr/bin/env python3
"""Generate one styled sub-page per Sleak rule from the reference markdown.

Run from the repo root:  python3 scripts/build_rules.py
Writes docs/rules/<slug>.html for each rule and shares docs/assets/site.css + site.js.
"""
import re
from pathlib import Path
import markdown
from demos_html import demo_section

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "references"
OUT = ROOT / "docs" / "rules"

# number, title, category, slug, formula, (source_md, start_line, end_line)
# start/end are 1-indexed inclusive; None,None means the whole file.
RULES = [
    ("01", "Concentric radius", "core", "concentric-radius",
     "parent − padding = child", ("concentric-radius.md", None, None)),
    ("02", "Section eyebrows", "core", "section-eyebrows",
     "≤ 1 per page · hero: none", ("section-eyebrows.md", None, None)),
    ("03", "Intentional accent", "core", "intentional-accent",
     "1 focal point / view", ("color.md", 9, 82)),
    ("04", "Accent-hue blacks", "color", "accent-hue-blacks",
     "sat > 0 → hue = accent", ("color.md", 83, None)),
    ("05", "Contrast", "a11y", "contrast",
     "WCAG 4.5 + APCA Lc 75", ("contrast.md", None, None)),
    ("06", "Typography", "type", "typography",
     "≈ 55ch · 7–12 words", ("typography.md", None, None)),
    ("07", "Layout & spacing", "layout", "layout-spacing",
     "0 full-bleed dividers", ("layout-spacing.md", None, None)),
    ("08", "Cards & buttons", "components", "components",
     "icon side ≈ ½ text side", ("components.md", None, None)),
    ("09", "Motion budget", "motion", "motion",
     "≤ 150ms · ease-out", ("motion.md", None, None)),
    ("10", "Content & copy", "copy", "content-copy",
     "verb + object", ("content-copy.md", None, None)),
]

# Short, punchy tab title per rule: the browser tab reads "Sleak Eyebrow", etc.
NICKNAME = {
    "concentric-radius": "Radius",
    "section-eyebrows": "Eyebrow",
    "intentional-accent": "Accent",
    "accent-hue-blacks": "Blacks",
    "contrast": "Contrast",
    "typography": "Type",
    "layout-spacing": "Spacing",
    "components": "Buttons",
    "motion": "Motion",
    "content-copy": "Copy",
}

# reference filename -> destination rule slug (for rewriting cross-links)
REF_TO_SLUG = {
    "concentric-radius.md": "concentric-radius",
    "section-eyebrows.md": "section-eyebrows",
    "color.md": "intentional-accent",
    "contrast.md": "contrast",
    "typography.md": "typography",
    "layout-spacing.md": "layout-spacing",
    "components.md": "components",
    "motion.md": "motion",
    "content-copy.md": "content-copy",
}

ARROW = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" '
         'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
         '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>')
BACK_ARROW = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" '
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
              '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>')


def slice_md(text, start, end):
    if start is None and end is None:
        return text
    lines = text.splitlines()
    s = (start - 1) if start else 0
    e = end if end else len(lines)
    return "\n".join(lines[s:e]).strip() + "\n"


def rewrite_links(html):
    # references/foo.md or foo.md (optionally with #anchor) -> sibling <slug>.html
    def repl(m):
        name = m.group("name")
        anchor = m.group("anchor") or ""
        slug = REF_TO_SLUG.get(name + ".md")
        if not slug:
            return m.group(0)
        # keep an anchor only when it is a real heading id we can't guarantee; drop it
        return f'href="{slug}.html"'
    pattern = re.compile(r'href="(?:\.\./)*(?:references/)?(?P<name>[a-z0-9-]+)\.md(?P<anchor>#[^"]*)?"')
    html = pattern.sub(repl, html)
    return html


def render_body(md_text):
    html = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "sane_lists", "attr_list"],
    )
    html = html.replace("<table>", '<div class="table-wrap"><table>').replace(
        "</table>", "</table></div>")
    html = rewrite_links(html)
    return html


def page(rule, prev_rule, next_rule):
    num, title, cat, slug, formula, (src, a, b) = rule
    md_text = slice_md((REF / src).read_text(encoding="utf-8"), a, b)
    body = render_body(md_text)

    def pager_cell(r, direction):
        if r is None:
            return f'<a class="{direction} empty" aria-hidden="true"><span class="dir">{direction}</span></a>'
        label = "Previous rule" if direction == "prev" else "Next rule"
        return (f'<a class="{direction}" href="{r[3]}.html">'
                f'<span class="dir">{label}</span>'
                f'<span class="ttl">{r[0]} · {r[1]}</span></a>')

    pager = pager_cell(prev_rule, "prev") + pager_cell(next_rule, "next")

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Sleak {NICKNAME.get(slug, title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="Sleak rule {num}: {title}. {formula}." />
<link rel="stylesheet" href="../assets/site.css" />
</head>
<body>
<header>
  <div class="wrap nav">
    <a class="brand" href="../index.html"><span class="dot" aria-hidden="true"></span>sleak</a>
    <nav class="nav-links">
      <a href="../index.html#rules">Rules</a>
      <a href="../index.html#how">How it works</a>
      <a href="../index.html#why">Why</a>
      <a class="btn btn-primary" href="../index.html#get">Get the skill {ARROW}</a>
      <button class="theme-toggle" id="tt" title="Toggle theme" aria-label="Toggle light/dark theme">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5 3.6 3.6M20.4 20.4 19 19M19 5l1.4-1.4M3.6 20.4 5 19"/></svg>
      </button>
    </nav>
  </div>
</header>

<main>
  <section class="rule-hero">
    <div class="wrap">
      <a class="crumb" href="../index.html#rules">{BACK_ARROW} All rules</a>
      <div class="rule-eyebrow"><span class="num">{num}</span><span>{cat}</span></div>
      <h1>{title}</h1>
      <span class="formula">{formula}</span>
    </div>
  </section>
{demo_section(slug)}
  <section class="article">
    <div class="wrap">
      <article class="doc">
{body}
      </article>
      <nav class="pager">
        {pager}
      </nav>
    </div>
  </section>
</main>

<footer>
  <div class="wrap foot">
    <a class="brand" href="../index.html"><span class="dot" aria-hidden="true"></span>sleak</a>
    <span>A design-decision skill for intentional product UI.</span>
    <span class="tag">craft over defaults</span>
  </div>
</footer>

<script src="../assets/site.js"></script>
<script src="../assets/demos.js"></script>
</body>
</html>
"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for i, rule in enumerate(RULES):
        prev_rule = RULES[i - 1] if i > 0 else None
        next_rule = RULES[i + 1] if i < len(RULES) - 1 else None
        (OUT / f"{rule[3]}.html").write_text(page(rule, prev_rule, next_rule), encoding="utf-8")
        print("wrote", OUT.relative_to(ROOT) / f"{rule[3]}.html")


if __name__ == "__main__":
    main()
