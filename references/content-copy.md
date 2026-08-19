# Content & copy

UI strings, labels, headings, errors, empty states, and onboarding text.

Built on an anti-fluff logic (action-first, no buried answers; drop filler, keep substance),
applied to **product copy**, not agent chat. The external skills this draws on are catalogued
in [sources.md](sources.md#external-craft-skills).

## Purpose

Catch copy that buries the action: preamble-heavy, vague, overly polite, or marketing-generic. Fix it so users know what to do in one scan.

## What weak product copy gets wrong

1. **Answer buried**, context before action; user scrolls to find the button.
2. **Vague time and effort**, "quick," "simple," "just a few steps" mean nothing.
3. **Preamble and closers**, welcomes, recaps, and "let us know" padding.
4. **Uniform politeness**, "Please," "Kindly," "We'd love to" on every label.
5. **Filler and hedging**, "really," "simply," "might," "could potentially."
6. **Generic SaaS voice**, seamless, empower, leverage, journey, delve, robust.

## Rules

### 1. Lead with the action

Headlines, CTAs, and empty states start with what the user can do, not context.

| Bad | Good |
|-----|------|
| Welcome to your dashboard! Here you can manage all your projects. | **Create project** |
| We're excited to help you get started on your journey. | **Add your first item** |
| This page allows you to configure your notification preferences. | **Notification settings** |

Primary button = verb + object. Not "Get started" when "Import CSV" is the real action.

### 2. One job per string

Each label, line, or toast does one thing. No "and then" in a single sentence.

| Bad | Good |
|-----|------|
| Enter your email address so we can send you a verification link and keep you updated. | **Email** + helper: "We'll send a sign-in link." |

Split headline / helper / CTA instead of one paragraph.

### 3. Number multi-step flows

Wizards, onboarding, and setup: numbered steps, one bounded action each.

```
1. Connect bank account
2. Verify identity
3. Set payout schedule
```

Not: "First you'll connect your account, then we'll verify you, and finally you can set up payouts."

### 4. End with one next step

Success screens, empty states, and confirmations name **one** follow-up, not three options and a recap.

| Bad | Good |
|-----|------|
| You're all set! Feel free to explore the app or check out our docs. | **Next:** Invite a teammate |

### 5. No preamble, recap, or closer

Forbidden in UI copy:

- **Openers:** "Welcome to…", "We're thrilled…", "Let's get started…"
- **Recaps:** "You've successfully completed… which means you can now…"
- **Closers:** "Happy to help", "Let us know if you need anything", "Hope this helps"

Errors and confirmations state fact + fix. Then stop.

### 6. Matter-of-fact errors

No performative sympathy. State cause and fix.

| Bad | Good |
|-----|------|
| Oops! Something went wrong. | **Payment failed:** Card declined. Try another card. |
| Uh oh, we couldn't save your changes. | **Not saved:** No connection. Check network and retry. |

Keep exact error codes and field names when the product exposes them.

### 7. Specific beats vague

Replace fuzzy promises with concrete units when time, count, or scope matters.

| Bad | Good |
|-----|------|
| This only takes a moment. | **About 2 minutes** |
| Upload your files quickly and easily. | **Upload up to 10 files (PDF, 25 MB each)** |

If you don't know the number, omit the claim, don't fake specificity.

### 8. Cap visible lists at five

Feature lists, plan comparisons, bullet benefits: max five visible items. Split **Do now** vs **Later** or **Included** vs **Add-on**.

Rank by user priority, not marketing completeness.

### 9. Drop filler; keep meaning

Apply aggressive compression to microcopy, not broken grammar on critical paths.

**Drop:** just, really, simply, actually, basically, kindly, please (when not legally required), "we're here to help."

**Never drop:** not, never, no, only, except, negation changes behavior.

**Keep exact:** product names, API terms, units, numbers, legal required text.

| Bad | Good |
|-----|------|
| Please simply enter your email address below. | **Email** |
| We couldn't possibly process your request at this time. | **Can't process request.** Try again in a few minutes. |

### 10. No generic marketing voice

Avoid unless the brand explicitly uses them:

- seamless, robust, cutting-edge, innovative, empower, leverage, unlock, journey
- "In today's fast-paced world…"
- "Designed with you in mind"
- Triple synonym stacks ("fast, reliable, and secure")

Write like the product team talks internally, then tighten once.

## Mechanics
Sleak's anti-fluff rules above are the sharpened line; these are the conventional copy
mechanics Sleak keeps:

- **Sentence case**, not Title Case, for UI text (headings, labels, buttons). Easier to read
  and friendlier.
- **Numerals for numbers** ("7 days", not "seven days"), they're scannable and shorter.
- **Limit UPPERCASE.** All-caps is harder to read in longer strings (letterforms lose their
  shape). Reserve it for short labels or eyebrows, and add a little letter-spacing when you do.
- **Descriptive link/action text.** The text must make sense read **out of context** (screen
  readers announce it alone, and eyes scan links). "View pricing", never "Read more" / "Click
  here". This is also an [accessibility.md](accessibility.md) rule.
- **Drop full stops** on short, standalone lines (labels, single-sentence helper text, list
  items). Keep them in multi-sentence body copy.
- **Parallel elements, parallel length.** Keep copy roughly the same length across items that
  sit together (nav links, card titles, feature bullets) so the layout stays even.
- **Break long content** with descriptive sub-headings and bullets; front-load each with the
  key word (inverted pyramid, most important first).

## Voice: distinctive beats bland
Concise and clear is the floor, not the ceiling. In marketing and personality-bearing copy,
**bland is the real failure**, trying to appeal to everyone yields nothing memorable. A
distinctive voice won't land for everyone, and that's the trade: the people who get it should
love it. Keep it within brand, never at the expense of clarity on functional/critical paths.

## Common mistakes

| Symptom | Example | Fix |
|------|---------|-----|
| Welcome wall | "Welcome to Acme! Your all-in-one solution for…" | Page title + primary CTA only |
| Fake enthusiasm | "We're so excited to have you here!" | Remove; show the first task |
| Vague CTA | Get started · Learn more · Continue | Verb + object: **Import contacts**, **Open settings** |
| Label + essay | Long placeholder tooltips | Label + one-line helper max |
| Symmetric feature trio | Three identical cards with icon + buzzword + sentence | Vary layout or cut to what matters |
| Lorem-adjacent | Generic benefit copy with no product facts | Name real limits, steps, or outcomes |
| Apologetic errors | Oops / Something went wrong | **What failed** + **what to do** |
| Permission theater | "Would you like to…?" for required flows | Direct: **Allow notifications** + Skip |

## Fixes (quick pass)

1. Delete the first sentence if it only introduces the page.
2. Delete the last sentence if it only offers help or recaps success.
3. Replace every "Get started" with the actual first action.
4. Replace error titles with `[Thing] failed` or `[Field] invalid`.
5. Cut any word that doesn't change user behavior.
6. Read only the **headline + primary button**, if intent isn't clear, rewrite.

## Do / Don't

| Do | Don't |
|----|-------|
| Verb-first buttons | "Submit" when "Pay $49" is clearer |
| Headline = task or object | Headline = welcome or mission statement |
| Helper text ≤ one line | Paragraph under every field |
| Numbered setup steps | Prose walkthrough in a modal |
| Concrete limits and times | "Quick," "easy," " hassle-free" |
| Errors: fact + fix | Errors: apology + mystery |
| Match existing brand voice | Default SaaS landing-page tone |
| Preserve legal and a11y requirements | Compress away required warnings |

## When to break the rules

1. **Marketing landing pages**, longer copy OK if scannable (headers, short blocks). Still no fake warmth or filler closers.
2. **Legal / compliance**, required disclaimers stay verbatim; tighten surrounding copy only.
3. **Brand voice is intentionally warm**, warmth in word choice, not preamble walls or empty enthusiasm.
4. **Accessibility**, don't sacrifice clarity for brevity; helper text and `aria-label` may need more words than visible UI.

## Pre-send check

Before shipping copy, verify:

1. First visible line = action, object, or status, not welcome.
2. Primary CTA names the real next step.
3. No opener/closer that could be deleted with zero information loss.
4. Errors state cause + fix without "Oops."
5. Lists ≤ 5 items or explicitly split.
6. No hedge/filler words unless they carry real uncertainty.

If the user reads **only the title and primary button**, they know what this screen is for.

## Cut AI-tell prose (docs, landing pages, marketing)

Everything above targets **UI strings**. This section targets the prose *around* the
product, landing pages, READMEs, case studies, release notes, that AI-tell phrasing
gives away even when the structure is otherwise sound. Adapted from
[unslop](sources.md#external-craft-skills).

**Patterns to cut:**

- **Puffery.** "seamless experience," "elevate," "unlock," "empower," "cutting-edge,"
  "game-changing," "pivotal moment." State what it does.
- **Fancy ways to say "is."** "serves as," "stands as," "boasts," "features." Just say
  "is" or "has."
- **Forced triads.** Padding a list to exactly three items ("fast, reliable, and secure")
  when the real count is two or four. Use the natural number.
- **Superficial *-ing* clauses.** "delivering...," "ensuring...," "empowering..." with no
  concrete follow-through. Delete or replace with the real mechanism.
- **Vague attribution.** "users love it," "teams report," "studies show," with no source.
  Name the source or delete the claim.
- **Bold-label-as-fake-structure.** "**Fast:** loads quickly." reads as a list pretending
  to be an argument. Write it as a sentence, or make it a real table row with real data.
- **Chatbot tics leaking into written copy.** "Hope this helps," "Let us know if you need
  anything," "Feel free to reach out." (Also banned in-product, see rule 5 above.)
- **Decoration.** Emoji as section markers, Title Case Headings, curly quotes. Sentence
  case, straight quotes, no decorative emoji.
- **Em dash and colon overuse.** Em dashes as an all-purpose connector are a tell on their
  own; use a period or a comma. A colon works before a list or an example, not as a
  mid-sentence joiner ("The result: faster." → "The result is faster.").

**Add the things AI writing skips:**

- **Have a point of view.** In explanation prose (a rule's *why*, a design decision's
  rationale), react to the trade-off instead of listing it neutrally.
- **Vary rhythm.** Short sentences land a point. Longer ones carry a fact with its
  condition. Don't clip every sentence to the same length.
- **Be specific over sterile.** Not "the layout feels polished" but "the button sits flush
  with the card's corner, no gutter." Concrete beats vibes, on the same logic as rule 7 above.

**Self-audit before publishing:** read it back and ask "what makes this obviously
AI-generated?" Fix what's left. The tell is rarely one bad sentence, it's the *absence* of
anything a person would specifically notice or care about.

## Notes

- **i18n:** Short English doesn't always shorten other languages; rules apply to structure (action first), not word count.
- **Agent vs UI:** The numbered rules target strings in the interface. Agent response style
  is out of scope unless the product IS a chat UI, then apply the same rules to bot messages.
  Docs, landing pages, and marketing prose are covered by the AI-tell section above instead.
