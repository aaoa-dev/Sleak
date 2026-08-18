# Design system foundations

The per-topic references (colour, type, spacing, components) are the craft rules. This file is
the **system layer**: how those decisions stay consistent once the work spans more than one
screen, one product, or one person.

## Purpose

Catch the failure mode where every screen re-invents its colours, sizes, and components;
drift, inconsistency, and design debt. A system makes the right decision the easy one.

## Design tokens are the single source of truth

Every reusable design decision, colour, type size, spacing step, radius, shadow, motion
duration, is a **named token** (`name → value`), defined once.

- Change the value once and it **propagates everywhere**; no hard-coded hexes or px scattered
  across components.
- Tokens are **platform-agnostic**, one definition compiles to a CSS variable, an iOS colour,
  an Android value.
- **Multi-brand / theming** = swap token *values* on one shared base (light/dark is the same
  move, see [color.md](color.md)); never fork the components.

```
--space-4: 1rem;  --radius-2: 8px;  --color-primary: hsl(var(--accent-h) …);
```

## Keep the sets lean

A **small, predefined set** per category beats unlimited choice. Too many colour steps, type
sizes, or spacing values invites inconsistency and misuse. Start slim; add an option only when
a real need appears. You can always add a step later, but removing one is painful.

Ties to the lean scales in [color.md](color.md), [typography.md](typography.md) (type scale),
and [layout-spacing.md](layout-spacing.md) (spacing scale).

## Components: modular, composable, generic, flexible

| Quality | Meaning |
|---------|---------|
| **Modular** | Self-contained; no cross-component dependencies |
| **Composable** | Small parts combine into larger ones |
| **Generic** | Handles multiple use cases, not one screen |
| **Flexible** | Extended via props/variants, not copy-paste |

**DRY**, two pieces of code doing the same job double the bugs and the maintenance. One
canonical implementation, reused.

## Compose by layers (atomic)

Build the smallest pieces first, then assemble up:

```
elements/atoms (button, icon, input)
  → components/molecules (search field = input + button + icon)
    → regions/organisms (left nav)
      → layouts (header + sidebar + main)
```

## Elevation is a standardized scale

Depth comes from a **defined set of z-index + shadow steps**, not ad-hoc shadows per
component. Surfaces closer to the user sit higher on the scale, and, in dark mode, get
*lighter* (see the elevation/luminance rule in [color.md](color.md#light--dark-mode-slide-dont-invert)).

## Accessibility is built in, not bolted on

Bake contrast, keyboard operability, labels, and alt text into the **shared components** so
every product inherits them. It is far cheaper than retrofitting a11y after the fact. See
[accessibility.md](accessibility.md) and [contrast.md](contrast.md).

## Responsive by flow

Avoid fixed `width`/`height`; let elements **fill the space they're given** so layouts adapt.
Images: `max-width: 100%`, `height: auto`, with a few preset fractions (½, ⅓) as max-widths.
Design mobile-first.

## Name things consistently

Clear, predictable names for components, variants, and utilities. Namespace shared classes
(e.g. `.ds-btn`) so they don't collide with other libraries on the page.

## Do / Don't

| Do | Don't |
|----|-------|
| Define each decision once as a token | Hard-code hexes/px across components |
| Keep colour/type/spacing sets lean | Ship dozens of near-identical options |
| Build modular, composable components | Copy-paste a variant per screen |
| Standardize elevation as a scale | Sprinkle one-off shadows |
| Bake a11y into shared components | Retrofit accessibility per feature |
| Let elements flow; size by content | Pin fixed widths/heights everywhere |

## Notes

- The system is a **living dependency**, not one-and-done; version it and document changes.
- This is the one reference that is deliberately *implementation-aware*, the rest of Sleak is
  craft-and-hierarchy. Match the project's existing system when one exists.
