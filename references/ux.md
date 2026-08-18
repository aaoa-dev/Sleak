# UX

Whether the interface behaves correctly under real use, all the states beyond the happy path, and the small interaction details that make controls feel solid instead of brittle.

Scaffold based on common product-UX guidance. Treat as a baseline, not exhaustive.

## Purpose

Design for every state and every input method, loading, empty, error, destructive, and the mechanics of the controls themselves, so the interface never leaves the user stuck, surprised, or unsure what happened.

## Rules

### 1. Design every state, not just the full one

A view has more states than "populated."

- **Loading**: skeleton or spinner; don't jump from blank to full.
- **Empty**: explain what goes here and offer the first action, not a bare "No data".
- **Error**: say what failed and what to do; keep the user's input.
- **Partial / offline**: degrade gracefully.

### 2. Confirm destructive and irreversible actions

- Delete, remove, overwrite, and "cannot be undone" actions ask first, or offer undo.
- The confirm button names the action ("Delete 3 files"), not "OK".
- Don't place a destructive action where the primary action usually sits.
- **Escalate friction with severity.** For an *initial* destructive action, use *less*
  prominence (demote it, move it away, or progressively disclose it), don't colour it red yet.
  Save the strong red + explicit confirm for the point of no return.
- **Frame the confirm positively.** Avoid double negatives ("Are you sure you don't want to keep
  it?", what does *No* mean?). Phrase it plainly and let the button name the action.

### 3. Use the right element for the job

Semantics drive behavior, and behavior is UX.

- Actions are `<button>`; navigation is `<a href>`. A clickable `div` loses keyboard, focus, and Enter/Space for free.
- Submit controls live in a `<form>` so Enter submits.
- Toggles/checkboxes/radios use native inputs where possible.

### 4. Kill dead zones on controls

The whole control should be interactive, not just the glyph.

- Checkbox/radio labels are clickable and tied via `htmlFor`/`id`.
- Card and list-row targets extend to the full surface (see [components.md](components.md)).
- Padding, not margin, carries the hit area so there's no dead gap.

### 5. Form field mechanics

- Input `font-size ≥ 16px` on mobile web (smaller triggers iOS auto-zoom on focus).
- Correct `type`/`inputmode`/`autocomplete` so the right keyboard and autofill appear.
- Validate on blur/submit, not on every keystroke; show errors inline next to the field.
- Support expected shortcuts (e.g. **Cmd/Ctrl+Enter** to submit a textarea).

### 6. Stable, predictable feedback

- Don't change **font-weight** on hover/active, it shifts layout; change color/background instead.
- Reserve space for things that appear (validation text, badges) so content doesn't jump.
- Every action gives feedback within ~100ms (pressed state, spinner, optimistic update).

### 7. Preserve user work and context

- Don't discard input on error or navigation without warning.
- Maintain scroll position and selection across benign re-renders.
- Make "back" and "cancel" actually restore prior state.

## Reduce interaction cost

Every look, scroll, click, and decision is effort. Lower it:

- **Keep related actions close and big enough** (Fitts's Law: nearer + larger = faster to hit).
  Put an action beside the thing it acts on.
- **Reduce choices** (Hick's Law: decision time grows with the number and complexity of
  options). Remove, group/categorise, split into steps, or recommend a sensible default.
- **Progressive disclosure.** Show only what's needed now; reveal detail on demand instead of
  dumping everything up front.
- **Use conventional patterns** (Jakob's Law: people expect your UI to behave like the others
  they already know). Don't reinvent standard controls; spend novelty on your actual
  differentiator.
- **Minimal ≠ simple.** Don't strip labels or critical information for a clean look, a vague
  minimal screen is harder to use, not simpler.

## Forms
Forms are where UX is won or lost. The concrete rules:

- **Single-column, stacked layout.** Multi-column forms break the reading flow and get
  mis-filled. One field per row.
- **Minimise fields.** Every field is friction and drop-off. Don't ask for what you don't
  need (phone number for a card charge? cut it). Progressive-disclose rare fields.
- **Mark optional, not required.** Most fields are required; asterisking them all adds clutter
  and feels interrogative. Label the *optional* ones instead.
- **Labels above the field, always visible.** Don't use placeholder text as the label, it
  vanishes on focus and fails contrast. Placeholder is a *hint* only.
- **Match field width to the expected input** (a 4-digit code field shouldn't be 400px wide).
- **Right input for the choice:** checkboxes for multi-select, radios for one-of-few (≲6–10),
  a select/autocomplete for long lists, a stepper for small numeric changes. Stack options
  vertically to avoid mis-clicks.
- **Validate on submit, not on every keystroke.** Live per-character errors are jarring.
  Exceptions where inline *is* right: password-complexity, character-count limits, and
  username-availability.
- **Errors:** summary of links at the top (focus the field on click), messages **above** each
  field (the space below gets covered by autofill/keyboards), red **plus an icon**.
- **Long forms → steps** with a progress indicator, one bounded action per step, and a
  **success state** at the end so the user knows they're done.
- **Don't over-style inputs**, translucent fields on a gradient look slick to the designer
  and unusable to everyone else. High-contrast borders (≥3:1) win.

## Modals & overlays

- **Always give an escape route:** a visible ✕, clear CTAs, and click-outside-to-dismiss.
- **Reserve modals for critical or timely interactions**, destructive confirmations, focused
  multi-step tasks. Overusing them breaks the app's flow and users stop reading them.
- **Not every error needs a modal.** Inline messages/notifications are usually less disruptive;
  interrupt with a modal only when the consequence is significant.
- **Responsive and legible** at every screen size; if it guides a multi-step task, show progress.
- Confirm labels follow the positive-framing rule above (no double negatives; the button names
  the action).

## Show, don't tell
- A good product **shouldn't need to explain itself.** If a screen requires a pop-over tour
  or a wall of onboarding to be usable, the design isn't done, let layout, affordances, and
  simple prompts do the teaching.
- **No redundant controls**, e.g. a Back button *and* an X that do the same thing. Every
  control should feel complete and non-duplicative ("polished" bar).
- **Restrain notifications.** More pings lift short-term activity but erode trust and drive
  people to mute or quit. Cap them regardless of what the short-term metric says.

## Common mistakes

| Tell | Fix |
|------|-----|
| Blank screen while loading | Skeleton / spinner |
| Empty state is just "No results" | Explain + offer first action |
| `<div onClick>` submit | Use `<button>` / `<form>` |
| Delete with no confirm or undo | Add confirm naming the action |
| Mobile input < 16px (zooms on focus) | `font-size: 16px+` |
| Font-weight change on hover (layout shift) | Change color, not weight |
| Error wipes the form | Preserve input, show inline |
| Only the checkbox box is clickable | Make the label clickable |

## Do / Don't

| Do | Don't |
|----|-------|
| Design loading / empty / error states | Ship only the happy path |
| Confirm or allow undo on destructive acts | Delete on a single unguarded click |
| Use `<button>` / `<a>` / `<form>` | Wire behavior onto `div`s |
| Keep input `font-size ≥ 16px` | Trigger focus-zoom on mobile |
| Give feedback within ~100ms | Leave actions with no response |

## Audit

- **High**: destructive action with no confirm/undo, action wired to a non-interactive element, error state that loses user input, no loading state on a slow fetch
- **Medium**: missing empty state, mobile input < 16px, layout shift on state change, dead zones on controls
- **Low**: missing keyboard shortcut, minor feedback timing

Verify by **using** the flow: trigger the error, empty the data, submit from the keyboard, delete something, on the rendered app, not from source.
