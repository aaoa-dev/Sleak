# Motion

Animation and transitions that feel intentional, not the same spring on every hover.

Synthesizes Sleak motion principles with craft from [Emil Kowalski's skills](https://github.com/emilkowalski/skills) (`emil-design-eng`, `animate`) and [Jakub Krehel's interface skills](https://github.com/jakubkrehel/skills) (`better-ui`, [make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better)). For full build recipes and strict review gates, load those skills alongside this one.

## Purpose

Catch motion that weakens focus: everything bounces, everything staggers, same curve everywhere, springs on every card hover.

## Motion is a budget (core rule)

**Vary animations. Don't animate everything.** One spring on hover feels nice. Fifteen springs on one screen is noise.

| Principle | Meaning |
|-----------|---------|
| **Default: no motion** | Static UI until a transition earns its place |
| **Subtle for most elements** | High-frequency interactions → instant or ≤150ms opacity/color only |
| **Expressive rarely** | Springs, stagger, bounce → one or two moments per view |
| **Vary the recipe** | Don't copy the same spring/duration/easing onto every component |

Motion should guide attention, like [intentional accent use](color.md#intentional-accent-use-core-rule). When everything moves, nothing feels special.

## Step 1, Should this animate at all?

From [Emil's frequency gate](https://github.com/emilkowalski/skills). Ask: **how often will users see this?**

| Frequency | Decision |
|-----------|----------|
| 100+ times/day (shortcuts, command palette, every keystroke) | **No animation. Ever.** |
| Tens of times/day (row hover, list nav, tab switch in a work tool) | **Near-imperceptible**, 100–150ms color/opacity, or nothing |
| Occasional (modal, drawer, toast, dropdown) | Standard transition, ease-out, 150–250ms |
| Rare / first-time (onboarding, success, empty state reveal) | **Delight budget**, stagger, spring, longer motion OK |

**Keyboard-initiated actions:** no animation. Raycast-style instant open/close is correct for high-frequency tools.

If it fails this gate, use instant state change. Zero lines of animation is a success.

## Step 2, Name the purpose

Every animation needs one word why ([Emil](https://github.com/emilkowalski/skills)):

- **Feedback**, press scale confirms the tap
- **Spatial consistency**, toast exits where it entered
- **State indication**, morphing control shows mode change
- **Prevent jarring change**, fade bridges a teleport
- **Explanation**, marketing/onboarding only
- **Delight**, only at the rare/first-time tier

Can't name it? Don't build it. **"It looks cool" on a frequent interaction** is a reason to stop.

From [Jakub Krehel's motion restraint](https://github.com/jakubkrehel/skills): motion is **never the only feedback channel**. Color, icon, or label must still communicate the state if animation is off (`prefers-reduced-motion` or a blink).

## Step 3, Pick intensity (vary, don't repeat)

**Weak pattern:** same `spring` + `whileHover={{ scale: 1.05 }}` on every card, chip, and icon.

**Sleak:**

| Element type | Typical motion |
|--------------|----------------|
| Primary button | `scale(0.96–0.97)` on `:active`, 100–160ms ease-out |
| Secondary / ghost button | Color/opacity only, no spring |
| List row hover | Background color 100ms, no bounce |
| Card in a grid | **Often none**, elevation/shadow static |
| One hero card / feature highlight | **Optional** subtle lift, the single expressive hover on the page |
| Modal / drawer | ease-out enter, softer exit |
| Icon swap on toggle | Short crossfade or spring with **bounce: 0** |

**Rule of thumb:** pick **one** element per view for expressive hover/spring. Everything else stays subtle or static.

### Springs, scarce

Springs feel alive but **add up fast**. Reserve for:

- Drag with momentum / swipe-to-dismiss
- One decorative or "alive" focal element
- Gestures that interrupt mid-flight

```js
// OK, occasional, low bounce
{ type: "spring", duration: 0.5, bounce: 0.2 }

// Jakub: icon state swaps, bounce must be 0
{ type: "spring", duration: 0.3, bounce: 0 }
```

**Avoid bounce** in most UI (0.1–0.3 max when used). Never spring every `:hover`.

Default interactive motion → **CSS ease-out** transitions, not springs.

## Step 4, Easing and duration

### Easing ([Emil](https://github.com/emilkowalski/skills))

| Situation | Easing |
|-----------|--------|
| Entering / exiting | **ease-out** (never ease-in on UI) |
| Moving on screen | ease-in-out |
| Hover / color | `ease` |
| Default | ease-out |

Built-in CSS easings are weak. Prefer:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

**Never `ease-in` on UI**, starts slow exactly when the user is watching.

### Duration

| Element | Duration |
|---------|----------|
| Press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns | 150–250ms |
| Modals, drawers | 200–500ms |
| High-frequency hover | ≤150ms or none |

**UI stays under 300ms** unless marketing/explanatory.

## Step 5, Properties and tools

- Animate **`transform` and `opacity` only** (GPU-friendly). Avoid `width`, `height`, `margin`, `top`, `left`.
- **Never `scale(0)`** on enter, use `scale(0.95–0.97)` + `opacity: 0`.
- **Never `transition: all`**, name exact properties.
- **Interactive toggles** → CSS **transitions** (interruptible). Keyframes restart from zero.
- **High-frequency** → CSS transition. **Springs/layout** → Motion library when needed, not for every hover.

Popovers: `transform-origin` at trigger (`var(--transform-origin)`). Modals: center origin.

## Stagger, infrequent only

Staggered entrance (~30–80ms between chunks, [Emil](https://github.com/emilkowalski/skills)) is for **first load of a view** or onboarding, not every section on scroll, not every list render.

From [Jakub](https://github.com/jakubkrehel/skills): split semantic chunks, ~100ms stagger. **Do not stagger routine interactions.**

Skip enter animation on page load for elements already in default state (`initial={false}` on `AnimatePresence` where appropriate).

## Reduced motion and hover gating

Ship with every animation ([Emil](https://github.com/emilkowalski/skills), [Jakub `better-accessibility`](https://github.com/jakubkrehel/skills)):

```css
@media (prefers-reduced-motion: reduce) {
  .element { transition: opacity 0.2s ease; } /* drop transform motion */
}

@media (hover: hover) and (pointer: fine) {
  .element:hover { /* hover motion only here */ }
}
```

Reduced motion = **fewer and gentler**, not necessarily zero.

## Common mistakes

| Tell | Fix |
|------|-----|
| Spring on every card hover | One expressive hover max; others static or color-only |
| Same animation on all components | Vary by frequency tier and purpose |
| Stagger on every scroll section | Stagger once on first view load, or remove |
| `ease-in` dropdown at 300ms | ease-out at 180–220ms |
| `transition: all` | Explicit properties |
| `scale(0)` enter | `scale(0.95)` + opacity |
| Bounce on list rows | Remove; 100ms background transition |
| Modal + cards + nav all spring | Pick one delight moment; rest subtle |
| Motion with no static state cue | Add color/icon/label change |

## Audit

1. List every animated element on the screen.
2. Tag **frequency** (high / occasional / rare).
3. Count **springs** and **bounce**, more than 1–2 expressive springs per view → **High**.
4. Count **identical** configs (same duration + curve on 5+ elements) → **Medium**, vary or remove.
5. Confirm high-frequency items use ≤150ms or no motion.
6. Replay at **10% speed** in DevTools ([Jakub](https://github.com/jakubkrehel/skills)), what feels wrong slow is wrong fast.

## Do / Don't

| Do | Don't |
|----|-------|
| Default static; add motion with a named purpose | Animate everything "to feel alive" |
| One spring/hover delight per view (optional) | 15 springs on one page |
| Subtle press `scale(0.96–0.97)` on primary actions | Bouncy hover on every tile |
| ease-out, &lt;300ms for UI | ease-in, slow dropdowns |
| Vary recipes by element role | Copy-paste the same Motion props everywhere |
| Transitions for interactive state | Keyframes on toasts/toggles |
| `prefers-reduced-motion` + static fallback cues | Motion as the only feedback |
| Load [emilkowalski/skills](https://github.com/emilkowalski/skills) for build/review depth | Hand-roll animation without a gate |

## Further reading

| Resource | Use for |
|----------|---------|
| [emilkowalski/skills](https://github.com/emilkowalski/skills), `animate`, `review-animations`, `emil-design-eng` | Build sequence, strict review, easing tables |
| [jakubkrehel/skills](https://github.com/jakubkrehel/skills), `better-ui` | Motion restraint, press scale, enter/exit recipes |
| [make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better) | Combined interface polish review |

Sleak owns **when not to animate** and **avoiding repetitive motion**. Those repos own **how to implement** motion that passes craft review.
