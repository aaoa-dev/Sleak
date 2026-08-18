# Section eyebrows

Small label above a section heading, uppercase tag, tinted pill, "Features · About · Pricing", decorative line, or category kicker.

Useful on **one** section. Weak layouts repeat them on **every** section, landing-page template immediately.

## Purpose

Limit or remove section eyebrows so hierarchy comes from the heading itself, not repeated template chrome.

## What an eyebrow is

```
┌─────────────────┐
│  FEATURES       │  ← eyebrow (kicker, overline, section label)
│  Built for teams│  ← real heading
│  Lorem ipsum…   │
└─────────────────┘
```

Also appears as: colored pill, dot + label, "Section", small caps with letter-spacing, gradient text above H2.

## Rules

### 1. Default: none

Most sections need **heading + body** only. No eyebrow.

### 2. Max one per page (usually zero)

If the page already has clear structure (nav, layout, spacing), eyebrows add noise. Allow **at most one** eyebrow on a full marketing page, and only when it carries information the heading cannot.

### 3. Never eyebrow-stack

Do not give every section its own kicker ("Why us", "How it works", "Testimonials", "FAQ"). That pattern is generic SaaS layout.

### 4. Hero: almost never

The hero does **not** need an eyebrow. The headline is the hook.

**Only plausible hero case:** a time-sensitive release callout, e.g. "Latest update" or "v2.0 out now", and even then prefer:

- a compact **badge on the announcement itself**, or
- metadata in the headline line

In short, not a standalone eyebrow above the main title.

### 5. When an eyebrow is justified

Use only if it adds **fact**, not **category**:

| OK (rare) | Not OK |
|-----------|--------|
| "Now in beta" (status) | "Features" ( repeats nav ) |
| "Dec 2026" (date-bound) | "Why choose us" ( empty category ) |
| "Customer story" (format) | "Testimonials" ( section name ) |
| Regulatory label required by context | "Our solution" ( filler ) |

If the eyebrow text could be the H2, delete the eyebrow and promote the idea into the heading, or delete both and write a better H2.

## Common mistakes

| Tell | Fix |
|------|-----|
| Eyebrow on every `<section>` | Remove all; rewrite headings if needed |
| Hero eyebrow "Welcome" / "Introducing" | Delete |
| Eyebrow duplicates nav item | Delete |
| Eyebrow + H2 say the same thing | Keep H2 only |
| Pill + icon + uppercase on all blocks | Remove decorative kickers |

## Fixes

1. **Delete** the eyebrow element.
2. **Merge** any useful fact into the heading or a single badge (not above the H1).
3. **Replace** category kickers with specific headings ("Import CSV in seconds" not eyebrow "Features" + H2 "Powerful tools").
4. On long pages, use **spacing and type scale** for section breaks, not repeated eyebrows.

## Do / Don't

| Do | Don't |
|----|-------|
| Let H2/H3 carry section identity | Label every section with a kicker |
| Use one status badge when timing matters | Stack "New" + eyebrow + headline in hero |
| Break sections with whitespace and hierarchy | Use eyebrows as section dividers |
| Write specific headings | Use generic category eyebrows |

## Audit

Count eyebrows on the page:

- **0**, default, good
- **1**, verify it carries non-duplicate fact
- **2+**, **High** severity; remove until ≤ 1

Hero eyebrow (except rare release badge) → **High**.
